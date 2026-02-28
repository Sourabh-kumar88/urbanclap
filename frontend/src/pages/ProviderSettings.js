import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

const ProviderSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    skills: '',
    experience: '',
    categories: [],
    availability: 'available',
    serviceArea: '',
    bio: '',
    hourlyRate: ''
  });
  const [services, setServices] = useState([]);

  const categoryOptions = [
    'Electrician', 'Plumber', 'Cleaner', 'Tutor', 
    'Mechanic', 'Painter', 'Carpenter', 'Gardener'
  ];

  useEffect(() => {
    fetchServices();
    fetchProviderProfile();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchProviderProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/providers/me/profile`);
      setProvider(response.data);
      setFormData({
        skills: response.data.skills?.join(', ') || '',
        experience: response.data.experience || '',
        categories: response.data.categories || [],
        availability: response.data.availability || 'available',
        serviceArea: response.data.serviceArea || '',
        bio: response.data.bio || '',
        hourlyRate: response.data.hourlyRate || ''
      });
    } catch (error) {
      console.error('Error fetching provider profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        experience: parseInt(formData.experience) || 0,
        categories: formData.categories,
        availability: formData.availability,
        serviceArea: formData.serviceArea,
        bio: formData.bio,
        hourlyRate: parseInt(formData.hourlyRate) || 0
      };

      if (provider) {
        await axios.put(`${API_URL}/providers/${provider._id}`, data);
      } else {
        await axios.post(`${API_URL}/providers`, data);
      }
      alert('Profile updated successfully!');
      navigate('/provider/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (category) => {
    const newCategories = formData.categories.includes(category)
      ? formData.categories.filter(c => c !== category)
      : [...formData.categories, category];
    setFormData({ ...formData, categories: newCategories });
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="loader" style={{ margin: '0 auto' }}></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Profile Settings</h1>
          <p className="page-subtitle">Manage your provider profile</p>
        </div>

        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Service Categories *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {categoryOptions.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: formData.categories.includes(cat) 
                        ? '2px solid var(--primary)' 
                        : '1px solid var(--border)',
                      background: formData.categories.includes(cat) 
                        ? 'var(--primary)' 
                        : 'transparent',
                      color: formData.categories.includes(cat) 
                        ? '#fff' 
                        : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Skills (comma separated) *</label>
              <input
                type="text"
                name="skills"
                className="form-input"
                placeholder="e.g., Electrical Wiring, Circuit Repair, Installation"
                value={formData.skills}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Years of Experience *</label>
                <input
                  type="number"
                  name="experience"
                  className="form-input"
                  placeholder="e.g., 5"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hourly Rate (₹)</label>
                <input
                  type="number"
                  name="hourlyRate"
                  className="form-input"
                  placeholder="e.g., 500"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Service Area *</label>
              <input
                type="text"
                name="serviceArea"
                className="form-input"
                placeholder="e.g., New York, Los Angeles"
                value={formData.serviceArea}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Availability</label>
              <select
                name="availability"
                className="form-select"
                value={formData.availability}
                onChange={handleChange}
              >
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                name="bio"
                className="form-textarea"
                placeholder="Tell customers about yourself and your services..."
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/provider/dashboard')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProviderSettings;
