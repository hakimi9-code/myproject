import React from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';
import { categories } from '../data/products';
import './ProductList.css';

const ProductList = () => {
  const { products, selectedCategory, setSelectedCategory, searchTerm } = useStore();

  return (
    <div className="product-list-container">
      <div className="filter-section">
        <div className="filter-title">
          <span>Filter by Category</span>
        </div>
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="results-info">
        {searchTerm && (
          <p className="search-info">
            Showing results for "<strong>{searchTerm}</strong>"
          </p>
        )}
        <p className="count-info">
          {products.length} product{products.length !== 1 ? 's' : ''} found
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
      </div>

      {products.length > 0 ? (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;

