// routes/chapterRoutes.js
const express = require('express');
const router = express.Router();
const { getChapters, createChapter, updateChapterUrl, handleQRRedirect } = require('../controllers/chapterController');
const { protect } = require('../middleware/auth');

// Public route for QR code redirection
router.get('/qr/:qrId', handleQRRedirect);

// Protected routes
router.get('/', protect, getChapters);
router.post('/', protect, createChapter);
router.patch('/:chapterId/url', protect, updateChapterUrl);

module.exports = router;
