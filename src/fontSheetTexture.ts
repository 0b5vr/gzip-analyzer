// import { edt2d } from '@0b5vr/experimental';
import { CanvasTexture } from 'three';

const canvas = document.createElement( 'canvas' );
const width = canvas.width = 1024;
const height = canvas.height = 1024;

const charCols = 16
const charRows = 16;

const charWidth = width / charCols;
const charHeight = width / charRows;

const context = canvas.getContext( '2d' )!;
context.textAlign = 'center';
context.textBaseline = 'alphabetic';
context.fillStyle = '#ffffff';
context.strokeStyle = '#000000';
context.lineCap = 'round';
context.lineJoin = 'round';
context.lineWidth = charHeight / 16.0;
context.font = `500 ${ 0.7 * charHeight }px "Consolas", monospace`;

for ( let i = 32; i < 126; i ++ ) {
  const char = String.fromCharCode( i );
  const x = charWidth * ( ( i % 16 ) + 0.5 );
  const y = charHeight * ( Math.floor( i / 16 ) + 0.7 );

  context.strokeText( char, x, y );
  context.fillText( char, x, y );
}

export const fontSheetTexture = new CanvasTexture( canvas );
// fontSheetTexture.generateMipmaps = false;
