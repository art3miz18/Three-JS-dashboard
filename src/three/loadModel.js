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


export const loadModelFromFile = (file, camera, scene, controls, onModelLoadedCallback) => {  
  
  console.log(file);
  if (!file) {
    console.error('File object is undefined');
    return;
  }
  const namee=  file?.name;
  const extension = namee.split('.').pop().toLowerCase();

  if (extension !== 'gltf' && extension !== 'glb') {
    console.error('Unsupported file format:', extension);
    alert('Unsupported file format. Please upload a 3D GLB or GLTF file.');
    return; // Stop the function if the file format is not supported
  }
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = (event) => {
    switch (extension) {
      case 'gltf':
      case 'glb':{
        const gltfLoader = new GLTFLoader();
        gltfLoader.parse(event.target.result, '', (gltf) => {
          processModel(gltf.scene, scene, camera, controls, onModelLoadedCallback);
        });
        break;}
      default:
        console.error('Unsupported file format:', extension);
    }
  };

  reader.onerror = (error) => {
    console.error('Error reading file:', error);
    alert('An error occurred while reading the file.');
  };
};
function processModel(model, scene, camera, controls, onModelLoadedCallback) {
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.userData.IsProduct = true;
    }
  });

  scene.add(model);
  adjustCameraToFitObject(scene, camera, model, controls);
  
  if (onModelLoadedCallback && typeof onModelLoadedCallback === 'function') {
    onModelLoadedCallback(model);
  }

  
};

export const validateModel = (file, onValidationComplete) => {
  if (!file) {
    console.error('File object is undefined');
    onValidationComplete(false, 'File object is undefined');
    return;
  }

  const name = file.name;
  const extension = name.split('.').pop().toLowerCase();

  if (extension !== 'gltf' && extension !== 'glb') {
    console.error('Unsupported file format:', extension);
    onValidationComplete(false, 'Unsupported file format. Please upload a GLB or GLTF file.');
    return; // Stop the function if the file format is not supported
  }

  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = (event) => {
    const gltfLoader = new GLTFLoader();
    try {
      gltfLoader.parse(event.target.result, '', (gltf) => {
        if (!gltf.scene || gltf.scene.children.length === 0) {
          throw new Error("Model does not contain a valid scene.");
        }
        onValidationComplete(true, 'Model is valid and can be used.');
      }, error => {
        throw new Error('Error parsing the model: ' + error.message);
      });
    } catch (error) {
      console.error('Validation error:', error);
      onValidationComplete(false, error.message);
    }
  };

  reader.onerror = (error) => {
    console.error('Error reading file:', error);
    onValidationComplete(false, 'An error occurred while reading the file.');
  };
};