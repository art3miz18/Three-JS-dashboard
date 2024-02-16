import * as THREE from 'three';
import {scene, camera} from './setupScene';


export function setupInteractionHandler(scene, camera, renderer) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    
    function onMouseClick(event) {
        // Convert mouse position to normalized device coordinates (-1 to +1) for both axes
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            // Assuming the first intersected object is the target
            const intersect = intersects[0];

            // Create a sphere and position it at the intersection point
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.copy(intersect.point);
            scene.add(sphere);
        }
    }

    // Add event listener for mouse click
    renderer.domElement.addEventListener('click', onMouseClick, false);

    // Return a cleanup function to remove the event listener when no longer needed
    return () => {
        renderer.domElement.removeEventListener('click', onMouseClick, false);
    };
}
