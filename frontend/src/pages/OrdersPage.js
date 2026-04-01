import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './MiscPages.css';

const STATUS_COLOR = { pending: 'badge-gold', processing: 'badge-black', shipped: 'badge-black', delivered: 'badge-green', cancelled: 'badge-red' };

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders').then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="page misc-page">
      <div className="container">
        <h1 className="misc-title">My Orders</h1>
        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div className="misc-empty">
            <p>No orders yet.</p>
            <Link to="/shop" className="btn btn-outline" style={{ marginTop: 16 }}>Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(o => (
              <Link key={o._id} to={`/orders/${o._id}`} className="order-card">
                <div className="order-card__left">
                  <p className="order-card__id">#{o._id.slice(-8).toUpperCase()}</p>
                  <p className="order-card__date">{new Date(o.createdAt).toLocaleDateString()}</p>
                  <p className="order-card__items">{o.orderItems?.length} item(s)</p>
                </div>
                <div className="order-card__right">
                  <p className="order-card__total">PKR {o.totalPrice?.toLocaleString()}</p>
                  <span className={`badge ${STATUS_COLOR[o.status] || 'badge-black'}`}>{o.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
