import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { useCartStore, useWishlistStore } from '../store';
import toast from 'react-hot-toast';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const isWishlisted = has(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product, 1, product.sizes?.[0] || '', product.colors?.[0]?.name || '');
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product);
    toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: isWishlisted ? '💔' : '❤️',
    });
  };

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null;

  return (
    <article className="product-card">
      <Link to={`/product/${product._id}`} className="product-card__image-wrap">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image'}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
        />
        {product.images?.[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="product-card__image product-card__image--hover"
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="product-card__badges">
          {product.isNewArrival && <span className="badge badge-gold">New</span>}
          {product.isBestSeller && <span className="badge badge-black">Best Seller</span>}
          {discount && <span className="badge badge-red">-{discount}%</span>}
        </div>

        {/* Actions */}
        <div className="product-card__actions">
          <button
            className={`product-card__action-btn${isWishlisted ? ' active' : ''}`}
            onClick={handleWishlist}
            aria-label="Wishlist"
          >
            <FiHeart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            className="product-card__action-btn"
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <FiShoppingBag size={18} />
          </button>
        </div>
      </Link>

      <div className="product-card__info">
        <p className="product-card__category">{product.category}</p>
        <Link to={`/product/${product._id}`} className="product-card__name">
          {product.name}
        </Link>

        {product.numReviews > 0 && (
          <div className="product-card__rating">
            <FiStar size={12} fill="#c9a84c" color="#c9a84c" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="product-card__reviews">({product.numReviews})</span>
          </div>
        )}

        <div className="product-card__price">
          {product.salePrice ? (
            <>
              <span className="product-card__price--sale">PKR {product.salePrice.toLocaleString()}</span>
              <span className="product-card__price--original">PKR {product.price.toLocaleString()}</span>
            </>
          ) : (
            <span>PKR {product.price.toLocaleString()}</span>
          )}
        </div>

        {product.colors && product.colors.length > 0 && (
          <div className="product-card__colors">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                className="product-card__color-dot"
                style={{ background: c.hex }}
                title={c.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="product-card__color-more">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
