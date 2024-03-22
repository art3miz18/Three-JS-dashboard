import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../../services/productServices';
import ThreeContainer from '../ThreeComponents/ThreeContainer';
import UpdateForm from './UpdateForm'

const EditProduct = () => {
  const mountRef = useRef(null);
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

  const handleSave = async () => {
    // Logic to save the edited product details
  };

  const handleNameChange = (e) => {
    setProduct({ ...product, name: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setProduct({ ...product, description: e.target.value });
  };
  
  return (
    <div>
      <UpdateForm
        product={product}
        onSave={handleSave}
        onNameChange={handleNameChange}
        onDescriptionChange={handleDescriptionChange}
      />
      {product && <ThreeContainer modelPath={product.modelFile} />}
    </div>
  );
}; 

export default EditProduct;
