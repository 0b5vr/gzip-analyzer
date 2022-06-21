export function buildHuffmanTree(
  codeLengths: Uint8Array,
): Map<number, number> {
  const maxBits = codeLengths.reduce(
    ( prev, cur ) => Math.max( prev, cur ),
    0,
  );

  let code = 0;
  const blCount = new Uint32Array( maxBits );
  const nextCode = new Uint32Array( maxBits );

  for ( const len of codeLengths ) {
    blCount[ len - 1 ] ++;
  }

  for ( let iBit = 1; iBit < maxBits; iBit ++ ) {
    code = ( code + blCount[ iBit - 1 ] << 1 );
    nextCode[ iBit ] = code;
  }

  const tree = new Map<number, number>();

  const maxCode = codeLengths.length;
  for ( let iCode = 0; iCode < maxCode; iCode ++ ) {
    const len = codeLengths[ iCode ];

    if ( len !== 0 ) {
      tree.set( nextCode[ len - 1 ], iCode );
      nextCode[ len - 1 ] ++;
    }
  }

  return tree;
}
