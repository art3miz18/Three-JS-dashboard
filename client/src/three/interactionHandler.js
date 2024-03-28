import * as THREE from 'three';
import { createBoundingBox } from './cameraUtil';
// import { spritePlane, updateSpriteCanvas, removeSpriteCanvas } from './spriteCanvas';

import { getAnnotationById } from '../js/annotation.js';

export function setupInteractionHandler(scene, camera, renderer, model, handlePointClick) {
    const raycaster = new THREE.Raycaster();
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5});
    const { size } = createBoundingBox(model, scene); // get size from bounding box
    const scale = Math.max(size.x, size.y, size.z) * 0.01; // scale factor based on model size
    const mouse = new THREE.Vector2();
    const rect = renderer.domElement.getBoundingClientRect(); // Get the bounding rectangle of the canvas
    
    let isDragging = false;
    let highlightMesh = null;
    let HIGHLIGHT_LAYER = 1;
    
    const onMouseDown = (event) => {
        event.preventDefault();
        const rect = renderer.domElement.getBoundingClientRect(); // Get the bounding rectangle of the canvas
        const x = event.clientX - rect.left; // Mouse x relative to the canvas
        const y = event.clientY - rect.top; // Mouse y relative to the canvas
        mouse.x = (x / rect.width ) * 2 - 1;
        mouse.y = -(y/ rect.height ) * 2 + 1;
        isDragging = false;
    };
    
    const onMouseMove = (event) => {
        event.preventDefault();
        const x = event.clientX - rect.left; // Mouse x relative to the canvas
        const y = event.clientY - rect.top; // Mouse y relative to the canvas
        // const mouse = new THREE.Vector2();
        
        mouse.x = (x / rect.width ) * 2 - 1;
        mouse.y = -(y/ rect.height ) * 2 + 1;
        
        if(Math.abs(mouse.x - event.clientX) > 10 || Math.abs(mouse.y -event.clientY) > 10){
            isDragging = true;
        }

        raycaster.layers.enable(0); // interact with obj with layer 0
        raycaster.layers.disable(HIGHLIGHT_LAYER); //ignore interaction with obj with layer 1
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);
        let newHoveredPoint = intersects.length > 0 && intersects[0].object.userData.IsAnnotationPoint ? intersects[0].object : null;
        if (intersects.length > 0 && intersects[0].object.userData.IsAnnotationPoint )
        {           
            // console.log('clicked on product');  
            if(!highlightMesh){
                const geometry = new THREE.SphereGeometry(scale * 1.2 , 32 ,32);
                const material = new THREE.MeshBasicMaterial ({color: 0x0000ff, transparent: true, opacity: 0.8});
                highlightMesh = new THREE.Mesh(geometry, material);
                highlightMesh.userData.IsHighlightMesh = true;
                scene.add(highlightMesh);
            }            
            highlightMesh.position.copy(newHoveredPoint.position);
            //hoverOverPoints(newHoveredPoint);
        }
        else{
            if(highlightMesh){
                //unhoverOverPoints();
                scene.remove(highlightMesh);
                highlightMesh = null;
            }
        }        
    };

    const onMouseUp = (event) => {
        event.preventDefault();
        if(!isDragging) {
            checkIntersections();
        }
    };

    function checkIntersections(){
        raycaster.layers.set(0);        
        raycaster.setFromCamera(mouse, camera);
        let intersects = raycaster.intersectObjects(scene.children, true);
        intersects = intersects.filter(intersect => !intersect.object.userData.IsHighlightMesh);
        if (intersects.length > 0 ) {
            if (intersects[0].object.userData.IsProduct){
                const intersect = intersects[0];
                const sphereGeometry = new THREE.SphereGeometry(scale, 32, 32);
                const sphere = new THREE.Mesh(sphereGeometry, material);
                sphere.position.copy(intersect.point);
                sphere.userData.IsAnnotationPoint = true;
                scene.add(sphere);
            }
            else if(intersects[0].object.userData.IsAnnotationPoint){
                handlePointClick(intersects[0].object.uuid, intersects[0].object.position);
            }
        }
    }
    
    function hoverOverPoints(point){ 
        const annotationData = getAnnotationById(point.uuid);
        let details = null;
                  
    }   
    
    function unhoverOverPoints(){

    }
    
    renderer.domElement.addEventListener('mousedown', onMouseDown, false);
    renderer.domElement.addEventListener('mousemove', onMouseMove, false);
    renderer.domElement.addEventListener('mouseup', onMouseUp, false);

    return () => {
        renderer.domElement.removeEventListener('mousedown', onMouseDown, false);
        renderer.domElement.removeEventListener('mousemove', onMouseMove, false); 
        renderer.domElement.removeEventListener('mouseup', onMouseUp, false);
    };
}
  