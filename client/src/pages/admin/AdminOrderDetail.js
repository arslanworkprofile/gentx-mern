import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, updateOrderStatus } from '../../store/slices/orderSlice';
import { PageSpinner, StatusBadge } from '../../components/common/UI';
import toast from 'react-hot-toast';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector(s => s.order);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => { dispatch(fetchOrderById(id)); }, [id, dispatch]);
  useEffect(() => { if (order) setNewStatus(order.orderStatus); }, [order]);

  const handleStatusUpdate = async () => {
    try { await dispatch(updateOrderStatus({ id, status: newStatus })).unwrap(); toast.success('Status updated!'); }
    catch (e) { toast.error(e || 'Update failed'); }
  };

  if (loading || !order) return <PageSpinner />;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/orders" className="text-xs tracking-widest uppercase text-gray-400 hover:text-black flex items-center gap-1">
          ← Orders
        </Link>
        <span className="text-gray-200">/</span>
        <span className="font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</span>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          {/* Items */}
          <div className="admin-card">
            <h2 className="text-xs tracking-widest uppercase font-medium mb-5">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems?.map(item => (
                <div key={item._id} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0">
                  <img src={item.image || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100'} alt={item.name} className="w-14 h-18 object-cover bg-gray-100 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.color}{item.size ? ` · ${item.size}` : ''}</p>
                    <p className="text-sm mt-1">${item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="admin-card">
            <h2 className="text-xs tracking-widest uppercase font-medium mb-4">Shipping Address</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-black">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
              <p>{order.shippingAddress?.country}</p>
              <p>{order.shippingAddress?.phone}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="admin-card">
            <h2 className="text-xs tracking-widest uppercase font-medium mb-4">Customer</h2>
            <p className="font-medium">{order.user?.name}</p>
            <p className="text-sm text-gray-500">{order.user?.email}</p>
          </div>

          {/* Payment */}
          <div className="admin-card">
            <h2 className="text-xs tracking-widest uppercase font-medium mb-4">Payment</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-400">Method</dt><dd className="capitalize">{order.paymentMethod}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-400">Subtotal</dt><dd>${order.itemsPrice?.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-400">Shipping</dt><dd>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice?.toFixed(2)}`}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-400">Tax</dt><dd>${order.taxPrice?.toFixed(2)}</dd></div>
              <div className="flex justify-between font-semibold border-t border-gray-100 pt-2"><dt>Total</dt><dd>${order.totalPrice?.toFixed(2)}</dd></div>
            </dl>
            <div className="mt-3">
              <span className={`text-xs font-medium ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                {order.isPaid ? `✓ Paid ${new Date(order.paidAt).toLocaleDateString()}` : '⏳ Payment pending'}
              </span>
            </div>
          </div>

          {/* Status update */}
          <div className="admin-card">
            <h2 className="text-xs tracking-widest uppercase font-medium mb-4">Update Status</h2>
            <div className="mb-2"><StatusBadge status={order.orderStatus} /></div>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-field mb-4 text-sm">
              {['pending','processing','shipped','delivered','cancelled'].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <button onClick={handleStatusUpdate} disabled={newStatus === order.orderStatus}
              className="btn-primary w-full py-3 text-xs disabled:opacity-40">
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
