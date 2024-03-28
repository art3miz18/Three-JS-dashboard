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

const DeleteProductById = async (productId) => {
  const userObject = JSON.parse(localStorage.getItem('user'));
  const token =  userObject ? userObject.token : null;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`, // Assuming JWT is stored in localStorage
      },
    };
  
    // GET request to fetch products
    const response = await axios.delete(`${API_URL}${productId}`, config);
    return response.data;
  };

  const updateProduct = async (productId, formData) => {
    try{

        // console.log('updating product details ' ,formData);
        // Include configuration for sending the Authorization header with the JWT
        const userObject = JSON.parse(localStorage.getItem('user'));
        const token = userObject ? userObject.token : null;
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`, // Assuming JWT is stored in localStorage
          },
        };
        // PATCH request to update an existing product
        const response = await axios.put(`${API_URL}${productId}`, formData, config);
        return response.data;
    }
    catch(er){
      console.error('error on updating product', er);
    }
  };

  const saveAnnotation = async (productId, annotation) => {
    try {
      const response = await axios.post(`${API_URL}/products/${productId}/annotations`, annotation);
      return response.data;
    } catch (error) {
      console.error('Error saving annotation:', error);
      throw error;
    }
  };
  
  const fetchAnnotations = async (productId) => {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}/annotations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching annotations:', error);
      throw error;
    }
  };
export default {
  addProduct, getProducts, getProductById, updateProduct, DeleteProductById, saveAnnotation, fetchAnnotations
};
