import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../store/slices/orderSlice';
import { StatusBadge, PageSpinner } from '../../components/common/UI';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { myOrders, loading } = useSelector(s => s.order);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  const stats = [
    { label: 'Orders', value: myOrders.length },
    { label: 'Delivered', value: myOrders.filter(o => o.orderStatus === 'delivered').length },
    { label: 'Pending', value: myOrders.filter(o => o.orderStatus === 'pending').length },
    { label: 'Total Spent', value: `$${myOrders.filter(o => o.isPaid).reduce((a, o) => a + o.totalPrice, 0).toFixed(0)}` },
  ];

  return (
    <div className="pt-24 min-h-screen page-enter">
      <div className="bg-gray-50 border-b border-gray-100 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="section-subtitle mb-2">My Account</p>
          <h1 className="section-title">Welcome, {user?.name?.split(' ')[0]}</h1>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map(s => (
            <div key={s.label} className="bg-white border border-gray-100 p-6 text-center shadow-sm">
              <p className="font-display text-3xl font-semibold mb-1">{s.value}</p>
              <p className="text-xs text-gray-500 tracking-widest uppercase">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[['My Orders','/orders','🛍️'],['Profile','/profile','👤'],['Shop','/shop','🛒'],['Wishlist','#','❤️']].map(([label, to, icon]) => (
            <Link key={label} to={to} className="flex flex-col items-center gap-2 p-5 border border-gray-100 hover:border-black transition-colors text-center group">
              <span className="text-2xl">{icon}</span>
              <span className="text-xs tracking-widest uppercase font-medium group-hover:text-accent transition-colors">{label}</span>
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold">Recent Orders</h2>
            <Link to="/orders" className="text-xs tracking-widest uppercase border-b border-black hover:text-accent hover:border-accent transition-colors">View All</Link>
          </div>
          {loading ? <PageSpinner /> : myOrders.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200">
              <p className="text-gray-500 mb-4">No orders yet</p>
              <Link to="/shop" className="btn-primary inline-block">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.slice(0, 3).map(order => (
                <Link key={order._id} to={`/orders/${order._id}`}
                  className="flex items-center justify-between p-5 border border-gray-100 hover:border-gray-300 transition-colors group">
                  <div>
                    <p className="text-sm font-medium font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge status={order.orderStatus} />
                  <p className="font-semibold">${order.totalPrice.toFixed(2)}</p>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
