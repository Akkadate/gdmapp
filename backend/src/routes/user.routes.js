const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// All routes are protected and only accessible by admins
router.use(authenticate);
router.use(authorize(['admin']));

// Routes for user management
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id/reset-password', userController.resetUserPassword);

module.exports = router;
