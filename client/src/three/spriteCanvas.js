import * as THREE from 'three';
import { getAnnotationById } from '../js/annotation.js';

let title = '';
let description = '';
let text = "Text is going to me much longer";
let currentSprite = null;

export const spritePlane = (position ,scene) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = 'Bold 40px Arial';
    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear previous text
    context.fillText(text , 0, 50);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    
    const material = new THREE.SpriteMaterial({  map : texture, color: '#69f' });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1, 1, 1.0); // Scale the sprite accordingly
    sprite.position.set(position.x, position.y, position.z); // Position near the annotation point
    console.log('scene details?  ', scene); // Position near the annotation point
    scene.add(sprite);
};

export const updateSpriteCanvas = (scene, annotationDetails, position) => {
    const { title, description } = annotationDetails;
    // If a sprite already exists, remove it from the scene
    console.log('title and desc ', title, '/n', description);
    if (currentSprite) {
        scene.remove(currentSprite);
    }

    // Create a new canvas and context for the sprite's texture
    const canvas = document.createElement('canvas');
    canvas.width = 256; // Set canvas size
    canvas.height = 100;
    const context = canvas.getContext('2d');
    context.fillStyle = '#FFFFFF'; // White text
    context.font = 'Bold 20px Arial';
    context.textAlign = "center";
    context.fillText(title, 20, 40);
    context.fillText(description, 15, 80);

    // Create texture from canvas
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true; // Update the texture

    // Create sprite material with the texture
    const material = new THREE.SpriteMaterial({map : texture, depthWrite: false}); //color: '#69f'
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1, 1, 1); // Adjust scale as needed
    sprite.position.copy(position); // Set sprite positio n
    sprite.renderOrder = 20;
    // Add sprite to the scene
    scene.add(sprite);
    currentSprite = sprite; // Update reference to the current sprite
};

export const removeSpriteCanvas = (scene) => {
    if (currentSprite) {
        scene.remove(currentSprite);
        currentSprite = null; // Clear reference
    }
};