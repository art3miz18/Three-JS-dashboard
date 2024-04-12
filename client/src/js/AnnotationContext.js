// AnnotationContext.js
import React, { createContext, useState } from 'react';

export const AnnotationContext = createContext({
    annotations: [],
    setAnnotations: () => {},
});

export const AnnotationProvider = ({ children }) => {
  const [annotations, setAnnotations] = useState([]);

  // Add other state management logic here as needed

  return (
    <AnnotationContext.Provider value={{ annotations, setAnnotations }}>
      {children}      
    </AnnotationContext.Provider>
  );
};

// export const useAnnotations = () => useContext(AnnotationContext);
