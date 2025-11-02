import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Navbar({ user }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          IMDb
        </Link>
        
        <button className="navbar-toggler" onClick={toggleMenu}>
          <i className="bi bi-list"></i>
        </button>

        <ul className={`navbar-nav ${isOpen ? 'show' : ''}`}>
          <li className="nav-item">
            <Link className="nav-link" to="/" onClick={() => setIsOpen(false)}>
              <i className="bi bi-house-fill me-1"></i>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/search" onClick={() => setIsOpen(false)}>
              <i className="bi bi-search me-1"></i>
              Search
            </Link>
          </li>
          {user ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard" onClick={() => setIsOpen(false)}>
                  <i className="bi bi-person-circle me-1"></i>
                  My Reviews
                </Link>
              </li>
              <li className="nav-item">
                <span className="text-warning me-2">
                  {user.displayName || user.email}
                </span>
                <button className="btn btn-sm btn-outline-warning" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="btn btn-sm btn-outline-warning me-2" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="btn btn-sm btn-warning" onClick={() => setIsOpen(false)}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;