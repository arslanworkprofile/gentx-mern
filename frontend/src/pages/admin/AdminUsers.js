import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiSearch } from 'react-icons/fi';
import api from '../../api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store';
import './Admin.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user: me } = useAuthStore();

  const fetch = () =>
    api.get('/users').then(r => { setUsers(r.data); setLoading(false); }).catch(() => setLoading(false));

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id, name) => {
    if (id === me?._id) return toast.error("You can't delete your own account");
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      fetch();
    } catch { toast.error('Delete failed'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page page">
      <div className="container">
        <div className="admin-header">
          <div>
            <p className="admin-breadcrumb"><Link to="/admin">Dashboard</Link> / Users</p>
            <h1 className="admin-title">Users</h1>
          </div>
          <div className="admin-search-wrap">
            <FiSearch size={16} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="admin-search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : (
          <div className="admin-table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '40px' }}>
                      No users found
                    </td>
                  </tr>
                ) : filtered.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="admin-user-avatar">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--black)' }}>{u.name}</span>
                        {u._id === me?._id && <span className="badge badge-gold" style={{ fontSize: 9 }}>You</span>}
                      </div>
                    </td>
                    <td style={{ color: 'var(--gray-600)' }}>{u.email}</td>
                    <td>
                      <span className={`badge ${u.isAdmin ? 'badge-gold' : 'badge-black'}`}>
                        {u.isAdmin ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="admin-action-btn admin-action-btn--danger"
                        onClick={() => handleDelete(u._id, u.name)}
                        disabled={u._id === me?._id}
                        title="Delete user"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="admin-table-footer">
              Showing {filtered.length} of {users.length} users
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
