import React from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './DashboardStats.css';

// Use environment variable in production, localhost in development
const getApiUrl = () => {
  const isProduction = window.location.hostname !== 'localhost';
  
  if (isProduction) {
    // Try environment variable first, then use hardcoded Render URL as fallback
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    // Fallback to Render backend
    return 'https://hakimi-store.onrender.com';
  }
  
  // Development
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

function DashboardStats() {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem('adminToken');
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      processing: '#17a2b8',
      shipped: '#6610f2',
      delivered: '#28a745',
      cancelled: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  if (loading) return <LoadingSpinner message="Loading analytics..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchStats} />;
  if (!stats) return null;

  return (
    <div className="dashboard-stats">
      {/* Main Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <span className="stat-number">{stats.totalOrders}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-number">{formatCurrency(stats.totalRevenue)}</span>
            <span className="stat-label">Total Revenue</span>
          </div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-icon">🛍️</div>
          <div className="stat-content">
            <span className="stat-number">{stats.totalProducts}</span>
            <span className="stat-label">Products</span>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <span className="stat-number">{stats.totalCustomers}</span>
            <span className="stat-label">Customers</span>
          </div>
        </div>
      </div>

      {/* Sales by Category */}
      <div className="stats-section">
        <h3 className="section-title">Sales by Category</h3>
        <div className="category-bars">
          {stats.salesByCategory?.map((item, index) => {
            const maxTotal = Math.max(...(stats.salesByCategory?.map(c => c.total) || [1]));
            const percentage = ((item.total || 0) / maxTotal) * 100;
            
            return (
              <div key={index} className="category-bar-item">
                <div className="category-info">
                  <span className="category-name">{item.category || 'Unknown'}</span>
                  <span className="category-value">{formatCurrency(item.total)}</span>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-bar-fill" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="stats-section">
        <h3 className="section-title">Recent Orders</h3>
        <div className="recent-orders">
          {stats.recentOrders?.length > 0 ? (
            stats.recentOrders.map((order) => (
              <div key={order.id} className="recent-order-item">
                <div className="order-info">
                  <span className="order-id">#{order.id}</span>
                  <span className="order-customer">{order.customer_name}</span>
                </div>
                <div className="order-meta">
                  <span className="order-amount">{formatCurrency(order.total)}</span>
                  <span 
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-orders">No recent orders</p>
          )}
        </div>
      </div>

      {/* Monthly Sales Chart (Simple) */}
      <div className="stats-section">
        <h3 className="section-title">Monthly Sales</h3>
        <div className="monthly-chart">
          {stats.monthlySales?.map((item, index) => {
            const maxSales = Math.max(...(stats.monthlySales?.map(m => m.sales) || [1]));
            const height = ((item.sales || 0) / maxSales) * 100;
            
            return (
              <div key={index} className="chart-bar-container">
                <div 
                  className="chart-bar" 
                  style={{ height: `${height}%` }}
                  title={formatCurrency(item.sales)}
                >
                  <span className="chart-value">{formatCurrency(item.sales)}</span>
                </div>
                <span className="chart-label">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;

