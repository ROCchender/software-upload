const asyncHandler = require('express-async-handler');
const Book = require('../models/bookModel');

// @desc    获取所有图书
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  // 过滤条件
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  
  const count = await Book.countDocuments({ ...keyword, ...category });
  const books = await Book.find({ ...keyword, ...category })
    .populate('category', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    books,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    获取单本图书
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('category', 'name');

  if (book) {
    res.json(book);
  } else {
    res.status(404);
    throw new Error('图书未找到');
  }
});

// @desc    创建新图书
// @route   POST /api/books
// @access  Private/Librarian
const createBook = asyncHandler(async (req, res) => {
  const {
    title,
    isbn,
    author,
    publisher,
    category,
    location,
    publicationYear,
    language,
    pages,
    description,
    totalCopies,
    price,
  } = req.body;

  // 检查ISBN是否已存在
  const bookExists = await Book.findOne({ isbn });

  if (bookExists) {
    res.status(400);
    throw new Error('该ISBN已存在');
  }

  const book = await Book.create({
    title,
    isbn,
    author,
    publisher,
    category,
    location,
    publicationYear,
    language,
    pages,
    description,
    totalCopies,
    availableCopies: totalCopies, // 初始时可借阅数量等于总数量
    price,
  });

  if (book) {
    res.status(201).json(book);
  } else {
    res.status(400);
    throw new Error('无效的图书数据');
  }
});

// @desc    更新图书
// @route   PUT /api/books/:id
// @access  Private/Librarian
const updateBook = asyncHandler(async (req, res) => {
  const {
    title,
    author,
    publisher,
    category,
    location,
    publicationYear,
    language,
    pages,
    description,
    totalCopies,
    availableCopies,
    price,
    status,
  } = req.body;

  const book = await Book.findById(req.params.id);

  if (book) {
    book.title = title || book.title;
    book.author = author || book.author;
    book.publisher = publisher || book.publisher;
    book.category = category || book.category;
    book.location = location || book.location;
    book.publicationYear = publicationYear || book.publicationYear;
    book.language = language || book.language;
    book.pages = pages || book.pages;
    book.description = description || book.description;
    
    if (totalCopies !== undefined) {
      // 如果更新总数量，需要同时更新可借阅数量
      const diff = totalCopies - book.totalCopies;
      book.totalCopies = totalCopies;
      book.availableCopies = Math.max(0, book.availableCopies + diff);
    }
    
    if (availableCopies !== undefined) {
      book.availableCopies = Math.min(book.totalCopies, Math.max(0, availableCopies));
    }
    
    book.price = price || book.price;
    book.status = status || book.status;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('图书未找到');
  }
});

// @desc    删除图书
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    await book.remove();
    res.json({ message: '图书已删除' });
  } else {
    res.status(404);
    throw new Error('图书未找到');
  }
});

// @desc    搜索图书
// @route   GET /api/books/search
// @access  Public
const searchBooks = asyncHandler(async (req, res) => {
  const { query, field } = req.query;
  
  if (!query) {
    res.status(400);
    throw new Error('请提供搜索关键词');
  }

  let searchQuery = {};

  // 根据指定字段搜索
  if (field === 'title') {
    searchQuery.title = { $regex: query, $options: 'i' };
  } else if (field === 'author') {
    searchQuery.author = { $regex: query, $options: 'i' };
  } else if (field === 'isbn') {
    searchQuery.isbn = { $regex: query, $options: 'i' };
  } else {
    // 默认在多个字段中搜索
    searchQuery = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { isbn: { $regex: query, $options: 'i' } },
        { publisher: { $regex: query, $options: 'i' } },
      ],
    };
  }

  const books = await Book.find(searchQuery)
    .populate('category', 'name')
    .limit(20); // 限制结果数量

  res.json(books);
});

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
};