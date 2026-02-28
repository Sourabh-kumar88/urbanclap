import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { formatTime12Hour } from '../utils/formatters';
import API_URL from '../config/api';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookings/customer/${user.id}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    return `booking-status status-${status}`;
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-welcome">Welcome back, {user?.name}</h1>
          <p className="page-subtitle">Manage your service bookings</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Bookings</div>
            <div className="stat-value">{bookings.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{pendingBookings}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{completedBookings}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Providers Booked</div>
            <div className="stat-value">{new Set(bookings.map(b => b.providerId?._id)).size}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-3 mb-4">
          <Link to="/providers" className="card" style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
            <h3 style={{ marginBottom: '8px' }}>Find Providers</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Browse and book services
            </p>
          </Link>
          <Link to="/post-job" className="card" style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📝</div>
            <h3 style={{ marginBottom: '8px' }}>Post a Job</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Describe your job request
            </p>
          </Link>
          <Link to="/bookings" className="card" style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
            <h3 style={{ marginBottom: '8px' }}>My Bookings</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              View all your bookings
            </p>
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Bookings</h3>
            <Link to="/bookings" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="loader" style={{ margin: '0 auto' }}></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3 className="empty-title">No bookings yet</h3>
              <p className="empty-text">Start by finding a service provider</p>
              <Link to="/providers" className="btn btn-primary">Find Providers</Link>
            </div>
          ) : (
            <div>
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking._id} className="booking-card" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="booking-info">
                    <h4 className="booking-title">
                      {booking.serviceId?.name || 'Service'}
                    </h4>
                    <div className="booking-meta">
                      <span>📅 {new Date(booking.date).toLocaleDateString()}</span>
                      <span>⏰ {formatTime12Hour(booking.time)}</span>
                      <span>📍 {booking.location}</span>
                    </div>
                  </div>
                  <span className={getStatusClass(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
