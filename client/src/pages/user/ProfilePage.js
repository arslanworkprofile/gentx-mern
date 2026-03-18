import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(s => s.auth);
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    street: user?.address?.street || '', city: user?.address?.city || '',
    state: user?.address?.state || '', zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
    password: '', confirmPassword: '',
  });

  const handle = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    const payload = { name: form.name, phone: form.phone, address: { street: form.street, city: form.city, state: form.state, zipCode: form.zipCode, country: form.country } };
    if (form.password) payload.password = form.password;
    try {
      await dispatch(updateProfile(payload)).unwrap();
      toast.success('Profile updated!');
      setForm(f => ({ ...f, password: '', confirmPassword: '' }));
    } catch (e) { toast.error(e || 'Update failed'); }
  };

  return (
    <div className="pt-24 min-h-screen page-enter">
      <div className="bg-gray-50 border-b border-gray-100 py-10 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="section-subtitle mb-2">Account</p>
          <h1 className="section-title">My Profile</h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <form onSubmit={handle} className="space-y-6">
          <div className="bg-white border border-gray-100 p-8">
            <h2 className="text-xs tracking-widest uppercase font-medium mb-6">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="label-field">Full Name</label>
                <input className="input-field" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
              </div>
              <div className="md:col-span-2">
                <label className="label-field">Email (cannot change)</label>
                <input className="input-field bg-gray-50 cursor-not-allowed" value={user?.email} disabled />
              </div>
              <div className="md:col-span-2">
                <label className="label-field">Phone</label>
                <input className="input-field" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+1 555 0100" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-8">
            <h2 className="text-xs tracking-widest uppercase font-medium mb-6">Shipping Address</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="label-field">Street</label>
                <input className="input-field" value={form.street} onChange={e => setForm(f => ({...f, street: e.target.value}))} />
              </div>
              <div>
                <label className="label-field">City</label>
                <input className="input-field" value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} />
              </div>
              <div>
                <label className="label-field">State</label>
                <input className="input-field" value={form.state} onChange={e => setForm(f => ({...f, state: e.target.value}))} />
              </div>
              <div>
                <label className="label-field">ZIP Code</label>
                <input className="input-field" value={form.zipCode} onChange={e => setForm(f => ({...f, zipCode: e.target.value}))} />
              </div>
              <div>
                <label className="label-field">Country</label>
                <input className="input-field" value={form.country} onChange={e => setForm(f => ({...f, country: e.target.value}))} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-8">
            <h2 className="text-xs tracking-widest uppercase font-medium mb-6">Change Password</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="label-field">New Password</label>
                <input type="password" className="input-field" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder="Leave blank to keep current" />
              </div>
              <div>
                <label className="label-field">Confirm Password</label>
                <input type="password" className="input-field" value={form.confirmPassword} onChange={e => setForm(f => ({...f, confirmPassword: e.target.value}))} placeholder="Repeat new password" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
