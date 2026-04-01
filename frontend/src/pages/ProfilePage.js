import React, { useState } from 'react';
import api from '../api';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';
import './MiscPages.css';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        ...(form.password && { password: form.password }),
      });
      setUser(data);
      toast.success('Profile updated!');
      setForm(f => ({ ...f, password: '', confirm: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page misc-page">
      <div className="container">
        <h1 className="misc-title">My Profile</h1>
        <div className="profile-layout">
          <div className="profile-card">
            <h2>Personal Information</h2>
            <form onSubmit={handleSubmit}>
              {[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
                { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+92 300 0000000' },
                { key: 'password', label: 'New Password', type: 'password', placeholder: 'Leave blank to keep current' },
                { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Re-enter new password' },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <input
                    type={f.type}
                    className="form-input"
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  />
                </div>
              ))}
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
