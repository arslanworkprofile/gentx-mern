import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import api from '../api';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const CATEGORIES = [
  { label: 'Shirts', value: 'shirts', img: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600' },
  { label: 'Pants', value: 'pants', img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600' },
  { label: 'Suits', value: 'suits', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600' },
  { label: 'Shoes', value: 'shoes', img: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600' },
  { label: 'Jackets', value: 'jackets', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600' },
  { label: 'Watches', value: 'watches', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [f, n, b] = await Promise.all([
          api.get('/products?featured=true&limit=4'),
          api.get('/products?newArrival=true&limit=4'),
          api.get('/products?bestSeller=true&limit=4'),
        ]);
        setFeatured(f.data.products);
        setNewArrivals(n.data.products);
        setBestSellers(b.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <main className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero__bg">
          <img
            src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600"
            alt="GentX Hero"
          />
          <div className="hero__overlay" />
        </div>
        <div className="hero__content">
          <p className="section-subtitle">New Collection 2025</p>
          <h1 className="hero__title">Dress Like<br />a <em>Gentleman</em></h1>
          <p className="hero__desc">
            Premium men's fashion crafted for the modern gentleman. Timeless pieces, flawless fit.
          </p>
          <div className="hero__ctas">
            <Link to="/shop" className="btn btn-gold">Shop Now <FiArrowRight /></Link>
            <Link to="/shop?newArrival=true" className="btn btn-outline hero__btn-outline">New Arrivals</Link>
          </div>
          <div className="hero__stats">
            <div><strong>500+</strong><span>Products</span></div>
            <div><strong>10K+</strong><span>Happy Customers</span></div>
            <div><strong>4.9</strong><span><FiStar style={{display:'inline',verticalAlign:'middle'}} /> Rating</span></div>
          </div>
        </div>
        <div className="hero__scroll">
          <span>Scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee__track">
          {['Free Shipping Over PKR 5000', 'Premium Quality Guaranteed', 'New Arrivals Every Week', 'Easy Returns Within 30 Days', 'Free Shipping Over PKR 5000', 'Premium Quality Guaranteed', 'New Arrivals Every Week', 'Easy Returns Within 30 Days'].map((t, i) => (
            <span key={i}>{t} <span className="marquee__dot">◆</span></span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle">Explore</p>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((c) => (
              <Link key={c.value} to={`/shop/${c.value}`} className="category-card">
                <div className="category-card__img">
                  <img src={c.img} alt={c.label} loading="lazy" />
                  <div className="category-card__overlay" />
                </div>
                <div className="category-card__info">
                  <p>{c.label}</p>
                  <span>Shop →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="home-section home-section--alt">
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle">Handpicked</p>
            <h2 className="section-title">Featured Products</h2>
            <Link to="/shop?featured=true" className="section-see-all">View All <FiArrowRight /></Link>
          </div>
          {loading ? (
            <div className="products-grid">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 420, borderRadius: 2 }} />)}
            </div>
          ) : (
            <div className="products-grid">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* BANNER */}
      <section className="banner">
        <div className="banner__bg">
          <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1400" alt="Sale" />
          <div className="banner__overlay" />
        </div>
        <div className="banner__content container">
          <p className="section-subtitle">Limited Time</p>
          <h2 className="banner__title">Season Sale<br /><em>Up to 40% Off</em></h2>
          <Link to="/shop?sale=true" className="btn btn-gold">Shop the Sale <FiArrowRight /></Link>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle">Just In</p>
            <h2 className="section-title">New Arrivals</h2>
            <Link to="/shop?newArrival=true" className="section-see-all">View All <FiArrowRight /></Link>
          </div>
          {loading ? (
            <div className="products-grid">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 420 }} />)}
            </div>
          ) : (
            <div className="products-grid">
              {newArrivals.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="home-section home-section--alt">
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle">Top Rated</p>
            <h2 className="section-title">Best Sellers</h2>
            <Link to="/shop?bestSeller=true" className="section-see-all">View All <FiArrowRight /></Link>
          </div>
          {loading ? (
            <div className="products-grid">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 420 }} />)}
            </div>
          ) : (
            <div className="products-grid">
              {bestSellers.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* WHY US */}
      <section className="why-us">
        <div className="container">
          <div className="why-us__grid">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On all orders above PKR 5,000 across Pakistan' },
              { icon: '↩', title: 'Easy Returns', desc: '30-day hassle-free return and exchange policy' },
              { icon: '🔒', title: 'Secure Payment', desc: 'Your payment information is always protected' },
              { icon: '⭐', title: 'Premium Quality', desc: 'Handpicked fabrics and expert craftsmanship' },
            ].map((item) => (
              <div key={item.title} className="why-us__item">
                <span className="why-us__icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
