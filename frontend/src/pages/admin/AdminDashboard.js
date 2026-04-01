import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import api from '../../api';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: [], products: [], users: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/orders'),
      api.get('/products?limit=100'),
      api.get('/users'),
    ]).then(([o, p, u]) => {
      setStats({ orders: o.data, products: p.data.products, users: u.data });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const revenue = stats.orders.filter(o => o.isPaid).reduce((s, o) => s + o.totalPrice, 0);
  const pending = stats.orders.filter(o => o.status === 'pending').length;

  const cards = [
    { title: 'Total Revenue', value: `PKR ${revenue.toLocaleString()}`, icon: <FiDollarSign size={24} />, color: '#c9a84c', link: '/admin/orders' },
    { title: 'Total Orders', value: stats.orders.length, icon: <FiShoppingBag size={24} />, color: '#3498db', link: '/admin/orders', sub: `${pending} pending` },
    { title: 'Products', value: stats.products.length, icon: <FiPackage size={24} />, color: '#2ecc71', link: '/admin/products' },
    { title: 'Customers', value: stats.users.length, icon: <FiUsers size={24} />, color: '#9b59b6', link: '/admin/users' },
  ];

  return (
    <div className="admin-page page">
      <div className="container">
        <div className="admin-header">
          <div>
            <p className="admin-breadcrumb"><Link to="/">Home</Link> / Admin</p>
            <h1 className="admin-title">Dashboard</h1>
          </div>
          <Link to="/admin/products/new" className="btn btn-gold">+ Add Product</Link>
        </div>

        {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
          <>
            <div className="admin-stats">
              {cards.map(c => (
                <Link key={c.title} to={c.link} className="stat-card">
                  <div className="stat-card__icon" style={{ background: c.color + '18', color: c.color }}>{c.icon}</div>
                  <div>
                    <p className="stat-card__value">{c.value}</p>
                    <p className="stat-card__title">{c.title}</p>
                    {c.sub && <p className="stat-card__sub">{c.sub}</p>}
                  </div>
                </Link>
              ))}
            </div>

            <div className="admin-grid">
              {/* Recent Orders */}
              <div className="admin-table-card">
                <div className="admin-table-card__header">
                  <h2>Recent Orders</h2>
                  <Link to="/admin/orders">View All <FiArrowRight size={14} /></Link>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.orders.slice(0, 6).map(o => (
                      <tr key={o._id}>
                        <td>#{o._id.slice(-8).toUpperCase()}</td>
                        <td>{o.user?.name || '—'}</td>
                        <td>PKR {o.totalPrice?.toLocaleString()}</td>
                        <td><span className={`badge ${o.status === 'delivered' ? 'badge-green' : o.status === 'cancelled' ? 'badge-red' : 'badge-gold'}`}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Low stock */}
              <div className="admin-table-card">
                <div className="admin-table-card__header">
                  <h2>Low Stock</h2>
                  <Link to="/admin/products">Manage <FiArrowRight size={14} /></Link>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.products.filter(p => p.stock <= 10).slice(0, 6).map(p => (
                      <tr key={p._id}>
                        <td>{p.name}</td>
                        <td>{p.category}</td>
                        <td><span className={`badge ${p.stock === 0 ? 'badge-red' : 'badge-gold'}`}>{p.stock}</span></td>
                      </tr>
                    ))}
                    {stats.products.filter(p => p.stock <= 10).length === 0 && (
                      <tr><td colSpan={3} style={{textAlign:'center',color:'var(--gray-400)',padding:'20px'}}>All products well-stocked</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
