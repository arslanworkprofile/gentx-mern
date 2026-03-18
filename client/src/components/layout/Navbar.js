import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { selectCartItemCount } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ]     = useState('');
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useSelector(s => s.auth);
  const cartCount = useSelector(selectCartItemCount);
  const searchRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [location]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleLogout = () => { dispatch(logout()); toast.success('Signed out'); navigate('/'); };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) { navigate(`/shop?search=${encodeURIComponent(searchQ.trim())}`); setSearchQ(''); setSearchOpen(false); }
  };

  const navLinks = [
    { label: 'Shop',        to: '/shop' },
    { label: 'Men',         to: '/shop?category=shirts' },
    { label: 'Jackets',     to: '/shop?category=jackets' },
    { label: 'Accessories', to: '/shop?category=accessories' },
  ];

  const isHome = location.pathname === '/';
  const transparent = isHome && !scrolled;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${transparent ? 'bg-transparent' : 'bg-white border-b border-gray-100 shadow-sm'}`}>
        {/* Top bar */}
        <div className={`text-center py-2 text-[10px] tracking-[0.25em] uppercase font-medium transition-colors duration-500 ${transparent ? 'text-white/70' : 'text-gray-500'} bg-transparent`}>
          Free shipping on orders over $150 — Gent X
        </div>

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className={`font-display text-2xl font-semibold tracking-tight transition-colors duration-300 ${transparent ? 'text-white' : 'text-black'}`}>
              Gent<span className="text-accent"> X</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className={`text-xs tracking-widest uppercase font-medium transition-colors duration-200 relative group ${transparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                {l.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${transparent ? 'bg-white' : 'bg-accent'}`} />
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <button onClick={() => setSearchOpen(true)} className={`transition-colors ${transparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'}`} aria-label="Search">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link to="/cart" className={`relative transition-colors ${transparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'}`} aria-label="Cart">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative group">
                <button className={`flex items-center gap-1.5 text-xs tracking-wider transition-colors ${transparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  </svg>
                </button>
                <div className="absolute right-0 top-8 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium truncate">{user.name}</p>
                  </div>
                  {user.role === 'admin' && <Link to="/admin" className="block px-4 py-2.5 text-xs tracking-wider uppercase text-accent hover:bg-gray-50 transition-colors">Admin Panel</Link>}
                  <Link to="/dashboard" className="block px-4 py-2.5 text-xs tracking-wider uppercase hover:bg-gray-50 transition-colors">Dashboard</Link>
                  <Link to="/orders"    className="block px-4 py-2.5 text-xs tracking-wider uppercase hover:bg-gray-50 transition-colors">Orders</Link>
                  <Link to="/profile"   className="block px-4 py-2.5 text-xs tracking-wider uppercase hover:bg-gray-50 transition-colors">Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-xs tracking-wider uppercase hover:bg-gray-50 text-red-500 transition-colors border-t border-gray-100">Sign Out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className={`text-xs tracking-widest uppercase font-medium transition-colors hidden md:block ${transparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'}`}>Sign In</Link>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden transition-colors ${transparent ? 'text-white' : 'text-black'}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-4">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className="block text-xs tracking-widest uppercase font-medium text-gray-700 py-2 border-b border-gray-50">{l.label}</Link>
            ))}
            {!user && <Link to="/login" className="block text-xs tracking-widest uppercase font-medium text-gray-700 py-2">Sign In</Link>}
            {user && <button onClick={handleLogout} className="text-xs tracking-widest uppercase text-red-500">Sign Out</button>}
          </div>
        )}
      </nav>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-start pt-32 px-6" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-2xl mx-auto" onClick={e => e.stopPropagation()}>
            <p className="text-xs text-gray-400 tracking-widest uppercase mb-4">Search Gent X</p>
            <form onSubmit={handleSearch} className="flex items-center border-b border-white/20 pb-4">
              <input ref={searchRef} value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder="Search products..." className="flex-1 bg-transparent text-white text-2xl font-display placeholder-gray-600 outline-none" />
              <button type="submit" className="text-accent ml-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </form>
            <p className="text-gray-600 text-xs mt-4">Press ESC to close</p>
          </div>
        </div>
      )}
    </>
  );
}
