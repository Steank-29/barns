const express = require('express');
const { signin } = require('../controllers/auth');
const { validateSignin } = require('../utils/validationMiddleware');

const router = express.Router();

router.post('/login', validateSignin, signin);


module.exports = router;