// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // This should match the model name of your User model
  },
    name: { type: String, required: true },
    description: { type: String, required: false },
    images: [{ type: String }], // Array of image file paths
    modelFile: { type: String }, // Path to the 3D model file
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
