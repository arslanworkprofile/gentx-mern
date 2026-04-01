import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const handle = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    try {
      await dispatch(registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password })).unwrap();
      toast.success('Account created! Welcome to Gent X.');
      navigate('/');
    } catch { /* handled by useEffect */ }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16" style={{ paddingTop: 100 }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/">
            <span className="font-display text-2xl font-semibold">Gent<span style={{ color: '#c9a96e' }}> X</span></span>
          </Link>
          <p className="section-subtitle mt-6 mb-2">Join the Club</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold">Create Account</h1>
        </div>

        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="label-field">Full Name</label>
            <input
              className="input-field"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="John Doe"
              autoComplete="name"
              required
            />
          </div>
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
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                required
              />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-black uppercase tracking-wider transition-colors">
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div>
            <label className="label-field">Confirm Password</label>
            <input
              type={show ? 'text' : 'password'}
              className="input-field"
              value={form.confirm}
              onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              placeholder="Repeat password"
              autoComplete="new-password"
              required
            />
          </div>

          {/* Password strength hint */}
          {form.password && (
            <div className="flex gap-1">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex-1 h-1 transition-colors" style={{
                  background: form.password.length >= i * 2
                    ? i <= 1 ? '#ef4444' : i <= 2 ? '#f59e0b' : i <= 3 ? '#3b82f6' : '#22c55e'
                    : '#efefef'
                }} />
              ))}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 mt-2 disabled:opacity-50" style={{ justifyContent: 'center' }}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="spinner w-4 h-4" />Creating account…
              </span>
            ) : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-black hover:text-[#c9a96e] transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
