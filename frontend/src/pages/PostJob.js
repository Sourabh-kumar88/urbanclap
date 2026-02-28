import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    providerId: '',
    serviceId: '',
    description: '',
    date: '',
    time: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    fetchServices();
    fetchProviders();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await axios.get(`${API_URL}/providers`);
      setProviders(response.data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/bookings`, {
        ...formData,
        customerId: user.id
      });
      alert('Job posted successfully!');
      navigate('/bookings');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Post a Job</h1>
          <p className="page-subtitle">Describe your job and find the right provider</p>
        </div>

        <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Service Type *</label>
              <select
                name="serviceId"
                className="form-select"
                value={formData.serviceId}
                onChange={handleChange}
                required
              >
                <option value="">Choose a service</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>{service.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Preferred Provider (Optional)</label>
              <select
                name="providerId"
                className="form-select"
                value={formData.providerId}
                onChange={handleChange}
              >
                <option value="">Any available provider</option>
                {providers.map((provider) => (
                  <option key={provider._id} value={provider.userId._id}>
                    {provider.userId?.name} - {provider.categories?.join(', ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Job Description *</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Describe what you need done in detail..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Preferred Date *</label>
                <input
                  type="date"
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Time *</label>
                <input
                  type="time"
                  name="time"
                  className="form-input"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="Enter your address or location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Additional Notes</label>
              <textarea
                name="notes"
                className="form-textarea"
                placeholder="Any special requirements or additional information..."
                value={formData.notes}
                onChange={handleChange}
                style={{ minHeight: '80px' }}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Posting Job...' : 'Post Job'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
