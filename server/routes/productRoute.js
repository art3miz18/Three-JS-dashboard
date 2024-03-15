// server/routes/productRoutes.js
const express = require('express');
const Product = require('../models/products');
const multer = require('multer');
const upload = multer({ dest: '../uploads'});

const router = express.Router();

// Define routes for your Product CRUD operations
// e.g., GET, POST, PUT, DELETE endpoints

//add product to collection
router.post('/', async (req, res) => {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      images: req.body.images,
      modelFile: req.body.modelFile,
      annotations: req.body.annotations,
    });
  
    try {
      const newProduct = await product.save();
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// GET route to fetch all products
router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


// GET route to fetch a single product by ID
router.get('/:id', getProduct, (req, res) => {
    res.json(res.product);
});
  
  
// PATCH route to update a product's details
// USES :: get product Middleware 
router.patch('/:id', getProduct, async (req, res) => {
    if (req.body.name != null) {
        res.product.name = req.body.name;
    }
    if (req.body.description != null) {
        res.product.description = req.body.description;
    }
    if (req.body.price != null) {
        res.product.price = req.body.price;
    }
    // Add other fields as necessary
    
    try {
        const updatedProduct = await res.product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// DELETE route to delete a product
router.delete('/:id', getProduct, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Cannot find product' });
        }

    res.json({ message: 'Deleted Product' });
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
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.product = product;
    next();
}

module.exports = router;
