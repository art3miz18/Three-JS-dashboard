import React, {useContext, useEffect, useState} from 'react';
import { AnnotationContext } from '../js/AnnotationContext';
import { toScreenPosition } from '../js/projectionUtils'; // Adjust the import path as needed

export default function AnnotationManager({ camera, renderer, annotationPositions}) {
  // State to hold the transformed 2D positions of the annotations
  const { annotations } = useContext(AnnotationContext);
  const [positions, setPositions] = useState([]);

  
  const updatePositions = () => {      
        const newPositions = {};
        annotations.forEach((annotation) => {
          if(annotation && annotation.position){
            // console.log('annotationManager ',annotation);
            const screenPosition = toScreenPosition(annotation.obj, camera, renderer);
            newPositions[annotation.id] = screenPosition;
          }
        });
        setPositions(newPositions);
    };

  useEffect(() => {
      updatePositions();
  }, [annotationPositions]);

  return (
    <>
    {annotations.map((annotation) => {
      const screenPosition = positions[annotation.id];
      if (!annotation || !screenPosition) return null; 

      
      const annotationStyle = {
        position: 'absolute',
        left: `${positions[annotation.id]?.x}px` || '0px',
        top: `${positions[annotation.id]?.y}px` || '0px',
      };

      return (
        <div  style={annotationStyle}>
          <h3>{annotation.details}</h3>
        </div>
      );
    })}
  </>
  );
}
