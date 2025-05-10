const express = require('express');
const router = express.Router();
const { login, register, forgotPassword, resetPassword } = require('../controllers/authController');
const { auth, checkPermission } = require('../middleware/auth');

// Public routes
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/register', auth, checkPermission('add-users'), register);

module.exports = router;

