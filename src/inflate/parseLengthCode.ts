import { getBits } from './getBits';

const LENGTH_BASE = new Uint16Array( [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13,
  15, 17, 19, 23, 27, 31, 35, 43, 51, 59,
  67, 83, 99, 115, 131, 163, 195, 227, 258,
] );

const LENGTH_EXTRA_BITS = new Uint8Array( [
  0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
  1, 1, 2, 2, 2, 2, 3, 3, 3, 3,
  4, 4, 4, 4, 5, 5, 5, 5, 0,
] );

export function parseLengthCode(
  array: Uint8Array,
  headBox: [ number ],
  lengthCode: number,
): number {
  const base = LENGTH_BASE[ lengthCode - 257 ];
  const extra = LENGTH_EXTRA_BITS[ lengthCode - 257 ];

  return base + getBits( array, headBox, extra );
}
