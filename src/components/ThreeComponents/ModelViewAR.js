import React, {useEffect} from "react";
import "@leoncvlt/ar-button"
import "@leoncvlt/ar-button/styles.css"

const ModelViewerComponent = ({source}) => {

  useEffect(() =>{
    const arButton = document.querySelector('ar-button');
    if (arButton) {
        arButton.addEventListener('click', () => {
          console.log('AR button clicked!');
      });
    }
    
    return () => {
      if (arButton) {
        arButton.removeEventListener('click', () => {
          console.log('AR button clicked!');
        });
      }
    };
  }, []);
  return (
    
      <model-viewer
        src={source}
        ar
        ar-modes="webxr scene-viewer quick-look"
        auto-rotate
        camera-controls
        style={{ width: '800px', height: '800px' }}
      >        
      </model-viewer>
      
      // <ar-button
      //   src={source}
      //   ios-src={source}
      //   link="https://threejs-dashboard.netlify.app/"
      //   title="AR demo">
      //   See in Augmented Reality 
      // </ar-button>
    // <ar-button
    //   src={source}
    //   ios-src={source}
    //   link="https://www.nasa.gov/"
    //   title={title}
    // >
    //     See in Augmented Reality 
    // </ar-button>

    
  );
};

export default ModelViewerComponent;
