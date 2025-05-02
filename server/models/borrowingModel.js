const mongoose = require('mongoose');

const borrowingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '请选择借书用户']
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, '请选择借阅图书']
    },
    borrowDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: [true, '请设置归还日期']
    },
    returnDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['borrowed', 'returned', 'overdue', 'renewed', 'lost'],
      default: 'borrowed'
    },
    renewCount: {
      type: Number,
      default: 0
    },
    fine: {
      type: Number,
      default: 0
    },
    remarks: {
      type: String
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// 计算是否逾期
borrowingSchema.methods.isOverdue = function() {
  if (this.returnDate) {
    return false;
  }
  return new Date() > this.dueDate;
};

// 计算逾期天数
borrowingSchema.methods.getOverdueDays = function() {
  if (this.returnDate || new Date() <= this.dueDate) {
    return 0;
  }
  
  const timeDiff = Math.abs(new Date() - this.dueDate);
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

// 计算罚款
borrowingSchema.methods.calculateFine = function(finePerDay = 0.5) {
  const overdueDays = this.getOverdueDays();
  return overdueDays * finePerDay;
};

const Borrowing = mongoose.model('Borrowing', borrowingSchema);

module.exports = Borrowing; 