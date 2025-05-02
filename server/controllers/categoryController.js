const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');

// @desc    获取所有分类
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ name: 1 });
  res.json(categories);
});

// @desc    获取单个分类
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('分类未找到');
  }
});

// @desc    创建分类
// @route   POST /api/categories
// @access  Private/Librarian
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // 检查分类名是否已存在
  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error('分类名已存在');
  }

  const category = await Category.create({
    name,
    description,
  });

  if (category) {
    res.status(201).json(category);
  } else {
    res.status(400);
    throw new Error('无效的分类数据');
  }
});

// @desc    更新分类
// @route   PUT /api/categories/:id
// @access  Private/Librarian
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const category = await Category.findById(req.params.id);

  if (category) {
    // 如果更新了名称，需要检查新名称是否已存在
    if (name && name !== category.name) {
      const categoryExists = await Category.findOne({ name });
      if (categoryExists) {
        res.status(400);
        throw new Error('分类名已存在');
      }
    }

    category.name = name || category.name;
    category.description = description || category.description;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('分类未找到');
  }
});

// @desc    删除分类
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    try {
      await category.remove();
      res.json({ message: '分类已删除' });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  } else {
    res.status(404);
    throw new Error('分类未找到');
  }
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}; 