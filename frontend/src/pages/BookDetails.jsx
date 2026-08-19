import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete states
  const [deleteBookLoading, setDeleteBookLoading] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      try {
        // Fetch book details
        const bookResponse = await api.get(`/books/${id}`);
        setBook(bookResponse.data);

        // Fetch reviews
        const reviewsResponse = await api.get(`/reviews/book/${id}`);
        setReviews(reviewsResponse.data);
      } catch (err) {
        console.error('Error fetching book/reviews:', err);
        const msg = err.response?.data?.message || 'Failed to load details. The book ID may be invalid or it does not exist.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndReviews();
  }, [id]);

  // Handle Book Deletion
  const handleDeleteBook = async () => {
    if (!window.confirm('Are you sure you want to delete this book? This will permanently remove all associated reviews.')) {
      return;
    }

    setDeleteBookLoading(true);
    setError('');

    try {
      await api.delete(`/books/${id}`);
      // Redirect to Home catalog page on success
      navigate('/');
    } catch (err) {
      console.error('Error deleting book:', err);
      const msg = err.response?.data?.message || 'Failed to delete book. Please try again.';
      setError(msg);
      setDeleteBookLoading(false);
    }
  };

  // Handle Review Deletion
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) {
      return;
    }

    setDeletingReviewId(reviewId);

    try {
      await api.delete(`/reviews/${reviewId}`);
      // State updates: remove from state immediately
      setReviews((prevReviews) => prevReviews.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
      alert(err.response?.data?.message || 'Failed to delete review. Please try again.');
    } finally {
      setDeletingReviewId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h3>Loading book details...</h3>
      </div>
    );
  }

  if (error && !book) {
    return (
      <div style={{ color: 'red', textAlign: 'center', marginTop: '50px', backgroundColor: '#fff2f0', border: '1px solid #ffccc7', padding: '20px', borderRadius: '4px', maxWidth: '600px', margin: '50px auto' }}>
        <h3>Error Loading Book</h3>
        <p>{error}</p>
        <Link to="/" style={{ color: '#1890ff', textDecoration: 'none', fontWeight: 'bold' }}>Back to Catalog</Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h3>Book Not Found</h3>
        <p>The requested book could not be found.</p>
        <Link to="/" style={{ color: '#1890ff', textDecoration: 'none', fontWeight: 'bold' }}>Back to Catalog</Link>
      </div>
    );
  }

  // Resolve ownership flags
  const isBookOwner = user && book && book.owner && (book.owner._id === user._id || book.owner === user._id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Header Back & Edit/Delete Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#1890ff', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Catalog</Link>
        
        {isBookOwner && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link 
              to={`/books/${book._id}/edit`} 
              style={{ 
                padding: '6px 12px', 
                backgroundColor: '#f5f5f5', 
                border: '1px solid #d9d9d9', 
                borderRadius: '4px', 
                textDecoration: 'none', 
                color: '#333', 
                fontWeight: 'bold', 
                fontSize: '13px',
                pointerEvents: deleteBookLoading ? 'none' : 'auto',
                opacity: deleteBookLoading ? 0.6 : 1
              }}
            >
              Edit Book
            </Link>
            <button 
              onClick={handleDeleteBook} 
              disabled={deleteBookLoading}
              style={{ 
                padding: '6px 12px', 
                backgroundColor: '#ff4d4f', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '4px', 
                fontWeight: 'bold', 
                fontSize: '13px', 
                cursor: deleteBookLoading ? 'not-allowed' : 'pointer' 
              }}
            >
              {deleteBookLoading ? 'Deleting...' : 'Delete Book'}
            </button>
          </div>
        )}
      </div>

      {/* Book Metadata Information Card */}
      <div style={{ display: 'flex', gap: '30px', border: '1px solid #e8e8e8', borderRadius: '8px', padding: '25px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', flexWrap: 'wrap' }}>
        {/* Cover image container */}
        <div style={{ flexShrink: 0, width: '200px', margin: '0 auto' }}>
          {book.coverImageUrl ? (
            <img src={book.coverImageUrl} alt={book.title} style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          ) : (
            <div style={{ width: '100%', height: '280px', backgroundColor: '#e6f7ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#1890ff', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '64px', marginBottom: '10px' }}>📖</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{book.genre || 'Book'}</span>
            </div>
          )}
        </div>

        {/* Text descriptions */}
        <div style={{ flexGrow: 1, flexBasis: '400px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#1f1f1f' }}>{book.title}</h1>
          <p style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#595959' }}>By <strong>{book.author}</strong></p>
          
          <div style={{ margin: '0 0 20px 0' }}>
            <span style={{ backgroundColor: '#f5f5f5', padding: '4px 8px', borderRadius: '4px', marginRight: '10px', fontSize: '13px', color: '#595959', border: '1px solid #e8e8e8' }}>{book.genre}</span>
            <span style={{ backgroundColor: '#f5f5f5', padding: '4px 8px', borderRadius: '4px', fontSize: '13px', color: '#595959', border: '1px solid #e8e8e8' }}>Published: {book.publicationYear}</span>
          </div>

          <h4 style={{ margin: '0 0 8px 0', color: '#262626' }}>Description</h4>
          <p style={{ margin: '0 0 20px 0', lineHeight: '1.6', color: '#434343' }}>{book.description}</p>
          
          <p style={{ margin: '0', fontSize: '13px', color: '#8c8c8c', borderTop: '1px solid #f0f0f0', paddingTop: '15px' }}>
            Listing created by: <strong>{book.owner?.username || 'Unknown'}</strong>
          </p>
        </div>
      </div>

      {/* Reviews Display Card */}
      <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '25px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: '0 0 20px 0', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px', color: '#1f1f1f' }}>User Reviews</h2>
        {reviews.length === 0 ? (
          <div style={{ padding: '20px 0', color: '#8c8c8c', textAlign: 'center' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>No reviews yet for this book.</p>
            <p style={{ margin: '0', fontSize: '14px' }}>Once review submissions are active, you can be the first to rate and write one!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {reviews.map((review, index) => {
              const isReviewAuthor = user && review.user && (review.user._id === user._id || review.user === user._id);
              const isDeletingThisReview = deletingReviewId === review._id;

              return (
                <div 
                  key={review._id} 
                  style={{ 
                    borderBottom: index === reviews.length - 1 ? 'none' : '1px solid #f0f0f0', 
                    paddingBottom: index === reviews.length - 1 ? '0' : '15px',
                    marginBottom: index === reviews.length - 1 ? '0' : '5px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 'bold', color: '#262626' }}>{review.user?.username || 'Anonymous'}</span>
                      <span style={{ color: '#fadb14', fontSize: '16px', fontWeight: 'bold', marginTop: '2px' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        <span style={{ marginLeft: '5px', color: '#595959', fontSize: '14px', fontWeight: 'normal' }}>({review.rating}/5)</span>
                      </span>
                    </div>
                    {isReviewAuthor && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        disabled={deletingReviewId !== null}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#ff7875',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: deletingReviewId !== null ? 'not-allowed' : 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        {isDeletingThisReview ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                  <p style={{ margin: '0', lineHeight: '1.5', color: '#434343' }}>{review.reviewText}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
