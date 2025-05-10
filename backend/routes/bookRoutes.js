const express = require('express');
const router = express.Router();
const { auth, checkPermission } = require('../middleware/auth');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

// @route   GET /api/books
// @desc    Get all books
// @access  Private
router.get('/', auth, getBooks);

// @route   GET /api/books/:id
// @desc    Get single book
// @access  Private
router.get('/:id', auth, getBookById);

// @route   POST /api/books
// @desc    Create a book
// @access  Private (requires 'add-books' permission)
router.post('/', auth, checkPermission('add-books'), createBook);

// @route   PUT /api/books/:id
// @desc    Update a book
// @access  Private (requires 'edit-books' permission)
router.put('/:id', auth, checkPermission('edit-books'), updateBook);

// @route   DELETE /api/books/:id
// @desc    Delete a book
// @access  Private (requires 'delete-books' permission)
router.delete('/:id', auth, checkPermission('delete-books'), deleteBook);

module.exports = router; 
