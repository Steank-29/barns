const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const twoBoxResinController = require('../controllers/TwoBoxResin');

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

router.post('/', upload.single('image'), twoBoxResinController.createTwoBoxResin);
router.get('/gettwoboxresin/:ref', twoBoxResinController.getTwoBoxResinByRef);
router.put('/updatetwoboxresin/:ref', upload.single('image'), twoBoxResinController.updateTwoBoxResin);
router.delete('/deletetwoboxresin/:ref', twoBoxResinController.deleteTwoBoxResin);
router.delete('/deletetwoboxresin', twoBoxResinController.deleteAllTwoBoxResins);
router.get('/getalltwoboxresins', twoBoxResinController.getAllTwoBoxResins);

module.exports = router;