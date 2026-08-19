const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Get all reviews for a specific book
// @route   GET /api/reviews/book/:bookId
// @access  Public
const getReviewsForBook = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId }).populate('user', '_id username');
    return res.status(200).json(reviews);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }
    return res.status(500).json({ message: 'Server error retrieving reviews', error: error.message });
  }
};

// @desc    Create a new review for a book
// @route   POST /api/reviews/book/:bookId
// @access  Private
const createReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const bookId = req.params.bookId;

    // Validation
    if (rating === undefined || !reviewText) {
      return res.status(400).json({ message: 'Please provide rating and review text' });
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    if (reviewText.length < 10) {
      return res.status(400).json({ message: 'Review text must be at least 10 characters long' });
    }

    // Verify the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Create review
    const review = await Review.create({
      book: bookId,
      user: req.user._id,
      rating: ratingNum,
      reviewText
    });

    return res.status(201).json(review);
  } catch (error) {
    // Handle compound unique index constraint violation (Duplicate Key Error)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }
    return res.status(500).json({ message: 'Server error creating review', error: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Authorization: User must be the author of the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    if (rating !== undefined) {
      const ratingNum = Number(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
      }
      review.rating = ratingNum;
    }

    if (reviewText !== undefined) {
      if (reviewText.length < 10) {
        return res.status(400).json({ message: 'Review text must be at least 10 characters long' });
      }
      review.reviewText = reviewText;
    }

    const updatedReview = await review.save();
    return res.status(200).json(updatedReview);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid review ID format' });
    }
    return res.status(500).json({ message: 'Server error updating review', error: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Authorization: User must be the author of the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid review ID format' });
    }
    return res.status(500).json({ message: 'Server error deleting review', error: error.message });
  }
};

module.exports = {
  getReviewsForBook,
  createReview,
  updateReview,
  deleteReview
};
