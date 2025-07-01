const express = require('express');
const router = express.Router();
const multer = require('multer');
const product = require('../controllers/productController');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const directory = `${__dirname}/../uploads`;
    fs.mkdirSync(directory, { recursive: true });
    cb(null, directory);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// 👉 POST /api/products
router.post('/', upload.single('image'), product.addProduct);

// Get one product by reference
router.get('/getonefacade/:ref', product.getProductByRef);

// Update a product by reference
router.put('/updatefacade/:ref', product.updateProductByRef);

// Delete one product by reference
router.delete('/deletefacade/:ref', product.deleteProductByRef);

// Delete all products
router.delete('/deletefacade', product.deleteAllProducts);

// Get all products
router.get('/getallfacades', product.getAllProducts);

module.exports = router;
