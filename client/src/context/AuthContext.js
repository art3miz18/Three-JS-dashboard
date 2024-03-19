// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    token: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Upon initial load, try to get authentication data from local storage or another source
    const token = localStorage.getItem('token');
    if (token) {
      setAuthData({ token, isAuthenticated: true });
    }
  }, []);

  // The value that will be given to the context
  const authContextValue = {
    authData,
    setAuthData,
    login: (newToken) => {
      localStorage.setItem('token', newToken);
      setAuthData({ token: newToken, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('token');
      setAuthData({ token: null, isAuthenticated: false });
    },
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
