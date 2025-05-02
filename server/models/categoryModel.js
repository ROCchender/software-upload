const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '请输入分类名称'],
      unique: true,
      trim: true
    },
    description: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// 删除分类前检查是否有关联的图书
categorySchema.pre('remove', async function(next) {
  const Book = mongoose.model('Book');
  const booksCount = await Book.countDocuments({ category: this._id });
  
  if (booksCount > 0) {
    const error = new Error(`该分类下有${booksCount}本书，无法删除`);
    return next(error);
  }
  
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category; 