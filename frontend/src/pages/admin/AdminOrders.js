import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiChevronDown } from 'react-icons/fi';
import api from '../../api';
import toast from 'react-hot-toast';
import './Admin.css';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetch = () =>
    api.get('/orders').then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));

  useEffect(() => { fetch(); }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetch();
    } catch { toast.error('Update failed'); }
    finally { setUpdatingId(null); }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const statusColor = {
    pending: 'badge-gold', processing: 'badge-black',
    shipped: 'badge-black', delivered: 'badge-green', cancelled: 'badge-red',
  };

  return (
    <div className="admin-page page">
      <div className="container">
        <div className="admin-header">
          <div>
            <p className="admin-breadcrumb"><Link to="/admin">Dashboard</Link> / Orders</p>
            <h1 className="admin-title">Orders</h1>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="admin-filter-tabs">
          {['all', ...STATUSES].map(s => (
            <button
              key={s}
              className={`admin-filter-tab${filter === s ? ' active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              <span className="admin-filter-count">
                {s === 'all' ? orders.length : orders.filter(o => o.status === s).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : (
          <div className="admin-table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '40px' }}>
                      No orders found
                    </td>
                  </tr>
                ) : filtered.map(o => (
                  <tr key={o._id}>
                    <td className="admin-table__mono">#{o._id.slice(-8).toUpperCase()}</td>
                    <td>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--black)' }}>{o.user?.name || '—'}</p>
                        <p style={{ fontSize: 11, color: 'var(--gray-400)' }}>{o.user?.email}</p>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td>{o.orderItems?.length}</td>
                    <td style={{ fontWeight: 600 }}>PKR {o.totalPrice?.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${o.isPaid ? 'badge-green' : 'badge-red'}`}>
                        {o.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-status-select-wrap">
                        <select
                          className="admin-status-select"
                          value={o.status}
                          onChange={e => handleStatusChange(o._id, e.target.value)}
                          disabled={updatingId === o._id}
                          style={{
                            borderColor: o.status === 'delivered' ? 'var(--green)'
                              : o.status === 'cancelled' ? 'var(--red)'
                              : 'var(--gold)',
                          }}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                        <FiChevronDown size={12} className="admin-status-chevron" />
                      </div>
                    </td>
                    <td>
                      <Link to={`/orders/${o._id}`} className="admin-action-btn" title="View Order">
                        <FiEye />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
