import { DataTexture, BufferGeometry, MeshBasicMaterial, Mesh, PlaneBufferGeometry, LinearFilter, LinearMipmapLinearFilter, NearestFilter } from 'three';
import { bufferGeometryUVYFlip } from './bufferGeometryUVYFlip';
import { colorTurbo } from './colorTurbo';
import { fontSheetTexture } from './fontSheetTexture';
import { InflateToken } from './inflate/inflate';

const ASPECT = 0.5;

export class VisualizeMesh {
  public readonly mesh: Mesh;

  public readonly width: number;
  public readonly height: number;
  public readonly texture: DataTexture;

  private __geometry: BufferGeometry;
  private __material: MeshBasicMaterial;

  public constructor( tokens: InflateToken[] ) {
    const tokensTextureResult = this.__createTokensTexture( tokens );
    this.width = tokensTextureResult.width;
    this.height = tokensTextureResult.height;

    this.texture = tokensTextureResult.texture;

    this.__geometry = new PlaneBufferGeometry( ASPECT * this.width, this.height );
    bufferGeometryUVYFlip( this.__geometry );

    this.__material = new MeshBasicMaterial( { map: this.texture } );
    this.__material.onBeforeCompile = ( shader ) => {
      shader.uniforms[ 'texFontSheet' ] = { value: fontSheetTexture };

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
          #include <common>

          uniform sampler2D texFontSheet;
        `
      )

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `
          #include <map_fragment>

          float show = 1.0;

          float d = abs( dFdx( vUv.x * float( ${ this.width } ) ) ) * 128.0;

          vec2 charCoord = fract( vUv * vec2( ${ this.width }, ${ this.height } ) );
          show *= step( abs( charCoord.x - 0.5 ), 0.49 ); // remove mipmap artifact on edge
          show *= step( abs( charCoord.y - 0.5 ), 0.49 ); // remove mipmap artifact on edge

          charCoord.x = ${ ASPECT } * ( charCoord.x - 0.5 ) + 0.5;

          vec2 charCell = floor( mod( vec2( sampledDiffuseColor.w ) * vec2( 256.0, 16.0 ), 16.0 ) );
          vec2 charUv = ( charCoord + charCell ) / 16.0;
          float charTex = texture2D( texFontSheet, charUv ).x;

          show *= smoothstep( 32.0, 16.0, d );

          diffuseColor = mix(
            diffuseColor,
            mix(
              vec4( 0.0, 0.0, 0.0, 1.0 ),
              vec4( 1.0 ),
              smoothstep( -d, d, charTex )
            ),
            smoothstep( -d, d, charTex + 8.0 ) * show
          );
        `
      )
    };

    this.mesh = new Mesh( this.__geometry, this.__material );
  }

  public dispose(): void {
    this.texture.dispose();
    this.__geometry.dispose();
    this.__material.dispose();
  }

  private __createTokensTexture( tokens: InflateToken[] ): {
    width: number;
    height: number;
    texture: DataTexture;
  } {
    const width = 64;
    const height = Math.ceil( tokens.length / width );

    if ( height > 4096 ) {
      console.warn( 'Renderer: Buffer height exceeds 4096. This might fail' );
    }

    const buffer = new Uint8Array( width * height * 4 );

    tokens.forEach( ( token, iToken ) => {
      const color = colorTurbo( token.bits / 10.0 );

      buffer[ 4 * iToken + 0 ] = Math.floor( 255.0 * color[ 0 ] );
      buffer[ 4 * iToken + 1 ] = Math.floor( 255.0 * color[ 1 ] );
      buffer[ 4 * iToken + 2 ] = Math.floor( 255.0 * color[ 2 ] );
      buffer[ 4 * iToken + 3 ] = token.value;
    } );

    const texture = new DataTexture(
      buffer,
      width,
      height,
    );
    texture.generateMipmaps = true;
    texture.magFilter = NearestFilter;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.needsUpdate = true;

    return { width, height, texture };
  }
}
