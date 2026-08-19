import React from 'react';
import { useParams } from 'react-router-dom';

const BookDetails = () => {
  const { id } = useParams();
  return (
    <div className="page-container">
      <h1>Book Details Page (Placeholder)</h1>
      <p>Displaying details and reviews for Book ID: {id}</p>
    </div>
  );
};

export default BookDetails;
