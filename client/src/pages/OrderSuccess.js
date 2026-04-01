import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '../store/slices/orderSlice';
import { PageSpinner, StatusBadge } from '../components/common/UI';

export default function OrderSuccess() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector(s => s.order);

  useEffect(() => { dispatch(fetchOrderById(id)); }, [id, dispatch]);

  if (loading) return <PageSpinner />;

  return (
    <div className="min-h-screen page-enter" style={{ paddingTop: 112 }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center py-20">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="section-subtitle mb-3">Thank You</p>
        <h1 className="font-display text-4xl font-semibold mb-4">Order Confirmed!</h1>
        <p className="text-gray-500 mb-2">Your order has been placed successfully.</p>
        <p className="text-xs font-mono text-gray-400 mb-10">Order ID: #{id?.slice(-8).toUpperCase()}</p>

        {order && (
          <div className="bg-gray-50 p-6 text-left mb-10">
            <h3 className="text-sm font-medium tracking-widest uppercase mb-4">Order Details</h3>
            <div className="space-y-3">
              {order.orderItems?.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>${order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs text-gray-500 tracking-wider uppercase">Status:</span>
              <StatusBadge status={order.orderStatus} />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders" className="btn-primary">View My Orders</Link>
          <Link to="/shop" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
