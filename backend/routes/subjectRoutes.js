// routes/subjectRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getSubjects, createSubject, uploadSubjectFile, upload } = require('../controllers/subjectController');
const { protect } = require('../middleware/auth');

// Example Routes
router.get('/', protect, getSubjects);

router.post('/', [
  protect,
  [
    check('name', 'Subject name is required').not().isEmpty(),
    check('year', 'Year is required').not().isEmpty(),
    check('book', 'Book is required').not().isEmpty()
  ]
], createSubject);

router.post('/upload', protect, upload.single('file'), uploadSubjectFile);

module.exports = router;

