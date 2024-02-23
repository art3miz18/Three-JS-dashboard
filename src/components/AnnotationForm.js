import React, { useState } from 'react';
import '../styles/annotationPanel.css';

const AnnotationForm = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, description });
  };

  const saveAnnotation = (annotation) => {
    const annotations = getAnnotations(); // Retrieve existing annotations
    const index = annotations.findIndex(a => a.id === annotation.id);
    if (index > -1) {
      annotations[index] = annotation; // Update existing annotation
    } else {
      annotations.push(annotation); // Add new annotation
    }
    localStorage.setItem('annotations', JSON.stringify(annotations));
  };
  
  const getAnnotations = () => {
    const annotations = localStorage.getItem('annotations');
    return annotations ? JSON.parse(annotations) : [];
  };
  

  return (
    <div className="annotation-form">
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default AnnotationForm;
