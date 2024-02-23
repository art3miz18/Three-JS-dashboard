import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { adjustCameraToFitObject } from './cameraUtil';

export const loadModel = (scene, modelPath, onLoadCallback) => {
  const loader = new GLTFLoader();
  loader.load(modelPath, gltf => {
    const model = gltf.scene;
    model.userData.IsProduct = true;
    scene.add(model);
    if (onLoadCallback) onLoadCallback(model);
  }, undefined, error => {
    console.error('An error happened', error);
  });
};

export const loadModelFromFile = (file,camera, scene, controls, onModelLoadedCallback) => {
  const reader = new FileReader();
  if (file instanceof Blob) {
    reader.readAsArrayBuffer(file);
  } 
  else {
    console.error('The provided file is not a valid Blob.');
  }
  // reader.readAsArrayBuffer(file);
  reader.onload = (event) => {
    const loader = new GLTFLoader();
    loader.parse(event.target.result, '', (gltf) => {
      // console.log("event target ",event.target.result);
      const model = gltf.scene;
      // model.userData.IsProduct = true;
      model.traverse((child) => {
        if (child.isMesh) {
          child.userData.IsProduct = true;
        }
      });
      scene.add(model);
      console.log(' checking for product tag', model.userData);
      // Additional setup like adjusting the camera can go here
      adjustCameraToFitObject(scene, camera, model, controls);
      if (onModelLoadedCallback && typeof onModelLoadedCallback === 'function') {
        onModelLoadedCallback(model);
      }
    });
  };
};