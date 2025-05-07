// routes/subjectRoutes.js
const express = require('express');
const router = express.Router();
const { getSubjects, createSubject } = require('../controllers/subjectController');
const { protect } = require('../middleware/auth');

// Example Routes
router.get('/', protect, getSubjects);
router.post('/', protect, createSubject);

module.exports = router;
 
