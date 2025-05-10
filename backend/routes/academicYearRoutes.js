const express = require('express');
const router = express.Router();
const { checkPermission,auth } = require('../middleware/auth');
const academicYearController = require('../controllers/academicYearController');

// Get all academic years
router.get('/', academicYearController.getAcademicYears);

// Create academic year
router.post('/', auth,checkPermission('manage-academic-years'), academicYearController.createAcademicYear);

// Update academic year
router.put('/:id', auth,checkPermission('manage-academic-years'), academicYearController.updateAcademicYear);

// Delete academic year
router.delete('/:id', auth,checkPermission('manage-academic-years'), academicYearController.deleteAcademicYear);

module.exports = router; 