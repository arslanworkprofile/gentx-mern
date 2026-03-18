import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, payOrder } from '../../store/slices/orderSlice';
import { PageSpinner, StatusBadge } from '../../components/common/UI';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector(s => s.order);

  useEffect(() => { dispatch(fetchOrderById(id)); }, [id, dispatch]);

  const handlePay = async () => {
    try { await dispatch(payOrder(id)).unwrap(); toast.success('Payment successful!'); }
    catch (e) { toast.error(e || 'Payment failed'); }
  };

  if (loading || !order) return <PageSpinner />;

  return (
    <div className="pt-24 min-h-screen page-enter">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link to="/orders" className="flex items-center gap-2 text-xs tracking-widest uppercase text-gray-500 hover:text-black transition-colors mb-8">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Back to Orders
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="text-sm text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p>
          </div>
          <StatusBadge status={order.orderStatus} />
        </div>

        <div className="space-y-4 mb-8">
          {order.orderItems?.map(item => (
            <div key={item._id} className="flex gap-4 border border-gray-100 p-4">
              <img src={item.image || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100'} alt={item.name} className="w-16 h-20 object-cover bg-gray-100 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">{item.color}{item.size ? ` · ${item.size}` : ''}</p>
                <p className="text-sm mt-1">${item.price.toFixed(2)} × {item.quantity}</p>
              </div>
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-5">
            <h3 className="text-xs tracking-widest uppercase font-medium mb-3">Shipping Address</h3>
            <div className="text-sm text-gray-600 space-y-0.5">
              <p className="font-medium text-black">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
              <p>{order.shippingAddress?.country}</p>
              <p>{order.shippingAddress?.phone}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-5">
            <h3 className="text-xs tracking-widest uppercase font-medium mb-3">Payment</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between"><span>Method</span><span className="capitalize">{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span>Subtotal</span><span>${order.itemsPrice?.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice?.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${order.taxPrice?.toFixed(2)}</span></div>
              <div className="flex justify-between font-semibold text-black border-t border-gray-200 pt-2">
                <span>Total</span><span>${order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {!order.isPaid && (
          <button onClick={handlePay} className="btn-accent w-full py-4">
            Pay Now — ${order.totalPrice?.toFixed(2)} (Demo)
          </button>
        )}
        {order.isPaid && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Paid on {new Date(order.paidAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
