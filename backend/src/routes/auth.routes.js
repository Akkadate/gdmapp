const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Routes for authentication
router.post('/login', authController.login);
router.post('/register', authController.register);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/change-password', authenticate, authController.changePassword);

module.exports = router;
