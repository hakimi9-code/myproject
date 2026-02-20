import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/products';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star">★</span>);
      }
    }
    return stars;
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
        <span className="product-category-badge">{product.category}</span>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-rating">
          <div className="stars">{renderStars(product.rating)}</div>
          <span className="rating-text">({product.reviews} reviews)</span>
        </div>
        
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

