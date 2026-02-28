import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    totalServices: 0
  });
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, providersRes, bookingsRes, servicesRes] = await Promise.all([
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/providers/admin/all`),
        axios.get(`${API_URL}/bookings/admin/all`),
        axios.get(`${API_URL}/services`)
      ]);

      setUsers(usersRes.data);
      setProviders(providersRes.data);
      setBookings(bookingsRes.data);
      setStats({
        totalUsers: usersRes.data.length,
        totalProviders: providersRes.data.length,
        totalBookings: bookingsRes.data.length,
        totalServices: servicesRes.data.length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyProvider = async (providerId) => {
    try {
      await axios.put(`${API_URL}/providers/${providerId}/verify`);
      fetchData();
    } catch (error) {
      alert('Failed to verify provider');
    }
  };

  const handleUserStatus = async (userId, action) => {
    try {
      if (action === 'deactivate') {
        await axios.put(`${API_URL}/users/${userId}/deactivate`);
      } else {
        await axios.put(`${API_URL}/users/${userId}/activate`);
      }
      fetchData();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    try {
      await axios.put(`${API_URL}/bookings/${bookingId}`, { status });
      fetchData();
    } catch (error) {
      alert('Failed to update booking');
    }
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
        <div className="dashboard-header">
          <h1 className="dashboard-welcome">Admin Dashboard</h1>
          <p className="page-subtitle">Manage the platform</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Service Providers</div>
            <div className="stat-value">{stats.totalProviders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Bookings</div>
            <div className="stat-value">{stats.totalBookings}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Services</div>
            <div className="stat-value">{stats.totalServices}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`tab ${activeTab === 'providers' ? 'active' : ''}`}
            onClick={() => setActiveTab('providers')}
          >
            Providers
          </button>
          <button 
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-2">
            <div className="card">
              <h3 className="card-title mb-3">Recent Users</h3>
              {users.slice(0, 5).map((u) => (
                <div key={u._id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: '500' }}>{u.name}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.email}</p>
                    </div>
                    <span className="badge" style={{ 
                      background: u.role === 'admin' ? '#000' : '#f3f4f6',
                      color: u.role === 'admin' ? '#fff' : '#6b7280'
                    }}>
                      {u.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="card">
              <h3 className="card-title mb-3">Recent Bookings</h3>
              {bookings.slice(0, 5).map((b) => (
                <div key={b._id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: '500' }}>{b.serviceId?.name || 'Service'}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {b.customerId?.name} → {b.providerId?.name}
                      </p>
                    </div>
                    <span className={`booking-status status-${b.status}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge" style={{ 
                        background: u.role === 'admin' ? '#000' : '#f3f4f6',
                        color: u.role === 'admin' ? '#fff' : '#6b7280'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-verified' : ''}`} style={{ 
                        background: u.isActive ? '#d1fae5' : '#fee2e2',
                        color: u.isActive ? '#059669' : '#dc2626'
                      }}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {u.role !== 'admin' && (
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleUserStatus(u._id, u.isActive ? 'deactivate' : 'activate')}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Providers Tab */}
        {activeTab === 'providers' && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Categories</th>
                  <th>Experience</th>
                  <th>Rating</th>
                  <th>Verified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((p) => (
                  <tr key={p._id}>
                    <td>{p.userId?.name || 'Unknown'}</td>
                    <td>{p.categories?.join(', ') || 'N/A'}</td>
                    <td>{p.experience} years</td>
                    <td>{p.rating || 0}</td>
                    <td>
                      <span className={`badge ${p.isVerified ? 'badge-verified' : ''}`} style={{ 
                        background: p.isVerified ? '#d1fae5' : '#fee2e2',
                        color: p.isVerified ? '#059669' : '#dc2626'
                      }}>
                        {p.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      {!p.isVerified && (
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleVerifyProvider(p._id)}
                        >
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Provider</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.serviceId?.name || 'N/A'}</td>
                    <td>{b.customerId?.name || 'Unknown'}</td>
                    <td>{b.providerId?.name || 'Unknown'}</td>
                    <td>{new Date(b.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`booking-status status-${b.status}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={b.status}
                        onChange={(e) => handleBookingStatus(b._id, e.target.value)}
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
