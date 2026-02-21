import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Toast, { useToast } from '../components/Toast';
import './Admin.css';

const API_URL = process.env.REACT_APP_API_URL || '';

function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/orders`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      const result = await response.json();
      setOrders(orders.map(o => o.id === orderId ? result.order : o));
      setSelectedOrder(result.order);
      showToast(`Order #${orderId} status updated to ${newStatus}`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (loading) return <LoadingSpinner message="Loading orders..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrders} />;

  return (
    <div className="admin-container">
      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <h1 className="admin-title">Order Management</h1>
      
      {orders.length === 0 ? (
        <EmptyState 
          icon="📦"
          title="No orders yet"
          message="Orders will appear here once customers make purchases."
          actionLabel="Refresh"
          onAction={fetchOrders}
        />
      ) : (
        <>
        <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-number">{orders.length}</span>
          <span className="stat-label">Total Orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {orders.filter(o => o.status === 'pending').length}
          </span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {orders.filter(o => o.status === 'processing').length}
          </span>
          <span className="stat-label">Processing</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {orders.filter(o => o.status === 'shipped').length}
          </span>
          <span className="stat-label">Shipped</span>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr 
                key={order.id} 
                onClick={() => setSelectedOrder(order)}
                className={selectedOrder?.id === order.id ? 'selected' : ''}
              >
                <td>#{order.id}</td>
                <td>
                  <div className="customer-info">
                    <strong>{order.customer_name}</strong>
                    <small>{order.customer_email}</small>
                  </div>
                </td>
                <td>{formatPrice(order.total)}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  <span className={`payment-badge ${order.payment_status}`}>
                    {order.payment_status}
                  </span>
                </td>
                <td>{formatDate(order.created_at)}</td>
                <td>
                  <button 
                    className="action-btn view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(order);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="order-detail-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order #{selectedOrder.id}</h2>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="order-info-grid">
                <div className="info-section">
                  <h3>Customer Details</h3>
                  <p><strong>Name:</strong> {selectedOrder.customer_name}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                  <p><strong>Address:</strong> {selectedOrder.customer_address}</p>
                </div>
                
                <div className="info-section">
                  <h3>Order Status</h3>
                  <div className="status-controls">
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                <div className="info-section">
                  <h3>Payment</h3>
                  <p><strong>Method:</strong> {selectedOrder.payment_method || 'card'}</p>
                  <p>
                    <strong>Status:</strong> 
                    <span className={`payment-badge ${selectedOrder.payment_status}`}>
                      {selectedOrder.payment_status}
                    </span>
                  </p>
                </div>
                
                <div className="info-section">
                  <h3>Order Summary</h3>
                  <p><strong>Total:</strong> {formatPrice(selectedOrder.total)}</p>
                  <p><strong>Date:</strong> {formatDate(selectedOrder.created_at)}</p>
                </div>
              </div>
              
              <div className="order-items">
                <h3>Order Items</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.product_name}</td>
                        <td>{formatPrice(item.product_price)}</td>
                        <td>{item.quantity}</td>
                        <td>{formatPrice(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

export default Admin;

