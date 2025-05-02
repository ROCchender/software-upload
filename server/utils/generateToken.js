const jwt = require('jsonwebtoken');

// 生成JWT令牌的函数
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken; 