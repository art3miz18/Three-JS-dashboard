import React, { useState, useEffect } from 'react';
import '../../styles/annotationPanel.css';

const AnnotationForm = ({ annotationData, selectedPoint, onSave, onEdit, onDelete }) => {
  const [title, setTitle] = useState( selectedPoint ? selectedPoint.title : '');
  const [description, setDescription] = useState( selectedPoint ? selectedPoint.description : '');
  const annotationID = selectedPoint;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ annotationID, title, description });
  };

  //Set Annotation Data to form if data is found
  useEffect(() => {
    setTitle(annotationData? annotationData.title : '');
    setDescription(annotationData? annotationData.description :'');
  }, [annotationData]); // Reinitialize form fields when annotationData changes

  return (
    <div className="annotation-form">
      <form onSubmit={handleSubmit}>
        <div>
          Annotation ID: 
          <span>{annotationID}</span> 
        </div>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
          <button type="submit" class="inline-flex items-center rounded-md bg-indigo-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 my-4">
            Save
          </button>
          <button type="button" onClick={()=> onEdit({annotationID})} class="inline-flex items-center rounded-md bg-orange-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 my-4">
            Edit
          </button>
          <button type="button" onClick={()=> onDelete({annotationID})} class="inline-flex items-center rounded-md bg-red-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 my-4">
            Delete
          </button>
      </form>
    </div>
  );
};

export default AnnotationForm;
