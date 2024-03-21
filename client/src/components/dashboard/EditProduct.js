import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import AnnotationForm  from '../ThreeComponents/AnnotationForm';
import productService from '../../services/productServices';
import { setupScene } from '../../three/setupScene'; // Assuming you have these utility functions for Three.js
import { loadModelFromFile } from '../../three/loadModel';// Assuming you have these utility functions for Three.js
import DragAndDrop from '../../three/dragAndDrop';
import { getAnnotationById, onSaveAnnotation} from '../../js/annotation';

const EditProduct = () => {
  const { id } = useParams(); // This will get the product id from the URL
  const [product, setProduct] = useState(null);
  const [threeObjects, setThreeObjects] = useState({ scene: null, camera: null, renderer: null, controls: null });
  const [showForm, setShowForm] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [AnnotationPosition, setPosition] = useState(null);
  const [annotationData, setAnnotationData] = useState([null]);
  const mountRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await productService.getProductById(id);
        setProduct(fetchedProduct);
        console.log('fetched details', fetchedProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
        // Handle error, possibly redirect back or show a message
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const { scene, camera, renderer, controls } = setupScene();
    setThreeObjects({ scene, camera, renderer, controls });
    // console.log('renderer',renderer);
    if(mountRef.current){
        mountRef.current.appendChild(renderer.domElement);
    }

    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate(); 

    const onWindowResize = () => {
      // Handle resizing
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      renderer.setSize(width, height);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      controls.update();
    };

    window.addEventListener('resize', onWindowResize);

    return () => {
        if(mountRef.current){
            window.removeEventListener('resize', onWindowResize);
        }
      // Perform additional cleanup if necessary
    };
  }, []);

  const handleModelLoaded = (file) => {
    loadModelFromFile(file, threeObjects.camera, threeObjects.scene, threeObjects.controls);
  };

  const handlePointClick = (point, position) => {
    setSelectedPoint(point);
    setPosition(position);
    setShowForm(true);
    // Assuming mesh has an annotationID property
    const annotationID = point;
    const annotationData = getAnnotationById(annotationID);
    setAnnotationData(annotationData);
  };
  const handleSave = async () => {
    // Logic to save the edited product details
  };

  const handleSaveAnnotation = ( id ) => {    
    // console.log('id: ',id);
    const annotationWithPosition = {
        ...id, // Spread the id object to include annotationID, title, and description
        position: AnnotationPosition // Add the position from state
    };
    onSaveAnnotation(annotationWithPosition);    
    setShowForm(false);
    setPosition(null);
   
  };

  if (!product) {
    return <div>Loading...</div>; // Or some loading component
  }

  return (
    <div>
      <h1>Edit Product</h1>
      {/* Render your form fields here */}
      <input
        type="text"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
      />
      <textarea
        value={product.description}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
      />
      {/* ...other fields... */}

      <div ref={mountRef} className="three-container">
        {/* This div will contain the Three.js rendered model */}
        <DragAndDrop {...threeObjects} onModelLoaded={handleModelLoaded} handlePointClick={handlePointClick}/>
        {showForm && (
          <AnnotationForm
            annotationData={annotationData}
            selectedPoint={selectedPoint}
            onCancel={() => setShowForm(false)}
            onSave={handleSaveAnnotation}
          />
        )}
      </div>

      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default EditProduct;
