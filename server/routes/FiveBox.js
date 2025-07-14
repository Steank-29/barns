const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const fiveBoxController = require('../controllers/FiveBox');

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

router.post('/', upload.single('image'), fiveBoxController.createFiveBox);
router.get('/getfivebox/:ref', fiveBoxController.getFiveBoxByRef);
router.put('/updatefivebox/:ref', upload.single('image'), fiveBoxController.updateFiveBox);
router.delete('/deletefivebox/:ref', fiveBoxController.deleteFiveBox);
router.delete('/deletefivebox', fiveBoxController.deleteAllFiveBoxes);
router.get('/getallfiveboxes', fiveBoxController.getAllFiveBoxes);

module.exports = router;
