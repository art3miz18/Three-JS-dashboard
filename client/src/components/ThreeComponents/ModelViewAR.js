import "@leoncvlt/ar-button"
import "@leoncvlt/ar-button/styles.css"
const testPath = "https://meta-3d-new.s3.ap-south-1.amazonaws.com/3dModel.glb";

const ModelViewerComponent = ({source}) => {
  return (
    <model-viewer
      src={testPath}
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
    //   link="https://www.nasa.gov/"
    //   title="3D product Demo">
    //     See in Augmented Reality 
    // </ar-button>

  );
};

export default ModelViewerComponent;
