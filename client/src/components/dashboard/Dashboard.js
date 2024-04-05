import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProductForm from '../dashboard/AddProductForm';
import ProductList from '../dashboard/ProductList';
import EditProduct from '../dashboard/EditProduct';
import productService from '../../services/productServices';

const Dashboard = () => {
  const [view, setView] = useState('addProduct');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const navigate = useNavigate();

  const DeleteProduct = async (productID) =>{
    console.log('delete called', productID);
    try {
      await productService.DeleteProductById(productID);      
      console.log('product deleted succesfully');   
      setRefreshTrigger(prev => !prev);   
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  //Update Product details
  const EditProduct = (product) =>{
    setSelectedProductId(product._id);
    navigate(`/edit-product/${product._id}`);
  };

  return (
    <div class="min-h-full">      
      <nav class="bg-gray-800 max-w-max">
        <div class=" flex items-baseline space-x-20 " >
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
        </div>
      </nav>     

      {view === 'addProduct' && <AddProductForm />}
      {view === 'product' && <ProductList onEdit={EditProduct} onDelete={DeleteProduct} refreshTrigger={refreshTrigger} />}
      {view === 'editProduct' && selectedProductId && <EditProduct productId={selectedProductId} />}
      
    </div>
  );
};

export default Dashboard;
