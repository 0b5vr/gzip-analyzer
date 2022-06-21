import { colorToHex, RawRGB, saturate, vecDot } from '@0b5vr/experimental';

/*!
 * Copyright 2019 Google LLC. (Apache-2.0)
 * https://gist.github.com/mikhailov-work/0d177465a8151eb6ede1768d51d476c7
 */

/**
 * Generate a turbo gradient.
 *
 * Ref: https://gist.github.com/mikhailov-work/0d177465a8151eb6ede1768d51d476c7
 */
export function colorTurbo( x: number ): RawRGB {
  const kr = [
    0.13572138, 4.61539260, -42.66032258,
    132.13108234, -152.94239396, 59.28637943,
  ];
  const kg = [
    0.09140261, 2.19418839, 4.84296658,
    -14.18503333, 4.27729857, 2.82956604,
  ];
  const kb = [
    0.10667330, 12.64194608, -60.58204836,
    110.36276771, -89.90310912, 27.34824973,
  ];

  const xt = saturate( x );
  const xv = [
    1.0,
    xt,
    xt * xt,
    xt * xt * xt,
    xt * xt * xt * xt,
    xt * xt * xt * xt * xt,
  ];

  const col = [
    vecDot( kr, xv ),
    vecDot( kg, xv ),
    vecDot( kb, xv ),
  ];

  return col as RawRGB;
}
