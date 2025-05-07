// routes/chapterRoutes.js
const express = require('express');
const router = express.Router();
const { getChapters, createChapter } = require('../controllers/chapterController');
const { protect } = require('../middleware/auth');

// Example Routes
router.get('/', protect, getChapters);
router.post('/', protect, createChapter);

module.exports = router;
