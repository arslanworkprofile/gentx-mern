import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import './MiscPages.css';

export default function OrderDetailPage() {
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
        <h1 className="misc-title">Order <span>#{order._id.slice(-8).toUpperCase()}</span></h1>
        <div className="order-detail-layout">
          <div>
            <div className="order-detail-section">
              <h3>Items Ordered</h3>
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
              <p>
                {order.shippingAddress?.name}<br />
                {order.shippingAddress?.street}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.country}<br />
                {order.shippingAddress?.phone}
              </p>
            </div>
          </div>
          <div className="order-detail-summary">
            <h3>Order Summary</h3>
            <div className="order-detail-row"><span>Items</span><span>PKR {order.itemsPrice?.toLocaleString()}</span></div>
            <div className="order-detail-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : `PKR ${order.shippingPrice}`}</span></div>
            <div className="order-detail-row order-detail-row--total"><span>Total</span><span>PKR {order.totalPrice?.toLocaleString()}</span></div>
            <div className="order-detail-row"><span>Payment</span><span style={{textTransform:'capitalize'}}>{order.paymentMethod}</span></div>
            <div className="order-detail-row">
              <span>Status</span>
              <span className={`badge ${order.status === 'delivered' ? 'badge-green' : order.status === 'cancelled' ? 'badge-red' : 'badge-gold'}`}>{order.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
