import React, { useEffect, useRef } from 'react';
import { setupScene } from './three/setupScene';
import { loadModel } from './three/loadModel';
import { setupInteractionHandler } from './three/interactionHandler';
import { adjustCameraToFitObject } from './three/cameraUtil';


function App() {
  const mountRef = useRef(null);

  useEffect(() => {
    const { scene, camera, renderer ,controls} = setupScene();

    mountRef.current.appendChild(renderer.domElement);

    // Adjust this path to where your model is located
    const modelPath = '/models/flowers_in_vase.glb';
    loadModel(scene, modelPath, (model) => {
      // Once the model is loaded, add interaction capabilities      
      // set Interactable through raycasting
      model.userData = { interactable: true }; // Optional, for filtering later


      // If needed, adjust model position
      model.position.set(0, -1, 0);

      // Assuming you have initialized `camera` and optionally `controls` (like OrbitControls)
      adjustCameraToFitObject(scene,camera, model, controls);
    });

    //render loop`
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Setup interaction handler, passing necessary objects
    const cleanupInteraction = setupInteractionHandler(scene, camera, renderer);

    // Cleanup function to remove the renderer from the DOM and clear event listeners
    return () => {
      cleanupInteraction(); // Call the cleanup from interactionHandler
      mountRef.current.removeChild(renderer.domElement);
      // Here, you should also call a cleanup function if you modify addInteraction to return one,
      // to properly remove event listeners attached to the renderer.domElement.
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }}></div>;
}

export default App;
