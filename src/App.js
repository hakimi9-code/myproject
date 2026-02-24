/**
 * Mini E-Commerce Store - Main Application Component
 * (Your documentation stays exactly the same)
 */

import { Toaster } from "react-hot-toast";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <StoreProvider>

      {/* ✅ Toast Notification System */}
      <Toaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
          },
        }}
      />

      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Route Definitions - Same URLs work locally and in production */}
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout-success" element={<Checkout />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <footer className="footer">
            <p>© 2026 MiniStore. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </StoreProvider>
  );
}

export default App;
