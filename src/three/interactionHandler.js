import * as THREE from 'three';


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
    };

    function checkIntersections(){
        
        raycaster.layers.set(0);
        raycaster.setFromCamera(mouse, camera);
        
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        if (intersects.length > 0) {
            const intersect = intersects[0];
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.copy(intersect.point);
            scene.add(sphere);
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
