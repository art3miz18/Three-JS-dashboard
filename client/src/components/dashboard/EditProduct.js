import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../../services/productServices';
import ThreeContainer from '../ThreeComponents/ThreeContainer';
import UpdateForm from './UpdateForm'

const EditProduct = () => {
  const { id } = useParams(); // This will get the product id from the URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    
    const fetchProduct = async () => {
        try {
          const fetchedProduct = await productService.getProductById(id);
          setProduct(fetchedProduct);
        } catch (error) {
          console.error('Error fetching product:', error);
          // Handle error, possibly redirect back or show a message
        }
      };
      fetchProduct();      
  }, [id]);

  const handleSave = async (updateProduct) => {
    console.log('handling save param', updateProduct);
    try{
      await productService.updateProduct(id, updateProduct);
      console.log('Update Succesful');
      setProduct(updateProduct);
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
    console.log('Description Changed',e.description.value)
    
  };
  
  return (
    <div class ="flex flex-row">
      <div class = "basis-1/2 h-700 w-700">
        {product && <ThreeContainer modelPath={product.modelFile} />}
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
