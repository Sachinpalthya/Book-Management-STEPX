const express = require('express');
const router = express.Router();
const { checkPermission,auth } = require('../middleware/auth');
const urlController = require('../controllers/urlController');

// Whitelisted URLs
router.get('/whitelisted', auth,checkPermission('manage-urls'), urlController.getWhitelistedUrls);
router.post('/whitelisted', auth,checkPermission('manage-urls'), urlController.addWhitelistedUrl);
router.delete('/whitelisted/:id', auth,checkPermission('manage-urls'), urlController.deleteWhitelistedUrl);

// Blocked URLs
router.get('/blocked', auth,checkPermission('manage-urls'), urlController.getBlockedUrls);
router.post('/blocked', auth,checkPermission('manage-urls'), urlController.addBlockedUrl);
router.delete('/blocked/:id', auth,checkPermission('manage-urls'), urlController.deleteBlockedUrl);

// Check URL
router.post('/check', urlController.checkUrl);

module.exports = router; 