import { PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from 'three';
import { InflateToken } from './inflate/inflate';
import { VisualizeMesh } from './VisualizeMesh';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const _v2A = new Vector2();

export class Renderer {
  private __renderer: WebGLRenderer;
  private __camera: PerspectiveCamera;
  private __controls: OrbitControls;
  private __scene: Scene;
  private __raycaster: Raycaster;

  private __visualizeMesh?: VisualizeMesh;

  public constructor( canvas: HTMLCanvasElement ) {
    this.__renderer = new WebGLRenderer( { canvas } );

    const aspect = canvas.width / canvas.height;
    this.__camera = new PerspectiveCamera( 45, aspect, 1.0, 10000.0 );
    this.__camera.position.set( 0, 0, 10 );

    this.__controls = new OrbitControls( this.__camera, canvas );

    this.__scene = new Scene();

    this.__raycaster = new Raycaster();
  }

  public setTokens( tokens: InflateToken[] ): void {
    if ( this.__visualizeMesh != null ) {
      this.__scene.remove( this.__visualizeMesh.mesh );
      this.__visualizeMesh.dispose();
    }

    this.__visualizeMesh = new VisualizeMesh( tokens );
    this.__scene.add( this.__visualizeMesh.mesh );
  }

  public update(): void {
    this.__controls.update();
    this.__renderer.render( this.__scene, this.__camera );
  }

  public castRay( x: number, y: number ): { col: number, row: number } | null {
    const visualizeMesh = this.__visualizeMesh;
    if ( visualizeMesh == null ) { return; }

    const { width, height, mesh } = visualizeMesh;

    _v2A.set( x, y );
    this.__raycaster.setFromCamera( _v2A, this.__camera );

    const isect = this.__raycaster.intersectObject( mesh );

    const uv = isect[ 0 ]?.uv;

    if ( uv ) {
      const col = Math.floor( uv.x * width );
      const row = Math.floor( uv.y * height );

      return { col, row };
    } else {
      return null;
    }
  }

  public resize( width: number, height: number ): void {
    this.__renderer.setSize( width, height );

    this.__camera.aspect = width / height;
    this.__camera.updateProjectionMatrix();
  }
}
