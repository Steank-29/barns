const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/Newsletter');

router.post('/subscribe', newsletterController.subscribe);

router.post('/unsubscribe', newsletterController.unsubscribe);

router.get('/subscribers', newsletterController.getAllSubscribers);

module.exports = router;