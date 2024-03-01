import React, { useEffect, useRef , useState} from 'react';
import AnnotationPanel  from './annotationPanel';
import AnnotationForm  from './AnnotationForm';
import { setupScene } from '../three/setupScene';
import { loadModelFromFile } from '../three/loadModel';
import DragAndDrop from '../three/dragAndDrop';
import { getAnnotationById, onSaveAnnotation} from '../js/annotation';


function App() {
  const mountRef = useRef(null);
  const [threeObjects, setThreeObjects] = useState({ scene: null, camera: null, renderer: null, controls: null });
  const [initialized, setInitialized] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [annotationData, setAnnotationData] = useState(null);
  
  const handleModelLoaded = (file) =>{
    if (threeObjects.scene && threeObjects.camera && threeObjects.controls) {
      loadModelFromFile(file, threeObjects.camera, threeObjects.scene, threeObjects.controls);
    }
  };

  const handlePointClick = (point) => {
    setSelectedPoint(point);
    setShowForm(true);
    // Assuming mesh has an annotationID property
    const annotationID = point;
    console.log('point data ',point);
    
    const annotationData = getAnnotationById(annotationID);
    setAnnotationData(annotationData);
    
    
  };

  const handleSaveAnnotation = (id, title, description, pointDetails) => {
    // // Use the imported function
    onSaveAnnotation(id, title, description, pointDetails);
    setShowForm(false);
    // // Any additional logic you need after saving an annotation    
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
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      controls.update();
    };


    window.addEventListener('resize', onWindowResize, false);

    // Cleanup function to remove the renderer from the DOM and clear event listeners
    return () => {           
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener('resize',onWindowResize, false);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }}>
    { initialized && (
        <>
          <DragAndDrop {...threeObjects} onModelLoaded={handleModelLoaded} handlePointClick={handlePointClick}/>          
          <AnnotationPanel onModelLoaded={handleModelLoaded}/>
          {showForm && (
            <AnnotationForm
              annotationData={annotationData}
              selectedPoint={selectedPoint}
              onCancel={() => setShowForm(false)}
              onSave={handleSaveAnnotation}
            />
          )}
        </>
      )}
  </div>;
}

export default App;
