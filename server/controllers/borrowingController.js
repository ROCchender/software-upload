const asyncHandler = require('express-async-handler');
const Borrowing = require('../models/borrowingModel');
const Book = require('../models/bookModel');
const User = require('../models/userModel');

// @desc    获取所有借阅记录
// @route   GET /api/borrowings
// @access  Private/Librarian
const getBorrowings = asyncHandler(async (req, res) => {
  const pageSize = 15;
  const page = Number(req.query.pageNumber) || 1;

  // 过滤条件
  const status = req.query.status ? { status: req.query.status } : {};
  
  const count = await Borrowing.countDocuments(status);
  const borrowings = await Borrowing.find(status)
    .populate('user', 'name studentId email')
    .populate('book', 'title isbn author')
    .populate('issuedBy', 'name')
    .populate('receivedBy', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ borrowDate: -1 });

  res.json({
    borrowings,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    获取用户的借阅记录
// @route   GET /api/borrowings/myborrowings
// @access  Private
const getUserBorrowings = asyncHandler(async (req, res) => {
  const borrowings = await Borrowing.find({ user: req.user._id })
    .populate('book', 'title isbn author cover')
    .sort({ borrowDate: -1 });

  res.json(borrowings);
});

// @desc    获取逾期借阅记录
// @route   GET /api/borrowings/overdue
// @access  Private/Librarian
const getOverdueBorrowings = asyncHandler(async (req, res) => {
  const today = new Date();
  
  const borrowings = await Borrowing.find({
    status: 'borrowed',
    dueDate: { $lt: today },
    returnDate: { $exists: false }
  })
    .populate('user', 'name studentId email phone')
    .populate('book', 'title isbn author')
    .sort({ dueDate: 1 });

  res.json(borrowings);
});

// @desc    获取单条借阅记录
// @route   GET /api/borrowings/:id
// @access  Private
const getBorrowingById = asyncHandler(async (req, res) => {
  const borrowing = await Borrowing.findById(req.params.id)
    .populate('user', 'name studentId email')
    .populate('book', 'title isbn author publisher')
    .populate('issuedBy', 'name')
    .populate('receivedBy', 'name');

  // 检查权限：只有管理员、图书管理员或借阅者本人可以查看
  if (
    borrowing &&
    (req.user.role === 'admin' ||
      req.user.role === 'librarian' ||
      borrowing.user._id.toString() === req.user._id.toString())
  ) {
    res.json(borrowing);
  } else if (!borrowing) {
    res.status(404);
    throw new Error('借阅记录未找到');
  } else {
    res.status(403);
    throw new Error('无权限查看此借阅记录');
  }
});

// @desc    创建借阅记录
// @route   POST /api/borrowings
// @access  Private/Librarian
const createBorrowing = asyncHandler(async (req, res) => {
  const { userId, bookId, dueDate } = req.body;

  // 检查图书是否存在且可借阅
  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error('图书未找到');
  }

  if (book.availableCopies <= 0) {
    res.status(400);
    throw new Error('图书已无可借阅副本');
  }

  // 检查用户是否存在
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('用户未找到');
  }

  // 检查用户是否已借此书
  const alreadyBorrowed = await Borrowing.findOne({
    user: userId,
    book: bookId,
    status: { $in: ['borrowed', 'renewed'] },
  });

  if (alreadyBorrowed) {
    res.status(400);
    throw new Error('用户已借阅此图书');
  }

  // 创建借阅记录
  const borrowing = await Borrowing.create({
    user: userId,
    book: bookId,
    dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 默认30天
    issuedBy: req.user._id,
    status: 'borrowed',
  });

  if (borrowing) {
    // 更新图书可借阅数量
    book.availableCopies -= 1;
    await book.save();

    // 更新用户借阅列表
    user.borrowedBooks.push(borrowing._id);
    await user.save();

    // 返回借阅记录
    const populatedBorrowing = await Borrowing.findById(borrowing._id)
      .populate('user', 'name studentId')
      .populate('book', 'title isbn author')
      .populate('issuedBy', 'name');

    res.status(201).json(populatedBorrowing);
  } else {
    res.status(400);
    throw new Error('创建借阅记录失败');
  }
});

// @desc    归还图书
// @route   PUT /api/borrowings/:id/return
// @access  Private/Librarian
const returnBook = asyncHandler(async (req, res) => {
  const borrowing = await Borrowing.findById(req.params.id);

  if (!borrowing) {
    res.status(404);
    throw new Error('借阅记录未找到');
  }

  if (borrowing.status === 'returned') {
    res.status(400);
    throw new Error('此图书已归还');
  }

  // 获取图书信息
  const book = await Book.findById(borrowing.book);
  if (!book) {
    res.status(404);
    throw new Error('图书未找到');
  }

  // 更新借阅记录
  borrowing.status = 'returned';
  borrowing.returnDate = new Date();
  borrowing.receivedBy = req.user._id;

  // 检查是否逾期并计算罚款
  if (borrowing.isOverdue()) {
    borrowing.fine = borrowing.calculateFine();
  }

  // 更新图书可借阅数量
  book.availableCopies += 1;
  await book.save();

  // 更新用户借阅列表
  const user = await User.findById(borrowing.user);
  if (user) {
    user.borrowedBooks = user.borrowedBooks.filter(
      (id) => id.toString() !== borrowing._id.toString()
    );
    await user.save();
  }

  const updatedBorrowing = await borrowing.save();

  const populatedBorrowing = await Borrowing.findById(updatedBorrowing._id)
    .populate('user', 'name studentId')
    .populate('book', 'title isbn author')
    .populate('issuedBy', 'name')
    .populate('receivedBy', 'name');

  res.json(populatedBorrowing);
});

// @desc    续借图书
// @route   PUT /api/borrowings/:id/renew
// @access  Private
const renewBook = asyncHandler(async (req, res) => {
  const borrowing = await Borrowing.findById(req.params.id);

  if (!borrowing) {
    res.status(404);
    throw new Error('借阅记录未找到');
  }

  // 检查是否是借阅者本人或管理员/图书管理员
  if (
    !(
      req.user.role === 'admin' ||
      req.user.role === 'librarian' ||
      borrowing.user.toString() === req.user._id.toString()
    )
  ) {
    res.status(403);
    throw new Error('无权续借此图书');
  }

  if (borrowing.status !== 'borrowed' && borrowing.status !== 'renewed') {
    res.status(400);
    throw new Error('此图书状态不可续借');
  }

  // 检查是否已经续借过多次
  const MAX_RENEW_COUNT = 2; // 最多续借次数
  if (borrowing.renewCount >= MAX_RENEW_COUNT) {
    res.status(400);
    throw new Error(`此图书已续借${MAX_RENEW_COUNT}次，不可再续借`);
  }

  // 检查是否已逾期
  if (borrowing.isOverdue()) {
    res.status(400);
    throw new Error('此图书已逾期，请先归还');
  }

  // 更新借阅记录
  borrowing.status = 'renewed';
  borrowing.renewCount += 1;
  
  // 延长归还日期（15天）
  const currentDueDate = new Date(borrowing.dueDate);
  currentDueDate.setDate(currentDueDate.getDate() + 15);
  borrowing.dueDate = currentDueDate;

  const updatedBorrowing = await borrowing.save();

  const populatedBorrowing = await Borrowing.findById(updatedBorrowing._id)
    .populate('user', 'name studentId')
    .populate('book', 'title isbn author')
    .populate('issuedBy', 'name');

  res.json(populatedBorrowing);
});

module.exports = {
  getBorrowings,
  getBorrowingById,
  createBorrowing,
  returnBook,
  renewBook,
  getUserBorrowings,
  getOverdueBorrowings,
}; 