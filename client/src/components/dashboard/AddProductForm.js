// src/components/dashboard/AddProductForm.js
import React, { useState } from 'react';
import productService from '../../services/productServices';

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [images, setImages] = useState([]);
  const [modelFile, setModelFile] = useState(null);
  const [productDescription, setProductDescription] = useState('');
  // Include state for file if needed
  // const [productFile, setProductFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Construct form data
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('description', productDescription);
      // Include file in form data if needed
      // For multiple images
      images.forEach(image => {
        formData.append('images', image);
      });
      
      // Append the 3D model file
      // For a single model file
      formData.append('modelFile', modelFile);

      // Assuming annotations are collected as an array of objects
      // formData.append('annotations', JSON.stringify(annotations));


      // Call the service function to add a new product
      await productService.addProduct(formData);

      // Clear the form or give user feedback
      setProductName('');
      setProductDescription('');
      // Reset file input if needed
      // setProductFile(null);

      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    }
  };

  return (
    <div>
        <form onSubmit={handleSubmit}>
        <label htmlFor="productName" class="block text-sm font-medium leading-6 text-gray-900">Product Name:</label>
        <input
          type="text"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />

        <label htmlFor="productDescription">Product Description:</label>
        <textarea
          id="productDescription"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />
        <input type="file" multiple onChange={(e) => setImages([...e.target.files])} />
        <input type="file" onChange={(e) => setModelFile(e.target.files[0])} />
          {/* Include input for file if needed */}
          {/* <input
            type="file"
            onChange={(e) => setProductFile(e.target.files[0])}
          /> */}

          <button type="submit">Add Product</button>
        </form>
    </div>
    
  );
};

export default AddProductForm;
