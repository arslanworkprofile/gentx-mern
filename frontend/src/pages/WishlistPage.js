import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useWishlistStore } from '../store';
import './MiscPages.css';

export default function WishlistPage() {
  const items = useWishlistStore(s => s.items);
  return (
    <div className="page misc-page">
      <div className="container">
        <h1 className="misc-title">My Wishlist <span>({items.length})</span></h1>
        {items.length === 0 ? (
          <div className="misc-empty">
            <p>Your wishlist is empty.</p>
            <Link to="/shop" className="btn btn-outline" style={{ marginTop: 16 }}>Browse Products</Link>
          </div>
        ) : (
          <div className="products-grid">
            {items.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
