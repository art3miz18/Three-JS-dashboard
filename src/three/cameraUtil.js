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


  