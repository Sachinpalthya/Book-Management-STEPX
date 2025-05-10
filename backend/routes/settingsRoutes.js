const express = require('express');
const router = express.Router();
const { checkPermission,auth } = require('../middleware/auth');
const settingsController = require('../controllers/settingsController');

// @route   GET /api/settings
// @desc    Get all settings
// @access  Private
router.get('/', settingsController.getSettings);

// @route   GET /api/settings/:key
// @desc    Get setting by key
// @access  Private
router.get('/:key', settingsController.getSettingByKey);

// @route   POST /api/settings
// @desc    Create or update setting
// @access  Private (Admin only)
router.post('/', auth,checkPermission('manage-settings'), settingsController.upsertSetting);

// @route   DELETE /api/settings/:key
// @desc    Delete setting
// @access  Private (Admin only)
router.delete('/:key', auth,checkPermission('manage-settings'), settingsController.deleteSetting);

module.exports = router; 