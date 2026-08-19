const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true
  },
  coverImageUrl: {
    type: String,
    default: ''
  },
  publicationYear: {
    type: Number,
    required: [true, 'Publication year is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner/creator reference is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
