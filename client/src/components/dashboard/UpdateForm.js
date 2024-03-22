
import React from 'react';

const UpdateForm = ({ product, onSave, onNameChange, onDescriptionChange }) => {
  if (!product) {
    return <div>Loading...</div>; // Or some loading component
  }

  return (
    <div>
      <h1>Edit Product</h1>
      <input
        type="text"
        value={product.name}
        onChange={onNameChange}
      />
      <textarea
        value={product.description}
        onChange={onDescriptionChange}
      />
      <button onClick={onSave}>Save Changes</button>
    </div>
  );
};

export default UpdateForm;
