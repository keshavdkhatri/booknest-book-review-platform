import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // If restoring auth session, show a simple loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <h3>Loading authentication session...</h3>
      </div>
    );
  }

  // If not authenticated, redirect to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render children or nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
