import React, { useState } from 'react';
import '../styles/annotationPanel.css'; // Make sure to create and import your CSS file


const AnnotationPanel = ({ onModelLoaded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Implement model loading logic or use passed `onModelLoaded` callback
      console.log("Model file selected:", file.name);
      onModelLoaded(file);
    }
  };

  return (
    <div className="annotation-panel">
      <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
      {/* uncomment to add files through files browser */}
      {/* <button onClick={() => document.getElementById('fileInput').click()}>Add 3D Model</button> */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      {/* Add more UI elements as needed */}
    </div>
  );
};

export default AnnotationPanel;
