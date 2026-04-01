// OrdersPage.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../store/slices/orderSlice';
import { StatusBadge, PageSpinner, EmptyState } from '../../components/common/UI';

export function OrdersPage() {
  const dispatch = useDispatch();
  const { myOrders, loading } = useSelector(s => s.order);
  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  return (
    <div className="min-h-screen page-enter" style={{ paddingTop: 96 }}>
      <div className="bg-gray-50 border-b border-gray-100 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="section-subtitle mb-2">Account</p>
          <h1 className="section-title">My Orders</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {loading ? <PageSpinner /> : myOrders.length === 0 ? (
          <EmptyState icon="📦" title="No orders yet" description="Your orders will appear here after you make a purchase."
            action={<Link to="/shop" className="btn-primary inline-block">Start Shopping</Link>} />
        ) : (
          <div className="space-y-4">
            {myOrders.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`}
                className="block border border-gray-100 hover:border-gray-300 transition-colors p-6 group">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-sm font-medium">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p>
                    <p className="text-xs text-gray-500 mt-1">{order.orderItems.length} item(s)</p>
                  </div>
                  <StatusBadge status={order.orderStatus} />
                  <div className="text-right">
                    <p className="font-display text-lg font-semibold">${order.totalPrice.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">{order.isPaid ? '✓ Paid' : 'Unpaid'}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
