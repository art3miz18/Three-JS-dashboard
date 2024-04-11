import React, {useEffect, useState} from 'react';
import { toScreenPosition } from '../js/projectionUtils'; // Adjust the import path as needed

export default function AnnotationManager({ interactionHandlerRef, camera, renderer}) {
  // State to hold the transformed 2D positions of the annotations
  const [positions, setPositions] = useState([]);
  const [annotations, setAnnotations] = useState([]);

// Function to update the positions; call this in an effect or directly in the animation loop
  const updatePositions = () => {
    console.log(annotations);
    const newPositions = {};
    annotations.forEach((annotation) => {
      const screenPosition = toScreenPosition(annotation.position, camera, renderer);
      newPositions[annotation.id] = screenPosition;
    });
    setPositions(newPositions);

  };

  // Effect to set up and tear down anything necessary for this component
  useEffect(() => {
      // const interactionHandler = interactionHandlerRef.current;
      if(interactionHandlerRef){
          console.log('interaction Handler ref',  interactionHandlerRef);          
          
        const handleAnnotationsUpdate = (newAnnotations) => {
            
            console.log('new annotations', newAnnotations);
            if (newAnnotations.action === 'add') {
                setAnnotations(prevAnnotations => [...prevAnnotations, newAnnotations.annotation]);
                console.log('setting up annotations');
            }
            else{
                console.log('handleAnnotation not adding ', newAnnotations);
            }
        };
            
        interactionHandlerRef.onAnnotationsChange(handleAnnotationsUpdate);
        updatePositions();
        
    }
  }, [interactionHandlerRef]);

  return (
    <>
      {annotations.map((annotation) => (
        <div
          key={annotation.id}
          id={annotation.id}
          className="annotation"
          style={{
            position: 'absolute',
            left: positions[annotation.id]?.x ?? 0,
            top: positions[annotation.id]?.y ?? 0,
            // Additional styles for visibility, etc.
          }}
        >
          {annotation.content}
        </div>
      ))}
    </>
  );
}
