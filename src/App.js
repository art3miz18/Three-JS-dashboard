import React, { useEffect, useRef } from 'react';
import { setupScene } from './three/setupScene';
import { loadModel } from './three/loadModel';


function App() {
  const mountRef = useRef(null);

  useEffect(() => {
    const { scene, camera, renderer } = setupScene();
    mountRef.current.appendChild(renderer.domElement);

    // Adjust this path to where your model is located
    const modelPath = '/models/toyota_supra_dekztrax_persephone_34.glb';
    loadModel(scene, modelPath, (model) => {
      // Once the model is loaded, add interaction capabilities
      
      // If needed, adjust model position
      model.position.set(0, -1, 0);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function to remove the renderer from the DOM and clear event listeners
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      // Here, you should also call a cleanup function if you modify addInteraction to return one,
      // to properly remove event listeners attached to the renderer.domElement.
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }}></div>;
}

export default App;
