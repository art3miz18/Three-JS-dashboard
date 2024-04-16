import React, { useEffect, useRef , useState} from 'react';
import { setupScene } from '../three/setupScene';
import { loadModelFromFile } from '../three/loadModel';
import DragAndDrop from '../three/dragAndDrop';
import { getAnnotationById, onSaveAnnotation} from '../js/annotation';


function App() {
  const mountRef = useRef(null);
  const [threeObjects, setThreeObjects] = useState({ scene: null, camera: null, renderer: null, controls: null });
  const [initialized, setInitialized] = useState(false);

  const handleModelLoaded = (file) =>{
    if (threeObjects.scene && threeObjects.camera && threeObjects.controls) {
      loadModelFromFile(file, threeObjects.camera, threeObjects.scene, threeObjects.controls);
    }
  };

  
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

    const onWindowResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      renderer.setSize(width, height);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      controls.update();
    };


    window.addEventListener('resize', onWindowResize, false);

    // Cleanup function to remove the renderer from the DOM and clear event listeners
    return () => {   
      if(mountRef.current){
        mountRef.current.removeChild(renderer.domElement);
      }        
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }}>
    { initialized && (
        <>
          <DragAndDrop {...threeObjects} onModelLoaded={handleModelLoaded} /> 
        </>
      )}
  </div>;
}

export default App;
