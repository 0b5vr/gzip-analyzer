import { inflate, InflateToken } from './inflate/inflate';
import { Renderer } from './Renderer';
import domainBin from './assets/domain.bin?url';

const inputFile = document.getElementById( 'inputFile' ) as HTMLInputElement;
const canvas = document.getElementById( 'canvas' ) as HTMLCanvasElement;
const divMeta = document.getElementById( 'divMeta' ) as HTMLDivElement;
const divTooltip = document.getElementById( 'divTooltip' ) as HTMLDivElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let currentTokens: InflateToken[] | undefined;
const renderer = new Renderer( canvas );

window.addEventListener( 'resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.resize( width, height );
} );

async function loadFile( file: File | Response, name: string ): Promise<void> {
  const buffer = await file.arrayBuffer();
  const array = new Uint8Array( buffer );

  const result = inflate( array );

  currentTokens = result.tokens;
  renderer.setTokens( result.tokens );

  const ratio = ( result.meta.compressedSize / result.meta.rawSize * 100.0 ).toFixed( 3 );

  divMeta.textContent = [
    `file: ${ name }`,
    `format: ${ result.meta.format }`,
    `raw size: ${ result.meta.rawSize }`,
    `compressed size: ${ result.meta.compressedSize } (${ ratio } %)`,
  ].join( '\n' );
}

inputFile.addEventListener( 'change', () => {
  const file = inputFile.files?.[ 0 ];

  if ( file != null ) {
    loadFile( file, file.name );
  }
} );

fetch( domainBin )
  .then( ( res ) => loadFile( res, 'domain.js.bin' ) );

canvas.addEventListener( 'mousemove', ( event ) => {
  divTooltip.style.left = `${ event.clientX + 8 }px`;
  divTooltip.style.top = `${ event.clientY + 8 }px`;

  const x = ( event.clientX / window.innerWidth ) * 2 - 1;
  const y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  const castRayResult = renderer.castRay( x, y );

  if ( castRayResult != null ) {
    const { col, row } = castRayResult;
    const token = currentTokens![ col + row * 64 ];

    if ( token == null ) {
      divTooltip.style.display = 'none';
    } else {
      divTooltip.textContent = [
        `${ token.bits.toFixed( 2 ) } bits`,
        '',
        ...Object.entries( token.details ).map( ( [ key, value ] ) => (
          `${ key }: ${ value }`
        ) ),
      ].join( '\n' );
      divTooltip.style.display = 'block';
    }
  } else {
    divTooltip.style.display = 'none';
  }
} );

function update(): void {
  renderer.update();

  requestAnimationFrame( update );
}
requestAnimationFrame( update );
