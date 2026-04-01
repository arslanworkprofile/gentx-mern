import React from 'react';
import { Link } from 'react-router-dom';
import './MiscPages.css';

export default function NotFoundPage() {
  return (
    <div className="page success-page">
      <div className="success-card">
        <p style={{ fontSize: 80, marginBottom: 16, fontFamily: 'Cormorant Garamond, serif', color: '#c9a84c' }}>404</p>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="success-actions">
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <Link to="/shop" className="btn btn-outline">Browse Shop</Link>
        </div>
      </div>
    </div>
  );
}
