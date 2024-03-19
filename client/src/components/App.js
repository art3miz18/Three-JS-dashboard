import React, { useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import Dashboard from './dashboard/Dashboard';
import PrivateRoute from './common/PrivateRoute';
import AuthContext from '../context/AuthContext'; // Assuming you've created this context



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  

  
  useEffect(() => {
  // Check for a token in local storage and update isAuthenticated accordingly
  const token = localStorage.getItem('token');
  setIsAuthenticated(!!token);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </PrivateRoute>
            } 
          />
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
