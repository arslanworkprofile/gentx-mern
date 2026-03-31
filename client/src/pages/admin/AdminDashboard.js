import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderStats } from '../../store/slices/orderSlice';
import { fetchProducts } from '../../store/slices/productSlice';
import { PageSpinner, StatusBadge } from '../../components/common/UI';
import API from '../../utils/api';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector(s => s.order);
  const { total: productTotal } = useSelector(s => s.product);
  const [userStats, setUserStats] = React.useState(null);

  useEffect(() => {
    dispatch(fetchOrderStats());
    dispatch(fetchProducts({ limit: 1 }));
    API.get('/users/stats').then(r => setUserStats(r.data.stats)).catch(() => {});
  }, [dispatch]);

  if (loading && !stats) return <PageSpinner />;

  const statCards = [
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: '💰', color: 'border-l-accent', change: '+12%' },
    { label: 'Total Orders',  value: stats?.totalOrders || 0, icon: '📦', color: 'border-l-blue-400', change: '+8%' },
    { label: 'Products',      value: productTotal || 0, icon: '🏷️', color: 'border-l-purple-400', change: '' },
    { label: 'Total Users',   value: userStats?.total || 0, icon: '👥', color: 'border-l-green-400', change: `+${userStats?.newThisMonth || 0} this month` },
  ];

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Overview</p>
        <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {statCards.map(s => (
          <div key={s.label} className={`admin-card border-l-4 ${s.color}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">{s.label}</p>
                <p className="font-display text-3xl font-semibold">{s.value}</p>
                {s.change && <p className="text-xs text-green-500 mt-1">{s.change}</p>}
              </div>
              <span className="text-2xl">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Order status breakdown */}
      {stats?.statusAgg && (
        <div className="grid md:grid-cols-5 gap-3 mb-10">
          {['pending','processing','shipped','delivered','cancelled'].map(status => {
            const count = stats.statusAgg.find(s => s._id === status)?.count || 0;
            return (
              <div key={status} className="admin-card text-center">
                <p className="font-display text-2xl font-semibold">{count}</p>
                <StatusBadge status={status} />
              </div>
            );
          })}
        </div>
      )}

      <div className="grid xl:grid-cols-2 gap-8">
        {/* Monthly revenue chart (simple bars) */}
        {stats?.monthlyAgg?.length > 0 && (
          <div className="admin-card">
            <h2 className="text-xs tracking-widest uppercase font-medium mb-6">Revenue — Last 6 Months</h2>
            <div className="flex items-end gap-3 h-40">
              {stats.monthlyAgg.map((m, i) => {
                const max = Math.max(...stats.monthlyAgg.map(x => x.revenue));
                const pct = max > 0 ? (m.revenue / max) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] text-gray-400">${(m.revenue/1000).toFixed(1)}k</span>
                    <div className="w-full bg-gray-100 relative" style={{ height: '100px' }}>
                      <div className="absolute bottom-0 left-0 right-0 bg-accent transition-all duration-500" style={{ height: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500">{monthNames[(m._id.month - 1)]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent orders */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs tracking-widest uppercase font-medium">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-accent hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {stats?.recentOrders?.map(order => (
              <Link key={order._id} to={`/admin/orders/${order._id}`}
                className="flex items-center justify-between py-3 border-b border-gray-50 hover:bg-gray-50 -mx-2 px-2 transition-colors">
                <div>
                  <p className="text-sm font-medium font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{order.user?.name || 'Unknown'}</p>
                </div>
                <StatusBadge status={order.orderStatus} />
                <p className="text-sm font-semibold">${order.totalPrice?.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ['Add Product',   '/admin/products/new', '➕'],
          ['View Orders',   '/admin/orders',       '📋'],
          ['Manage Users',  '/admin/users',        '👥'],
          ['All Products',  '/admin/products',     '🏷️'],
        ['Site Settings', '/admin/settings',     '⚙️'],
        ].map(([label, to, icon]) => (
          <Link key={label} to={to} className="admin-card flex flex-col items-center gap-3 text-center hover:border-accent transition-colors border border-gray-100 group">
            <span className="text-3xl">{icon}</span>
            <span className="text-xs tracking-widest uppercase font-medium group-hover:text-accent transition-colors">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
