import React, { useEffect, useRef , useState} from 'react';
import AnnotationForm  from '../ThreeComponents/AnnotationForm';
import { setupScene } from '../../three/setupScene';
import { loadModelFromFile, loadModel } from '../../three/loadModel';
// import DragAndDrop from '../../three/dragAndDrop';
import { getAnnotationById, onSaveAnnotation} from '../../js/annotation';
import { setupInteractionHandler } from '../../three/interactionHandler';

const ThreeContainer = (modelPath) => {
  const mountRef = useRef(null);
  const [threeObjects, setThreeObjects] = useState({ scene: null, camera: null, renderer: null, controls: null });
  const [initialized, setInitialized] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [AnnotationPosition, setPosition] = useState(null);
  const [annotationData, setAnnotationData] = useState(null);
  const cleanupInteractionRef = useRef(null);  
  let modelFile = null;

  const handleModelLoaded = (file) =>{
    if (threeObjects.scene && threeObjects.camera && threeObjects.controls) {
      loadModelFromFile(file, threeObjects.camera, threeObjects.scene, threeObjects.controls);
    }
  };

  

  const handlePointClick = (point, position) => {
    console.log('point over object clicked');
    setSelectedPoint(point);
    setPosition(position);
    setShowForm(true);
    // Assuming mesh has an annotationID property
    const annotationID = point;
    const annotationData = getAnnotationById(annotationID);
    setAnnotationData(annotationData);
  };

  const handleSaveAnnotation = ( id ) => {    
    // console.log('id: ',id);
    const annotationWithPosition = {
        ...id, // Spread the id object to include annotationID, title, and description
        position: AnnotationPosition // Add the position from state
    };
    onSaveAnnotation(annotationWithPosition);    
    setShowForm(false);
    setPosition(null);
   
  };
  useEffect(() => {
    
    const { scene, camera, renderer ,controls} = setupScene(); //need to send width and height 
    // renderer.setSize()
    setThreeObjects({ scene, camera, renderer, controls });
    setInitialized(true);
    
    mountRef.current.appendChild(renderer.domElement);
    
    loadModel(scene, modelPath, camera,  controls, (onModelLoaded)=>{
      cleanupInteractionRef.current = setupInteractionHandler(scene, camera, renderer, onModelLoaded, handlePointClick); // need to add interaction flow here 
    });
    
    //render loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate(); 
    
    // setupCanvasSize(); // add window event listeners
    const onWindowResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      controls.update();
      // 
    };
    
    window.addEventListener('resize', onWindowResize, false);
    onWindowResize();

    // Cleanup function to remove the renderer from the DOM and clear event listeners
    return () => {           
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize',onWindowResize, false);
      if (cleanupInteractionRef.current) {
        // console.log('Cleaned up');
        cleanupInteractionRef.current();
        
      }
    };
  }, [modelPath]);

  return <div ref={mountRef} children class="box-content" style={{ width: '800px', height: '800px'}}>
    { initialized && (
        <>
          
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
};

export default ThreeContainer;
