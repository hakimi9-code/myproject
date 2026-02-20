
import React from 'react';
import Navbar from '../components/Navbar';
import ProductList from '../components/ProductList';
import ContactForm from '../components/ContactForm';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Abdul MiniStore</h1>
          <p>Discover amazing products at unbeatable prices</p>
        </div>
      </div>
      
      <ProductList />
      
      <div className="contact-section">
        <ContactForm />
      </div>
    </div>
  );
};

export default Home;

