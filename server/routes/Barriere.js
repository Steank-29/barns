const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const barriere = require('../controllers/Barriere');

const router = express.Router();

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

router.post('/', upload.single('image'), barriere.addBarriere);
router.get('/getonebarriere/:ref', barriere.getBarriereByRef);
router.put('/updatebarriere/:ref', upload.single('image'), barriere.updateBarriereByRef);
router.delete('/deletebarriere/:ref', barriere.deleteBarriereByRef);
router.delete('/deletebarriere', barriere.deleteAllBarrieres);
router.get('/getallbarrieres', barriere.getAllBarrieres);

module.exports = router;
