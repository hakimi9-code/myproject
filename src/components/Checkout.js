import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Toast, { useToast } from './Toast';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const order = location.state?.order;
  const { toasts, showToast, removeToast } = useToast();

  // Show toast based on payment status
  React.useEffect(() => {
    if (order?.payment_status === 'completed') {
      showToast('Payment successful!', 'success');
    } else if (order?.payment_status === 'pending') {
      showToast('Order placed! You will pay on delivery.', 'info');
    }
  }, []);

  return (
    <div className="checkout-container">
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

      <div className="checkout-success">
        <div className="success-icon">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your purchase. Your order has been confirmed.</p>
        
        <div className="order-details">
          <h3>Order Details</h3>
          <div className="order-info">
            <p><strong>Order Number:</strong> #{order?.id || Math.floor(Math.random() * 1000000)}</p>
            <p><strong>Status:</strong> <span className="order-status">{order?.status || 'Pending'}</span></p>
            <p><strong>Payment Status:</strong> <span className={`payment-status ${order?.payment_status || 'completed'}`}>{order?.payment_status || 'completed'}</span></p>
            <p><strong>Total:</strong> ${order?.total ? parseFloat(order.total).toFixed(2) : '0.00'}</p>
            <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
            <p><strong>Confirmation Email:</strong> Sent to your email address</p>
          </div>
          
          {order?.items && order.items.length > 0 && (
            <div className="order-items-summary">
              <h4>Items Ordered:</h4>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.product_name} x{item.quantity} - ${parseFloat(item.subtotal).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="checkout-actions">
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

