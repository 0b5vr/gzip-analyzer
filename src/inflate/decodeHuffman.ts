import { getBit } from './getBit';

export function decodeHuffman(
  array: Uint8Array,
  headBox: [ number ],
  codeLengths: Uint8Array,
  tree: Map<number, number>,
): number {
  let head = headBox[ 0 ];

  let alpha = 0;
  let length = 0;
  let value = 0;

  for ( ;; ) {
    length ++;
    alpha |= getBit( array, head ++ );

    if ( tree.has( alpha ) ) {
      value = tree.get( alpha )!;

      if ( codeLengths[ value ] === length ) {
        break;
      }
    }

    alpha <<= 1;
  }

  headBox[ 0 ] = head;

  return value;
}
