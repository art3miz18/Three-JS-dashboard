import * as THREE from 'three';
import { createBoundingBox } from './cameraUtil';
// import { spritePlane, updateSpriteCanvas, removeSpriteCanvas } from './spriteCanvas';

import { getAnnotationById } from '../js/annotation.js';
// import{ displayAnnotationDetails, removeCSS3DAnnotation} from './CSS3DRend.js';

export function setupInteractionHandler(scene, camera, renderer, model, handlePointClick) {

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5});
    const { size } = createBoundingBox(model, scene); // get size from bounding box
    const scale = Math.max(size.x, size.y, size.z) * 0.01; // scale factor based on model size

    let isDragging = false;
    let highlightMesh = null;
    let HIGHLIGHT_LAYER = 1;

    const onMouseDown = (event) => {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        isDragging = false;
    };

    const onMouseMove = (event) => {
        event.preventDefault();
        // console.log('mouse moved');
        if(Math.abs(mouse.x - event.clientX) > 10 || Math.abs(mouse.y -event.clientY) > 10){
            isDragging = true;
        }

        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.layers.enable(0); // interact with obj with layer 0
        raycaster.layers.disable(HIGHLIGHT_LAYER); //ignore interaction with obj with layer 1
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);
        let newHoveredPoint = intersects.length > 0 && intersects[0].object.userData.IsAnnotationPoint ? intersects[0].object : null;
        if (intersects.length > 0 && intersects[0].object.userData.IsAnnotationPoint )
        {             
            if(!highlightMesh){
                const geometry = new THREE.SphereGeometry(scale * 1.2 , 32 ,32);
                const material = new THREE.MeshBasicMaterial ({color: 0x0000ff, transparent: true, opacity: 0.8});
                highlightMesh = new THREE.Mesh(geometry, material);
                highlightMesh.userData.IsHighlightMesh = true;
                scene.add(highlightMesh);
            }            
            highlightMesh.position.copy(newHoveredPoint.position);
            hoverOverPoints(newHoveredPoint);
        }
        else{
            if(highlightMesh){
                unhoverOverPoints();
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
        // intersects = intersects.filter(intersect => !intersect.object.userData.isHighlightMesh);
        if (intersects.length > 0 ) {
            // console.log('intersected object ', intersects[0].object.uuid);
            if (intersects[0].object.userData.IsProduct){
                const intersect = intersects[0];
                const sphereGeometry = new THREE.SphereGeometry(scale, 32, 32);
                const sphere = new THREE.Mesh(sphereGeometry, material);
                sphere.position.copy(intersect.point);
                sphere.userData.IsAnnotationPoint = true;
                scene.add(sphere);
            }
            else if(intersects[0].object.userData.IsAnnotationPoint){
                // console.log('Clicked over a interaction point', intersects[0].object.material.color);
                handlePointClick(intersects[0].object.uuid, intersects[0].object.position);
            }
        }
    }
    
    function hoverOverPoints(point){ 
        const annotationData = getAnnotationById(point.uuid);
        let details = null;
        if(annotationData){
            // details= { title:  annotationData.id.title, description: annotationData.id.description};
            // updateSpriteCanvas(scene, details, point.position);            
            // displayAnnotationDetails(details, point.position, scene, camera, renderer);

        }          
    }   
    
    function unhoverOverPoints(){

        // removeSpriteCanvas(scene);
        // removeCSS3DAnnotation(scene);

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
  