// annotations.js
export const getAnnotations = () => {
    const annotations = localStorage.getItem('annotations');
    return annotations ? JSON.parse(annotations) : [];
  };
  
  export const handleSave = (annotation) => {
    const annotations = getAnnotations();
    const index = annotations.findIndex(a => a.annotationID.annotationID === annotation.annotationID.annotationID);
    if (index > -1) {
      annotations[index] = annotation;
    } else {
      annotations.push(annotation);
    }
    localStorage.setItem('annotations', JSON.stringify(annotations));
  };
  
  export const getAnnotationById = (id) => {
    const annotations = getAnnotations();
    return annotations.find(a => a.annotationID.annotationID === id);
  };
  
  export const onSaveAnnotation = (annotationID) => {
    const annotation = {
      annotationID // Use annotationID as the unique identifier
      // position: {x: position.x, y: position.y, z: position.z}
    };
    console.log('annotations ',annotation);
    handleSave(annotation);
  };
  