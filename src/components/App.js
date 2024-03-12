import React, { useEffect, useRef , useState} from 'react';
import AnnotationForm  from './AnnotationForm';
import { setupScene } from '../three/setupScene';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { loadModelFromFile } from '../three/loadModel';
import { calculateScaleFactor, calculatePerspective } from '../three/cameraUtil';
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
  const [scaleFactor, setScaleFactor] = useState(1);

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
    // console.log('id: ',id);
    const annotationWithPosition = {
        ...id, // Spread the id object to include annotationID, title, and description
        position: AnnotationPosition // Add the position from state
    };
    onSaveAnnotation(annotationWithPosition);    
    // createAnnotation(annotationWithPosition);
    createAndScaleAnnotation(annotationWithPosition);  
    setShowForm(false);
    setPosition(null);
    
    // console.log(annotationWithPosition.position);
    const newAnnotations = annotations.some(anno => anno.id === id.annotationID)
        ? annotations.map(anno => anno.id === id.annotationID ? annotationWithPosition : anno)
        : [...annotations, annotationWithPosition];
    setAnnotations(newAnnotations);
  };

  const createAnnotation = (annotationData) => {
    // Update the annotations state
    setAnnotations(prevAnnotations => [
      ...prevAnnotations,
      { ...annotationData, css3DObject: css3DObject }
    ]);
    const element = document.createElement('div');
    element.className = 'Annotation-Label';
    // Style the element as needed
    element.style.position = 'absolute';
    element.style.width = '200px'; // Set width
    element.style.height = '100px'; // Set height
    element.style.backgroundColor = 'rgba(0, 128, 0, 0.5)'; // Example: green with some transparency
    element.style.color = 'white'; // Text color
    element.style.padding = '10px'; // Some padding
    element.style.border = '1px solid #fff'; // Border to distinguish the div if needed
    element.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)'; // Optional: some shadow
    element.style.backfaceVisibility = 'hidden'; // This can help with any potential flickering issues
    
    element.style.position = 'fixed';
    element.style.top = '0';
    element.style.left = '0';
    element.style.zIndex = '9999';
    element.innerHTML = `
      <h1>${annotationData.title}</h1>
      <p>${annotationData.description}</p>
    `;

    // Create CSS3DObject and set its position
    const css3DObject = new CSS3DObject(element);
    css3DObject.position.copy(annotationData.position);
    // Apply the scale factor
    // css3DObject.scale.set(scaleFactor, scaleFactor, scaleFactor);
    
    // Add it to the scene
    threeObjects.scene.add(css3DObject);    
    return css3DObject;
  };
  
  function createAndScaleAnnotation(annoData) {
    const css3dObject = createAnnotation(annoData); // Your function to create the CSS3D object
    const newScaleFactor = calculateScaleFactor(threeObjects.camera, threeObjects.renderer.domElement);
    setScaleFactor(newScaleFactor);
    css3dObject.scale.set(scaleFactor, scaleFactor, scaleFactor);
  }
  useEffect(() => {
    
    const { scene, camera, renderer ,controls} = setupScene();

    const css3DRenderer = new CSS3DRenderer();    
    // css3DRenderer.setSize(window.innerWidth, window.innerHeight);
    setThreeObjects({ scene, camera, renderer, controls });
    setInitialized(true);
    
    const rendererHeight =  mountRef.current.clientHeight;
    const perspectiveValue = calculatePerspective(camera, rendererHeight);

    // Apply the perspective to the renderer's DOM element
    // css3DRenderer.domElement.style.perspective = `${perspectiveValue}px`;
    
    mountRef.current.appendChild(renderer.domElement);
    mountRef.current.appendChild(css3DRenderer.domElement);

    //render loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      css3DRenderer.render(scene, camera);
    };
    animate(); 

    const onWindowResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      // const newPerspectiveValue = calculatePerspective(camera, height);
      // css3DRenderer.domElement.style.perspective = `${newPerspectiveValue}px`;

      renderer.setSize(width, height);
      css3DRenderer.setSize(width, height);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      controls.update();
    };


    window.addEventListener('resize', onWindowResize, false);

    // Cleanup function to remove the renderer from the DOM and clear event listeners
    return () => {           

      annotations.forEach(anno => {
        if (anno.css3DObject) {
          scene.remove(anno.css3DObject);
        }
      });
      mountRef.current.removeChild(renderer.domElement);
      mountRef.current.removeChild(css3DRenderer.domElement);
      window.removeEventListener('resize',onWindowResize, false);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }}>
    { initialized && (

        <>
          <DragAndDrop {...threeObjects} onModelLoaded={handleModelLoaded} handlePointClick={handlePointClick}/>
        
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
