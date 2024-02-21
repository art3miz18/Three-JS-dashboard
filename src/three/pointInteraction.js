import * as THREE from 'three';

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let intersectedObject = null;

function onMouseMove(event, camera, scene, renderer) {
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    if (intersectedObject != intersects[0].object) {
      if (intersectedObject) intersectedObject.material.color.set('#FFFFFF'); // Restore previous intersection object color
      intersectedObject = intersects[0].object;
      intersectedObject.material.color.set('#FF0000'); // Change color of new intersected object
    }
  } else {
    if (intersectedObject) intersectedObject.material.color.set('#FFFFFF');
    intersectedObject = null;
  }
}

function onMouseClick() {
  if (intersectedObject) {
    console.log('Point clicked:', intersectedObject);
    // Additional actions here
  }
}

function setupPointInteraction(camera, scene, renderer) {
  renderer.domElement.addEventListener('mousemove', (e) => onMouseMove(e, camera, scene, renderer));
  renderer.domElement.addEventListener('click', onMouseClick);
}

export { setupPointInteraction };
