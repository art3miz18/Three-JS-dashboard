// This can be in a separate file
import * as THREE from 'three';

export function toScreenPosition(position, camera, renderer) {
    const vector = new THREE.Vector3();
    const widthHalf = 0.5 * renderer.domElement.clientWidth;
    const heightHalf = 0.5 * renderer.domElement.clientHeight;
  
    vector.setFromMatrixPosition(position.matrixWorld);
    vector.project(camera);
  
    return {
      x: (vector.x * widthHalf) + widthHalf,
      y: -(vector.y * heightHalf) + heightHalf
    };
  }
  