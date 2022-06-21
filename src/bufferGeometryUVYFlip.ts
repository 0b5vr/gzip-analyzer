import { BufferAttribute, BufferGeometry } from 'three';

export function bufferGeometryUVYFlip<T extends BufferGeometry>( geometry: T ): T {
  const geometryUv = geometry.getAttribute( 'uv' ) as BufferAttribute;
  const newGeometryUvArray = new Float32Array( geometryUv.array.length );

  for ( let i = 0; i < geometryUv.array.length; i += 2 ) {
    newGeometryUvArray[ i ] = geometryUv.array[ i ];
    newGeometryUvArray[ i + 1 ] = 1.0 - geometryUv.array[ i + 1 ];
  }

  geometryUv.copyArray( newGeometryUvArray );
  geometryUv.needsUpdate = true;

  return geometry;
}
