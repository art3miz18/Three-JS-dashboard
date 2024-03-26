import axios from 'axios';

const API_URL = 'http://localhost:3001/api/products/'; // Update with the correct API endpoint

const addProduct = async (formData) => {
  // Include configuration for sending the Authorization header with the JWT
  const userObject = JSON.parse(localStorage.getItem('user'));
  const token =  userObject ? userObject.token : null;
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`, // Assuming JWT is stored in localStorage
    },
  };
  // POST request to add a new product
  const response = await axios.post(API_URL, formData, config);
  return response.data;
};

const getProducts = async () => {
  const userObject = JSON.parse(localStorage.getItem('user'));
  const token =  userObject ? userObject.token : null;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`, // Assuming JWT is stored in localStorage
      },
    };
  
    // GET request to fetch products
    const response = await axios.get(API_URL, config);
    return response.data;
  };

const getProductById = async (productId) => {
  const userObject = JSON.parse(localStorage.getItem('user'));
  const token =  userObject ? userObject.token : null;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`, // Assuming JWT is stored in localStorage
      },
    };
  
    // GET request to fetch products
    const response = await axios.get(`${API_URL}${productId}`, config);
    return response.data;
  };

  const updateProduct = async (productId, formData) => {
    console.log('updating product details ' ,formData);
    // Include configuration for sending the Authorization header with the JWT
    const userObject = JSON.parse(localStorage.getItem('user'));
    const token = userObject ? userObject.token : null;
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data', // Use 'application/json' if you're sending JSON data
        'Authorization': `Bearer ${token}`, // Assuming JWT is stored in localStorage
      },
    };
  
    // PATCH request to update an existing product
    const response = await axios.patch(`${API_URL}${productId}`, formData, config);
    return response.data;
  };

export default {
  addProduct, getProducts, getProductById, updateProduct
  // ...other service functions
};
