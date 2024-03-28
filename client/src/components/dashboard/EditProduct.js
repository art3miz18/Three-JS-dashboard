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
          console.log('new product details', product );
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

  const handleNameChange = (e) => {
    setProduct({ ...product, name: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setProduct({ ...product, description: e.target.value });
    console.log('Description Changed',e.description.value);
    
  };

  return (
    <div class ="flex flex-row">
      <div class = "basis-1/2 h-700 w-700">
        { !isLoading && product && <ThreeContainer modelPath={product.modelFile} productId={product._id} />}
      </div>      
      <div class = "flex-basis: 100% h-700 w-700 mx-10 ">
        <UpdateForm
          product={product}
          onSave={handleSave}
          // onNameChange={handleNameChange}
          // onDescriptionChange={handleDescriptionChange}
        />      
      </div>
    </div>
  );
}; 

export default EditProduct;
