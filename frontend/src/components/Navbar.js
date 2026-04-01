import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiUser, FiMenu, FiX, FiSearch, FiChevronDown } from 'react-icons/fi';
import { useAuthStore, useCartStore } from '../store';
import toast from 'react-hot-toast';
import './Navbar.css';

const CATEGORIES = [
  { label: 'Shirts', value: 'shirts' },
  { label: 'Pants', value: 'pants' },
  { label: 'Suits & Blazers', value: 'suits' },
  { label: 'Shoes', value: 'shoes' },
  { label: 'Jackets', value: 'jackets' },
  { label: 'Watches', value: 'watches' },
  { label: 'Accessories', value: 'accessories' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userOpen, setUserOpen] = useState(false);

  const { user, logout } = useAuthStore();
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));
  const navigate = useNavigate();
  const location = useLocation();
  const shopRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShopOpen(false);
    setUserOpen(false);
  }, [location]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (shopRef.current && !shopRef.current.contains(e.target)) setShopOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  const isHome = location.pathname === '/';

  return (
    <>
      <nav className={`navbar${scrolled || !isHome ? ' navbar--solid' : ''}${mobileOpen ? ' navbar--open' : ''}`}>
        <div className="navbar__inner">
          {/* Left */}
          <div className="navbar__left">
            <button className="navbar__hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            <nav className="navbar__links">
              <Link to="/" className="navbar__link">Home</Link>

              <div className="navbar__dropdown" ref={shopRef}>
                <button className="navbar__link navbar__link--drop" onClick={() => setShopOpen(!shopOpen)}>
                  Shop <FiChevronDown size={14} className={shopOpen ? 'rotated' : ''} />
                </button>
                {shopOpen && (
                  <div className="navbar__mega">
                    <div className="navbar__mega-inner">
                      <p className="navbar__mega-title">Shop by Category</p>
                      <div className="navbar__mega-grid">
                        {CATEGORIES.map((c) => (
                          <Link key={c.value} to={`/shop/${c.value}`} className="navbar__mega-item">
                            {c.label}
                          </Link>
                        ))}
                        <Link to="/shop" className="navbar__mega-item navbar__mega-item--all">
                          All Products →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/shop?newArrival=true" className="navbar__link">New Arrivals</Link>
              <Link to="/shop?bestSeller=true" className="navbar__link">Best Sellers</Link>
            </nav>
          </div>

          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-text">GENT<span>X</span></span>
          </Link>

          {/* Right */}
          <div className="navbar__actions">
            <button className="navbar__icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
              <FiSearch size={20} />
            </button>

            <Link to="/wishlist" className="navbar__icon-btn" aria-label="Wishlist">
              <FiHeart size={20} />
            </Link>

            <Link to="/cart" className="navbar__icon-btn navbar__cart-btn" aria-label="Cart">
              <FiShoppingBag size={20} />
              {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
            </Link>

            {user ? (
              <div className="navbar__dropdown" ref={userRef}>
                <button className="navbar__icon-btn" onClick={() => setUserOpen(!userOpen)}>
                  <FiUser size={20} />
                </button>
                {userOpen && (
                  <div className="navbar__user-menu">
                    <p className="navbar__user-name">{user.name}</p>
                    <Link to="/profile" className="navbar__user-link">My Profile</Link>
                    <Link to="/orders" className="navbar__user-link">My Orders</Link>
                    {user.isAdmin && <Link to="/admin" className="navbar__user-link navbar__user-link--admin">Admin Panel</Link>}
                    <button onClick={handleLogout} className="navbar__user-link navbar__user-link--logout">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="navbar__icon-btn" aria-label="Login">
                <FiUser size={20} />
              </Link>
            )}
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <form className="navbar__search" onSubmit={handleSearch}>
            <input
              autoFocus
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar__search-input"
            />
            <button type="submit" className="navbar__search-btn">
              <FiSearch size={18} />
            </button>
            <button type="button" onClick={() => setSearchOpen(false)} className="navbar__search-close">
              <FiX size={18} />
            </button>
          </form>
        )}
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu${mobileOpen ? ' mobile-menu--open' : ''}`}>
        <div className="mobile-menu__inner">
          <Link to="/" className="mobile-menu__link">Home</Link>
          <p className="mobile-menu__label">Shop</p>
          {CATEGORIES.map((c) => (
            <Link key={c.value} to={`/shop/${c.value}`} className="mobile-menu__link mobile-menu__link--sub">
              {c.label}
            </Link>
          ))}
          <Link to="/shop" className="mobile-menu__link">All Products</Link>
          <Link to="/shop?newArrival=true" className="mobile-menu__link">New Arrivals</Link>
          <Link to="/shop?bestSeller=true" className="mobile-menu__link">Best Sellers</Link>
          <Link to="/wishlist" className="mobile-menu__link">Wishlist</Link>
          {user ? (
            <>
              <Link to="/profile" className="mobile-menu__link">Profile</Link>
              <Link to="/orders" className="mobile-menu__link">Orders</Link>
              {user.isAdmin && <Link to="/admin" className="mobile-menu__link">Admin Panel</Link>}
              <button onClick={handleLogout} className="mobile-menu__link mobile-menu__link--logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-menu__link">Login</Link>
              <Link to="/register" className="mobile-menu__link">Register</Link>
            </>
          )}
        </div>
      </div>
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
    </>
  );
}
