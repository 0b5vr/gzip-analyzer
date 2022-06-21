import { buildHuffmanTree } from './buildHuffmanTree';
import { decodeHuffman } from './decodeHuffman';
import { getBits } from './getBits';
import { parseDistanceCode } from './parseDistanceCode';
import { parseLengthCode } from './parseLengthCode';

export interface InflateToken {
  value: number;
  bits: number;
  details: {
    type: 'literal';
    bits: number;
  } | {
    type: 'repeat';
    length: number;
    lengthBits: number;
    distance: number;
    distanceBits: number;
  }
}

interface TreeSet {
  litCodeLengths: Uint8Array;
  litCodeTree: Map<number, number>;
  distCodeLengths: Uint8Array;
  distCodeTree: Map<number, number>;
}

const CODE_CODE_LENGTH_ORDER = new Uint8Array(
  [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ]
);

function parseDynamicHuffmanTree(
  array: Uint8Array,
  headBox: [ number ],
): TreeSet {
  const litCodes = 257 + getBits( array, headBox, 5 );
  const distCodes = 1 + getBits( array, headBox, 5 );
  const codeCodes = 4 + getBits( array, headBox, 4 );

  // parse code code lengths
  const codeCodeLengths = new Uint8Array( CODE_CODE_LENGTH_ORDER.length );

  for ( let iCode = 0; iCode < codeCodes; iCode ++ ) {
    const value = CODE_CODE_LENGTH_ORDER[ iCode ];
    codeCodeLengths[ value ] = getBits( array, headBox, 3 );
  }

  // build code code tree
  const codeCodeTree = buildHuffmanTree( codeCodeLengths );

  // parse literal and length + distance code lengths
  const litDistCodeLengths = new Uint8Array( litCodes + distCodes );

  let prevLength = 0;

  for ( let iCode = 0; iCode < ( litCodes + distCodes ); ) {
    const value = decodeHuffman( array, headBox, codeCodeLengths, codeCodeTree );

    if ( value === 16 ) { // `repeat`, 3 - 6
      const count = 3 + getBits( array, headBox, 2 );

      for ( let i = 0; i < count; i ++ ) {
        litDistCodeLengths[ iCode ++ ] = prevLength;
      }
    } else if ( value === 17 ) { // `zeros`, 3 - 10
      const count = 3 + getBits( array, headBox, 3 );
      iCode += count;
    } else if ( value === 18 ) { // `zeros`, 11 - 138
      const count = 11 + getBits( array, headBox, 7 );
      iCode += count;
    } else {
      litDistCodeLengths[ iCode ++ ] = value;
      prevLength = value;
    }
  }

  const litCodeLengths = litDistCodeLengths.subarray( 0, litCodes );
  const distCodeLengths = litDistCodeLengths.subarray( litCodes );

  return {
    litCodeLengths,
    litCodeTree: buildHuffmanTree( litCodeLengths ),
    distCodeLengths,
    distCodeTree: buildHuffmanTree( distCodeLengths ),
  };
}

function processBlockUsingTree(
  array: Uint8Array,
  headBox: [ number ],
  raw: number[],
  { litCodeLengths, litCodeTree, distCodeLengths, distCodeTree }: TreeSet,
): InflateToken[] {
  const tokens: InflateToken[] = [];

  for ( ;; ) {
    const headBeforeAlpha = headBox[ 0 ];
    const value = decodeHuffman( array, headBox, litCodeLengths, litCodeTree );

    if ( value === 256 ) { // end-of-block
      break;
    } else if ( value > 256 ) { // `match`
      const length = parseLengthCode( array, headBox, value );
      const headBeforeDist = headBox[ 0 ];
      const lengthBits = headBeforeDist - headBeforeAlpha;

      const distCode = decodeHuffman( array, headBox, distCodeLengths, distCodeTree );
      const distance = parseDistanceCode( array, headBox, distCode );
      const distanceBits = headBox[ 0 ] - headBeforeDist;

      const start = raw.length - distance;
      const sliced = raw.slice( start, start + length );

      let concat = sliced;
      if ( sliced.length < length ) {
        concat = [ ...Array( length ) ].map( ( _, i ) => sliced[ i % sliced.length ] );
      }

      raw.push( ...concat );

      concat.forEach( ( value ) => {
        tokens.push( {
          value,
          bits: ( lengthBits + distanceBits ) / length,
          details: {
            type: 'repeat',
            length,
            lengthBits,
            distance,
            distanceBits,
          }
        } );
      } );
    } else {
      raw.push( value );

      const bits = headBox[ 0 ] - headBeforeAlpha;

      tokens.push( {
        value,
        bits,
        details: {
          type: 'literal',
          bits,
        },
      } );
    }
  }

  return tokens;
}

function processBlock(
  array: Uint8Array,
  headBox: [ number ],
  raw: number[],
  ): {
  tokens: InflateToken[];
  isFinalBlock: boolean;
} {
  const isFinalBlock = getBits( array, headBox, 1 ) === 1;
  const type = getBits( array, headBox, 2 );

  if ( type === 0 ) {
    throw new Error( 'Unsupported block' );
  } else if ( type === 1 ) {
    throw new Error( 'Unsupported block' );
  } else {
    const headBeforeTreeGen = headBox[ 0 ];

    const treeSet = parseDynamicHuffmanTree( array, headBox );

    const lenTreeGen = headBox[ 0 ] - headBeforeTreeGen;

    const result = processBlockUsingTree( array, headBox, raw, treeSet );

    return {
      tokens: result,
      isFinalBlock,
    }
  }
}

export function inflate( array: Uint8Array ): InflateToken[] {
  const headBox: [ number ] = [ 0 ];
  const tokens: InflateToken[] = [];
  const raw: number[] = [];

  for ( ;; ) {
    const result = processBlock( array, headBox, raw );
    tokens.push( ...result.tokens );

    if ( result.isFinalBlock ) {
      break;
    }
  }

  return tokens;
}
