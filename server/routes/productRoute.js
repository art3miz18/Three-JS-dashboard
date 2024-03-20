// server/routes/productRoutes.js
const express = require('express');
const auth = require('../middleware/auth');
const Product = require('../models/products');
const multer = require('multer');
const path = require('path');
const router = express.Router();


//define storage route to store files ../uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // Make sure the /uploads directory exists in your server directory
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage }).fields([
  { name: 'images', maxCount: 5 }, // Adjust maxCount as needed
  { name: 'modelFile', maxCount: 1 }
]);
// Define routes for your Product CRUD operations
// e.g., GET, POST, PUT, DELETE endpoints

//add product to collection
router.post('/', auth, upload, async (req, res) => {
    const imagePath = req.files['images'] ? req.files['images'].map(file => file.path) : [];
    const modelFilePath = req.files['modelFile'] ? req.files['modelFile'][0].path : null;
    const product = new Product({
      user: req.user._id,
      name: req.body.name,
      description: req.body.description,
      images: imagePath,
      modelFile: modelFilePath,
      annotations: JSON.parse(req.body.annotations || '[]') // Assuming annotations are sent as a JSON string
    });
    console.log(modelFilePath);
    
    try {
      const newProduct = await product.save();
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
 
// GET route to fetch all products
router.get('/', auth, async (req, res) => {
    try {
      const products = await Product.find({ user: req.user._id });
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


// GET route to fetch a single product by ID
router.get('/:id', auth, getProduct, (req, res) => {
    res.json(res.product);
});
  
  
// PATCH route to update a product's details
// USES :: get product Middleware 
router.patch('/:id', auth, getProduct, async (req, res) => {
        
    try {
        const product = await Product.findOne({ _id: req.params.id , user: req.user._id});         
        if (!product) {
          return res.status(404).json({ message: 'Product not found or user not authorized' });
        }
        
        // Dynamically update fields provided in the request
        Object.entries(req.body).forEach(([key, value]) => {
          res.product[key] = value;
        });      
      const updatedProduct = await res.product.save();
      res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
        // console.log('error here', err.message);
    }
}); 


// DELETE route to delete a product
router.delete('/:id',auth, getProduct, async (req, res) => {
    try {
        const deletedProduct = await Product.findOne({ _id: req.params.id });
        if (!deletedProduct) {
          return res.status(404).json({ message: 'Cannot find product' });
        }
        if (deletedProduct.user.toString() !== req.user.id) {
          return res.status(403).json({ message: 'User not authorized to delete this product' });
        }
        await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted Product ', product: deletedProduct.name });
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
});


// Middleware to get a product by ID
async function getProduct(req, res, next) {
    let product;
    try {
    product = await Product.findById(req.params.id);
    if (product == null) {
        return res.status(404).json({ message: 'Cannot find product' });
    }
    res.product = product;
    next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = router;
