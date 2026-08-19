import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  
  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${id}`);
        setTitle(response.data.title);
        setAuthor(response.data.author);
        setDescription(response.data.description);
        setGenre(response.data.genre);
        setCoverImageUrl(response.data.coverImageUrl || '');
        setPublicationYear(response.data.publicationYear);
      } catch (err) {
        console.error('Error fetching book details for edit:', err);
        const msg = err.response?.data?.message || 'Failed to load book data. It may not exist or the ID is invalid.';
        setError(msg);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!title || !author || !description || !genre || !publicationYear) {
      setError('Please provide all required fields.');
      return;
    }

    const yearNum = Number(publicationYear);
    if (isNaN(yearNum) || yearNum <= 0 || !Number.isInteger(yearNum)) {
      setError('Publication year must be a valid positive integer.');
      return;
    }

    setSubmitLoading(true);

    try {
      await api.put(`/books/${id}`, {
        title: title.trim(),
        author: author.trim(),
        description: description.trim(),
        genre: genre.trim(),
        coverImageUrl: coverImageUrl.trim(),
        publicationYear: yearNum
      });

      // Redirect to the updated details page
      navigate(`/books/${id}`);
    } catch (err) {
      console.error('Error updating book details:', err);
      const msg = err.response?.data?.message || 'Failed to update book. Please check credentials or permissions.';
      setError(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h3>Loading book details for edit...</h3>
      </div>
    );
  }

  if (error && !title) {
    return (
      <div style={{ color: 'red', textAlign: 'center', marginTop: '50px', backgroundColor: '#fff2f0', border: '1px solid #ffccc7', padding: '20px', borderRadius: '4px', maxWidth: '600px', margin: '50px auto' }}>
        <h3>Error Editing Book</h3>
        <p>{error}</p>
        <Link to="/" style={{ color: '#1890ff', textDecoration: 'none', fontWeight: 'bold' }}>Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '25px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Edit Book Details</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px', backgroundColor: '#fff2f0', border: '1px solid #ffccc7', padding: '8px', borderRadius: '4px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitLoading}
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
            disabled={submitLoading}
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
            disabled={submitLoading}
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
            disabled={submitLoading}
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
            disabled={submitLoading}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #d9d9d9', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitLoading}
            rows="5"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #d9d9d9', borderRadius: '4px', resize: 'vertical' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            type="submit"
            disabled={submitLoading}
            style={{ flexGrow: 1, padding: '10px', backgroundColor: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: submitLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px' }}
          >
            {submitLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/books/${id}`)}
            disabled={submitLoading}
            style={{ padding: '10px 20px', backgroundColor: '#f5f5f5', border: '1px solid #d9d9d9', borderRadius: '4px', cursor: submitLoading ? 'not-allowed' : 'pointer', color: '#333' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBook;
