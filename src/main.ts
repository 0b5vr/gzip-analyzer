import { inflate, InflateToken } from './inflate/inflate';
import { Renderer } from './Renderer';

const inputFile = document.getElementById( 'inputFile' ) as HTMLInputElement;
const canvas = document.getElementById( 'canvas' ) as HTMLCanvasElement;
const divInfo = document.getElementById( 'divInfo' ) as HTMLDivElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let currentTokens: InflateToken[] | undefined;
const renderer = new Renderer( canvas );

window.addEventListener( 'resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.resize( width, height );
} );

inputFile.addEventListener( 'change', async () => {
  const file = inputFile.files?.[ 0 ];

  if ( file != null ) {
    const buffer = await file.arrayBuffer();
    const array = new Uint8Array( buffer, 2 );

    const result = inflate( array );

    currentTokens = result;
    renderer.setTokens( result );
  }
} );

canvas.addEventListener( 'mousemove', ( event ) => {
  divInfo.style.left = `${ event.clientX + 8 }px`;
  divInfo.style.top = `${ event.clientY + 8 }px`;

  const x = ( event.clientX / window.innerWidth ) * 2 - 1;
  const y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  const castRayResult = renderer.castRay( x, y );

  if ( castRayResult != null ) {
    const { col, row } = castRayResult;
    const token = currentTokens![ col + row * 64 ];

    divInfo.textContent = [
      `${ token.bits.toFixed( 2 ) } bits`,
      '',
      ...Object.entries( token.details ).map( ( [ key, value ] ) => (
        `${ key }: ${ value }`
      ) ),
    ].join( '\n' );
    divInfo.style.display = 'block';
  } else {
    divInfo.style.display = 'none';
  }
} );

function update() {
  renderer.update();

  requestAnimationFrame( update );
}
requestAnimationFrame( update );
