import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#f0f2f5', borderBottom: '1px solid #ccc' }}>
      <div>
        <Link to="/" style={{ marginRight: '20px', fontWeight: 'bold', textDecoration: 'none', color: '#1890ff' }}>BookNest Logo</Link>
        <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>Home</Link>
      </div>
      <div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '15px' }}>Welcome, <strong>{user.username}</strong></span>
            <Link to="/add-book" style={{ marginRight: '15px', textDecoration: 'none', color: '#333' }}>Add Book</Link>
            <button onClick={handleLogout} style={{ padding: '4px 8px', cursor: 'pointer' }}>Logout</button>
          </div>
        ) : (
          <div>
            <Link to="/login" style={{ marginRight: '15px', textDecoration: 'none', color: '#333' }}>Login</Link>
            <Link to="/register" style={{ textDecoration: 'none', color: '#333' }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
