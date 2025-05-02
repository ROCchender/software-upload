const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getUsers,
  getUserProfile,
  updateUserProfile,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// 公共路由
router.post('/register', registerUser);
router.post('/login', loginUser);

// 需要权限的路由
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// 管理员路由
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router; 