const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const twoBoxController = require('../controllers/TwoBox');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});

const upload = multer({ storage });

// Routes
router.post('/', upload.single('image'), twoBoxController.createTwoBox);
router.get('/gettwobox/:ref', twoBoxController.getTwoBoxByRef);
router.put('/updatetwobox/:ref', upload.single('image'), twoBoxController.updateTwoBox);
router.delete('/deletetwobox/:ref', twoBoxController.deleteTwoBox);
router.delete('/deletetwobox', twoBoxController.deleteAllTwoBoxes);
router.get('/getalltwoboxes', twoBoxController.getAllTwoBoxes);

module.exports = router;
