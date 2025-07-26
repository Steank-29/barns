const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const product = require('../controllers/Porte');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), product.addProduct);
router.get('/getoneporte/:ref', product.getProductByRef);
router.put('/updateporte/:ref', upload.single('image'), product.updateProductByRef);
router.delete('/deleteporte/:ref', product.deleteProductByRef);
router.delete('/deleteporte', product.deleteAllProducts);
router.get('/getallportes', product.getAllProducts);

module.exports = router;
