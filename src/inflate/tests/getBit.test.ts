import { getBit } from '../getBit';

describe( 'getBit', () => {
  const array = new Uint8Array( [
    0x78,
    0xda,
  ] );

  it( 'returns a corresponding bit of the given array', () => {
    expect( getBit( array, 0 ) ).toBe( 0 );
    expect( getBit( array, 1 ) ).toBe( 0 );
    expect( getBit( array, 2 ) ).toBe( 0 );
    expect( getBit( array, 3 ) ).toBe( 1 );
    expect( getBit( array, 4 ) ).toBe( 1 );
    expect( getBit( array, 5 ) ).toBe( 1 );
    expect( getBit( array, 6 ) ).toBe( 1 );
    expect( getBit( array, 7 ) ).toBe( 0 );

    expect( getBit( array, 8 ) ).toBe( 0 );
    expect( getBit( array, 9 ) ).toBe( 1 );
    expect( getBit( array, 10 ) ).toBe( 0 );
    expect( getBit( array, 11 ) ).toBe( 1 );
    expect( getBit( array, 12 ) ).toBe( 1 );
    expect( getBit( array, 13 ) ).toBe( 0 );
    expect( getBit( array, 14 ) ).toBe( 1 );
    expect( getBit( array, 15 ) ).toBe( 1 );
  } );
} );
