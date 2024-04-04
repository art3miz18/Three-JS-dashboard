
import React, { useState, useEffect} from 'react';
import productServices from '../../services/productServices';


const UpdateForm = ({ product, onSave }) => {
  const [name ,setName] = useState('');
  const [description ,setDescription] = useState('');
  const [endPointURL ,setEndpointUrl] = useState('');
  const [AnnotationsEndPointURL ,setAnnotationURL] = useState('');
  
  useEffect(() => {
    
    if (product) {
      setName(product.name);
      setDescription(product.description);      
      const url =  productServices.getProductURL(product._id);      
      setEndpointUrl(url.getProduct);
      setAnnotationURL(url.getAnnotations);
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...product,
      name: name,
      description: description
    };
    onSave({ ...updatedProduct });
  };

  

  return (
    <form onSubmit={handleSubmit} class = "container mx-auto" >
      <h1>Edit Product</h1>
      <label  class="text-base font-semibold leading-7 text-gray-900 my-4">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      <label class="block text-sm font-medium leading-6 text-gray-900 my-4">description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />

      <label  class="block text-sm font-medium leading-6 text-gray-900 my-4">Product details URL</label>
        {/* <textarea
          value={endPointURL}
          onChange={(e) => setEndpointUrl(e.target.value)}
          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          /> */}
          <p>{endPointURL}</p>
      <label  class="block text-sm font-medium leading-6 text-gray-900 my-4">Annotations URL</label>
        <p>{AnnotationsEndPointURL}</p>
      <button type ="submit"  class="inline-flex items-center rounded-md bg-indigo-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 my-4">Save Changes</button>
    </form>
  );
};

export default UpdateForm;
