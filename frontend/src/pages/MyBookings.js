import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { formatTime12Hour } from '../utils/formatters';
import API_URL from '../config/api';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewedBookings, setReviewedBookings] = useState({});

  useEffect(() => {
    if (user) {
      fetchBookings();
      if (user.role === 'customer') {
        fetchMyReviews();
      }
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const endpoint = user.role === 'provider' 
        ? `/bookings/provider/${user.id}`
        : `/bookings/customer/${user.id}`;
      const response = await axios.get(`${API_URL}${endpoint}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/reviews/customer/${user.id}`);
      const reviewMap = {};
      response.data.forEach(review => {
        reviewMap[review.bookingId] = review;
      });
      setReviewedBookings(reviewMap);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await axios.put(`${API_URL}/bookings/${bookingId}`, { status });
      fetchBookings();
    } catch (error) {
      alert('Failed to update booking');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      await axios.post(`${API_URL}/reviews`, {
        bookingId: selectedBooking._id,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      alert('Review submitted successfully!');
      setShowReviewModal(false);
      setSelectedBooking(null);
      fetchBookings();
      fetchMyReviews();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const getStatusClass = (status) => `booking-status status-${status}`;

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="page-title">{user?.role === 'provider' ? 'My Jobs' : 'My Bookings'}</h1>
          <p className="page-subtitle">View and manage your bookings</p>
        </div>

        {/* Filters */}
        <div className="tabs">
          <button 
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({bookings.length})
          </button>
          <button 
            className={`tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({bookings.filter(b => b.status === 'pending').length})
          </button>
          <button 
            className={`tab ${filter === 'accepted' ? 'active' : ''}`}
            onClick={() => setFilter('accepted')}
          >
            Accepted ({bookings.filter(b => b.status === 'accepted').length})
          </button>
          <button 
            className={`tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({bookings.filter(b => b.status === 'completed').length})
          </button>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="loader" style={{ margin: '0 auto' }}></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3 className="empty-title">No bookings found</h3>
            <p className="empty-text">
              {user?.role === 'customer' 
                ? 'Start by booking a service provider'
                : 'No jobs yet. Wait for customers to book your services.'}
            </p>
            {user?.role === 'customer' && (
              <Link to="/providers" className="btn btn-primary">Find Providers</Link>
            )}
          </div>
        ) : (
          <div className="card">
            {filteredBookings.map((booking) => (
              <div key={booking._id} style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '8px' }}>
                      {booking.serviceId?.name || 'Service'}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      {user?.role === 'provider' 
                        ? `👤 Customer: ${booking.customerId?.name}`
                        : `👤 Provider: ${booking.providerId?.name}`}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      📅 {new Date(booking.date).toLocaleDateString()} at {formatTime12Hour(booking.time)}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      📍 {booking.location}
                    </p>
                    {booking.description && (
                      <p style={{ marginTop: '12px', padding: '12px', background: 'var(--background)', borderRadius: '8px', fontSize: '0.9rem' }}>
                        "{booking.description}"
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    <span className={getStatusClass(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    
                    {/* Customer Actions */}
                    {user?.role === 'customer' && booking.status === 'completed' && (
                      reviewedBookings[booking._id] ? (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#F59E0B', fontSize: '16px' }}>
                            {'★'.repeat(reviewedBookings[booking._id].rating)}
                            {'☆'.repeat(5 - reviewedBookings[booking._id].rating)}
                          </div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Reviewed
                          </span>
                        </div>
                      ) : (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setReviewData({ rating: 5, comment: '' });
                            setShowReviewModal(true);
                          }}
                        >
                          Leave Review
                        </button>
                      )
                    )}

                    {/* Provider Actions */}
                    {user?.role === 'provider' && booking.status === 'pending' && (
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
                    )}

                    {user?.role === 'provider' && booking.status === 'accepted' && (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleStatusUpdate(booking._id, 'completed')}
                      >
                        Mark Complete
                      </button>
                    )}

                    {/* Cancel for customer */}
                    {user?.role === 'customer' && booking.status === 'pending' && (
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && selectedBooking && (
          <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Leave a Review</h3>
                <button className="modal-close" onClick={() => setShowReviewModal(false)}>×</button>
              </div>
              <form onSubmit={handleReviewSubmit}>
                <div className="modal-body">
                  {/* Booking Info */}
                  <div style={{ 
                    padding: '16px', 
                    background: 'var(--background)', 
                    borderRadius: '8px', 
                    marginBottom: '20px' 
                  }}>
                    <p style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {selectedBooking.serviceId?.name || 'Service'}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Provider: {selectedBooking.providerId?.name || 'Unknown'}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      📅 {new Date(selectedBooking.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">How was your experience?</label>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', padding: '10px 0' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewData({ ...reviewData, rating: star })}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            fontSize: '32px', 
                            cursor: 'pointer',
                            color: star <= reviewData.rating ? '#F59E0B' : '#E5E5E5',
                            transition: 'transform 0.1s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {reviewData.rating === 1 && 'Poor'}
                      {reviewData.rating === 2 && 'Fair'}
                      {reviewData.rating === 3 && 'Good'}
                      {reviewData.rating === 4 && 'Very Good'}
                      {reviewData.rating === 5 && 'Excellent'}
                    </p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tell us more (optional)</label>
                    <textarea
                      className="form-textarea"
                      placeholder="What did you like? Any suggestions for improvement?"
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      style={{ minHeight: '100px' }}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowReviewModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={reviewLoading}>
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
