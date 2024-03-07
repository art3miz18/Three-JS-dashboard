import React from 'react';
import * as THREE from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

class AnnotationDetail extends React.Component {
  constructor(props) {
    super(props);
    this.element = document.createElement('div');
    this.element.className = 'annotation-detail';
    // Add styles or classes to the element
    this.element.innerHTML = `
      <h1>${props.title}</h1>
      <p>${props.description}</p>
    `;

    // CSS3DObject which will be added to the scene
    this.css3DObject = new CSS3DObject(this.element);
    this.css3DObject.position.copy(props.position);
  }

  componentDidMount() {
    this.props.scene.add(this.css3DObject);
  }

  componentWillUnmount() {
    this.props.scene.remove(this.css3DObject);
  }

  render() {
    // You can manage dynamic styles or classes here if needed
    return null; // This component does not render anything itself
  }
}

export default AnnotationDetail;
