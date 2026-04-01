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
    { label: 'Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: '💰', color: 'border-l-accent', change: '+12%' },
    { label: 'Orders',  value: stats?.totalOrders || 0, icon: '📦', color: 'border-l-blue-400', change: '+8%' },
    { label: 'Products', value: productTotal || 0, icon: '🏷️', color: 'border-l-purple-400', change: '' },
    { label: 'Users',   value: userStats?.total || 0, icon: '👥', color: 'border-l-green-400', change: `+${userStats?.newThisMonth || 0} this month` },
  ];

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Overview</p>
        <h1 className="font-display text-2xl md:text-3xl font-semibold">Dashboard</h1>
      </div>

      {/* Stat cards - 2 cols on mobile, 4 on xl */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
        {statCards.map(s => (
          <div key={s.label} className={`admin-card border-l-4 ${s.color} !p-3 md:!p-5`}>
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-1 truncate">{s.label}</p>
                <p className="font-display text-lg md:text-3xl font-semibold truncate">{s.value}</p>
                {s.change && <p className="text-[10px] text-green-500 mt-1 truncate">{s.change}</p>}
              </div>
              <span className="text-base md:text-2xl flex-shrink-0">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Order status - 3 cols mobile, 5 on md */}
      {stats?.statusAgg && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-6">
          {['pending','processing','shipped','delivered','cancelled'].map(status => {
            const count = stats.statusAgg.find(s => s._id === status)?.count || 0;
            return (
              <div key={status} className="admin-card text-center !p-3">
                <p className="font-display text-xl font-semibold">{count}</p>
                <div className="mt-1 scale-90 origin-center"><StatusBadge status={status} /></div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid xl:grid-cols-2 gap-6">
        {/* Revenue chart */}
        {stats?.monthlyAgg?.length > 0 && (
          <div className="admin-card">
            <h2 className="text-xs tracking-widest uppercase font-medium mb-4">Revenue — Last 6 Months</h2>
            <div className="flex items-end gap-2 h-32">
              {stats.monthlyAgg.map((m, i) => {
                const max = Math.max(...stats.monthlyAgg.map(x => x.revenue));
                const pct = max > 0 ? (m.revenue / max) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] text-gray-400">${(m.revenue/1000).toFixed(1)}k</span>
                    <div className="w-full bg-gray-100 relative" style={{ height: '70px' }}>
                      <div className="absolute bottom-0 left-0 right-0 bg-accent" style={{ height: `${pct}%` }} />
                    </div>
                    <span className="text-[9px] text-gray-500">{monthNames[(m._id.month - 1)]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent orders */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs tracking-widest uppercase font-medium">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-accent hover:underline">View All</Link>
          </div>
          <div className="space-y-1">
            {stats?.recentOrders?.map(order => (
              <Link key={order._id} to={`/admin/orders/${order._id}`}
                className="flex items-center gap-2 py-2 border-b border-gray-50 hover:bg-gray-50 -mx-2 px-2 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium font-mono truncate">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-[10px] text-gray-400 truncate">{order.user?.name || 'Unknown'}</p>
                </div>
                <StatusBadge status={order.orderStatus} />
                <p className="text-xs font-semibold flex-shrink-0">${order.totalPrice?.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions - 2 cols mobile, 4 on md */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['Add Product',   '/admin/products/new', '➕'],
          ['View Orders',   '/admin/orders',       '📋'],
          ['Manage Users',  '/admin/users',        '👥'],
          ['All Products',  '/admin/products',     '🏷️'],
          ['Settings',      '/admin/settings',     '⚙️'],
        ].map(([label, to, icon]) => (
          <Link key={label} to={to} className="admin-card flex flex-col items-center gap-2 text-center hover:border-accent transition-colors border border-gray-100 group !p-3 md:!p-5">
            <span className="text-2xl">{icon}</span>
            <span className="text-[10px] tracking-widest uppercase font-medium group-hover:text-accent transition-colors">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
