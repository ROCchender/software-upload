const express = require('express');
const { 
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks
} = require('../controllers/bookController');
const { protect, admin, librarian } = require('../middleware/authMiddleware');

const router = express.Router();

// 公共路由
router.get('/', getBooks);
router.get('/search', searchBooks);
router.get('/:id', getBookById);

// 需要图书管理员或管理员权限的路由
router.post('/', protect, librarian, createBook);
router.route('/:id')
  .put(protect, librarian, updateBook)
  .delete(protect, admin, deleteBook);

module.exports = router; 