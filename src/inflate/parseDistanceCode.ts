import { getBits } from './getBits';

const DISTANCE_BASE = new Uint16Array( [
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25,
  33, 49, 65, 97, 129, 193, 257, 385, 513, 769,
  1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577,
] );

const DISTANCE_EXTRA_BITS = new Uint8Array( [
  0, 0, 0, 0, 1, 1, 2, 2, 3, 3,
  4, 4, 5, 5, 6, 6, 7, 7, 8, 8,
  9, 9, 10, 10, 11, 11, 12, 12, 13, 13,
] );

export function parseDistanceCode(
  array: Uint8Array,
  headBox: [ number ],
  distanceCode: number,
): number {
  const base = DISTANCE_BASE[ distanceCode ];
  const extra = DISTANCE_EXTRA_BITS[ distanceCode ];

  return base + getBits( array, headBox, extra );
}
