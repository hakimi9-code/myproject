import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/products';
import toast from "react-hot-toast";
import './Cart.css';

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

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderError, setOrderError] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsCheckingOut(true);
    setOrderError('');

    try {
      const orderItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          customer,
          total: cartTotal,
          paymentMethod
        })
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server error: ${text.substring(0, 100)}...`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      clearCart();
      toast.success("Order placed successfully!");
      setShowCheckoutForm(false);
      navigate('/checkout-success', { state: { order: data.order } });
    } catch (err) {
      setOrderError(err.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/" className="continue-shopping-btn">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          <div className="cart-header">
            <span className="header-product">Product</span>
            <span className="header-price">Price</span>
            <span className="header-quantity">Quantity</span>
            <span className="header-total">Total</span>
            <span className="header-remove">Remove</span>
          </div>
          
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-product">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="item-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                  }}
                />
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <span className="item-category">{item.category}</span>
                </div>
              </div>
              
              <div className="item-price">
                {formatPrice(item.price)}
              </div>
              
              <div className="item-quantity">
                <button 
                  className="qty-btn"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  −
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button 
                  className="qty-btn"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              
              <div className="item-total">
                {formatPrice(item.price * item.quantity)}
              </div>
              
              <button 
                className="item-remove"
                onClick={() => removeFromCart(item.id)}
                aria-label="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal ({cart.length} items)</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          
          <div className="summary-row">
            <span>Estimated Shipping</span>
            <span className="shipping-free">FREE</span>
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          
          <button 
            className="checkout-btn"
            onClick={() => setShowCheckoutForm(true)}
            disabled={isCheckingOut}
          >
            Proceed to Checkout
          </button>
          
          <Link to="/" className="continue-shopping-link">
            ← Continue Shopping
          </Link>
          
          <button 
            className="clear-cart-btn"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* Checkout Form Modal */}
      {showCheckoutForm && (
        <div className="checkout-form-overlay">
          <div className="checkout-form-modal">
            <button 
              className="close-form-btn"
              onClick={() => setShowCheckoutForm(false)}
            >
              ✕
            </button>
            
            <h2>Checkout</h2>
            
            {orderError && (
              <div className="order-error">{orderError}</div>
            )}
            
            <form onSubmit={handleCheckout}>
              <div className="form-section">
                <h3>Customer Information</h3>
                
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={customer.name}
                    onChange={(e) => setCustomer({...customer, name: e.target.value})}
                    required
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({...customer, email: e.target.value})}
                    required
                    placeholder="john@example.com"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Shipping Address *</label>
                  <textarea
                    id="address"
                    value={customer.address}
                    onChange={(e) => setCustomer({...customer, address: e.target.value})}
                    required
                    placeholder="123 Main St, City, State, ZIP"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h3>Payment Method</h3>
                
                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="payment-icon">💳</span>
                    <span className="payment-label">Credit/Debit Card</span>
                  </label>
                  
                  <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="payment-icon">💵</span>
                    <span className="payment-label">Cash on Delivery</span>
                  </label>
                </div>
              </div>
              
              <div className="form-section order-review">
                <h3>Order Review</h3>
                <div className="review-items">
                  {cart.map(item => (
                    <div key={item.id} className="review-item">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="review-total">
                  <span>Total:</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="place-order-btn"
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Processing...' : `Place Order - ${formatPrice(cartTotal)}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

