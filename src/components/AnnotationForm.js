import React, { useState } from 'react';
import '../styles/annotationPanel.css';

const AnnotationForm = ({ selectedPoint, onSave, onCancel }) => {
  const [title, setTitle] = useState( selectedPoint ? selectedPoint.title : '');
  const [description, setDescription] = useState( selectedPoint ? selectedPoint.description : '');
  const annotationID = selectedPoint;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ annotationID, title, description });
  };

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
