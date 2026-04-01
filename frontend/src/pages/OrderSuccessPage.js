import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiCheckCircle, FiPackage } from 'react-icons/fi';
import api from '../api';
import './MiscPages.css';

export default function OrderSuccessPage() {
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
