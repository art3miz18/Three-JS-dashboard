// annotations.js
import productServices from "../services/productServices";

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
  
  export const getAnnotationById = async(productId, annotationId) => {
    // const annotations = getAnnotations();
    // return annotations.find(a => a.annotationID.annotationID === id);
    const annotationData = await productServices.getAnnotationById(productId, annotationId);
    return annotationData;
  };
  
  export const onSaveAnnotation = async (annotationId, productId) => {
    const annotationData = await productServices.getAnnotationById(productId, annotationId.annotationID);
    if(annotationData){
      console.log('Data exists on id', annotationId.annotationID);
      try{
        await productServices.updateAnnotation(productId, annotationId.annotationID, annotationId);
        alert('annotation details updated');
      } catch(error){
        console.error('failed while updating annotation details!', error);
      }
    }
    else{
      console.log('New Data Found');
      try {
       await productServices.saveAnnotation(productId, annotationId);
       console.log('Annotation saved successfully', );
       // Optionally, refresh annotations here if you have a UI component displaying them
     } catch (error) {
       console.error('Error saving annotation:', error);
     }
    }
    
  };
  
  export const getAnnotationData = async (productID, interactionHandler)=> {
    try{
      const annotations = await productServices.fetchAnnotations(productID);
      // createAnnotations(annotations);
      interactionHandler.addAnnotations(annotations);
      if(!annotations){
        console.log('annotation are null on this product');
      }
    }
    catch(error){
      console.error(error.message);
    }
  };

  export const updateAnnotationData = async (productID, annotationData, annotationID)=> {
    try{
      await productServices.updateAnnotation(productID, annotationData, annotationID);
      alert('annotation details updated');
    } catch(error){
      console.error('failed while updating annotation details!', error);
    }
  }