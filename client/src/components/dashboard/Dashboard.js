import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProductForm from '../dashboard/AddProductForm';
import ThreeContainer from '../ThreeComponents/ThreeContainer';
import ProductList from '../dashboard/ProductList';

const Dashboard = () => {
  const [view, setView] = useState('addProduct');
  const navigate = useNavigate();

  const DeleteProduct = (productID) =>{
    console.log('delete called', productID);
  };

  //Update Product details
  const EditProduct = (product) =>{
    console.log('Edit called on product', product);
    navigate(`/edit-product/${product._id}`);
  };

  return (
    <div class="min-h-full">      
      <nav class="bg-gray-800 max-w-max">
        <div class=" flex items-baseline space-x-20">
          <div class="mt-5 flex lg:ml-0 ">
            <span class="hidden sm:block">
              <button onClick={() => setView('addProduct')} class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" aria-current="page">Add Product</button>
            </span> 
          </div>
          <div class="mt-5 flex lg:ml-0 ">
            <span class="hidden sm:block">
              <button onClick={() => setView('product')} class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">View Products</button>
            </span> 
          </div>
          <div class="mt-5 flex lg:ml-0 ">
            <span class="hidden sm:block">        
            <button onClick={() => setView('ThreeView')} class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">3D view</button>
            </span> 
          </div> 
        </div>
      </nav>     

      {view === 'addProduct' && <AddProductForm />}
      {view === 'product' && <ProductList onEdit={EditProduct} onDelete={DeleteProduct} />}
      {view === 'ThreeView' && <ThreeContainer />}      
    </div>
  );
};

export default Dashboard;
