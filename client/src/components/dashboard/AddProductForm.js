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
      <form onSubmit={handleSubmit} class="space-y-10">      
      <div class="container mx-auto ">
        <label htmlFor="productName" class="block text-sm font-medium leading-6 text-gray-900" >Product Name:</label>
          <input
            class=" w-full h-8 rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm "
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
      </div>
      <div class="sm:col-span-3">
        <label htmlFor="productDescription" class="block text-sm font-medium leading-6 text-gray-900">Product Description:</label>
          <input
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            id="productDescription"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
      </div>
      <div class="sm:col-span-3">
        <label htmlFor="images" class="block text-sm font-medium leading-6 text-gray-900" >Images</label>
        <input type="file" multiple onChange={(e) => setImages([...e.target.files])} />
      </div>
      <div class="sm:col-span-3">
        <label htmlFor="modelFile" class="block text-sm font-medium leading-6 text-gray-900" >modelFile</label>
        <input type="file" onChange={(e) => setModelFile(e.target.files[0])} />
      </div>
          {/* Include input for file if needed */}
          {/* <input
            type="file"
            onChange={(e) => setProductFile(e.target.files[0])}
          /> */}

          <button type="submit" class=" space-y-4 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add Product</button>
      </form>
    </div>
    
    
  );
};

export default AddProductForm;
