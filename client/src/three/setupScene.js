import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


let controls;
const setupCanvas = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight; 
    
    // Define the width of the sidebar based on your layout, adjust this as needed
    const sidebarWidth = 250; // This value should match the actual width of your sidebar
    
    // Calculate the content area width
    const contentWidth = windowWidth - sidebarWidth;
    
    // Set the height of the canvas to be the full height of the window minus any header/footer
    const headerHeight = 0; // Replace with actual header height if present
    const footerHeight = 0; // Replace with actual footer height if present
    const contentHeight = windowHeight - headerHeight - footerHeight;
    return { contentWidth, contentHeight} ;
};

export const setupScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color().setHSL( 0.8, 0, 0.8 );
  // scene.fog = new THREE.Fog( scene.background, 1, 5000 );
  
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  // camera.position.z = 15;

  const renderer = new THREE.WebGLRenderer({ antialias: true });  
  // renderer.domElement.style.position = '';
  renderer.domElement.style.zIndex = "1";
  // renderer.setSize(window.innerWidth, window.innerHeight);  
  

// Newer Three.js versions use this setup for HDR environment maps
  controls = new OrbitControls( camera, renderer.domElement );
  // controls.minDistance = 1.5;
  // controls.maxDistance = 6;
  const lights = setupLights(scene);
  return { scene, camera, renderer, controls};
};


const setupLights = (scene) => {
  const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
  ambientLight.intensity = 25;
  scene.add(ambientLight);
 
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 1, 0);
  directionalLight.intensity = 10;
  scene.add(directionalLight);   
};

