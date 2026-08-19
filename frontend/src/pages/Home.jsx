import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books');
        setBooks(response.data);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Please ensure your backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h3>Loading books catalog...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'red', textAlign: 'center', marginTop: '50px', backgroundColor: '#fff2f0', border: '1px solid #ffccc7', padding: '15px', borderRadius: '4px', maxWidth: '600px', margin: '50px auto' }}>
        <h3>Error Loading Catalog</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', padding: '40px', border: '1px solid #e8e8e8', borderRadius: '5px', backgroundColor: '#fafafa' }}>
        <h3>No Books Available</h3>
        <p>There are no books currently cataloged in BookNest. Be the first to add one once available!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>Explore BookNest Library</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {books.map((book) => (
          <div key={book._id} style={{ border: '1px solid #e8e8e8', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {/* Book Cover Fallback */}
            {book.coverImageUrl ? (
              <img
                src={book.coverImageUrl}
                alt={book.title}
                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onError = null;
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div style={{ 
              display: book.coverImageUrl ? 'none' : 'flex', 
              width: '100%', 
              height: '220px', 
              backgroundColor: '#e6f7ff', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#1890ff' 
            }}>
              <span style={{ fontSize: '48px', marginBottom: '10px' }}>📖</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{book.genre || 'Book'}</span>
            </div>

            {/* Book Metadata */}
            <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1f1f1f', fontWeight: 'bold' }}>{book.title}</h3>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#595959' }}>By: <strong>{book.author}</strong></p>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#8c8c8c' }}>Genre: {book.genre}</p>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#8c8c8c' }}>Published: {book.publicationYear}</p>
                <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#bfbfbf' }}>Added by: {book.owner?.username || 'Unknown'}</p>
              </div>
              <Link
                to={`/books/${book._id}`}
                style={{ display: 'block', textAlign: 'center', padding: '8px 16px', backgroundColor: '#1890ff', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px', transition: 'background-color 0.3s' }}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
