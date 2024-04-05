import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../../services/productServices';
import ThreeContainer from '../ThreeComponents/ThreeContainer';
import UpdateForm from './UpdateForm'

const EditProduct = () => {
  const { id } = useParams(); // This will get the product id from the URL
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false); // enable add point editing
  const interactionHandlerRef = useRef(null);  
  const newEditMode = !isEditMode;

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
        }
      };

      fetchProduct();
      
        
  }, [id , refreshTrigger]);

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

  
  return (
    <div class ="flex flex-row">
      <div class = "basis-1/2 h-700 w-700">
        { !isLoading && product && <ThreeContainer  modelPath={ product.modelFile } productId={product._id} interactionHandlerRef={interactionHandlerRef} />
        }
        <button onClick={toggleEditMode} class="inline-flex items-center rounded-md bg-indigo-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 my-4" >
          {isEditMode ? "Stop Editing" : "Edit Points"}
        </button>

      </div>      
      <div class = "flex-basis: 100% h-700 w-700 mx-10 ">
        <UpdateForm
          product={product}
          onSave={handleSave}
        />      
      </div>
    </div>
  );
}; 

export default EditProduct;
