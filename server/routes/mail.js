const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mail');

// POST route for sending order emails
router.post('/buy/mail', mailController.sendOrderEmail);

module.exports = router;