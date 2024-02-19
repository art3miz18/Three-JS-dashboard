import React, { useEffect, useRef , useState} from 'react';
import { setupScene } from './three/setupScene';
import DragAndDrop from './three/dragAndDrop';
// import { loadModel,loadModelFromFile } from './three/loadModel';
import { setupInteractionHandler } from './three/interactionHandler';


function App() {
  const mountRef = useRef(null);
  const [threeObjects, setThreeObjects] = useState({});
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    
    const { scene, camera, renderer ,controls} = setupScene();
    setThreeObjects({ scene, camera, renderer, controls });
    setInitialized(true);
    
    mountRef.current.appendChild(renderer.domElement);
    //render loop
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
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }}>
    { initialized && <DragAndDrop{...threeObjects}
        onModelLoaded={() => {
          console.log('Model loaded!');
          // Additional actions after model load if necessary
        }}
      />}
  </div>;
}

export default App;
