import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { adjustCameraToFitObject } from './cameraUtil';

export const loadModel = (scene, modelPath, onLoadCallback) => {
  const loader = new GLTFLoader();
  loader.load(modelPath, gltf => {
    const model = gltf.scene;
    model.userData.IsProduct = true;
    scene.add(model);
    if (onLoadCallback) onLoadCallback(model);
  }, undefined, error => {
    console.error('An error happened', error);
  });
};

// export const loadModelFromFile = (file, camera, scene, controls, onModelLoadedCallback) => {
//   const extension = file.name.split('.').pop().toLowerCase();
//   const reader = new FileReader();
//   if (file instanceof Blob) {
//     reader.readAsArrayBuffer(file);
//   } 
//   else {
//     console.error('The provided file is not a valid Blob.');
//   }
//   // reader.readAsArrayBuffer(file);
//   reader.onload = (event) => {
//     const loader = new GLTFLoader();
//     loader.parse(event.target.result, '', (gltf) => {
//       // console.log("event target ",event.target.result);
//       const model = gltf.scene;
//       // model.userData.IsProduct = true;
//       model.traverse((child) => {
//         if (child.isMesh) {
//           child.userData.IsProduct = true;
//         }
//         child.userData.IsProduct = true;
//       });
//       scene.add(model);
//       console.log(' checking for product tag', model);
//       // Additional setup like adjusting the camera can go here
//       adjustCameraToFitObject(scene, camera, model, controls);
//       if (onModelLoadedCallback && typeof onModelLoadedCallback === 'function') {
//         onModelLoadedCallback(model);
//       }
//     });
//   };
//   reader.onerror = (error) => {
//     console.error('Error reading file:', error);
//   };
// };
export const loadModelFromFile = (file, camera, scene, controls, onModelLoadedCallback) => {
  console.log(file);
  if (!file) {
    console.error('File object is undefined');
    return;
  }
  const namee=  file?.name;
  console.log('file name', namee);
  const extension = namee.split('.').pop().toLowerCase();
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = (event) => {
    switch (extension) {
      case 'gltf':
      case 'glb':
        console.log('file is GLB');
        const gltfLoader = new GLTFLoader();
        gltfLoader.parse(event.target.result, '', (gltf) => {
          processModel(gltf.scene, scene, camera, controls, onModelLoadedCallback);
        });
        break;

        case 'fbx':
        console.log('file is FBX');
        const fbxLoader = new FBXLoader();

        fbxLoader.parse(event.target.result, '', (fbx) => {
          processModel(fbx, scene, camera, controls, onModelLoadedCallback);
        }, (error) => {
          console.error('Error loading FBX:', error);
        });

        // fbxLoader.parse(event.target.result, '', (fbx) => {
        //   processModel(fbx.scene, scene, camera, controls, onModelLoadedCallback);
        // });

        // fbxLoader.load( '', function ( file ) {
				// 	scene.add( file );
				// } );
        break;

        case 'obj':
        console.log('file is OBJ');
        const objLoader = new OBJLoader();
        const object = objLoader.parse(event.target.result);
        processModel(object, scene, camera, controls, onModelLoadedCallback);
        break;
      default:
        console.error('Unsupported file format:', extension);
    }
  };

  reader.onerror = (error) => {
    console.error('Error reading file:', error);
  };
};
// loader.load( 'models/fbx/nurbs.fbx', function ( object ) {

//   scene.add( object );

// } );


// loader.load( 'models/fbx/Samba Dancing.fbx', function ( object ) {

// 					mixer = new THREE.AnimationMixer( object );

// 					const action = mixer.clipAction( object.animations[ 0 ] );
// 					action.play();

// 					object.traverse( function ( child ) {

// 						if ( child.isMesh ) {

// 							child.castShadow = true;
// 							child.receiveShadow = true;

// 						}

// 					} );

// 					scene.add( object );

// 				} );
function processModel(model, scene, camera, controls, onModelLoadedCallback) {
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.userData.IsProduct = true;
    }
  });

  scene.add(model);
  console.log('model added to the scene');
  adjustCameraToFitObject(scene, camera, model, controls);

  if (onModelLoadedCallback && typeof onModelLoadedCallback === 'function') {
    onModelLoadedCallback(model);
  }
};
