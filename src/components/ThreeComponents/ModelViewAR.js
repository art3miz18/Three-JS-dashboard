// import React,{useEffect, useRef} from "react";
// import "@leoncvlt/ar-button"
// import "@leoncvlt/ar-button/styles.css"

const ModelViewerComponent = ({source}) => {
  // const arButtonRef = useRef(null);

  // useEffect(() => {
  //   const arButton = document.querySelector('ar-button');

  //   const handleInitialized = (event) => {
  //     if (event.detail === 'unsupported') {
  //       console.log('AR is not supported on this device');
  //     } else {
  //       console.log('AR initialized with backend:', event.detail);
  //     }
  //   };

  //   if (arButton) {
  //     arButton.addEventListener('initialized', handleInitialized);
  //   }

  //   // Cleanup the event listener when the component unmounts
  //   return () => {
  //     if (arButton) {
  //       arButton.removeEventListener('initialized', handleInitialized);
  //     }
  //   };
  // }, []);  

  return (
    
      <model-viewer
        src={source}
        ar
        ar-modes="webxr scene-viewer quick-look"
        auto-rotate
        camera-controls
        style={{ width: '100%', height: '100%' }}
      >        
      </model-viewer>
      
      // <ar-button
      //   ref = {arButtonRef}
      //   src={source}
      //   ios-src={source}
      //   link="https://threejs-dashboard.netlify.app/"
      //   title="AR demo">
      //   See in Augmented Reality 
      // </ar-button>       
  );
};

export default ModelViewerComponent;
