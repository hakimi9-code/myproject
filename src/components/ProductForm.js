import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast, { useToast } from '../components/Toast';
import './ProductForm.css';

// Use environment variable in production, localhost in development
const getApiUrl = () => {
  const isProduction = window.location.hostname !== 'localhost';
  
  if (isProduction) {
    // Try environment variable first, then use hardcoded Render URL as fallback
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    // Fallback to Render backend
    return '/api';
  }
  
  // Development
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const defaultCategories = ['Electronics', 'Clothing', 'Accessories', 'Sports', 'Home'];

function ProductForm({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Electronics',
    image: '',
    description: '',
    in_stock: true,
    rating: 0,
    reviews: 0
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState(defaultCategories);
  const { toasts, showToast, removeToast } = useToast();

  const isEditing = Boolean(product?.id);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        category: product.category || 'Electronics',
        image: product.image || '',
        description: product.description || '',
        in_stock: product.in_stock !== false,
        rating: product.rating || 0,
        reviews: product.reviews || 0
      });
    }
  }, [product]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        if (data.length > 0 && data[0] === 'All') {
          setCategories(data.slice(1));
        }
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const token = localStorage.getItem('adminToken');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      setFormData(prev => ({
        ...prev,
        image: data.url
      }));

      showToast('Image uploaded successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
      // Allow manual URL input as fallback
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      showToast('Name, price, and category are required', 'error');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('adminToken');

    try {
      const url = isEditing 
        ? `${API_URL}/products/${product.id}`
        : `${API_URL}/products`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save product');
      }

      showToast(
        isEditing ? 'Product updated successfully!' : 'Product created successfully!',
        'success'
      );

      if (onSave) {
        onSave(data.product);
      }

      if (onClose) {
        setTimeout(() => onClose(), 1000);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-overlay" onClick={onClose}>
      <div className="product-form-container" onClick={e => e.stopPropagation()}>
        <div className="product-form-header">
          <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}

        {loading && <LoadingSpinner message="Saving product..." />}

        {!loading && (
          <form onSubmit={handleSubmit} className="product-form">
            {/* Image Upload */}
            <div className="form-section">
              <label>Product Image</label>
              <div className="image-upload-area">
                {formData.image ? (
                  <div className="image-preview">
                    <img src={formData.image} alt="Product preview" />
                    <button 
                      type="button" 
                      className="remove-image"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="image-upload-placeholder">
                    <span className="upload-icon">📷</span>
                    <span>Click to upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </div>
                )}
                {uploading && <LoadingSpinner message="Uploading..." />}
              </div>
              
              <div className="image-url-input">
                <label>Or enter image URL:</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="price">Price *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="in_stock"
                      checked={formData.in_stock}
                      onChange={handleChange}
                    />
                    <span>In Stock</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                {isEditing ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProductForm;

