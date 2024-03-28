// src/components/dashboard/ProductList.js
import React, { useEffect, useState } from 'react';
import productService from '../../services/productServices';

const ProductList = ({ onEdit, onDelete, refreshTrigger }) => {
  const [products, setProducts] = useState([]);
  
  
  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts();
      setProducts(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]);

  return (
    <div class="max-auto">
      <ul class="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
        {products.map((product) => (
          <li>
            <div class="flex h-32 rounded-md items-center gap-x-6 border-2 hover:bg-indigo-500 " key={product._id}>
              <img class="h-24 w-24 rounded-full" src={product.images[0]} alt="ProductImg"/>
              <div class="m-12"> 
                <dt class="text-base font-semibold leading-7 tracking-tight text-gray-900">{product.name}</dt>
                <dd class="text-sm font-semibold leading-6 text-indigo-600">{product.description}</dd>
                <a class="hover:text-white" href={product.modelFile} download>Download 3D Model</a>
                
              </div>
                <button class="h-10 w-10" onClick={() => onEdit(product)} src =""> 
                  <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="Edit"><path d="M3.5,24h15A3.51,3.51,0,0,0,22,20.487V12.95a1,1,0,0,0-2,0v7.537A1.508,1.508,0,0,1,18.5,22H3.5A1.508,1.508,0,0,1,2,20.487V5.513A1.508,1.508,0,0,1,3.5,4H11a1,1,0,0,0,0-2H3.5A3.51,3.51,0,0,0,0,5.513V20.487A3.51,3.51,0,0,0,3.5,24Z" fill="#d85b53" class="color000000 svgShape"></path><path d="M9.455,10.544l-.789,3.614a1,1,0,0,0,.271.921,1.038,1.038,0,0,0,.92.269l3.606-.791a1,1,0,0,0,.494-.271l9.114-9.114a3,3,0,0,0,0-4.243,3.07,3.07,0,0,0-4.242,0l-9.1,9.123A1,1,0,0,0,9.455,10.544Zm10.788-8.2a1.022,1.022,0,0,1,1.414,0,1.009,1.009,0,0,1,0,1.413l-.707.707L19.536,3.05Zm-8.9,8.914,6.774-6.791,1.4,1.407-6.777,6.793-1.795.394Z" fill="#d85b53" class="color000000 svgShape"></path>
                  </svg></button>
                <button class="h-14 w-14" onClick={() => onDelete(product._id)} src ="">
                  <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 64 64" viewBox="0 0 64 64" id="Delete"><g transform="translate(232 228)" fill="#d85b53" class="color000000 svgShape"><path fill="#d45985" d="M-207.5-205.1h3v24h-3zM-201.5-205.1h3v24h-3zM-195.5-205.1h3v24h-3zM-219.5-214.1h39v3h-39z" class="color134563 svgShape"></path><path fill="#d45985" d="M-192.6-212.6h-2.8v-3c0-.9-.7-1.6-1.6-1.6h-6c-.9 0-1.6.7-1.6 1.6v3h-2.8v-3c0-2.4 2-4.4 4.4-4.4h6c2.4 0 4.4 2 4.4 4.4v3" class="color134563 svgShape"></path><path fill="#d45985" d="M-191-172.1h-18c-2.4 0-4.5-2-4.7-4.4l-2.8-36 3-.2 2.8 36c.1.9.9 1.6 1.7 1.6h18c.9 0 1.7-.8 1.7-1.6l2.8-36 3 .2-2.8 36c-.2 2.5-2.3 4.4-4.7 4.4" class="color134563 svgShape"></path></g>
                  </svg></button>
            </div>
          </li>
        ))}        
      </ul>
    </div>
  );
};

export default ProductList;
