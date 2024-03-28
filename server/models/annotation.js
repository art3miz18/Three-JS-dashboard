const mongoose = require('mongoose');

const annotationSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'products' 
  },
  title: { type: String, required: true },
  description: { type: String, required: false },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true }
  }
});

const Annotation = mongoose.model('Annotation', annotationSchema);

module.exports = Annotation;
