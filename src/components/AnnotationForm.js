import React, { useState, useEffect } from 'react';
import '../styles/annotationPanel.css';

const AnnotationForm = ({ annotationData, selectedPoint, onSave, onCancel }) => {
  const [title, setTitle] = useState( selectedPoint ? selectedPoint.title : '');
  const [description, setDescription] = useState( selectedPoint ? selectedPoint.description : '');
  const annotationID = selectedPoint;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ annotationID, title, description });
  };

  //Set Annotation Data to form if data is found
  useEffect(() => {
    setTitle(annotationData? annotationData.annotationID.title : '');
    setDescription(annotationData? annotationData.annotationID.description :'');
  }, [annotationData]); // Reinitialize form fields when annotationData changes

  return (
    <div className="annotation-form">
      <form onSubmit={handleSubmit}>
        <div>
          Annotation ID: 
          <span>{annotationID}</span> {/* Display the annotationID */}
        </div>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button type="submit" >Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default AnnotationForm;
