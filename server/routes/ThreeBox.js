const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const threeBoxController = require('../controllers/ThreeBox');

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

router.post('/', upload.single('image'), threeBoxController.createThreeBox);
router.get('/getthreebox/:ref', threeBoxController.getThreeBoxByRef);
router.put('/updatethreebox/:ref', upload.single('image'), threeBoxController.updateThreeBox);
router.delete('/deletethreebox/:ref', threeBoxController.deleteThreeBox);
router.delete('/deletethreebox', threeBoxController.deleteAllThreeBoxes);
router.get('/getallthreeboxes', threeBoxController.getAllThreeBoxes);

module.exports = router;
