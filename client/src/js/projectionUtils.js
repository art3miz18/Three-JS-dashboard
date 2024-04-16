// This can be in a separate file
import * as THREE from 'three';

export function toScreenPosition(obj, camera, renderer) {
    const vector = new THREE.Vector3();

    // Make sure obj is a THREE.Object3D (has a position property)
    if (!(obj instanceof THREE.Object3D) && !obj.position) {
        console.log('The obj parameter should be an instance of THREE.Object3D or must have a position property.');
        return { x: 0, y: 0 };
    }

    // Extract the position vector using position if obj is not an instance of Object3D
    const position = (obj instanceof THREE.Object3D) ? obj.position : obj;

    camera.aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight;
    camera.updateMatrixWorld();  // Only if the camera's position has changed
    camera.updateProjectionMatrix();  // If the camera's settings have been updated
    vector.copy(position); // Copy the position to the vector
    vector.project(camera); // Project the vector to 2D screen space

    // const widthHalf = 0.65 * renderer.domElement.clientWidth;
    // const heightHalf = 0.65 * renderer.domElement.clientHeight;
    
    // return {
    //     x: (vector.x * widthHalf) + widthHalf,
    //     y: -(vector.y * heightHalf) + heightHalf
    // };
    const rect = renderer.domElement.getBoundingClientRect();

    return {
        x: ((vector.x + 1) * rect.width / 2) + rect.left ,
        y: ((-vector.y + 1) * rect.height / 2) + rect.top
    };
  }

  