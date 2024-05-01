import * as THREE from 'three';
import { createBoundingBox } from './cameraUtil';class InteractionHandler {
    constructor(scene, camera, renderer, model, handlePointClick, historyManager, UpdateUndoRedoAvailability, setAnnotations){
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5});

        this.model = model;
        this.handlePointClick = handlePointClick;
        this.historyManager = historyManager;
        this.isEditMode = false;
        this.scale = this.calculateScale();
        this.setAnnotations = setAnnotations;

        this.updateUndoRedoAvailability = UpdateUndoRedoAvailability;
        this.initialAnnotations = [];
        this.points = [];
        this.ActivePoint = ''; // storing active point details for position update
        this.pointReposition ='';
        this.IsNewPoint = true;
        this.initialPosition = null;

        // functional Binding
        this.setupInteractionHandler = this.setupInteractionHandler.bind(this);
        this.checkIntersections = this.checkIntersections.bind(this);
        this.createAnnotation = this.createAnnotation.bind(this);
        this.setPosition = this.setPosition.bind(this);

            
        this.setupInteractionHandler();
        this.updateCursorStyle();
        this.onAnnotationChangeCallbacks = [];
    }


    setEditMode(isEditMode){
        this.isEditMode = isEditMode;
    }

    calculateScale(){
        const{ size } = createBoundingBox(this.model, this.scene);
        return Math.max(size.x, size.y, size.z) * 0.01;
    }   

    

    setupInteractionHandler() {
        const raycaster = new THREE.Raycaster();
        // const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5});
        const mouse = new THREE.Vector2(); // Get the bounding rectangle of the canvas
        let rect = this.renderer.domElement.getBoundingClientRect();
        let isDragging = false;
        let highlightMesh = null;
        let HIGHLIGHT_LAYER = 1;
        
        const updateRect = () => {
            rect = this.renderer.domElement.getBoundingClientRect();
        };
        const onMouseDown = (event) => {
            event.preventDefault();
            if(this.isEditMode){
                updateRect();
                const x = event.clientX - rect.left; // Mouse x relative to the canvas
                const y = event.clientY - rect.top; // Mouse y relative to the canvas
                mouse.x = (x / rect.width ) * 2 - 1;
                mouse.y = -(y/ rect.height ) * 2 + 1;
                isDragging = false;

                if (this.ActivePoint) {
                    this.initialPosition = this.ActivePoint.position.clone();
                }
            }
        };
        
        const onMouseMove = (event) => {
            event.preventDefault();
            if(this.isEditMode){
                updateRect();
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
                if(intersects.length === 0 ){
                    this.updateCursorStyle('default');
                }
                let newHoveredPoint = intersects.length > 0 && intersects[0].object.userData.IsAnnotationPoint ? intersects[0].object : null;
                if(intersects.length > 0 && intersects[0].object.userData.IsProduct){
                    this.updateCursorStyle('pointer');
                }
                if (intersects.length > 0 && intersects[0].object.userData.IsAnnotationPoint )
                {           
                    // console.log('clicked on product');  
                    if(!highlightMesh  ){
                        const geometry = new THREE.SphereGeometry( this.scale * 1.2 , 32 ,32);
                        const material = new THREE.MeshBasicMaterial ({color: 0x0000ff, transparent: true, opacity: 0.8});
                        highlightMesh = new THREE.Mesh(geometry, material);
                        highlightMesh.userData.IsHighlightMesh = true;
                        this.scene.add(highlightMesh);
                        if(this.ActivePoint){
                            this.updateCursorStyle('disabled');
                        }
                    }            
                    highlightMesh.position.copy(newHoveredPoint.position);
                    //hoverOverPoints(newHoveredPoint);
                }
                else{
                    if(highlightMesh){
                        //unhoverOverPoints();
                        this.scene.remove(highlightMesh);
                        highlightMesh = null;
                        this.updateCursorStyle('default');
                    }
                }        
            }
        };
    
        const onMouseUp = (event) => {
            event.preventDefault();
            if(!isDragging && this.isEditMode) {
                this.checkIntersections(mouse, raycaster, this.material);
            }
        };
        
        // function hoverOverPoints(point){             
                    
        // }   
        
        // function unhoverOverPoints(){
    
        // }
        
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
        if(this.ActivePoint){ 
                       
            raycaster.layers.set(0);        
            raycaster.setFromCamera(mouse, this.camera);
            let intersects = raycaster.intersectObjects(this.scene.children, true);
            intersects = intersects.filter(intersect => !intersect.object.userData.IsHighlightMesh);
            if (intersects.length > 0 ) {
                if (intersects[0].object.userData.IsProduct){
                    const intersect = intersects[0];
                    this.ActivePoint.position.copy(intersect.point);                    
                    this.saveHistory(intersect); // Save Undo Redo actions
                    if(this.ActivePoint.userData.HasData){
                        this.handlePointClick(this.ActivePoint.uuid, this.ActivePoint.position, false);
                    }
                    else{
                        this.handlePointClick(this.ActivePoint.uuid, this.ActivePoint.position, true);
                    }
                }                
            }
            return;
        }
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
                this.ActivePoint = sphere;
                this.initialPosition = this.ActivePoint.position.clone(); 
                this.saveHistory(intersect);  // Save Undo Redo actions
                this.addPoint(this.ActivePoint);               
                this.handlePointClick(this.ActivePoint.uuid, this.ActivePoint.position, true);
            }
            else if(intersects[0].object.userData.IsAnnotationPoint && intersects[0].object.userData.HasData ){
                // this.ActivePoint = intersects[0];
                this.handlePointClick(intersects[0].object.uuid, intersects[0].object.position, false);
            }
        }
    }

    createNewAnnotation(uuid, position){
        const sphereGeometry = new THREE.SphereGeometry(this.scale, 32, 32);
        const sphere = new THREE.Mesh(sphereGeometry, this.material);
        sphere.position.copy(position);        
        sphere.userData.IsAnnotationPoint = true;
        sphere.uuid = uuid;
        this.scene.add(sphere);
        this.addPoint(sphere);
    }
    
    //#region Creating Initial Annotations
    createInitialAnnotations() {
        this.initialAnnotations.forEach(annotation => {
            this.createAnnotation(annotation, true);
        });
    }
    
    createAnnotation(annotation, hasData) {
        const sphereGeometry = new THREE.SphereGeometry(this.scale, 20, 20);
        const sphere = new THREE.Mesh(sphereGeometry, this.material);      
        sphere.position.set(annotation.position.x, annotation.position.y, annotation.position.z);
        sphere.userData = { IsAnnotationPoint: true, annotationID: annotation.annotationID, HasData: hasData };
        sphere.uuid = annotation.annotationID;
        sphere.layers.set(1);
        this.scene.add(sphere);
        this.addPoint(sphere);
        
        if(typeof this.setAnnotations === 'function') {
            const newAnnotation = {
                id: annotation.annotationID,
                position: annotation.position,
                details: annotation.title,
                description: annotation.description,
                obj: sphere  
                };                
                this.setAnnotations(prevAnnotations => [...prevAnnotations, newAnnotation]);
        }         
        if(!hasData){
            this.ActivePoint = sphere;
            this.handlePointClick(this.ActivePoint.uuid, this.ActivePoint.position, true);
        }        
    }
    
    //Add new annotations these is triggered from annotation.js when the data is recieved through the API
    addAnnotations(annotations) {
        this.initialAnnotations = annotations;
        this.createInitialAnnotations();
    }
    
    //#endregion
    //#region History Managment of new points
    saveHistory(intersect){
        if(this.initialPosition && !this.initialPosition.equals(intersect.point)){ 
            let uid = this.ActivePoint.uuid;
            let initPos = this.initialPosition;
            this.historyManager.addAction({
                do: ()=> {this.setPosition(uid, intersect.point)},
                undo: ()=> {this.setPosition(uid, initPos)}
            });
            this.updateUndoRedoAvailability();
        }
    }

    // Add point to the list
    addPoint(point){
        this.points.push(point);
    }
    
    //Find point from current array of points added to the scene
    findPointById(uuid){
        const pointData = this.points.find(p => p.uuid === uuid.annotationID);
        console.log('pointData ', pointData);
        return pointData        
    }
    
    //SetPosition is action that is saved in history Manager to use it to redo and Undo actions
    setPosition(uuid, position){
        const point = this.ActivePoint; //this.findPointById(uuid); 
        if(point) {            
            point.position.copy(position);
        }
        else if(!point){
            console.log('point not found bitch');
            const annotation ={
                annotationID: uuid,
                position: position
            }
            // this.createNewAnnotation(uuid,position);
            this.createAnnotation(annotation, false);
        }
    }
    //#endregion

    //Cleaning up the referemce to active annotation point
    clearActivePoint(){
        if(this.ActivePoint){
            this.ActivePoint.userData.HasData = true;
            this.points.push(this.ActivePoint); // add new point to points[] array
            this.ActivePoint='';
        }
    }

    //On Delete button callback to delete the annotation from the annotation form
    deleteActivePoint = async (uuid) => {
        const pointIndex = await this.points.findIndex(p => p.uuid === uuid.annotationID);
        if(pointIndex > -1){
            const [point] = this.points.splice(pointIndex, 1);
            this.scene.remove(point);
            this.ActivePoint='';
        }
        else{
            console.log('no point found with ID');
        }
    }

    //On edit Button Callback to edit certain specified point
    editActivePoint = async(editID) => {
        const point = await this.findPointById(editID);
        if(point){
            const init = this.initialAnnotations.find(p => p.uuid === editID.annotationID)
            if(init){
                console.log('Old data bc');
            }
            this.ActivePoint = point;
        }
    }

    updateCursorStyle = (style) => {
        switch(style) {
          case 'disabled':
            this.renderer.domElement.style.cursor = 'not-allowed'; // Shows a 'disabled' cursor
            break;
          case 'pointer':
            this.renderer.domElement.style.cursor = 'pointer'; // Pointer cursor when over clickable items
            break;
          default:
            this.renderer.domElement.style.cursor = 'default'; // Default cursor
        }
    };
}

export default InteractionHandler;