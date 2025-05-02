const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, '请输入图书标题'],
      trim: true
    },
    isbn: {
      type: String,
      required: [true, '请输入ISBN号'],
      unique: true,
      trim: true
    },
    author: {
      type: String,
      required: [true, '请输入作者']
    },
    publisher: {
      type: String,
      required: [true, '请输入出版社']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, '请选择图书分类']
    },
    location: {
      type: String,
      required: [true, '请输入图书位置']
    },
    publicationYear: {
      type: Number,
      required: [true, '请输入出版年份']
    },
    language: {
      type: String,
      default: '中文'
    },
    pages: {
      type: Number
    },
    cover: {
      type: String,
      default: '/uploads/default-book.jpg'
    },
    description: {
      type: String
    },
    totalCopies: {
      type: Number,
      required: [true, '请输入总库存数量'],
      default: 1
    },
    availableCopies: {
      type: Number,
      required: [true, '请输入可借阅数量'],
      default: 1
    },
    price: {
      type: Number
    },
    status: {
      type: String,
      enum: ['available', 'unavailable'],
      default: 'available'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 虚拟字段：是否可借阅
bookSchema.virtual('isAvailable').get(function() {
  return this.availableCopies > 0;
});

// 虚拟字段：借阅记录
bookSchema.virtual('borrowings', {
  ref: 'Borrowing',
  localField: '_id',
  foreignField: 'book',
  justOne: false
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book; 