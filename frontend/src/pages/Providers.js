import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { formatCurrency } from '../utils/formatters';
import API_URL from '../config/api';

const Providers = () => {
  const [searchParams] = useSearchParams();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    serviceArea: ''
  });

  useEffect(() => {
    fetchProviders();
  }, [filters.category]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.serviceArea) params.append('serviceArea', filters.serviceArea);
      
      const response = await axios.get(`${API_URL}/providers?${params}`);
      setProviders(response.data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProviders();
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="page-header">
        <h1 className="page-title">Find Service Providers</h1>
        <p className="page-subtitle">Browse verified professionals in your area</p>
      </div>

      {/* Filters */}
      <div className="card mb-4" style={{ padding: '20px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search providers..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ flex: '1', minWidth: '200px' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Location..."
            value={filters.serviceArea}
            onChange={(e) => setFilters({ ...filters, serviceArea: e.target.value })}
            style={{ width: '200px' }}
          />
          <select
            className="form-select"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            style={{ width: '200px' }}
          >
            <option value="">All Categories</option>
            <option value="Electrician">Electrician</option>
            <option value="Plumber">Plumber</option>
            <option value="Cleaner">Cleaner</option>
            <option value="Tutor">Tutor</option>
            <option value="Mechanic">Mechanic</option>
            <option value="Painter">Painter</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Gardener">Gardener</option>
          </select>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="loader" style={{ margin: '0 auto' }}></div>
        </div>
      ) : providers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3 className="empty-title">No providers found</h3>
          <p className="empty-text">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {providers.map((provider) => (
            <div key={provider._id} className="card provider-card">
              <div className="provider-avatar">
                {provider.userId?.name?.charAt(0) || 'P'}
              </div>
              <div className="provider-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 className="provider-name">{provider.userId?.name || 'Unknown'}</h3>
                  {provider.isVerified && (
                    <span className="badge badge-verified">Verified</span>
                  )}
                </div>
                <div className="provider-meta">
                  <span className="provider-rating">
                    {renderStars(provider.rating || 0)} {provider.rating || 0}
                  </span>
                  <span>{provider.experience || 0} years exp.</span>
                  <span>{provider.serviceArea || 'N/A'}</span>
                </div>
                <div className="provider-skills">
                  {provider.categories?.map((cat, idx) => (
                    <span key={idx} className="skill-tag">{cat}</span>
                  ))}
                  {provider.skills?.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
                {provider.hourlyRate && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    {formatCurrency(provider.hourlyRate)}/hour
                  </p>
                )}
                <div className="provider-actions">
                  <Link to={`/providers/${provider._id}`} className="btn btn-primary btn-sm">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Providers;
