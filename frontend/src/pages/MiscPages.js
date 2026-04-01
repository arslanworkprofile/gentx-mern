// OrderSuccessPage
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiCheckCircle, FiPackage } from 'react-icons/fi';
import api from '../api';
import './MiscPages.css';

export function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data)).catch(() => {});
  }, [id]);

  return (
    <div className="page success-page">
      <div className="success-card">
        <FiCheckCircle size={64} className="success-icon" />
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. Your order has been placed successfully.</p>
        {order && (
          <div className="success-details">
            <p><strong>Order ID:</strong> #{order._id.slice(-8).toUpperCase()}</p>
            <p><strong>Total:</strong> PKR {order.totalPrice?.toLocaleString()}</p>
            <p><strong>Payment:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
            <p><strong>Status:</strong> <span className="badge badge-gold">{order.status}</span></p>
          </div>
        )}
        <div className="success-actions">
          <Link to="/orders" className="btn btn-primary"><FiPackage /> View My Orders</Link>
          <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

// OrdersPage
export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders').then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statusColor = { pending: 'badge-gold', processing: 'badge-black', shipped: 'badge-black', delivered: 'badge-green', cancelled: 'badge-red' };

  return (
    <div className="page misc-page">
      <div className="container">
        <h1 className="misc-title">My Orders</h1>
        {loading ? <div className="loading-screen"><div className="spinner" /></div>
        : orders.length === 0 ? (
          <div className="misc-empty">
            <p>No orders yet.</p>
            <Link to="/shop" className="btn btn-outline" style={{marginTop:16}}>Start Shopping</Link>
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
                  <span className={`badge ${statusColor[o.status] || 'badge-black'}`}>{o.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// OrderDetailPage
export function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => { setOrder(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page loading-screen"><div className="spinner" /></div>;
  if (!order) return <div className="page loading-screen"><p>Order not found</p></div>;

  return (
    <div className="page misc-page">
      <div className="container">
        <h1 className="misc-title">Order #{order._id.slice(-8).toUpperCase()}</h1>
        <div className="order-detail-layout">
          <div>
            <div className="order-detail-section">
              <h3>Items</h3>
              {order.orderItems.map((item, i) => (
                <div key={i} className="order-detail-item">
                  <img src={item.image || 'https://via.placeholder.com/60x75'} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    {item.size && <span>Size: {item.size}</span>}
                    {item.color && <span> · Color: {item.color}</span>}
                    <br /><span>Qty: {item.qty} × PKR {item.price?.toLocaleString()}</span>
                  </div>
                  <p>PKR {(item.qty * item.price).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="order-detail-section">
              <h3>Shipping Address</h3>
              <p>{order.shippingAddress?.name}<br />
                {order.shippingAddress?.street}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.country}<br />
                {order.shippingAddress?.phone}
              </p>
            </div>
          </div>
          <div className="order-detail-summary">
            <h3>Summary</h3>
            <div className="order-detail-row"><span>Items</span><span>PKR {order.itemsPrice?.toLocaleString()}</span></div>
            <div className="order-detail-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : `PKR ${order.shippingPrice}`}</span></div>
            <div className="order-detail-row order-detail-row--total"><span>Total</span><span>PKR {order.totalPrice?.toLocaleString()}</span></div>
            <div className="order-detail-row"><span>Payment</span><span>{order.paymentMethod}</span></div>
            <div className="order-detail-row"><span>Status</span><span className={`badge ${order.status === 'delivered' ? 'badge-green' : 'badge-gold'}`}>{order.status}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ProfilePage
export function ProfilePage() {
  const { user, setUser } = require('../store').useAuthStore();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirm) return require('react-hot-toast').default.error('Passwords do not match');
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', { name: form.name, email: form.email, phone: form.phone, ...(form.password && { password: form.password }) });
      setUser(data);
      require('react-hot-toast').default.success('Profile updated!');
    } catch (err) {
      require('react-hot-toast').default.error('Update failed');
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
                { key: 'name', label: 'Full Name', type: 'text' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'phone', label: 'Phone', type: 'tel' },
                { key: 'password', label: 'New Password', type: 'password', placeholder: 'Leave blank to keep current' },
                { key: 'confirm', label: 'Confirm Password', type: 'password' },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <input type={f.type} className="form-input" placeholder={f.placeholder || ''} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <button type="submit" className="btn btn-primary" disabled={loading} style={{width:'100%'}}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// WishlistPage
export function WishlistPage() {
  const items = require('../store').useWishlistStore(s => s.items);

  return (
    <div className="page misc-page">
      <div className="container">
        <h1 className="misc-title">My Wishlist <span>({items.length})</span></h1>
        {items.length === 0 ? (
          <div className="misc-empty">
            <p>Your wishlist is empty.</p>
            <Link to="/shop" className="btn btn-outline" style={{marginTop:16}}>Browse Products</Link>
          </div>
        ) : (
          <div className="products-grid">
            {items.map(p => <require('../components/ProductCard').default key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// NotFoundPage
export function NotFoundPage() {
  return (
    <div className="page success-page">
      <div className="success-card">
        <p style={{fontSize:80,marginBottom:16}}>404</p>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <div className="success-actions">
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <Link to="/shop" className="btn btn-outline">Browse Shop</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
