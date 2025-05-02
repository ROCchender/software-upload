const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// 保护路由中间件
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 从请求头中获取token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 获取token部分
      token = req.headers.authorization.split(' ')[1];

      // 验证token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 获取用户信息
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('用户不存在');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('未授权，token无效');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('未授权，无token');
  }
});

// 管理员中间件
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('只有管理员可以访问此资源');
  }
};

// 图书管理员中间件
const librarian = (req, res, next) => {
  if (req.user && (req.user.role === 'librarian' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403);
    throw new Error('只有图书管理员或管理员可以访问此资源');
  }
};

module.exports = { protect, admin, librarian }; 