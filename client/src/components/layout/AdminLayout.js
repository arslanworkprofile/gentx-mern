import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin',          label: 'Dashboard',   exact: true, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/admin/products', label: 'Products',    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { to: '/admin/orders',   label: 'Orders',      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { to: '/admin/users',    label: 'Users',       icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { to: '/admin/settings', label: 'Settings',    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

function SidebarContent({ collapsed, isMobile, onClose, onCollapseToggle, user, onLogout }) {
  return (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-gray-800 flex-shrink-0">
        {(!collapsed || isMobile) && (
          <span className="font-display text-xl font-semibold">
            Gent<span className="text-accent"> X</span>
          </span>
        )}
        {isMobile ? (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors ml-auto"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <button
            onClick={onCollapseToggle}
            className="text-gray-400 hover:text-white transition-colors ml-auto"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {collapsed
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              }
            </svg>
          </button>
        )}
      </div>

      {/* Admin badge */}
      {(!collapsed || isMobile) && (
        <div className="px-5 py-4 border-b border-gray-800 flex-shrink-0">
          <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-1">Signed in as</p>
          <p className="text-sm font-medium text-white truncate">{user?.name}</p>
          <span className="badge-new mt-1 inline-block">Admin</span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-xs tracking-widest uppercase font-medium transition-all duration-200 group
               ${isActive ? 'bg-accent text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`
            }
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
            {(!collapsed || isMobile) && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom links */}
      <div className="p-3 border-t border-gray-800 space-y-1 flex-shrink-0">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 text-xs tracking-widest uppercase text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {(!collapsed || isMobile) && 'Back to Site'}
        </NavLink>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs tracking-widest uppercase text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {(!collapsed || isMobile) && 'Sign Out'}
        </button>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Signed out');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── DESKTOP SIDEBAR (md and above) ── */}
      <aside
        className={`
          hidden md:flex flex-col
          ${collapsed ? 'w-16' : 'w-60'}
          bg-gray-950 text-white
          transition-all duration-300
          fixed top-0 left-0 h-full z-40
        `}
      >
        <SidebarContent
          collapsed={collapsed}
          isMobile={false}
          onCollapseToggle={() => setCollapsed(!collapsed)}
          user={user}
          onLogout={handleLogout}
        />
      </aside>

      {/* ── MOBILE BACKDROP ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50
          bg-gray-950 text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          md:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Admin navigation"
      >
        <SidebarContent
          collapsed={false}
          isMobile={true}
          onClose={() => setMobileOpen(false)}
          user={user}
          onLogout={handleLogout}
        />
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div
        className={`
          flex-1 min-w-0 transition-all duration-300
          ${collapsed ? 'md:ml-16' : 'md:ml-60'}
        `}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-gray-600 hover:text-black transition-colors p-1 -ml-1"
              aria-label="Open admin menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <p className="text-xs text-gray-400 tracking-widest uppercase">Gent X</p>
              <h1 className="text-sm font-semibold text-black">Admin Panel</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
