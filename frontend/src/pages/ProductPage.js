import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar, FiTruck, FiRefreshCw, FiShield, FiMinus, FiPlus } from 'react-icons/fi';
import api from '../api';
import { useCartStore, useWishlistStore, useAuthStore } from '../store';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import './ProductPage.css';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [tab, setTab] = useState('description');

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setSelectedSize(data.sizes?.[0] || '');
        setSelectedColor(data.colors?.[0]?.name || '');
        if (data.category) {
          const rel = await api.get(`/products?category=${data.category}&limit=4`);
          setRelated(rel.data.products.filter((p) => p._id !== id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) return toast.error('Please select a size');
    addItem(product, qty, selectedSize, selectedColor);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = () => {
    toggle(product);
    toast(has(product._id) ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: has(product._id) ? '💔' : '❤️',
    });
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to leave a review');
    setReviewLoading(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewComment('');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return (
    <div className="page loading-screen"><div className="spinner" /><p>Loading product</p></div>
  );
  if (!product) return (
    <div className="page loading-screen"><p>Product not found</p><Link to="/shop" className="btn btn-outline" style={{marginTop:16}}>Back to Shop</Link></div>
  );

  const isWishlisted = has(product._id);
  const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : null;

  return (
    <div className="product-page page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="product-breadcrumb">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/shop">Shop</Link><span>/</span>
          <Link to={`/shop/${product.category}`}>{product.category}</Link><span>/</span>
          <span>{product.name}</span>
        </div>

        {/* Main grid */}
        <div className="product-detail">
          {/* Images */}
          <div className="product-images">
            <div className="product-images__thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`product-images__thumb${activeImg === i ? ' active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
            <div className="product-images__main">
              <img
                src={product.images[activeImg] || 'https://via.placeholder.com/600x750?text=No+Image'}
                alt={product.name}
              />
              {discount && <span className="badge badge-red product-images__badge">-{discount}%</span>}
              <button
                className={`product-images__wishlist${isWishlisted ? ' active' : ''}`}
                onClick={handleWishlist}
              >
                <FiHeart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="product-info">
            <p className="product-info__brand">{product.brand}</p>
            <h1 className="product-info__name">{product.name}</h1>

            {product.numReviews > 0 && (
              <div className="product-info__rating">
                <div className="stars">
                  {[1,2,3,4,5].map((s) => (
                    <FiStar key={s} size={14} fill={s <= Math.round(product.rating) ? '#c9a84c' : 'none'} color="#c9a84c" />
                  ))}
                </div>
                <span>{product.rating.toFixed(1)}</span>
                <span className="product-info__review-count">({product.numReviews} reviews)</span>
              </div>
            )}

            <div className="product-info__price">
              {product.salePrice ? (
                <>
                  <span className="product-info__price--sale">PKR {product.salePrice.toLocaleString()}</span>
                  <span className="product-info__price--original">PKR {product.price.toLocaleString()}</span>
                  <span className="badge badge-red">Save {discount}%</span>
                </>
              ) : (
                <span>PKR {product.price.toLocaleString()}</span>
              )}
            </div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="product-info__section">
                <p className="product-info__label">Color: <strong>{selectedColor}</strong></p>
                <div className="product-info__colors">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      className={`color-btn${selectedColor === c.name ? ' active' : ''}`}
                      style={{ background: c.hex }}
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="product-info__section">
                <div className="product-info__size-header">
                  <p className="product-info__label">Size: <strong>{selectedSize}</strong></p>
                  <button className="product-info__size-guide">Size Guide</button>
                </div>
                <div className="product-info__sizes">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={`size-btn${selectedSize === s ? ' active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add to Cart */}
            <div className="product-info__add">
              <div className="qty-control">
                <button onClick={() => setQty(Math.max(1, qty - 1))}><FiMinus size={14} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))}><FiPlus size={14} /></button>
              </div>
              <button
                className="btn btn-primary product-info__cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <FiShoppingBag size={16} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                className={`product-info__wish-btn${isWishlisted ? ' active' : ''}`}
                onClick={handleWishlist}
              >
                <FiHeart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {product.stock > 0 && product.stock < 10 && (
              <p className="product-info__stock-warn">Only {product.stock} left in stock!</p>
            )}

            {/* Shipping info */}
            <div className="product-info__features">
              <div className="product-info__feature">
                <FiTruck size={16} />
                <span>Free shipping on orders over PKR 5,000</span>
              </div>
              <div className="product-info__feature">
                <FiRefreshCw size={16} />
                <span>30-day hassle-free returns</span>
              </div>
              <div className="product-info__feature">
                <FiShield size={16} />
                <span>Genuine product guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-tabs">
          <div className="product-tabs__nav">
            {['description','reviews'].map((t) => (
              <button
                key={t}
                className={`product-tabs__btn${tab === t ? ' active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t === 'reviews' ? `Reviews (${product.numReviews})` : 'Description'}
              </button>
            ))}
          </div>

          {tab === 'description' && (
            <div className="product-tabs__content">
              <p className="product-desc">{product.description}</p>
              {product.tags?.length > 0 && (
                <div className="product-tags">
                  {product.tags.map((t) => (
                    <span key={t} className="product-tag">{t}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="product-tabs__content">
              {/* Review list */}
              {product.reviews.length === 0 ? (
                <p className="product-no-reviews">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="reviews-list">
                  {product.reviews.map((r) => (
                    <div key={r._id} className="review-item">
                      <div className="review-item__header">
                        <span className="review-item__name">{r.name}</span>
                        <div className="stars">
                          {[1,2,3,4,5].map((s) => (
                            <FiStar key={s} size={12} fill={s <= r.rating ? '#c9a84c' : 'none'} color="#c9a84c" />
                          ))}
                        </div>
                        <span className="review-item__date">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="review-item__comment">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add review */}
              {user && (
                <form className="review-form" onSubmit={handleReview}>
                  <h3 className="review-form__title">Write a Review</h3>
                  <div className="review-form__stars">
                    {[1,2,3,4,5].map((s) => (
                      <button type="button" key={s} onClick={() => setReviewRating(s)}>
                        <FiStar size={22} fill={s <= reviewRating ? '#c9a84c' : 'none'} color="#c9a84c" />
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder="Share your thoughts about this product..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary" disabled={reviewLoading}>
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
              {!user && (
                <p className="review-login-prompt">
                  <Link to="/login">Login</Link> to write a review.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="related-products">
            <p className="section-subtitle">You May Also Like</p>
            <h2 className="section-title" style={{ marginBottom: 32 }}>Related Products</h2>
            <div className="products-grid">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
