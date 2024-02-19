import React, { useState, useEffect } from 'react';
import { loadModelFromFile } from './loadModel';

const DragAndDrop = ({ onModelLoaded, scene, camera, controls }) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleDrop = (event) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files[0];
      if (file) {
        loadModelFromFile(file, camera, scene, controls);
        if (onModelLoaded) onModelLoaded();
      }
    };

    const handleDragOver = (event) => {
      event.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (event) => {
      event.preventDefault();
      setIsDragging(false);
    };

    // Add event listeners to the document
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);

    // Cleanup
    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
    };
  }, [scene, camera, controls, onModelLoaded]);

  return isDragging ? (
    <div className="drag-over-message show-drag-over-message">
      Drop your model to load it
    </div>
  ) : null;
};

export default DragAndDrop;
