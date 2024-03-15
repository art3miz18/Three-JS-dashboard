import * as THREE from 'three';

export const adjustCameraToFitObject = (scene, camera, object, controls) => {
    
    const {center, size, boundingBox } = createBoundingBox(object, scene);
    model = object;
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

    camera.far = cameraToFarEdgeDistance * 3;
    camera.near = camera.far / 100;
    // console.log('far val: ', camera.far,'Near val: ', camera.near);
    camera.updateProjectionMatrix();

    if (controls) {

        // Update controls target to rotate around the center of the object
        // controls.target = center;  

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
  