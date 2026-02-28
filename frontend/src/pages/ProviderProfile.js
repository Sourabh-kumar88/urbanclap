import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import API_URL from '../config/api';

const ProviderProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    serviceId: '',
    description: '',
    date: '',
    time: '',
    location: '',
    notes: ''
  });
  const [services, setServices] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchProvider();
    fetchServices();
  }, [id]);

  const fetchProvider = async () => {
    try {
      const response = await axios.get(`${API_URL}/providers/${id}`);
      setProvider(response.data.provider);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching provider:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      await axios.post(`${API_URL}/bookings`, {
        providerId: provider.userId._id,
        ...bookingData
      });
      alert('Booking created successfully!');
      setShowBookingModal(false);
      navigate('/bookings');
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="loader" style={{ margin: '0 auto' }}></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Provider not found</h2>
        <Link to="/providers" className="btn btn-primary mt-3">Back to Providers</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {provider.userId?.name?.charAt(0) || 'P'}
          </div>
          <div className="profile-details">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 className="profile-name">{provider.userId?.name || 'Unknown'}</h1>
              {provider.isVerified && (
                <span className="badge badge-verified">Verified</span>
              )}
            </div>
            <p className="profile-location">
              📍 {provider.userId?.location || provider.serviceArea || 'Location not specified'}
            </p>
            <div className="profile-stats">
              <div className="profile-stat">
                <div className="profile-stat-value">{renderStars(provider.rating || 0)}</div>
                <div className="profile-stat-label">{provider.rating || 0} Rating</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{provider.totalReviews || 0}</div>
                <div className="profile-stat-label">Reviews</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{provider.experience || 0}</div>
                <div className="profile-stat-label">Years Exp.</div>
              </div>
              {provider.hourlyRate && (
                <div className="profile-stat">
                  <div className="profile-stat-value">{formatCurrency(provider.hourlyRate)}</div>
                  <div className="profile-stat-label">Per Hour</div>
                </div>
              )}
            </div>
            <p className="profile-bio">{provider.bio || 'No bio available'}</p>
            <div className="profile-actions">
              {user && user.role === 'customer' && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowBookingModal(true)}
                >
                  Book Now
                </button>
              )}
              <Link to="/providers" className="btn btn-secondary">Back</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Skills & Categories */}
      <div className="grid grid-2 mb-4">
        <div className="card">
          <h3 className="card-title mb-3">Categories</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {provider.categories?.map((cat, idx) => (
              <span key={idx} className="skill-tag">{cat}</span>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="card-title mb-3">Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {provider.skills?.map((skill, idx) => (
              <span key={idx} className="skill-tag">{skill}</span>
            )) || <span style={{ color: 'var(--text-secondary)' }}>No skills listed</span>}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="card">
        <h3 className="card-title mb-3">Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No reviews yet</p>
        ) : (
          <div>
            {reviews.map((review) => (
              <div key={review._id} className="review-card" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="review-header">
                  <div>
                    <span className="review-author">{review.customerId?.name || 'Anonymous'}</span>
                    <span className="review-date" style={{ marginLeft: '12px' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="review-rating">{renderStars(review.rating)}</span>
                </div>
                <p className="review-comment">{review.comment || 'No comment'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Book Service</h3>
              <button className="modal-close" onClick={() => setShowBookingModal(false)}>×</button>
            </div>
            <form onSubmit={handleBookingSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Service Type</label>
                  <select
                    className="form-select"
                    value={bookingData.serviceId}
                    onChange={(e) => setBookingData({ ...bookingData, serviceId: e.target.value })}
                    required
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>{service.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe the service you need..."
                    value={bookingData.description}
                    onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Preferred Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Service location"
                    value={bookingData.location}
                    onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Additional Notes</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Any additional information..."
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                    style={{ minHeight: '80px' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={bookingLoading}>
                  {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderProfile;
