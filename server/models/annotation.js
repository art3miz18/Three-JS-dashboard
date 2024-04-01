const mongoose = require('mongoose');

const annotationSchema = new mongoose.Schema({
  
  annotationID: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true }
  }
});

const productAnnotationsSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
  annotations: [annotationSchema]
});

const Annotation = mongoose.model('Annotations', productAnnotationsSchema);

module.exports = Annotation;
