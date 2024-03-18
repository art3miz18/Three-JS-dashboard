// server/routes/productRoutes.js
const express = require('express');
const auth = require('../middleware/auth');
const Product = require('../models/products');
const multer = require('multer');
const upload = multer({ dest: '../uploads'});

const router = express.Router();

// Define routes for your Product CRUD operations
// e.g., GET, POST, PUT, DELETE endpoints

//add product to collection
router.post('/', auth,  async (req, res) => {
    const product = new Product({
      ...req.body,
      user: req.user._id
    });
  
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
router.patch('/:id', auth, async (req, res) => {
        
    try {
        const product = await Product.findOne({ _id: req.params.id, user: req.user._id });
        // console.log(' id: ', req.params.id, 'user: ', req.user._id);
        if (!product) {
          return res.status(404).json({ message: 'Product not found or user not authorized' });
        }
        
        // Dynamically update fields provided in the request
        Object.entries(req.body).forEach(([key, value]) => {
          product[key] = value;
      });
        console.log('Product ', updatedProduct);
        const updatedProduct = await res.product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
        // console.log('error here', err.message);
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
