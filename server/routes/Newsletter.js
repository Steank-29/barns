const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/Newsletter');

router.post('/subscribe', newsletterController.subscribe);

router.delete('/unsubscribe/:email', newsletterController.unsubscribe);

router.get('/subscribers', newsletterController.getAllSubscribers);

module.exports = router;
