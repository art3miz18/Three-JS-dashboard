import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

const MIN_ZOOM_RATIO = 1; // Closest zoom (half the size of the object)
const MAX_ZOOM_RATIO = 300; // Farthest zoom (twice the size of the object)
let OBJ_SIZE = null;
let OBJ_CENTER = null;
let Camera = null;
let Controls = null;
let boundedBox = null;
let currScene = null;

export const adjustCameraToFitObject = (scene, camera, object, controls) => {
    Camera = camera;
    Controls = controls;
    const {center, size, boundingBox } = createBoundingBox(object, scene);
    // const {spCenter, sphereBounds, spherr} = createBoundingSphere(object,scene);
    // console.log('Box Dimensions', size, '\n SphereDimension', sphereBounds);
    OBJ_SIZE = size;
    OBJ_CENTER = center; 
    model = object;
    currScene = scene;
    boundedBox = boundingBox;
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180); //camera.fov = 60 ;
    let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2));
    const cameraToCenterDistance = cameraZ * 2;
    cameraZ += center.z; // Adjust camera Z considering the object's position

    // console.log(cameraZ);
    camera.position.z = cameraZ; //cameraZ
    const minZ = boundingBox.min.z;
    const cameraToFarEdgeDistance = (minZ < 0) ? -minZ + cameraToCenterDistance : cameraToCenterDistance - minZ;

    camera.far = cameraToFarEdgeDistance * 10;
    
    camera.near = 0.01; //camera.far / 100
    // console.log('far val: ', camera.far,'Near val: ', camera.near);
    camera.updateProjectionMatrix();

    if (controls) {
        controls.target.set(center.x, center.y, center.z);
        controls.update();
    }
    camera.lookAt(center);
};

export const createBoundingBox = (object, scene) => {
    const boundingBox = new THREE.Box3().setFromObject(object);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());
    
    const boxHelper = new THREE.BoxHelper(object, 0xffff00); // color is optional    
    boxHelper.layers.set(1);
    scene.add(boxHelper);
    boxHelper.update();
    return {center, size, boundingBox};
};
export const createBoundingSphere = (object, scene) => {
  object.geometry.computeBoundingSphere();
  const boundingSphere = object.geometry.boundingSphere.clone();
  const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00, // Yellow color for the sphere
      wireframe: true,
      transparent: true,
      opacity: 0.5
  });
  const sphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(boundingSphere.radius, 32, 32),
      sphereMaterial
  );
  sphereMesh.position.copy(boundingSphere.center);
  sphereMesh.layers.set(1); // Set the same layer as the box helper was using
  scene.add(sphereMesh);
  sphereMesh.updateMatrix(); // Ensure the sphere mesh updates to reflect the object's transformations

  return {
      center: boundingSphere.center,
      radius: boundingSphere.radius,
      boundingSphere: boundingSphere,
  };
};


let model = null;



  export const setZoomBasedOnSlider = (sliderValue, scene, camera, controls) => {
    
    const zoomRatio = THREE.MathUtils.lerp(MIN_ZOOM_RATIO, MAX_ZOOM_RATIO, sliderValue / 100);
    
    const size = OBJ_SIZE; // `model` should be the object you want to zoom on
    const center = OBJ_CENTER ; // `model` should be the object you want to zoom on
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    
    // Calculate the new camera position based on the zoom ratio
    let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2)) * zoomRatio;
    camera.zoom = zoomRatio;  
    camera.updateProjectionMatrix();  
    if (controls) {
      controls.update();
    }
    camera.lookAt(center);
  };
   
  export const annotationToLookAt = (annotationPosition, camera) =>{
    const targetPosition = new THREE.Vector3(annotationPosition.x, annotationPosition.y, annotationPosition.z); // or apply an offset if needed
    const offsetPosition = new THREE.Vector3(0, 0, 0); // Adjust the values as needed
    offsetPosition.z += OBJ_SIZE.x ;       
    const newCameraPosition = findNearestPointOnBoundingBox(boundedBox ,targetPosition);
    // UpdatePointVisual(newCameraPosition);
    smoothTransitionTo(camera, newCameraPosition, targetPosition, Controls ); 

  };

  function smoothTransitionTo(camera, newPosition, targetPosition, controls) {
      const tweenCamera = new TWEEN.Tween(camera.position)
          .to(newPosition, 700)
          .onUpdate(() =>{
            camera.lookAt(targetPosition);
            controls.update();            
          } )
          .easing(TWEEN.Easing.Cubic.InOut)
          .onComplete(() => {
            // camera.lookAt(targetPosition);
            // controls.target.set(targetPosition);
          })
          .start();

      function renderLoop() {
          requestAnimationFrame(renderLoop);
          TWEEN.update();
      }
      renderLoop();
  }
  
  // Function to find the nearest point on the bounding box to a given target position
  function findNearestPointOnBoundingBox(boundingBox, targetPosition ) {    

      const boxCenter = boundingBox.getCenter(new THREE.Vector3());
      const directionToTarget = new THREE.Vector3().subVectors(targetPosition, boxCenter).normalize();
      const distanceToCenter = boundingBox.getSize(new THREE.Vector3()).length() * 0.5; // Half the diagonal of the box
      return boxCenter.addScaledVector(directionToTarget, distanceToCenter);

  }  
  
  let visual = null;

  function UpdatePointVisual(positionData){
    console.log('updating pos', positionData);
    if(!visual){
      const sphereGeometry = new THREE.SphereGeometry(10, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0x0000ff});
      visual = new THREE.Mesh(sphereGeometry, material);
      visual.position.copy(positionData);
      currScene.add(visual);
      console.log('updating pos', visual);
    }
    else {
      visual.position.copy(positionData);
    }
}
  