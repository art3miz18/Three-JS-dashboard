import * as THREE from 'three';


export const addInteraction = (renderer, camera, scene, object) => {
    let isDragging = false;
    let previousMousePosition = {
      x: 0,
      y: 0
    };
  
    const toRadians = (angle) => angle * (Math.PI / 180);
    const toDegrees = (angle) => angle * (180 / Math.PI);
  
    const onMouseDown = (e) => {
      isDragging = true;
    };
  
    const onMouseMove = (e) => {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
      };
  
      if (isDragging) {
          
          const deltaRotationQuaternion = new THREE.Quaternion()
              .setFromEuler(new THREE.Euler(
                  toRadians(deltaMove.y * 1),
                  toRadians(deltaMove.x * 1),
                  0,
                  'XYZ'
              ));
          
          object.quaternion.multiplyQuaternions(deltaRotationQuaternion, object.quaternion);
      }
  
      previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
      };
    };
  
    const onMouseUp = () => {
      isDragging = false;
    };
  
    renderer.domElement.addEventListener('mousedown', onMouseDown, false);
    renderer.domElement.addEventListener('mousemove', onMouseMove, false);
    renderer.domElement.addEventListener('mouseup', onMouseUp, false);
  };
  
  