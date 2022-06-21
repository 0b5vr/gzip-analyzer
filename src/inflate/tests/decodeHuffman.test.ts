import { buildHuffmanTree } from '../buildHuffmanTree';
import { decodeHuffman } from '../decodeHuffman';

describe( 'decodeHuffman', () => {
  const codeLengths = new Uint8Array( [ 3, 3, 3, 3, 3, 2, 4, 4 ] );
  const tree = buildHuffmanTree( codeLengths );

  const data = new Uint8Array( [ 0x71, 0xe1, 0x04 ] ); // 2, 1, 3, 5, 5, 6, 0
  const headBox: [ number ] = [ 0 ];

  it( 'decodes a huffman code', () => {
    expect( decodeHuffman( data, headBox, codeLengths, tree ) ).toBe( 2 );
    expect( decodeHuffman( data, headBox, codeLengths, tree ) ).toBe( 1 );
    expect( decodeHuffman( data, headBox, codeLengths, tree ) ).toBe( 3 );
    expect( decodeHuffman( data, headBox, codeLengths, tree ) ).toBe( 5 );
    expect( decodeHuffman( data, headBox, codeLengths, tree ) ).toBe( 5 );
    expect( decodeHuffman( data, headBox, codeLengths, tree ) ).toBe( 6 );
    expect( decodeHuffman( data, headBox, codeLengths, tree ) ).toBe( 0 );
  } );
} );
