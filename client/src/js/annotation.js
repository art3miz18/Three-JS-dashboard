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
    console.log('annotation Data', annotationData);
    return annotationData;
  };
  
  export const onSaveAnnotation = async (annotationID, productId) => {
    const annotation = {
      annotationID // Use annotationID as the unique identifier
      // position: {x: position.x, y: position.y, z: position.z}
    };

     try {
      await productServices.saveAnnotation(productId, annotationID);
      console.log('Annotation saved successfully', );
      // Optionally, refresh annotations here if you have a UI component displaying them
    } catch (error) {
      console.error('Error saving annotation:', error);
    } 
    // console.log('annotations ',annotation);
    handleSave(annotation);
  };
  
  export const getAnnotationData = async (productID, interactionHandler)=> {
    try{
      const annotations = await productServices.fetchAnnotations(productID);
      console.log("found annotation data", annotations);
      // createAnnotations(annotations);
      interactionHandler.addAnnotations(annotations);
      if(!annotations){
        console.log('annotation are null on this product');
      }
    }
    catch(error){
      console.error(error.message);
    }
  }