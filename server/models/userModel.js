const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '请输入姓名'],
    },
    studentId: {
      type: String,
      required: [true, '请输入学号/工号'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, '请输入邮箱'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        '请输入有效的邮箱'
      ]
    },
    password: {
      type: String,
      required: [true, '请输入密码'],
      minlength: [6, '密码至少6位字符']
    },
    role: {
      type: String,
      enum: ['student', 'librarian', 'admin'],
      default: 'student'
    },
    department: {
      type: String,
      required: [true, '请输入院系']
    },
    phone: {
      type: String
    },
    borrowedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Borrowing'
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// 密码加密
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 密码验证
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 