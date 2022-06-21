export function getBit( array: Uint8Array, bit: number ): number {
  return ( array[ bit >> 3 ] >> ( bit & 7 ) ) & 1;
}
