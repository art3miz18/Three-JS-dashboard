import React, { useEffect, useRef } from 'react';
import { setupScene } from './three/setupScene';
import { loadModel,loadModelFromFile } from './three/loadModel';
import { setupInteractionHandler } from './three/interactionHandler';
import { adjustCameraToFitObject } from './three/cameraUtil';


function App() {
  const mountRef = useRef(null);
  
  useEffect(() => {
    
    const { scene, camera, renderer ,controls} = setupScene();
    mountRef.current.appendChild(renderer.domElement);

    //render loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    
    // Setup drag and drop
    const handleDrop = (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        loadModelFromFile(file, camera, scene, controls);
      }
      mountRef.current.classList.remove('drag-over');
    };
    
    // Setup drag and drop listeners
    const handleDragOver = (e) => {
      e.preventDefault(); // Prevent default behavior
      mountRef.current.classList.add('drag-over');
      // Visual feedback or any action on drag over
    };

    const handleDragLeave = (e) => {
      mountRef.current.classList.remove('drag-over');
    };
    
    // LOAD 3D GLB FROM FILE LOCATION
    // Adjust this path to where your model is located
    // const modelPath = '/models/flowers_in_vase.glb';
    
    // loadModel(scene, modelPath, (model) => {
    //   // Once the model is loaded, add interaction capabilities      
    //   // set Interactable through raycasting
    //   model.userData = { interactable: true }; // Optional, for filtering later
    //   // If needed, adjust model position
    //   model.position.set(0, -1, 0);
    //   // Assuming you have initialized `camera` and optionally `controls` (like OrbitControls)
    //   adjustCameraToFitObject(scene,camera, model, controls);
    // });

    mountRef.current.addEventListener('dragleave', handleDragLeave);
    mountRef.current.addEventListener('dragover', handleDragOver);
    mountRef.current.addEventListener('drop', handleDrop);

    // Setup interaction handler, passing necessary objects
    const cleanupInteraction = setupInteractionHandler(scene, camera, renderer);

    // Cleanup function to remove the renderer from the DOM and clear event listeners
    return () => {
      cleanupInteraction(); // Call the cleanup from interactionHandler
      mountRef.current.removeEventListener('dragleave', handleDragLeave);
      mountRef.current.removeEventListener('dragover', handleDragOver);
      mountRef.current.removeEventListener('drop', handleDrop);
      mountRef.current.removeChild(renderer.domElement);
      // Here, you should also call a cleanup function if you modify addInteraction to return one,
      // to properly remove event listeners attached to the renderer.domElement.
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }}></div>;
}

export default App;
