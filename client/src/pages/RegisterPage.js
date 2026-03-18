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

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handle = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    try {
      await dispatch(registerUser({ name: form.name, email: form.email, password: form.password })).unwrap();
      toast.success('Account created!');
      navigate('/');
    } catch {}
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link to="/" className="font-display text-2xl font-semibold">Gent<span className="text-accent"> X</span></Link>
          <p className="section-subtitle mt-4 mb-2">Join the Club</p>
          <h1 className="font-display text-3xl font-semibold">Create Account</h1>
        </div>
        <form onSubmit={handle} className="space-y-5">
          <div>
            <label className="label-field">Full Name</label>
            <input className="input-field" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="John Doe" required />
          </div>
          <div>
            <label className="label-field">Email</label>
            <input type="email" className="input-field" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="you@example.com" required />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input type="password" className="input-field" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder="Min 6 characters" required />
          </div>
          <div>
            <label className="label-field">Confirm Password</label>
            <input type="password" className="input-field" value={form.confirm} onChange={e => setForm(f => ({...f, confirm: e.target.value}))} placeholder="Repeat password" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-black font-medium hover:text-accent">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
