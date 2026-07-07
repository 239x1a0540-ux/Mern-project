const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/register-admin', authController.registerAdmin);
router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);
router.get('/verify-token', authMiddleware, authController.verifyToken);

module.exports = router;
