// routes/subjectRoutes.js
const express = require('express');
const router = express.Router();
const { auth, checkPermission } = require('../middleware/auth');
const {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');

// @route   GET /api/subjects
// @desc    Get all subjects
// @access  Private
router.get('/', auth, getSubjects);

// @route   POST /api/subjects
// @desc    Create a subject
// @access  Private (requires 'add-subjects' permission)
router.post('/', auth, checkPermission('add-subjects'), createSubject);

// @route   PUT /api/subjects/:id
// @desc    Update a subject
// @access  Private (requires 'edit-subjects' permission)
router.put('/:id', auth, checkPermission('edit-subjects'), updateSubject);

// @route   DELETE /api/subjects/:id
// @desc    Delete a subject
// @access  Private (requires 'delete-subjects' permission)
router.delete('/:id', auth, checkPermission('delete-subjects'), deleteSubject);

module.exports = router;

