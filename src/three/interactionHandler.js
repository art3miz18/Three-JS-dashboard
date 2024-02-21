import * as THREE from 'three';
import { createBoundingBox } from './cameraUtil';
import { setupPointInteraction } from './pointInteraction';


export function setupInteractionHandler(scene, camera, renderer, model) {

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const { size } = createBoundingBox(model, scene); // get size from bounding box
    const scale = Math.max(size.x, size.y, size.z) * 0.01; // scale factor based on model size

    let isDragging = false;
    let currentlyHoveredPoint = null;

    const onMouseDown = (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        isDragging = false;
    };

    const onMouseMove = (event) => {
        if(Math.abs(mouse.x - event.clientX) > 10 || Math.abs(mouse.y -event.clientY) > 10){
            isDragging = true;
        }
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0 && intersects[0].object.userData.IsAnnotationPoint )
        { 
            if(currentlyHoveredPoint && currentlyHoveredPoint !== intersects[0].object ){    //                               
                console.log('unhovered last obj');
                unhoverOverPoints(currentlyHoveredPoint);
                // currentlyHoveredPoint = null;                
            }
            currentlyHoveredPoint = intersects[0].object;            
            hoverOverPoints(currentlyHoveredPoint);
            // console.log('hovering over the object', currentlyHoveredPoint);
        }
        else{
            // fix issues with all points being affected with change material color 
            if(currentlyHoveredPoint ){ //&& currentlyHoveredPoint !== intersects[0].object                
                unhoverOverPoints(currentlyHoveredPoint);
                currentlyHoveredPoint = null;
            }
        }
    };

    const onMouseUp = (event) => {
        if(!isDragging) {
            checkIntersections();
        }
    };

    function checkIntersections(){
        raycaster.layers.set(0);
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        if (intersects.length > 0) {
            if(intersects[0].object.userData.IsAnnotationPoint){
                console.log('Clicked over a interaction point', intersects[0].object.material.color);
            }
            else{
                const intersect = intersects[0];
                const sphereGeometry = new THREE.SphereGeometry(scale, 32, 32);
                const sphere = new THREE.Mesh(sphereGeometry, material);
                sphere.position.copy(intersect.point);
                sphere.userData.IsAnnotationPoint = true;
                scene.add(sphere);
            }
        }
    }
    
    function hoverOverPoints(hoverPoint){
        // console.log('curent objects on hover',currentlyHoveredPoint);
        if (!hoverPoint.userData.originalColor) {
            hoverPoint.userData.originalColor = hoverPoint.material.color.getHexString();
        }
        if(hoverPoint === currentlyHoveredPoint){

            // Change color to white on hover
            hoverPoint.material.color.set('#FFFFFF');
        }
    }   
    
    function unhoverOverPoints(hoverPoint){
        console.log('Unhover object ', hoverPoint);
        if (hoverPoint.userData.originalColor) {
            console.log('changing color ', hoverPoint);
            hoverPoint.material.color.set(`#${hoverPoint.userData.originalColor}`);
        }
        currentlyHoveredPoint = null;
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
  