const express = require('express');
const router = express.Router();
const { checkPermission,auth } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Get all users
router.get('/', auth,checkPermission('view-users'), userController.getAllUsers);

// Add user
router.post('/', auth,checkPermission('add-users'), userController.createUser);

// Update user
router.put('/:id', auth,checkPermission('edit-users'), userController.updateUser);

// Delete user
router.delete('/:id', auth,checkPermission('delete-users'), userController.deleteUser);

module.exports = router; 