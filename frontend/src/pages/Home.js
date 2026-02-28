import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

const Home = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [howItWorksTab, setHowItWorksTab] = useState('customer');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/providers?search=${encodeURIComponent(searchTerm)}`);
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

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Find Trusted Local Service Providers</h1>
          <p className="hero-subtitle">
            Connect with verified professionals in your area. From electricians to tutors, 
            find the right expert for any job.
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-input"
              placeholder="Search for services (e.g., plumber, electrician)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Browse Services</h2>
          <div className="grid grid-4">
            {services.map((service) => (
              <Link 
                key={service._id} 
                to={`/providers?category=${encodeURIComponent(service.name)}`}
                className="card service-card"
              >
                <div className="service-icon">
                  <span style={{ fontSize: '28px' }}>{getServiceIcon(service.name)}</span>
                </div>
                <h3 className="service-name">{service.name}</h3>
                <p className="service-count">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '60px 0', background: '#fff' }}>
        <div className="container">
          <h2 className="section-title text-center">How It Works</h2>
          
          {/* Tab Toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
            <button
              onClick={() => setHowItWorksTab('customer')}
              className="btn"
              style={{
                background: howItWorksTab === 'customer' ? 'var(--primary)' : '#e5e7eb',
                color: howItWorksTab === 'customer' ? '#fff' : 'var(--text-primary)',
                padding: '12px 24px',
                fontWeight: '600'
              }}
            >
              For Customers
            </button>
            <button
              onClick={() => setHowItWorksTab('provider')}
              className="btn"
              style={{
                background: howItWorksTab === 'provider' ? 'var(--primary)' : '#e5e7eb',
                color: howItWorksTab === 'provider' ? '#fff' : 'var(--text-primary)',
                padding: '12px 24px',
                fontWeight: '600'
              }}
            >
              For Providers
            </button>
          </div>

          {/* Customer Steps */}
          {howItWorksTab === 'customer' && (
            <div className="grid grid-3 mt-4">
              <div
                className="card"
                style={{ textAlign: 'center', padding: '32px', cursor: 'pointer', transition: 'transform 0.2s' }}
                onClick={() => navigate('/providers')}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <h3 style={{ marginBottom: '12px' }}>1. Search</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Browse through our network of verified service providers in your area.
                </p>
                <span style={{ color: 'var(--primary)', fontWeight: '500', marginTop: '12px', display: 'block' }}>
                  Browse Providers →
                </span>
              </div>
              <div
                className="card"
                style={{ textAlign: 'center', padding: '32px', cursor: 'pointer', transition: 'transform 0.2s' }}
                onClick={() => user ? navigate('/providers') : navigate('/register')}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                <h3 style={{ marginBottom: '12px' }}>2. Book</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Choose a provider that fits your needs and book an appointment instantly.
                </p>
                <span style={{ color: 'var(--primary)', fontWeight: '500', marginTop: '12px', display: 'block' }}>
                  {user ? 'Book Now →' : 'Sign Up to Book →'}
                </span>
              </div>
              <div
                className="card"
                style={{ textAlign: 'center', padding: '32px', cursor: 'pointer', transition: 'transform 0.2s' }}
                onClick={() => user ? navigate('/my-bookings') : navigate('/register')}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
                <h3 style={{ marginBottom: '12px' }}>3. Review</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Rate your experience and help others find the best professionals.
                </p>
                <span style={{ color: 'var(--primary)', fontWeight: '500', marginTop: '12px', display: 'block' }}>
                  {user ? 'My Bookings →' : 'Sign Up to Review →'}
                </span>
              </div>
            </div>
          )}

          {/* Provider Steps */}
          {howItWorksTab === 'provider' && (
            <div className="grid grid-3 mt-4">
              <div
                className="card"
                style={{ textAlign: 'center', padding: '32px', cursor: 'pointer', transition: 'transform 0.2s' }}
                onClick={() => user && user.role === 'provider' ? navigate('/provider/dashboard') : navigate('/register')}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <h3 style={{ marginBottom: '12px' }}>1. Create Profile</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Sign up as a provider and create your professional profile with your skills and services.
                </p>
                <span style={{ color: 'var(--primary)', fontWeight: '500', marginTop: '12px', display: 'block' }}>
                  {user && user.role === 'provider' ? 'Go to Dashboard →' : 'Register as Provider →'}
                </span>
              </div>
              <div
                className="card"
                style={{ textAlign: 'center', padding: '32px', cursor: 'pointer', transition: 'transform 0.2s' }}
                onClick={() => user && user.role === 'provider' ? navigate('/provider/dashboard') : navigate('/register')}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📥</div>
                <h3 style={{ marginBottom: '12px' }}>2. Receive Bookings</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Get booking requests from customers in your area and manage your schedule easily.
                </p>
                <span style={{ color: 'var(--primary)', fontWeight: '500', marginTop: '12px', display: 'block' }}>
                  {user && user.role === 'provider' ? 'View Bookings →' : 'Start Receiving Jobs →'}
                </span>
              </div>
              <div
                className="card"
                style={{ textAlign: 'center', padding: '32px', cursor: 'pointer', transition: 'transform 0.2s' }}
                onClick={() => user && user.role === 'provider' ? navigate('/provider/settings') : navigate('/register')}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
                <h3 style={{ marginBottom: '12px' }}>3. Grow Business</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Complete jobs, collect reviews, and grow your reputation and earnings.
                </p>
                <span style={{ color: 'var(--primary)', fontWeight: '500', marginTop: '12px', display: 'block' }}>
                  {user && user.role === 'provider' ? 'Manage Settings →' : 'Join Today →'}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 0', background: 'var(--primary)', color: '#fff' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '16px' }}>
            Are You a Service Provider?
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
            Join our network of professionals and grow your business with unlimited clients.
          </p>
          <Link 
            to="/register" 
            className="btn" 
            style={{ background: '#fff', color: 'var(--primary)' }}
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p className="footer-text">© 2026 ServiceHub. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Privacy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Terms</a>
              <a href="mailto:kumar.sourabhhhh@gmail.com" style={{ color: 'var(--text-secondary)' }}>Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="modal-overlay" onClick={() => setShowPrivacyModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}>
            <div className="modal-header">
              <h2>Privacy Policy</h2>
              <button className="close-btn" onClick={() => setShowPrivacyModal(false)}>×</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'left' }}>
              <h3>Information We Collect</h3>
              <p>We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support.</p>
              
              <h3>How We Use Your Information</h3>
              <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
              
              <h3>Information Sharing</h3>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as necessary to provide our services.</p>
              
              <h3>Data Security</h3>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              
              <h3>Contact Us</h3>
              <p>If you have any questions about this Privacy Policy, please contact us at kumar.sourabhhhh@gmail.com</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setShowPrivacyModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}>
            <div className="modal-header">
              <h2>Terms of Service</h2>
              <button className="close-btn" onClick={() => setShowTermsModal(false)}>×</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'left' }}>
              <h3>Acceptance of Terms</h3>
              <p>By accessing and using ServiceHub, you accept and agree to be bound by the terms and conditions of this agreement.</p>
              
              <h3>Use of Service</h3>
              <p>You agree to use our service only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account.</p>
              
              <h3>Service Providers</h3>
              <p>ServiceHub connects customers with independent service providers. We are not responsible for the quality of services provided by third-party providers.</p>
              
              <h3>Payments</h3>
              <p>All payments are processed securely. Refunds and cancellations are subject to our refund policy and the individual service provider's terms.</p>
              
              <h3>Limitation of Liability</h3>
              <p>ServiceHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>
              
              <h3>Contact Us</h3>
              <p>For any questions regarding these Terms, please contact us at kumar.sourabhhhh@gmail.com</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setShowTermsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
