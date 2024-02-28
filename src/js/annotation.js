// annotations.js
export const getAnnotations = () => {
    const annotations = localStorage.getItem('annotations');
    return annotations ? JSON.parse(annotations) : [];
  };
  
  export const handleSave = (annotation) => {
    const annotations = getAnnotations();
    const index = annotations.findIndex(a => a.id === annotation.id);
    if (index > -1) {
      annotations[index] = annotation;
    } else {
      annotations.push(annotation);
    }
    localStorage.setItem('annotations', JSON.stringify(annotations));
  };
  
  export const getAnnotationById = (id) => {
    const annotations = getAnnotations();
    return annotations.find(a => a.id.annotationID === id);
  };
  
  export const onSaveAnnotation = (annotationID, title, description, pointDetails) => {
    const annotation = {
      id: annotationID, // Use annotationID as the unique identifier
      title,
      description,
      pointDetails
    };
    handleSave(annotation);
  };
  