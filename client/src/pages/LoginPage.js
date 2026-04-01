import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { loading, error } = useSelector(s => s.auth);
  const [form, setForm]   = useState({ email: '', password: '' });
  const [show, setShow]   = useState(false);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const handle = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      toast.error('Please enter email and password'); return;
    }
    try {
      const res = await dispatch(loginUser(form)).unwrap();
      toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`);
      navigate(res.user.role === 'admin' ? '/admin' : from);
    } catch { /* error shown by useEffect above */ }
  };

  const quickFill = (email, password) => {
    setForm({ email, password });
  };

  return (
    <div className="min-h-screen flex" style={{ paddingTop: 80 }}>
      {/* Left image — desktop only */}
      <div className="hidden lg:block w-1/2 relative flex-shrink-0">
        <img
          src="https://images.unsplash.com/photo-1490551902236-7231eb14e87c?w=900&h=1200&fit=crop&q=80"
          alt="Gent X"
          className="w-full h-full object-cover"
          style={{ position: 'sticky', top: 80, maxHeight: 'calc(100vh - 80px)' }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-12" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 60%)' }}>
          <Link to="/">
            <span className="font-display text-4xl font-semibold text-white">Gent<span style={{ color: '#c9a96e' }}> X</span></span>
          </Link>
          <p className="text-white/50 text-sm mt-2">Premium fashion for the modern gentleman.</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden block mb-8 text-center">
            <span className="font-display text-3xl font-semibold">Gent<span style={{ color: '#c9a96e' }}> X</span></span>
          </Link>

          <p className="section-subtitle mb-2">Welcome Back</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-8">Sign In</h1>

          <form onSubmit={handle} className="space-y-5">
            <div>
              <label className="label-field">Email Address</label>
              <input
                type="email"
                className="input-field"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="label-field">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  className="input-field pr-12"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-black transition-colors tracking-wider uppercase"
                >
                  {show ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 disabled:opacity-50"
              style={{ justifyContent: 'center' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="spinner w-4 h-4 border-2" style={{ borderTopColor: '#c9a96e' }} />
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-black hover:text-[#c9a96e] transition-colors">
              Create one
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 border border-dashed border-gray-200 p-5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-3">Quick Demo Login</p>
            <div className="space-y-2">
              {[
                { label: '⚙ Admin', email: 'admin@gentx.com',  pass: 'admin123' },
                { label: '👤 User',  email: 'alex@example.com', pass: 'user123' },
              ].map(d => (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => quickFill(d.email, d.pass)}
                  className="w-full text-left px-3 py-2.5 border border-gray-100 hover:border-black transition-colors flex items-center justify-between group"
                >
                  <div>
                    <span className="text-xs font-medium">{d.label}</span>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{d.email}</p>
                  </div>
                  <span className="text-[10px] text-gray-300 tracking-wider uppercase group-hover:text-[#c9a96e] transition-colors">Fill →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
