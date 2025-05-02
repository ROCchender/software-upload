const express = require('express');
const { 
  getBorrowings,
  getBorrowingById,
  createBorrowing,
  returnBook,
  renewBook,
  getUserBorrowings,
  getOverdueBorrowings
} = require('../controllers/borrowingController');
const { protect, admin, librarian } = require('../middleware/authMiddleware');

const router = express.Router();

// 获取所有借阅记录 (仅管理员和图书管理员)
router.get('/', protect, librarian, getBorrowings);

// 获取逾期借阅记录 (仅管理员和图书管理员)
router.get('/overdue', protect, librarian, getOverdueBorrowings);

// 获取用户自己的借阅记录
router.get('/myborrowings', protect, getUserBorrowings);

// 创建借阅记录 (仅图书管理员和管理员)
router.post('/', protect, librarian, createBorrowing);

// 获取特定借阅记录
router.get('/:id', protect, getBorrowingById);

// 续借图书
router.put('/:id/renew', protect, renewBook);

// 归还图书 (仅图书管理员和管理员)
router.put('/:id/return', protect, librarian, returnBook);

module.exports = router; 