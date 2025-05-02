const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// @desc    注册新用户
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, studentId, email, password, department, phone } = req.body;

  // 检查用户是否已存在
  const userExistsByEmail = await User.findOne({ email });
  const userExistsByStudentId = await User.findOne({ studentId });

  if (userExistsByEmail) {
    res.status(400);
    throw new Error('该邮箱已被注册');
  }

  if (userExistsByStudentId) {
    res.status(400);
    throw new Error('该学号/工号已被注册');
  }

  // 创建新用户
  const user = await User.create({
    name,
    studentId,
    email,
    password,
    department,
    phone,
    role: 'student', // 默认为学生角色
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      studentId: user.studentId,
      email: user.email,
      department: user.department,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('无效的用户数据');
  }
});

// @desc    用户登录
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 查找用户
  const user = await User.findOne({ email });

  // 检查用户和密码
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      studentId: user.studentId,
      email: user.email,
      department: user.department,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('邮箱或密码错误');
  }
});

// @desc    获取用户个人资料
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('borrowedBooks');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('用户不存在');
  }
});

// @desc    更新用户个人资料
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.department = req.body.department || user.department;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      studentId: updatedUser.studentId,
      email: updatedUser.email,
      department: updatedUser.department,
      phone: updatedUser.phone,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('用户不存在');
  }
});

// @desc    获取所有用户
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    获取用户通过ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('borrowedBooks');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('用户不存在');
  }
});

// @desc    更新用户
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.department = req.body.department || user.department;
    user.phone = req.body.phone || user.phone;
    user.role = req.body.role || user.role;
    user.isActive = req.body.isActive === undefined ? user.isActive : req.body.isActive;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      studentId: updatedUser.studentId,
      email: updatedUser.email,
      department: updatedUser.department,
      phone: updatedUser.phone,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    });
  } else {
    res.status(404);
    throw new Error('用户不存在');
  }
});

// @desc    删除用户
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: '用户已删除' });
  } else {
    res.status(404);
    throw new Error('用户不存在');
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
}; 