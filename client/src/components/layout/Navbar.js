import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { selectCartItemCount } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);
  const [searchQ,    setSearchQ]    = useState('');
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user }   = useSelector(s => s.auth);
  const cartCount  = useSelector(selectCartItemCount);
  const searchRef  = useRef(null);
  const userRef    = useRef(null);

  const isHome      = location.pathname === '/';
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setUserOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => { dispatch(logout()); toast.success('Signed out'); navigate('/'); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQ.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(searchQ.trim())}`);
    setSearchQ(''); setSearchOpen(false);
  };

  const navLinks = [
    { label: 'Shop',        to: '/shop' },
    { label: 'Shirts',      to: '/shop?category=shirts' },
    { label: 'Jackets',     to: '/shop?category=jackets' },
    { label: 'Accessories', to: '/shop?category=accessories' },
    { label: 'About',       to: '/about' },
  ];

  const iconClass = `transition-colors duration-200 ${transparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'}`;

  return (
    <>
      {/* ── Main nav ───────────────────────────────────── */}
      <nav
        style={{ transition: 'background-color 0.4s ease, box-shadow 0.4s ease' }}
        className={`fixed top-0 left-0 right-0 z-50 ${
          transparent
            ? 'bg-transparent'
            : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100'
        }`}
      >
        {/* Announcement bar */}
        <div
          className={`text-center py-2 px-4 text-[10px] tracking-[0.22em] uppercase font-medium transition-colors duration-400 ${
            transparent ? 'text-white/60 bg-black/10' : 'text-gray-400 bg-gray-50'
          }`}
        >
          Free Shipping on Orders Over $150 &nbsp;·&nbsp; Est. Delivery 3–5 Days
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 z-10">
            <span
              className="font-display text-2xl font-semibold tracking-tight"
              style={{ color: transparent ? '#fafafa' : '#0a0a0a', transition: 'color 0.4s' }}
            >
              Gent<span style={{ color: '#c9a96e' }}> X</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to} to={to}
                className={`relative text-[11px] tracking-[0.18em] uppercase font-medium group ${iconClass}`}
              >
                {label}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                  style={{ background: transparent ? '#fafafa' : '#c9a96e' }}
                />
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className={`p-2 ${iconClass}`}
              aria-label="Search"
            >
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link to="/cart" className={`relative p-2 ${iconClass}`} aria-label="Cart">
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 text-black text-[9px] font-bold flex items-center justify-center"
                  style={{ background: '#c9a96e', borderRadius: '50%' }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User — desktop */}
            <div className="hidden sm:block relative" ref={userRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setUserOpen(!userOpen)}
                    className={`flex items-center gap-1.5 p-2 ${iconClass}`}
                    aria-label="Account"
                  >
                    <div
                      className="w-7 h-7 flex items-center justify-center text-xs font-bold"
                      style={{ background: '#c9a96e', color: '#0a0a0a' }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  {userOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 shadow-xl z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-semibold truncate mt-0.5">{user.name}</p>
                      </div>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-xs tracking-wider uppercase text-[#c9a96e] hover:bg-gray-50 transition-colors font-medium">
                          ⚙ Admin Panel
                        </Link>
                      )}
                      {[['Dashboard','/dashboard'],['My Orders','/orders'],['Profile','/profile']].map(([label, to]) => (
                        <Link key={to} to={to} className="block px-4 py-2.5 text-xs tracking-wider uppercase hover:bg-gray-50 transition-colors text-gray-600 hover:text-black">{label}</Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-xs tracking-wider uppercase text-red-400 hover:bg-red-50 transition-colors border-t border-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className={`text-[11px] tracking-[0.18em] uppercase font-medium p-2 ${iconClass}`}
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2 ${iconClass}`}
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu ─────────────────────────────────── */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          {/* Panel */}
          <div className="absolute top-0 right-0 bottom-0 w-[80vw] max-w-[320px] bg-white flex flex-col animate-slide-in overflow-y-auto overflow-x-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <span className="font-display text-xl font-semibold">
                Gent<span style={{ color: '#c9a96e' }}> X</span>
              </span>
              <button onClick={() => setMenuOpen(false)} className="p-1 text-gray-400 hover:text-black">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-6 py-6 space-y-1">
              {navLinks.map(({ label, to }) => (
                <Link
                  key={to} to={to}
                  className="flex items-center justify-between py-3 text-sm tracking-[0.12em] uppercase font-medium text-gray-700 hover:text-black border-b border-gray-50 transition-colors"
                >
                  {label}
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ))}
            </nav>

            {/* User section */}
            <div className="px-6 pb-8 pt-4 border-t border-gray-100 space-y-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-9 h-9 flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: '#c9a96e', color: '#0a0a0a' }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block text-xs tracking-widest uppercase py-2 text-[#c9a96e] font-medium">⚙ Admin Panel</Link>
                  )}
                  {[['Dashboard','/dashboard'],['Orders','/orders'],['Profile','/profile']].map(([l,t]) => (
                    <Link key={t} to={t} className="block text-xs tracking-widest uppercase py-2 text-gray-600 hover:text-black transition-colors">{l}</Link>
                  ))}
                  <button onClick={handleLogout} className="block text-xs tracking-widest uppercase py-2 text-red-400 hover:text-red-600 transition-colors w-full text-left">Sign Out</button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login"    className="flex-1 btn-primary text-center py-3 text-xs">Sign In</Link>
                  <Link to="/register" className="flex-1 btn-secondary text-center py-3 text-xs">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Search overlay ───────────────────────────────── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-28 px-4"
          style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl animate-fade-up"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-[10px] text-gray-500 tracking-[0.25em] uppercase mb-5">Search Gent X</p>
            <form onSubmit={handleSearch} className="flex items-center border-b border-white/15 pb-5">
              <input
                ref={searchRef}
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search for products…"
                className="flex-1 bg-transparent text-white text-2xl sm:text-3xl font-display placeholder-gray-600 outline-none"
              />
              <button type="submit" className="ml-4 p-2" style={{ color: '#c9a96e' }}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </form>
            <p className="text-gray-600 text-xs mt-4 tracking-wider">Press ESC or click outside to close</p>
          </div>
        </div>
      )}
    </>
  );
}
