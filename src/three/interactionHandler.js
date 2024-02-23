import * as THREE from 'three';
import { createBoundingBox } from './cameraUtil';


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
                // highlightMesh.layers.set(HIGHLIGHT_LAYER);
                scene.add(highlightMesh);
            }
            // console.log('added a point for highlights');            
            highlightMesh.position.copy(newHoveredPoint.position);
        }
        else{
            if(highlightMesh){
                scene.remove(highlightMesh);
                highlightMesh = null;
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
        
        if (intersects.length > 0 ) {
            console.log('intersected object ', intersects[0].object.userData);
            if (intersects[0].object.userData.IsProduct){
                const intersect = intersects[0];
                const sphereGeometry = new THREE.SphereGeometry(scale, 32, 32);
                const sphere = new THREE.Mesh(sphereGeometry, material);
                sphere.position.copy(intersect.point);
                sphere.userData.IsAnnotationPoint = true;
                scene.add(sphere);
            }
            else if(intersects[0].object.userData.IsAnnotationPoint){
                console.log('Clicked over a interaction point', intersects[0].object.material.color);
                handlePointClick(intersects[0].object.userData);
            }
        }
    }
    
    function hoverOverPoints(point){        
        // console.log('hover object ', point);
        if (!point.userData.originalColor) {
            point.userData.originalColor = point.material.color.getHexString();
        }
        // Change color to white on hover
        point.material.color.set('#FFFFFF');
    }   
    
    function unhoverOverPoints(point){
        console.log('Unhover object ', point);
        if (point.userData.originalColor) {
            // console.log('changing color ', point);
            point.material.color.set(`#${point.userData.originalColor}`);
            // currentlyHoveredPoint = null;
        }
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
  