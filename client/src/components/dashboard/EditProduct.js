import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../../services/productServices';
import ThreeContainer from '../ThreeComponents/ThreeContainer';
import UpdateForm from './UpdateForm'
import { HistoryManager } from '../../three/historyManager';
import { AnnotationProvider } from '../../js/AnnotationContext';
// import { ModelViewerComponent } from '../ThreeComponents/ModelViewAR'
import  ModelViewerComponent  from '../ThreeComponents/ModelViewAR'

const EditProduct = () => {
  const { id } = useParams(); // This will get the product id from the URL
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false); // enable add point editing
  const interactionHandlerRef = useRef(null);
  const threeComponentRef = useRef(null);
  const historyRef = useRef(null);  
  const newEditMode = !isEditMode;

  // In EditProduct component
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  // Zoom level
  const [zoomLevel, setZoomLevel] = useState(0.5);
  const [isModalOpen, setModalOpen] = useState(false);
  
  useEffect(() => {
    
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
          const fetchedProduct = await productService.getProductById(id);
          setProduct(fetchedProduct);
        } catch (error) {
          console.error('Error fetching product:', error);
          // Handle error, possibly redirect back or show a message
        } finally{
          setIsLoading(false);
          setZoomLevel(0.5);
        }
      };

      fetchProduct();
      
        
  }, [id , refreshTrigger]);

  if(!historyRef.current){
    historyRef.current = new HistoryManager();
  }
  const historyManager = historyRef.current;
  
  const handleSave = async (updateProduct) => {
    try{
      await productService.updateProduct(id, updateProduct);
      setRefreshTrigger(oldTrigger => oldTrigger + 1);
    }
    catch(err){
      console.error('error in update patch', err);
    }
  };


  // Toggling editing of points
  const toggleEditMode = () => {
    setIsEditMode(newEditMode);
    if(interactionHandlerRef.current){
      interactionHandlerRef.current.setEditMode(newEditMode)
    }
  };

  const updateUndoRedoAvailability = () => {
    setCanUndo(historyManager.undoStackSize > 0);
    setCanRedo(historyManager.redoStackSize > 0);
  };
  
  // Similar for undo and redo operations
  const performUndo = () => {
    historyManager.undo();
    updateUndoRedoAvailability(); // Update button states
  };
  
  const performRedo = () => {
    historyManager.redo();
    updateUndoRedoAvailability(); // Update button states
  };

  const handleZoomChange = (event) => {
    const zoomValue = parseFloat(event.target.value); // Convert value to float
    setZoomLevel(zoomValue); // Set the new zoom level
    if(threeComponentRef.current){
      threeComponentRef.current(zoomValue);
    }
  };
  
  const HandleModalClose = () => {
    setModalOpen(false);
    console.log('modal closed');
  }
  const viewAR = (shouldOpen) => {
    setModalOpen(shouldOpen);
  };
  return (
    <div class ="flex flex-row">
      <div class = "basis-1/2 h-700 w-700">
        <AnnotationProvider>
          { !isLoading && product && <ThreeContainer  modelPath={ product.modelFile }   
                                                      productId={product._id} 
                                                      interactionHandlerRef={interactionHandlerRef}
                                                      historyManager = { historyManager }
                                                      UpdateUndoRedoAvailability = {updateUndoRedoAvailability}
                                                      threeComponentRef={threeComponentRef}
                                                      />
          }
        </AnnotationProvider>
        <div class ="flex flex-row "> 
          <div class="w-200 " style={{ flex :'auto'  }}>
              <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                <span>Min Zoom</span>
                <span>Max Zoom</span>
              </div>              
              <input
                type="range"
                min="0"    // Minimum zoom level
                max="1"    // Maximum zoom level
                step ="0.01"
                value={zoomLevel}
                onChange={handleZoomChange}
                className="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200"
              /> 
              <div
                style={{
                  position: 'relative',
                  left: `${zoomLevel * 100}%`,
                  transform: 'translateX(-50%)',
                }}>
                {zoomLevel}
              </div>
          </div>
          <div>
            <button onClick={performUndo} disabled={!canUndo} class="mx-2 inline-flex items-center rounded-md bg-indigo-600 px-8 py-2 text-sm font-semibold text-white shadow-sm   my-4">Undo</button>
            <button onClick={performRedo} disabled={!canRedo} class="mx-2 inline-flex items-center rounded-md bg-indigo-600 px-8 py-2 text-sm font-semibold text-white shadow-sm   my-4">Redo</button>
            <button onClick={toggleEditMode} class="inline-flex items-center rounded-md bg-indigo-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 my-4" >
              {isEditMode ? "Stop Editing" : "Edit Points"}
            </button>
          </div>
        </div>

      </div>      
      <div class = "flex-basis: 100% h-700 w-700 mx-10 ">
        <UpdateForm
          product={product}
          onSave={handleSave}
          viewAR={viewAR}
        />      
      </div>

      {isModalOpen && product && 
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 ">
            <button type="button" onClick={ HandleModalClose }
            className=" absolute top-0 right-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </button>
            <ModelViewerComponent source={product.modelFile}/>
        </div>
      }


    </div>
  );
}; 

export default EditProduct;
