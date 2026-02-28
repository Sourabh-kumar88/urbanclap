import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { formatTime12Hour } from '../utils/formatters';
import API_URL from '../config/api';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchBookings();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/providers/me/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookings/provider/${user.id}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await axios.put(`${API_URL}/bookings/${bookingId}`, { status });
      fetchBookings();
      fetchStats();
    } catch (error) {
      alert('Failed to update booking status');
    }
  };

  const getStatusClass = (status) => {
    return `booking-status status-${status}`;
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-welcome">Welcome back, {user?.name}</h1>
          <p className="page-subtitle">Manage your jobs and bookings</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Jobs</div>
            <div className="stat-value">{stats?.totalBookings || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{stats?.pendingBookings || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{stats?.completedBookings || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Rating</div>
            <div className="stat-value">{stats?.rating || 0} ⭐</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-2 mb-4">
          <Link to="/provider/settings" className="card" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>⚙️</div>
            <h3 style={{ marginBottom: '8px' }}>Profile Settings</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Update your profile and availability
            </p>
          </Link>
          <Link to="/providers" className="card" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>👥</div>
            <h3 style={{ marginBottom: '8px' }}>View All Providers</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              See other service providers
            </p>
          </Link>
        </div>

        {/* Pending Jobs */}
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="card-title">Pending Requests</h3>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="loader" style={{ margin: '0 auto' }}></div>
            </div>
          ) : (
            <div>
              {bookings.filter(b => b.status === 'pending').length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                  No pending requests
                </p>
              ) : (
                bookings.filter(b => b.status === 'pending').map((booking) => (
                  <div key={booking._id} style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ marginBottom: '8px' }}>{booking.serviceId?.name || 'Service'}</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          👤 {booking.customerId?.name}
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          📍 {booking.location}
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          📅 {new Date(booking.date).toLocaleDateString()} at {formatTime12Hour(booking.time)}
                        </p>
                        {booking.description && (
                          <p style={{ fontSize: '0.9rem', marginTop: '8px', color: 'var(--text-secondary)' }}>
                            "{booking.description}"
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleStatusUpdate(booking._id, 'accepted')}
                        >
                          Accept
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* All Jobs */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">All Jobs</h3>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="loader" style={{ margin: '0 auto' }}></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3 className="empty-title">No jobs yet</h3>
              <p className="empty-text">Jobs will appear here when customers book your services</p>
            </div>
          ) : (
            <div>
              {bookings.slice(0, 10).map((booking) => (
                <div key={booking._id} className="booking-card" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="booking-info">
                    <h4 className="booking-title">
                      {booking.serviceId?.name || 'Service'}
                    </h4>
                    <div className="booking-meta">
                      <span>👤 {booking.customerId?.name}</span>
                      <span>📅 {new Date(booking.date).toLocaleDateString()}</span>
                      <span>📍 {booking.location}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {booking.status === 'accepted' && (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleStatusUpdate(booking._id, 'completed')}
                      >
                        Mark Complete
                      </button>
                    )}
                    <span className={getStatusClass(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
