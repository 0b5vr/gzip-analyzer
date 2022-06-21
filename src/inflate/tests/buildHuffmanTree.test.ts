import { buildHuffmanTree } from '../buildHuffmanTree';

describe( 'buildHuffmanTree', () => {
  const bitLengths = new Uint8Array( [ 3, 3, 3, 3, 3, 2, 4, 4 ] );
  const tree = buildHuffmanTree( bitLengths );

  it( 'builds a proper huffman tree', () => {
    expect( tree.get( 2 ) ).toBe( 0 );
    expect( tree.get( 3 ) ).toBe( 1 );
    expect( tree.get( 4 ) ).toBe( 2 );
    expect( tree.get( 5 ) ).toBe( 3 );
    expect( tree.get( 6 ) ).toBe( 4 );
    expect( tree.get( 0 ) ).toBe( 5 );
    expect( tree.get( 14 ) ).toBe( 6 );
    expect( tree.get( 15 ) ).toBe( 7 );
  } );
} );
