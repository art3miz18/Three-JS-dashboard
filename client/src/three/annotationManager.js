import React, {useContext, useEffect, useState} from 'react';
import { AnnotationContext } from '../js/AnnotationContext';
import { toScreenPosition } from '../js/projectionUtils'; // Adjust the import path as needed

export default function AnnotationManager({ camera, renderer}) {
  // State to hold the transformed 2D positions of the annotations
  const { annotations } = useContext(AnnotationContext);
  const [positions, setPositions] = useState([]);

  
  useEffect(() => {
      const updatePositions = () => {
          if(Array.isArray(annotations) && annotations.length > 0){
            const newPositions = {};
            annotations.forEach((annotation) => {
              if(annotation && annotation.position){
                console.log('annotationManager ',annotation.position);
                const screenPosition = toScreenPosition(annotation, camera, renderer);
                newPositions[annotation.id] = screenPosition;
              }
            });
            setPositions(newPositions);  
          }
        };
      updatePositions();
        
  }, []);

  return (
    <>
      {annotations.map((annotation) => (
        <div
          key={annotation.id}
          id={annotation.id}
          className="annotation"
          style={{
            position: 'absolute',
            left: positions[annotation.position]?.x ?? 0,
            top: positions[annotation.position]?.y ?? 0,
            // Additional styles for visibility, etc.
          }}
        >
          {annotation.content}
        </div>
      ))}
    </>


    // <>
    //   {Array.isArray(annotations) && annotations.map(annotation => {
    //     if (!annotation || !positions[annotation.id]) return null; // Check for valid data
    //     const { x, y } = positions[annotation.id];
    //     return (
    //       <div
    //         key={annotation.id}
    //         className="annotation"
    //         style={{
    //           position: 'absolute',
    //           left: x,
    //           top: y,
    //           // Additional styles here...
    //         }}
    //       >
    //         {annotation.content}
    //       </div>
    //     );
    //   })}
    // </>
  );
}
