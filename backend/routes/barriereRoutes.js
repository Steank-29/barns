const express = require('express');
const router = express.Router();
const barriereController = require('../controllers/barriereController');
const multer = require('multer');
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

router.post('/', upload.single('image'), barriereController.create);
router.get('/allbarriere', barriereController.getAll);
router.get('/onebarriere/:id', barriereController.getById);
router.put('/updatebarriere/:id', barriereController.update);
router.delete('/deletebarriere/:id', barriereController.delete);

module.exports = router;