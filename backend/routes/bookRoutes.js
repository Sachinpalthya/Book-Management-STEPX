const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getBooks);

router.get('/:id', protect, getBookById);

router.post(
  '/',
  [
    protect,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description must be at least 10 characters').isLength({ min: 10 })
    ]
  ],
  createBook
);

router.put(
  '/:id',
  [
    protect,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description must be at least 10 characters').isLength({ min: 10 })
    ]
  ],
  updateBook
);

router.delete('/:id', protect, deleteBook);

module.exports = router; 
