import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (name) => {
    const icons = {
      'Electrician': '⚡',
      'Plumber': '💧',
      'Cleaner': '✨',
      'Tutor': '📚',
      'Mechanic': '🚗',
      'Painter': '🎨',
      'Carpenter': '🔨',
      'Gardener': '🌸'
    };
    return icons[name] || '🔧';
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="loader" style={{ margin: '0 auto' }}></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="page-header">
        <h1 className="page-title">Our Services</h1>
        <p className="page-subtitle">Browse all available service categories</p>
      </div>

      <div className="grid grid-3">
        {services.map((service) => (
          <Link 
            key={service._id} 
            to={`/providers?category=${encodeURIComponent(service.name)}`}
            className="card"
            style={{ padding: '32px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'var(--background)', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                {getServiceIcon(service.name)}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{service.name}</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {service.description}
            </p>
            <Link 
              to={`/providers?category=${encodeURIComponent(service.name)}`}
              style={{ 
                display: 'inline-block',
                marginTop: '16px', 
                color: 'var(--primary)', 
                fontWeight: '500',
                fontSize: '0.9rem'
              }}
            >
              View Providers →
            </Link>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Services;
