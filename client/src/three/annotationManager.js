import React, {useContext, useEffect, useState} from 'react';
import { AnnotationContext } from '../js/AnnotationContext';
import { toScreenPosition, getDepth } from '../js/projectionUtils'; // Adjust the import path as needed
import { annotationToLookAt } from '../three/cameraUtil';


export default function AnnotationManager({ camera, renderer, annotationPositions, containerRef, handlePointClick}) {
  
  const { annotations } = useContext(AnnotationContext);
  const [positions, setPositions] = useState([]);

  
  // const updatePositions = () => {      
  //   const newPositions = {};
  //   annotations.forEach((annotation) => {
  //     if(annotation && annotation.position){
  //       const screenPosition = toScreenPosition(annotation.obj, camera, renderer, containerRef);            
        
  //       newPositions[annotation.id] = screenPosition;
  //     }
  //   });
  //   setPositions(newPositions);
  // };
      
  const updatePositions = () => {
    // First, map over annotations to create an array of objects with screenPosition and depth
    const newPositions = annotations.map((annotation) => {
      if (annotation && annotation.position) {
        const screenPosition = toScreenPosition(annotation.obj, camera, renderer, containerRef);
        const depth = getDepth(annotation.obj, camera);
        // Return the new object with all annotation properties plus screenPosition and depth
        return { ...annotation, screenPosition, depth };
      }
      return null;
    }).filter(annotation => annotation !== null); // Filter out any null entries
    
    // Then, sort this array by depth
    const sortedPositions = newPositions.sort((a, b) => b.depth - a.depth); // Closest first
    
    // Finally, update the state with the sorted array
    setPositions(sortedPositions);
  };
  
  useEffect(() => {
      updatePositions();
  }, [annotationPositions, containerRef, renderer, camera]);

  return (
    <>
    {positions.map((position) => {
      if (!position) return null;

      const annotationStyle = {
        position: 'absolute',
        left: `${position.screenPosition.x}px` || '0px',
        top: `${position.screenPosition.y}px` || '0px',
        zIndex: Math.round((1 - position.depth) * 1000), // Adjust the z-index based on depth
      };

      const handleAnnotationClick = () => {
        console.log(position.obj.uuid);
        if(position.obj.userData.HasData){
          handlePointClick(position.id, position.position, false);   
        }     
        annotationToLookAt(position.position, camera);        
      };
 
      return (
        <div onClick={ handleAnnotationClick}
          class="flex flex-row rounded-full px-4 bg-gray-800 hover:bg-white  border-0 py-1.5 shadow-sm  cursor-pointer " 
          style={annotationStyle}>
          <p class="bg-blue-600 rounded-full h-6 w-6 justify-items-start "></p>
          <h3 class="text-blue-300 font-sans font-semibold justify-items-end mx-2" >{position.details}</h3>
        </div>
      );
    })}
  </>
  );
}


// Prev
// return (
//   <>
//   {annotations.map((annotation) => {
//     const screenPosition = positions[annotation.id];
//     if (!annotation || !screenPosition) return null; 
    
    
//     const annotationStyle = {
//       position: 'absolute',
//       left: `${positions[annotation.id]?.x}px` || '0px',
//       top: `${positions[annotation.id]?.y}px` || '0px',
//       zIndex: Math.round((1 - annotation.depth) * 1000), // Adjust the z-index based on depth
//     };

//     const handleAnnotationClick = (annotation) => {
//       console.log(annotation.obj.uuid);
//       if(annotation.obj.userData.HasData){
//         handlePointClick(annotation.id, annotation.position, false);   
//       }     
//       annotationToLookAt(annotation.position, camera);        
//     };

//     return (
//       <div onClick={() => handleAnnotationClick(annotation)}
//         class="flex flex-row rounded-full px-4 bg-gray-800 hover:bg-white  border-0 py-1.5 shadow-sm  cursor-pointer " 
//         style={annotationStyle}>
//         <p class="bg-blue-600 rounded-full h-6 w-6 justify-items-start "></p>
//         <h3 class="text-blue-300 font-sans font-semibold justify-items-end mx-2" >{annotation.details}</h3>
//       </div>
//     );
//   })}
// </>
// );