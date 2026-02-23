import React, { useState, useEffect, useRef } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Toast, { useToast } from '../components/Toast';
import './Admin.css';

// Use relative API URL in production, localhost in development
const getApiUrl = () => {
  // Check if we're in production (not localhost)
  const isProduction = window.location.hostname !== 'localhost';
  
  if (isProduction) {
    // In production, use relative path (same domain)
    return '/api';
  }
  
  // In development, check for environment variable or use localhost
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { toasts, showToast, removeToast } = useToast();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Focus close button when dialog opens
  useEffect(() => {
    if (selectedOrder && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [selectedOrder]);

  // Handle dialog open/close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedOrder) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [selectedOrder]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/orders`);
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server error: ${text.substring(0, 100)}...`);
      }
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
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server error: ${text.substring(0, 100)}...`);
      }
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
    return `$${Number.parseFloat(price).toFixed(2)}`;
  };

  const handleDialogKeyDown = (e) => {
    // Trap focus within dialog on Tab key
    if (e.key === 'Tab') {
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements?.length) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (loading) return <LoadingSpinner message="Loading orders..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrders} />;

  return (
    <div className="admin-container">
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
        <div className="admin-content">
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
            <table className="orders-table" role="grid">
              <thead>
                <tr>
                  <th scope="col">Order ID</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Total</th>
                  <th scope="col">Status</th>
                  <th scope="col">Payment</th>
                  <th scope="col">Date</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr 
                    key={order.id} 
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
                        onClick={() => setSelectedOrder(order)}
                        aria-label={`View order #${order.id}`}
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
            <dialog 
              ref={dialogRef}
              className="order-detail-modal"
              aria-labelledby="order-modal-title"
              aria-describedby="order-modal-description"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedOrder(null);
              }}
              onKeyDown={handleDialogKeyDown}
            >
              <div className="modal-header">
                <h2 id="order-modal-title">Order #{selectedOrder.id}</h2>
                <button 
                  ref={closeButtonRef}
                  className="close-btn" 
                  onClick={() => setSelectedOrder(null)}
                  aria-label="Close order details"
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body" id="order-modal-description">
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
                        aria-label="Order status"
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
                      {selectedOrder.items?.map((item) => (
                        <tr key={item.id || item.product_id}>
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
            </dialog>
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;

