# 校园图书管理系统

这是一个基于 Node.js, Express, MongoDB 和 React 的现代校园图书管理系统。

## 功能特点

- 图书管理：添加、编辑、删除和查询图书
- 用户管理：管理员、图书管理员和学生用户角色
- 借阅管理：借书、还书、续借功能
- 预约系统：图书预约功能
- 统计分析：借阅统计和图书使用情况分析
- 通知系统：到期提醒和预约通知

## 技术栈

- **后端**：Node.js, Express, MongoDB
- **前端**：React, Bootstrap
- **认证**：JWT (JSON Web Tokens)

## 项目结构

```
schoolLibrary/
├── server/            # 后端代码
│   ├── controllers/   # 控制器
│   ├── models/        # 数据模型
│   ├── routes/        # API路由
│   ├── config/        # 配置文件
│   └── server.js      # 主服务器文件
│
├── client/            # 前端代码
│   ├── public/        # 静态资源
│   ├── src/           # React源代码
│   │   ├── components/# React组件
│   │   ├── pages/     # 页面组件
│   │   ├── services/  # API服务
│   │   └── App.js     # 主应用组件
│   └── package.json   # 前端依赖
│
└── package.json       # 项目依赖
```

## 安装和运行

### 前提条件

- Node.js (v14+)
- MongoDB

### 安装步骤

1. 克隆仓库
2. 安装依赖
   ```
   npm install
   cd client && npm install
   ```
3. 配置环境变量
   - 创建 `.env` 文件在项目根目录
   - 设置必要的环境变量（MongoDB连接、JWT密钥等）

4. 运行开发服务器
   ```
   # 运行后端
   npm run server
   
   # 运行前端
   npm run client
   
   # 同时运行前端和后端
   npm run dev
   ```

## 使用指南

### 管理员账户

- 用户名: admin
- 密码: admin123

### 学生测试账户

- 用户名: student
- 密码: student123 