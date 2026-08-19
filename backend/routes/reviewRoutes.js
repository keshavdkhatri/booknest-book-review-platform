const express = require('express');
const router = express.Router();
const { getReviewsForBook, createReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Review routes mapping
router.route('/book/:bookId')
  .get(getReviewsForBook)
  .post(protect, createReview);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
