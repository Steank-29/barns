const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { validateSignin } = require('../utils/validationMiddleware');

router.post('/login', validateSignin, authController.signin);
router.post('/signup', authController.signup);

router.get('/users', authController.getAllUsers);
router.get('/users/:id', authController.getUser);
router.put('/users/:id', authController.updateUser);
router.delete('/users/:id', authController.deleteUser);

router.post('/password/reset-request', authController.requestPasswordReset);
router.post('/password/reset', authController.resetPassword);

module.exports = router;