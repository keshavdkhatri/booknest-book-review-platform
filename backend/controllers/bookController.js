const Book = require('../models/Book');
const Review = require('../models/Review');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('owner', '_id username');
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: 'Server error retrieving books', error: error.message });
  }
};

// @desc    Get a single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('owner', '_id username');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.status(200).json(book);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }
    return res.status(500).json({ message: 'Server error retrieving book', error: error.message });
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
  try {
    const { title, author, description, genre, coverImageUrl, publicationYear } = req.body;

    // Validation
    if (!title || !author || !description || !genre || !publicationYear) {
      return res.status(400).json({ message: 'Please provide all required fields (title, author, description, genre, publicationYear)' });
    }

    const book = await Book.create({
      title,
      author,
      description,
      genre,
      coverImageUrl: coverImageUrl || '',
      publicationYear,
      owner: req.user._id
    });

    return res.status(201).json(book);
  } catch (error) {
    return res.status(500).json({ message: 'Server error creating book', error: error.message });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
  try {
    const { title, author, description, genre, coverImageUrl, publicationYear } = req.body;

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Authorization: User must be the owner of the book
    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }

    book.title = title !== undefined ? title : book.title;
    book.author = author !== undefined ? author : book.author;
    book.description = description !== undefined ? description : book.description;
    book.genre = genre !== undefined ? genre : book.genre;
    book.coverImageUrl = coverImageUrl !== undefined ? coverImageUrl : book.coverImageUrl;
    book.publicationYear = publicationYear !== undefined ? publicationYear : book.publicationYear;

    const updatedBook = await book.save();
    return res.status(200).json(updatedBook);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }
    return res.status(500).json({ message: 'Server error updating book', error: error.message });
  }
};

// @desc    Delete a book and its reviews (Cascade Deletion)
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Authorization: User must be the owner of the book
    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    // Delete the book itself
    await Book.findByIdAndDelete(req.params.id);

    // Cascade delete: delete all reviews associated with this book
    await Review.deleteMany({ book: req.params.id });

    return res.status(200).json({ message: 'Book and its reviews deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }
    return res.status(500).json({ message: 'Server error deleting book', error: error.message });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
