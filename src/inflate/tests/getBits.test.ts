import { getBit } from '../getBit';
import { getBits } from '../getBits';

describe( 'getBits', () => {
  const array = new Uint8Array( [
    0x84,
    0x56,
    0x67,
  ] );

  const headBox: [ number ] = [ 3 ];

  it( 'returns a corresponding bits of the given array', () => {
    expect( getBits( array, headBox, 5 ) ).toBe( 16 );
    expect( getBits( array, headBox, 5 ) ).toBe( 22 );
    expect( getBits( array, headBox, 4 ) ).toBe( 10 );
  } );
} );
