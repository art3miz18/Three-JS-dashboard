import * as THREE from 'three';
import { createBoundingBox } from './cameraUtil';
import { getAnnotationById } from '../js/annotation.js';

class InteractionHandler {
    constructor(scene, camera, renderer, model, handlePointClick){
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.model = model;
        this.handlePointClick = handlePointClick;
        this.scale = this.calculateScale();
        this.initialAnnotations = [];
        this.scale = this.calculateScale();
        this.setupInteractionHandler = this.setupInteractionHandler.bind(this);
        this.checkIntersections = this.checkIntersections.bind(this);
        this.createAnnotation = this.createAnnotation.bind(this);
        this.setupInteractionHandler();
    }
    
    calculateScale(){
        const{ size } = createBoundingBox(this.model, this.scene);
        return Math.max(size.x, size.y, size.z) * 0.01;
    }   

    setupInteractionHandler() {
        const raycaster = new THREE.Raycaster();
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5});
        const mouse = new THREE.Vector2(); // Get the bounding rectangle of the canvas
        const rect = this.renderer.domElement.getBoundingClientRect();
        let isDragging = false;
        let highlightMesh = null;
        let HIGHLIGHT_LAYER = 1;
        
        const onMouseDown = (event) => {
            event.preventDefault();
            
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
            raycaster.setFromCamera(mouse, this.camera);
    
            const intersects = raycaster.intersectObjects(this.scene.children, true);
            let newHoveredPoint = intersects.length > 0 && intersects[0].object.userData.IsAnnotationPoint ? intersects[0].object : null;
            if (intersects.length > 0 && intersects[0].object.userData.IsAnnotationPoint )
            {           
                // console.log('clicked on product');  
                if(!highlightMesh){
                    const geometry = new THREE.SphereGeometry( this.scale * 1.2 , 32 ,32);
                    const material = new THREE.MeshBasicMaterial ({color: 0x0000ff, transparent: true, opacity: 0.8});
                    highlightMesh = new THREE.Mesh(geometry, material);
                    highlightMesh.userData.IsHighlightMesh = true;
                    this.scene.add(highlightMesh);
                }            
                highlightMesh.position.copy(newHoveredPoint.position);
                //hoverOverPoints(newHoveredPoint);
            }
            else{
                if(highlightMesh){
                    //unhoverOverPoints();
                    this.scene.remove(highlightMesh);
                    highlightMesh = null;
                }
            }        
        };
    
        const onMouseUp = (event) => {
            event.preventDefault();
            if(!isDragging) {
                this.checkIntersections(mouse, raycaster, material);
            }
        };
        
        function hoverOverPoints(point){             
                    
        }   
        
        function unhoverOverPoints(){
    
        }
        
        this.renderer.domElement.addEventListener('mousedown', onMouseDown, false);
        this.renderer.domElement.addEventListener('mousemove', onMouseMove, false);
        this.renderer.domElement.addEventListener('mouseup', onMouseUp, false);
    
        return () => {
            this.renderer.domElement.removeEventListener('mousedown', onMouseDown, false);
            this.renderer.domElement.removeEventListener('mousemove', onMouseMove, false); 
            this.renderer.domElement.removeEventListener('mouseup', onMouseUp, false);
        };
    }

    checkIntersections(mouse, raycaster, material){
        raycaster.layers.set(0);        
        raycaster.setFromCamera(mouse, this.camera);
        let intersects = raycaster.intersectObjects(this.scene.children, true);
        intersects = intersects.filter(intersect => !intersect.object.userData.IsHighlightMesh);
        if (intersects.length > 0 ) {
            if (intersects[0].object.userData.IsProduct){
                const intersect = intersects[0];
                const sphereGeometry = new THREE.SphereGeometry(this.scale, 32, 32);
                const sphere = new THREE.Mesh(sphereGeometry, material);
                sphere.position.copy(intersect.point);
                sphere.userData.IsAnnotationPoint = true;
                this.scene.add(sphere);
            }
            else if(intersects[0].object.userData.IsAnnotationPoint){
                this.handlePointClick(intersects[0].object.uuid, intersects[0].object.position);
            }
        }
    }
    
    createInitialAnnotations() {
        this.initialAnnotations.forEach(annotation => {
            this.createAnnotation(annotation);
        });
    }

    createAnnotation(annotation) {
        const sphereGeometry = new THREE.SphereGeometry(this.scale, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);        
        sphere.position.set(annotation.position.x, annotation.position.y, annotation.position.z);
        sphere.userData = { IsAnnotationPoint: true, annotationID: annotation.annotationID };
        sphere.uuid = annotation.annotationID;
        this.scene.add(sphere);
    }

    addAnnotations(annotations) {
        this.initialAnnotations = annotations;
        this.createInitialAnnotations();
    }
}

export default InteractionHandler;