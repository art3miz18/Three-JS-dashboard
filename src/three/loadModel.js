import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const loadModel = (scene, modelPath, onLoadCallback) => {
  const loader = new GLTFLoader();
  loader.load(modelPath, gltf => {
    const model = gltf.scene;
    scene.add(model);
    if (onLoadCallback) onLoadCallback(model);
  }, undefined, error => {
    console.error('An error happened', error);
  });
};
