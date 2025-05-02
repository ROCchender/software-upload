const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

// 加载环境变量
dotenv.config();

// 连接数据库
connectDB();

const app = express();

// 中间件
app.use(express.json());
app.use(cors());

// 开发环境下的日志
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 路由
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/borrowings', require('./routes/borrowingRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// 404处理
app.use((req, res, next) => {
  res.status(404).json({ message: '未找到请求的资源' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || '服务器发生错误',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// 配置端口
const PORT = process.env.PORT || 5000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 ${process.env.NODE_ENV} 模式, 端口: ${PORT}`);
}); 