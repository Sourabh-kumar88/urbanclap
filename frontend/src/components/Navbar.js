import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
          <polyline points="9,22 9,12 15,12 15,22"></polyline>
        </svg>
        ServiceHub
      </Link>

      <div className="navbar-menu">
        <div className="navbar-links">
          <Link to="/services" className={isActive('/services') ? 'active' : ''}>Services</Link>
          <Link to="/providers" className={isActive('/providers') ? 'active' : ''}>Providers</Link>
        </div>

        {user ? (
          <div className="navbar-dropdown">
            <button 
              className="navbar-dropdown-toggle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {user.name}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
            
            {dropdownOpen && (
              <div className="navbar-dropdown-menu">
                {user.role === 'customer' && (
                  <>
                    <Link to="/customer/dashboard" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                    <Link to="/bookings" onClick={() => setDropdownOpen(false)}>My Bookings</Link>
                    <Link to="/post-job" onClick={() => setDropdownOpen(false)}>Post a Job</Link>
                  </>
                )}
                {user.role === 'provider' && (
                  <>
                    <Link to="/provider/dashboard" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                    <Link to="/provider/settings" onClick={() => setDropdownOpen(false)}>Settings</Link>
                    <Link to="/bookings" onClick={() => setDropdownOpen(false)}>My Jobs</Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)}>Admin Dashboard</Link>
                )}
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="navbar-user">
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
