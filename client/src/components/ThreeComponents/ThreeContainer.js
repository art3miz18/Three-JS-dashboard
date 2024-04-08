import React, { useEffect, useRef , useState } from 'react';
import AnnotationForm  from '../ThreeComponents/AnnotationForm';
import { setupScene } from '../../three/setupScene';
import { loadModel } from '../../three/loadModel';
import { getAnnotationById, onSaveAnnotation, getAnnotationData } from '../../js/annotation';
import InteractionHandler from '../../three/interactionHandler';

const ThreeContainer = ({ modelPath, productId, interactionHandlerRef, historyManager, UpdateUndoRedoAvailability}) => {
  const mountRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [AnnotationPosition, setPosition] = useState(null);
  const [annotationData, setAnnotationData] = useState(null);

  const handlePointClick = (point, position, isNewPoint) => {
    if(!showForm){
      setSelectedPoint(point);
      setPosition(position);
      setShowForm(true);
      if(!isNewPoint){
        const annotationID = point;
        getAnnotationById(productId, annotationID).then( annotationData=>{
        setAnnotationData(annotationData);
        });
      }
      else{
        const nullData = '';
        setAnnotationData(nullData);
      }
    }
  };

  const handleSaveAnnotation = async ( id ) => {    
    const annotationWithPosition = {
        ...id, 
        position: AnnotationPosition 
    };
    onSaveAnnotation(annotationWithPosition , productId);
    if(interactionHandlerRef.current){
      console.log('setting point creation back to active');
      interactionHandlerRef.current.clearActivePoint();
    }
    setShowForm(false);
    setPosition(null);   
  };

  const handleEditPoint = () =>{
    
    console.log('Editing is clicked');
  }
  const handleDeletePoint = () =>{
    setShowForm(false);
    console.log('Delete is clicked');
  }
  useEffect(() => {
    const { scene, camera, renderer ,controls} = setupScene(); 
    setInitialized(true);
    
    mountRef.current.appendChild(renderer.domElement);
    loadModel(scene, modelPath, camera,  controls, (onModelLoaded)=>{
      interactionHandlerRef.current = new InteractionHandler(scene,
                                                        camera, 
                                                        renderer, 
                                                        onModelLoaded, 
                                                        handlePointClick,
                                                        historyManager,
                                                        UpdateUndoRedoAvailability);
      getAnnotationData(productId, interactionHandlerRef.current);
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
        
      };
    }, [ modelPath, productId, interactionHandlerRef]);

  return <div ref={mountRef} children class="box-content" style={{ width: '800px', height: '800px'}}>
    { initialized && (
        <>          
          {showForm && (
            <AnnotationForm
              annotationData={annotationData}
              selectedPoint={selectedPoint}
              onCancel={() => setShowForm(false)}
              onSave={handleSaveAnnotation}
              onEdit={handleEditPoint}
              onDelete={handleDeletePoint}
            />
          )}
        </>
      )}
  </div>;
};

export default ThreeContainer;
