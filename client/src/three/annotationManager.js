import React, {useContext, useEffect, useState} from 'react';
import { AnnotationContext } from '../js/AnnotationContext';
import { toScreenPosition } from '../js/projectionUtils'; // Adjust the import path as needed
import { annotationToLookAt } from '../three/cameraUtil'


export default function AnnotationManager({ camera, renderer, annotationPositions, containerRef}) {
  // State to hold the transformed 2D positions of the annotations
  const { annotations } = useContext(AnnotationContext);
  const [positions, setPositions] = useState([]);

  
  const updatePositions = () => {      
        const newPositions = {};
        annotations.forEach((annotation) => {
          if(annotation && annotation.position){
            const screenPosition = toScreenPosition(annotation.obj, camera, renderer, containerRef);
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

      const handleAnnotationClick = (annotation) => {
        console.log(annotation);
        annotationToLookAt(annotation.position)
       
      };

      return (
        <div onClick={() => handleAnnotationClick(annotation)}
          class="flex flex-row rounded-full px-4 hover:bg-white  border-0 py-1.5 shadow-sm ring-1 ring-white cursor-pointer " 
          style={annotationStyle}>
          <p class="bg-red-600 rounded-full h-6 w-6 justify-items-start "></p>
          <h3 class="text-red-600 font-sans font-semibold justify-items-end mx-2" >{annotation.details}</h3>
        </div>
      );
    })}
  </>
  );
}
