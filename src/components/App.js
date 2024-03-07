import React, { useEffect, useRef , useState} from 'react';
import AnnotationForm  from './AnnotationForm';
import AnnotationDetail  from './AnnotationDetails';
import { setupScene } from '../three/setupScene';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { loadModelFromFile } from '../three/loadModel';
import DragAndDrop from '../three/dragAndDrop';
import { getAnnotationById, onSaveAnnotation} from '../js/annotation';


function App() {
  const mountRef = useRef(null);
  const [threeObjects, setThreeObjects] = useState({ scene: null, camera: null, renderer: null, controls: null });
  const [initialized, setInitialized] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [AnnotationPosition, setPosition] = useState(null);
  const [annotationData, setAnnotationData] = useState(null);

  const [annotations, setAnnotations] = useState([]); // This state holds all annotations
  
  const handleModelLoaded = (file) =>{
    if (threeObjects.scene && threeObjects.camera && threeObjects.controls) {
      loadModelFromFile(file, threeObjects.camera, threeObjects.scene, threeObjects.controls);
    }
  };

  const handlePointClick = (point, position) => {
    setSelectedPoint(point);
    setPosition(position);
    setShowForm(true);
    // Assuming mesh has an annotationID property
    const annotationID = point;
    const annotationData = getAnnotationById(annotationID);
    setAnnotationData(annotationData);
  };

  const handleSaveAnnotation = ( id ) => {    
    console.log('id: ',id);
    const annotationWithPosition = {
        ...id, // Spread the id object to include annotationID, title, and description
        position: AnnotationPosition // Add the position from state
    };
    onSaveAnnotation(annotationWithPosition);    
    setShowForm(false);
    setPosition(null);

    const newAnnotations = annotations.some(anno => anno.id === id.annotationID)
        ? annotations.map(anno => anno.id === id.annotationID ? annotationWithPosition : anno)
        : [...annotations, annotationWithPosition];
    setAnnotations(newAnnotations);  
  };

  useEffect(() => {
    
    const { scene, camera, renderer ,controls} = setupScene();

    const css3DRenderer = new CSS3DRenderer();    
    css3DRenderer.setSize(window.innerWidth, window.innerHeight);

    setThreeObjects({ scene, camera, renderer, controls });
    setInitialized(true);
    
    
    mountRef.current.appendChild(renderer.domElement);
    
    //render loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);

      css3DRenderer.render(scene, camera);
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
        
          {annotations.map((anno) =>
            anno.title && anno.description ? ( // Only render details for described annotations
              <AnnotationDetail
                key={anno.id}
                title={anno.title}
                description={anno.description}
                position={anno.position}
                scene={threeObjects.scene} // Pass in your Three.js scene
              />
            ) : null
          )}

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
