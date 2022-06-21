import { edt2d, range } from '@0b5vr/experimental';
import { CanvasTexture, DataTexture, FloatType, LinearFilter, LinearMipmapLinearFilter, RedFormat } from 'three';

const dataWidth = 4096;
const dataHeight = 4096;
const data = new Float32Array( dataWidth * dataHeight );

const charCols = 16;
const charRows = 16;

const charWidth = dataWidth / charCols;
const charHeight = dataHeight / charRows;

const canvasChar = document.createElement( 'canvas' );
canvasChar.width = charWidth;
canvasChar.height = charHeight;

const tempCharInside = new Float32Array( charWidth * charHeight );
const tempCharOutside = new Float32Array( charWidth * charHeight );

const contextChar = canvasChar.getContext( '2d' )!;
contextChar.textAlign = 'center';
contextChar.textBaseline = 'alphabetic';
contextChar.fillStyle = '#ffffff';
contextChar.font = `500 ${ 0.7 * charHeight }px "Consolas", monospace`;

for ( let iChar = 32; iChar < 126; iChar ++ ) {
  const char = String.fromCharCode( iChar );

  contextChar.clearRect( 0, 0, charWidth, charHeight );
  contextChar.fillText( char, 0.5 * charWidth, 0.7 * charHeight );

  const charImageData = contextChar.getImageData( 0, 0, charWidth, charHeight );

  for ( let i = 0; i < charWidth * charHeight; i ++ ) {
    const v = range( charImageData.data[ i * 4 + 3 ], 0.0, 255.0, 0.5, -0.5 );

    tempCharInside[ i ] = (
      v === 0.5 ? 1E8 :
      v === -0.5 ? 0.0 :
      Math.max( 0.0, v )
    );
    tempCharOutside[ i ] = (
      v === 0.5 ? 0.0 :
      v === -0.5 ? 1E8 :
      Math.max( 0.0, -v )
    );
  }

  edt2d( tempCharInside, charWidth, charHeight );
  edt2d( tempCharOutside, charWidth, charHeight );

  for ( let i = 0; i < charWidth * charHeight; i ++ ) {
    const length = Math.sqrt( tempCharOutside[ i ] ) - Math.sqrt( tempCharInside[ i ] );

    const x = charWidth * ( iChar % charCols ) + ( i % charWidth );
    const y = charHeight * Math.floor( iChar / charRows ) + Math.floor( i / charWidth );

    data[ x + dataWidth * y ] = length;
  }
}

export const fontSheetTexture = new DataTexture(
  data,
  dataWidth,
  dataHeight,
  RedFormat,
  FloatType,
);
fontSheetTexture.needsUpdate = true;
fontSheetTexture.magFilter = LinearFilter;
fontSheetTexture.minFilter = LinearMipmapLinearFilter;
