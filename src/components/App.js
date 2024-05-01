import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import AddProductForm from './dashboard/AddProductForm';
import ProductList from './dashboard/ProductList';
import EditProduct from './dashboard/EditProduct';
import LoginForm from './auth/LoginForm';
import PrivateRoute from './common/PrivateRoute';
import AuthContext from '../context/AuthContext'; // Assuming you've created this context
// import { useAPI } from './common/APIcontext';
// import authServices from '../services/authServices';
// import productServices from '../services/productServices';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  

  useEffect(() => {
    // Check for a token in local storage and update isAuthenticated accordingly
  const token = localStorage.getItem('user');
  setIsAuthenticated(!!token);
  if(isAuthenticated){
    console.log('auth status', isAuthenticated);
    // navigate('/dashboard');
  }
  // console.log('token found state', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </PrivateRoute>
            }/>
          <Route path="/edit-product/:id" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <EditProduct />
              </PrivateRoute>
            }/>
          <Route path="/add-product" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <AddProductForm />
              </PrivateRoute>
            }/>
          <Route path="/product-list" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <ProductList />
              </PrivateRoute>
            }/>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate replace to="/dashboard" /> : <Navigate replace to="/login" />} 
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}
export default App;
