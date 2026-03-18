// LoginPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export function LoginPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handle = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(loginUser(form)).unwrap();
      toast.success(`Welcome back, ${res.user.name}!`);
      navigate(res.user.role === 'admin' ? '/admin' : '/');
    } catch {}
  };

  return (
    <div className="min-h-screen pt-16 flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1490551902236-7231eb14e87c?w=800&h=1000&fit=crop" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-end p-12">
          <div>
            <span className="font-display text-4xl font-semibold text-white">Gent<span className="text-accent"> X</span></span>
            <p className="text-white/60 text-sm mt-2">Premium fashion for the modern gentleman.</p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <p className="section-subtitle mb-2">Welcome Back</p>
            <h1 className="font-display text-3xl font-semibold">Sign In</h1>
          </div>
          <form onSubmit={handle} className="space-y-5">
            <div>
              <label className="label-field">Email</label>
              <input type="email" className="input-field" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="label-field">Password</label>
              <input type="password" className="input-field" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-8 text-center space-y-3">
            <p className="text-sm text-gray-500">
              Don't have an account? <Link to="/register" className="text-black font-medium hover:text-accent transition-colors">Register</Link>
            </p>
            <div className="border-t border-gray-100 pt-6">
              <p className="text-xs text-gray-400 mb-3 tracking-wider uppercase">Demo Credentials</p>
              <div className="space-y-2 text-xs text-gray-500 font-mono">
                <p>Admin: admin@gentx.com / admin123</p>
                <p>User: alex@example.com / user123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
