const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  borrowed: { type: Boolean, default: false },
  borrowedBy: { type: String, default: '' },
  borrowDate: { type: String, default: '' }
});

module.exports = mongoose.model('Book', BookSchema);
