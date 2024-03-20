// src/components/dashboard/ProductList.js
import React, { useEffect, useState } from 'react';
import productService from '../../services/productServices';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts();
        console.log(response);
        setProducts(response);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {products.map((product) => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          {/* <!-- Example of displaying an image in React --> */}
          <img src={product.images[0]} alt="Product" />
          {/* <!-- Example of providing a download link for a 3D model file --> */}
          <a href={product.modelFile} download>Download 3D Model</a>
          {/* Render additional product details here */}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
