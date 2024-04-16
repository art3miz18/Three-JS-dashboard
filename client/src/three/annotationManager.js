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
        <div class="flex flex-row rounded-full px-4 hover:bg-white  border-0 py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" style={annotationStyle}>
          <p class="bg-red-600 rounded-full h-6 w-6 justify-items-start "></p>
          <h3 class="text-red-600 font-sans font-semibold justify-items-end mx-2" >{annotation.details}</h3>
        </div>
      );
    })}
  </>
  );
}
