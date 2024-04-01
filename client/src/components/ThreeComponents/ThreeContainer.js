import React, { useEffect, useRef , useState } from 'react';
import AnnotationForm  from '../ThreeComponents/AnnotationForm';
import { setupScene } from '../../three/setupScene';
import { loadModel } from '../../three/loadModel';
import { getAnnotationById, onSaveAnnotation, getAnnotationData } from '../../js/annotation';
import InteractionHandler from '../../three/interactionHandler';
// import  productService  from '../../services/productServices';

const ThreeContainer = ({modelPath, productId}) => {
  const mountRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [AnnotationPosition, setPosition] = useState(null);
  const [annotationData, setAnnotationData] = useState(null);
  // const cleanupInteractionRef = useRef(null);  

  const handlePointClick = (point, position) => {
    console.log('point over object clicked');
    setSelectedPoint(point);
    setPosition(position);
    setShowForm(true);
    const annotationID = point;
     getAnnotationById(productId, annotationID).then( annotationData=>{
      console.log('fetched data from API',annotationData);
      setAnnotationData(annotationData);
    });
  };

  const handleSaveAnnotation = async ( id ) => {    
    const annotationWithPosition = {
        ...id, 
        position: AnnotationPosition 
    };

    onSaveAnnotation(annotationWithPosition , productId); 
    console.log('annotations ',annotationWithPosition);   
    setShowForm(false);
    setPosition(null);   
  };

  useEffect(() => {
    
    const { scene, camera, renderer ,controls} = setupScene(); 
    setInitialized(true);
    
    mountRef.current.appendChild(renderer.domElement);
    console.log('modelpath variable', modelPath);
    loadModel(scene, modelPath, camera,  controls, (onModelLoaded)=>{
      const interactionHandler = new InteractionHandler(scene, camera, renderer, onModelLoaded, handlePointClick);
      // cleanupInteractionRef.current = interactionHandler;
      getAnnotationData(productId, interactionHandler);
    });
    

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
    onWindowResize();

    // Cleanup function to remove the renderer from the DOM and clear event listeners
    return () => {           
        if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement);
        }
        window.removeEventListener('resize',onWindowResize, false);
        
        // if (cleanupInteractionRef.current) {
        //   cleanupInteractionRef.current();          
        // }
      };
    }, [modelPath, productId]);

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
