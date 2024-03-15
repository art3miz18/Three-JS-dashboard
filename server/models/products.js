// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    images: [{ type: String }], // Array of image file paths
    modelFile: { type: String }, // Path to the 3D model file
    annotations: [{
      annotationID: String,
      title: String,
      description: String,
      position: {
        x: Number,
        y: Number,
        z: Number
      }
    }]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
