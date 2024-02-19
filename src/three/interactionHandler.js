import * as THREE from 'three';
// import {scene, camera} from './setupScene';


export function setupInteractionHandler(scene, camera, renderer) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    let isDragging = false;
    
    const onMouseDown = (event) =>{
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        isDragging = false;
    };

    const onMouseMove = (event) => {
        if(Math.abs(mouse.x - event.clientX) > 10 || Math.abs(mouse.y -event.clientY) > 10){
            isDragging = true;
        }
    };

    const onMouseUp = (event) => {
        if(!isDragging) {
            checkIntersections();
        }
        // mouse = { x: null, y: null};
    };

    function checkIntersections(){
        
        raycaster.layers.set(0);
        // Update the picking ray with the camera and mouse position
        // console.log("intersected at point ", mouse);
        raycaster.setFromCamera(mouse, camera);
        
        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        // console.log("intersected at point ", intersects.point);
        if (intersects.length > 0) {
            // Assuming the first intersected object is the target
            const intersect = intersects[0];
            // Create a sphere and position it at the intersection point
            const sphere = new THREE.Mesh(geometry, material);
            // Position it at the intersection point
            sphere.position.copy(intersect.point);
            scene.add(sphere);
        }
    }

    // Add event listener for mouse click
    // renderer.domElement.addEventListener('click', onMouseClick, false);
    renderer.domElement.addEventListener('mousedown', onMouseDown, false);
    renderer.domElement.addEventListener('mousemove', onMouseMove, false);
    renderer.domElement.addEventListener('mouseup', onMouseUp, false);

    // Return a cleanup function to remove the event listener when no longer needed
    return () => {
        // renderer.domElement.removeEventListener('click', onMouseClick, false);
        renderer.domElement.removeEventListener('mousedown', onMouseDown, false);
        renderer.domElement.removeEventListener('mousemove', onMouseMove, false); 
        renderer.domElement.removeEventListener('mouseup', onMouseUp, false);
    };
}
