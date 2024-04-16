

# Script Overview for 3D Product Viewer

## Introduction
This README provides detailed descriptions of the scripts used in the 3D Product Viewer project. Each script contributes to the functionality of visualizing 3D models in a web browser using React and Three.js.

## Scripts

### `App.js`
This is the main component of the application. It initializes the 3D scene using Three.js, handles the lifecycle of the application, and integrates the `DragAndDrop` component. It ensures the 3D models are rendered within the viewport and manages state changes related to the scene setup and model loading.

### `setupScene.js`
Responsible for setting up the initial 3D scene. It configures the renderer, camera, and controls using Three.js. This script includes settings for the scene's lighting and background color, creating a visually appealing environment for 3D models.

### `loadModel.js`
Contains functions to load 3D models from files. It uses the `GLTFLoader` for importing `.glb` or `.gltf` files. The script also includes error handling and adjusts the camera to fit the loaded model into view, enhancing user interaction with the model.

### `cameraUtil.js`
Provides utility functions for camera adjustments post-model loading. It calculates the optimal camera position and sets the camera to focus on the model, ensuring the model is properly centered and scaled in the viewport.

### `dragAndDrop.js`
Implements a React component that handles the drag-and-drop functionality. It allows users to upload GLB files by dragging and dropping them into a designated area. This script is integral for user interaction, providing visual feedback during the drag-and-drop process and triggering model loading on file drop.

## Conclusion
These scripts collectively enable the functionality of a 3D product viewer in a web browser. By understanding each script's role, developers can better maintain and enhance the application.
