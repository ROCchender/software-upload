const express = require('express');
const { 
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, admin, librarian } = require('../middleware/authMiddleware');

const router = express.Router();

// 获取所有分类 (公开)
router.get('/', getCategories);

// 获取单个分类 (公开)
router.get('/:id', getCategoryById);

// 创建分类 (仅图书管理员和管理员)
router.post('/', protect, librarian, createCategory);

// 更新分类 (仅图书管理员和管理员)
router.put('/:id', protect, librarian, updateCategory);

// 删除分类 (仅管理员)
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router; 