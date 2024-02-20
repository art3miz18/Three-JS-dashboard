import React, { useState, useEffect } from 'react';
import { loadModelFromFile } from './loadModel';
import { setupInteractionHandler } from './interactionHandler';

const DragAndDrop = ({ onModelLoaded, scene, camera, controls, renderer }) => {
  const [isDragging, setIsDragging] = useState(false);  
  const [fileLoaded, setFileLoaded] = useState(false);

  useEffect(() => {
    const handleDrop = (event) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files[0];
      if (file) {
        loadModelFromFile(file, camera, scene, controls,()=>{
          // console.log('Model has been loaded!');
          setFileLoaded(true);
        });
        if (onModelLoaded) onModelLoaded();
      }
    }; 

    const handleDragOver = (event) => {
      event.preventDefault();
      setIsDragging(true);
    };

    // const handleDragLeave = (event) => {
    //   event.preventDefault();
    //   setIsDragging(false);
    //   setFileLoaded(true); 
    // };
    
    const handleDragEnd = (event) => {
      event.preventDefault();
      setIsDragging(false); // Assuming you have an `isDragging` state
      setFileLoaded(true); 
    };

    const cleanupInteraction = setupInteractionHandler(scene, camera, renderer);
    // Add event listeners to the document
    document.addEventListener('dragover', handleDragOver);
    // document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);
    document.addEventListener('dragend', handleDragEnd);

    // Cleanup
    return () => {
      document.removeEventListener('dragover', handleDragOver);
      // document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);      
      document.removeEventListener('dragend', handleDragEnd);
      cleanupInteraction();
    };
  }, [scene, camera, controls, onModelLoaded]);

  return (
    <div
      className={`drop-zone ${isDragging ? 'drag-over' : ''}`}
      style={{
        display: fileLoaded ? 'none' : 'flex', // Hide after file is loaded
        // Additional styles here
      }}>
        <lottie-player
        src="https://lottie.host/179750b7-1f47-40ce-9274-0eff47e3885c/rlZg6Efq3f.json"
        background="transparent"
        speed="1"
        style={{ width: '300px', height: '300px' }}
        loop
        autoplay
      ></lottie-player>
      <p>Drag and Drop GLB Files Here</p>
    </div>
  );
};

export default DragAndDrop;
