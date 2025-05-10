// routes/chapterRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { 
  getChapters, 
  createChapter, 
  createChaptersFromPDF, 
  handleQRRedirect,
  addSubQR,
  deleteChapter 
} = require('../controllers/chapterController');
const { auth } = require('../middleware/auth');

// Public route for QR code redirection
router.get('/qr/:qrId', handleQRRedirect);

// Protected routes
router.get('/', auth, getChapters);

// Create a single chapter
router.post('/', [
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('subjectId', 'Subject ID is required').not().isEmpty()
  ]
], createChapter);

// Create multiple chapters from PDF
// router.post('/pdf', [
//   auth,
//   [
//     check('chapters', 'Chapters array is required').isArray(),
//     check('subjectId', 'Subject ID is required').not().isEmpty()
//   ]
// ], createChaptersFromPDF);

// Add sub-QR to chapter
// router.post('/:chapterId/sub-qr', [
//   auth,
//   [
//     check('title', 'Title is required').not().isEmpty(),
//     check('qrUrl', 'QR URL is required').not().isEmpty()
//   ]
// ], addSubQR);

// Delete chapter
router.delete('/:chapterId', auth, deleteChapter);

module.exports = router;
