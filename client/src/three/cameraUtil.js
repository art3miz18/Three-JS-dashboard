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
    // console.log('fov :',camera.fov);
    let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2));

    // This factor will depend on the initial position of the camera relative to the object
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
    // boxHelper.userData = { interactable: true };
    scene.add(boxHelper);
    boxHelper.update();
    return {center, size, boundingBox};
};
export const createBoundingSphere = (object, scene) => {
  // Compute the bounding sphere based on the object's geometry
  object.geometry.computeBoundingSphere();
  const boundingSphere = object.geometry.boundingSphere.clone();

  // Create a visual representation of the bounding sphere (optional)
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

  // Return necessary data for further processing
  return {
      center: boundingSphere.center,
      radius: boundingSphere.radius,
      boundingSphere: boundingSphere,
  };
};


let model = null;

export const calculateScaleFactor = ( camera, rendererDomElement) => {
    // Step 1: Get the size of the bounding box in the world space
    const boundingBox = new THREE.Box3().setFromObject(model);
    const size = boundingBox.getSize(new THREE.Vector3());
  
    console.log('our OBJECT SIZE ',  size);
    // Step 2: Calculate the object's distance from the camera
    const objectPosition = new THREE.Vector3();
    boundingBox.getCenter(objectPosition);
    const distance = objectPosition.distanceTo(camera.position);
  
    // Step 3: Calculate the vertical field of view in radians
    const vFOV = THREE.MathUtils.degToRad(camera.fov);
  
    // Step 4: Calculate the height of the visible area at this distance
    const visibleHeight = 2 * Math.tan(vFOV / 2) * distance;
  
    // Step 5: Calculate the visible width based on the aspect ratio
    const visibleWidth = visibleHeight * camera.aspect;
  
    // Step 6: Calculate the size of the object on the screen in pixels
    const pixelWidth = (size.x / visibleWidth) * rendererDomElement.clientWidth;
    const pixelHeight = (size.y / visibleHeight) * rendererDomElement.clientHeight;
  
    // Step 7: Derive the scaleFactor for CSS3DObject
    // Assuming you want a CSS3DObject to have a specific size in pixels (cssTargetWidth, cssTargetHeight)
    const cssTargetWidth = 200; // The width you want the CSS3D object to have in pixels
    const cssTargetHeight = 200; // The height you want the CSS3D object to have in pixels
    const scaleFactorWidth = cssTargetWidth / pixelWidth;
    const scaleFactorHeight = cssTargetHeight / pixelHeight;
    
    console.log('Scaled width', scaleFactorWidth, 'Scaled Height', scaleFactorHeight);
    // Return the average scale factor
    return (scaleFactorWidth + scaleFactorHeight) / 2;
  };

  export function calculatePerspective(camera, height) {
    const fov = THREE.MathUtils.degToRad(camera.fov); // Convert FOV to radians
    const perspective = 0.5 * height / Math.tan(fov / 2);
    return perspective;
  };

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
  
  
  //#region LookAtPoint Function 
  // export const annotationToLookAt = (annotationPosition) =>{
  //   const targetPosition = new THREE.Vector3(annotationPosition.x, annotationPosition.y, annotationPosition.z); // or apply an offset if needed
  //   // console.log( annotationPosition);
  //   const offsetPosition = new THREE.Vector3(0, 0, 0); // Adjust the values as needed
  //   offsetPosition.z += (OBJ_SIZE.x * 0.5);
  //   // console.log( 'New camera pos', offsetPosition);

  //   const newCameraPosition = targetPosition.clone().add(offsetPosition.applyQuaternion(Camera.quaternion));    
  //   const startCameraPosition = Camera.position.clone();
  //   console.log( 'Start camera pos', startCameraPosition, Camera.position);
  //   console.log( 'New camera pos', newCameraPosition);

    
  //   const desiredLookAtQuaternion = new THREE.Quaternion().setFromRotationMatrix(
  //   new THREE.Matrix4().lookAt(newCameraPosition, targetPosition, Camera.up)
  //   );


  //   let t = 0; // Interpolation parameter [0,1]
  //   const duration = 1000; // Duration of the animation in milliseconds

  //   function animateCamera(time) {
      
  //     // Update the interpolation parameter      
  //     t += (time - lastTime) / duration;
  //     // console.log('t ',t);
  //     if (t < 1) {
  //       // requestAnimationFrame(animateCamera);
  //       animationFrameId = requestAnimationFrame(animateCamera);
  //       // Interpolate position
  //       Camera.quaternion.slerpQuaternions(startCameraPosition, newCameraPosition, t);

  //       // Linear interpolation of the position
  //       Camera.position.lerpVectors(startCameraPosition, newCameraPosition, t);
  //       Camera.lookAt(targetPosition);
  //       // Update the camera matrix
  //       // Camera.updateMatrixWorld();
  //       Camera.updateProjectionMatrix();
  //       Controls.update();
  //     } else if(t > 1) {
  //       // Ensure the final values are set
  //       Camera.quaternion.copy(desiredLookAtQuaternion);
  //       Camera.position.copy(newCameraPosition);
  //       Camera.lookAt(targetPosition);
  //       Camera.updateMatrixWorld();
  //       Controls.update();       
  //       // Stop the animation when t >= 1
  //       console.log('camera postion after lerping' , Camera.position);
  //       return;
  //     }      
  //     lastTime = time;
  //   }
    
  //   function animateCamera(time){
  //     requestAnimationFrame(animateCamera);
  //     TWEEN.update(time);
  //     Camera.updateProjectionMatrix();
  //     Controls.update();
  //   }

  //   let animationFrameId;
  //   let lastTime = performance.now();
  //   requestAnimationFrame(animateCamera);

  // };
  //#endregion