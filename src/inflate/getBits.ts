import { getBit } from './getBit';

export function getBits( array: Uint8Array, headBox: [ number ], len: number ): number {
  let head = headBox[ 0 ];
  let value = 0;

  for ( let i = 0; i < len; i ++ ) {
    value += ( getBit( array, head ++ ) << i );
  }

  headBox[ 0 ] = head;

  return value;
}
