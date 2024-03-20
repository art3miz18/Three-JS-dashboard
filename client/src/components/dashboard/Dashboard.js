import React, { useState } from 'react';
import AddProductForm from '../dashboard/AddProductForm';
import ThreeContainer from '../ThreeComponents/ThreeContainer';
import ProductList from '../dashboard/ProductList';

const Dashboard = () => {
  const [view, setView] = useState('products');

  return (
    <div>
      
      <nav>
      <div class="mt-5 flex lg:ml-4 lg:mt-0">
        <span class="hidden sm:block">
          <button onClick={() => setView('addProduct')} class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add Product</button>
        </span> 
      </div>
      <div class="mt-5 flex lg:ml-4 lg:mt-0">
        <span class="hidden sm:block">
          <button onClick={() => setView('product')} class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">View Products</button>
        </span> 
      </div>
      <div class="mt-5 flex lg:ml-4 lg:mt-0">
        <span class="hidden sm:block">        
        <button onClick={() => setView('ThreeView')} class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">3D view</button>
        </span> 
      </div>
      </nav>

      {view === 'addProduct' && <AddProductForm />}
      {view === 'product' && <ProductList />}
      {view === 'ThreeView' && <ThreeContainer />}
      
      {/* Other dashboard-related components */}
    </div>
  );
};

export default Dashboard;
