import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!title || !author || !description || !genre || !publicationYear) {
      setError('Please provide all required fields (title, author, description, genre, publication year).');
      return;
    }

    const yearNum = Number(publicationYear);
    if (isNaN(yearNum) || yearNum <= 0 || !Number.isInteger(yearNum)) {
      setError('Publication year must be a valid positive integer.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/books', {
        title: title.trim(),
        author: author.trim(),
        description: description.trim(),
        genre: genre.trim(),
        coverImageUrl: coverImageUrl.trim(),
        publicationYear: yearNum
      });

      // Navigate to details page of the newly created book
      navigate(`/books/${response.data._id}`);
    } catch (err) {
      console.error('Error adding book:', err);
      const msg = err.response?.data?.message || 'Failed to add book. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '25px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Add New Book</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px', backgroundColor: '#fff2f0', border: '1px solid #ffccc7', padding: '8px', borderRadius: '4px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #d9d9d9', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="author" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Author *</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={loading}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #d9d9d9', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="genre" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Genre *</label>
          <input
            type="text"
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            disabled={loading}
            placeholder="Fiction, Classics, Science Fiction, etc."
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #d9d9d9', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="publicationYear" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Publication Year *</label>
          <input
            type="number"
            id="publicationYear"
            value={publicationYear}
            onChange={(e) => setPublicationYear(e.target.value)}
            disabled={loading}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #d9d9d9', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="coverImageUrl" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Cover Image URL (Optional)</label>
          <input
            type="text"
            id="coverImageUrl"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            disabled={loading}
            placeholder="http://example.com/cover.jpg"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #d9d9d9', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows="5"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #d9d9d9', borderRadius: '4px', resize: 'vertical' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '10px', backgroundColor: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px' }}
        >
          {loading ? 'Adding Book...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
