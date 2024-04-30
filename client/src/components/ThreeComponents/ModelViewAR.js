

const ModelViewerComponent = ({source}) => {
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
  );
};

export default ModelViewerComponent;
