import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';


const css3DRenderer = new CSS3DRenderer();
css3DRenderer.setSize(window.innerWidth, window.innerHeight);
css3DRenderer.domElement.style.position = 'absolute';
css3DRenderer.domElement.style.zIndex = "1";
css3DRenderer.domElement.style.top = '0';
document.body.appendChild(css3DRenderer.domElement);
let object = null;

// Function to create and add a CSS3DObject for annotation details


export const displayAnnotationDetails = (annotationDetails, position, scene, camera, renderer) => {
    const element = document.createElement('div');
    element.style.width = '200px';
    element.style.height = '100px';
    element.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    element.innerHTML = `<h2 style="color:white; margin:10px;">${annotationDetails.title}</h2><p style="color:white; margin:10px;">${annotationDetails.description}</p>`;
    
    object = new CSS3DObject(element);
    object.position.copy(position);
    scene.add(object);

    // Function to render/update both WebGL and CSS3D scenes
    const render = () => {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        css3DRenderer.render(scene, camera);
    };
    render();
};

// Function to remove the CSS3DAnnotation
export const removeCSS3DAnnotation = (scene) => {
    if (object) {
        scene.remove(object);
        object = null;
    }
    // if(!object){
    //     console.log('No Canvas object exists in scene');
    // }
};


