import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, deleteOrder } from '../../store/slices/orderSlice';
import { PageSpinner, Pagination, StatusBadge } from '../../components/common/UI';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { orders, loading, page, pages, total } = useSelector(s => s.order);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchAllOrders({ page: currentPage, limit: 20, ...(statusFilter && { status: statusFilter }) }));
  }, [dispatch, currentPage, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order? This cannot be undone.')) return;
    try { await dispatch(deleteOrder(id)).unwrap(); toast.success('Order deleted'); }
    catch (e) { toast.error(e || 'Delete failed'); }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Manage</p>
        <h1 className="font-display text-3xl font-semibold">Orders</h1>
      </div>

      <div className="admin-card mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2 flex-wrap">
            {['','pending','processing','shipped','delivered','cancelled'].map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-xs tracking-widest uppercase border transition-colors ${statusFilter === s ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-gray-600'}`}>
                {s || 'All'}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 ml-auto">{total} orders</p>
        </div>
      </div>

      {loading ? <PageSpinner /> : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs tracking-widest uppercase text-gray-400">
                <th className="text-left table-cell">Order</th>
                <th className="text-left table-cell hidden md:table-cell">Customer</th>
                <th className="text-left table-cell hidden sm:table-cell">Date</th>
                <th className="text-left table-cell">Status</th>
                <th className="text-left table-cell">Total</th>
                <th className="text-left table-cell hidden md:table-cell">Paid</th>
                <th className="text-right table-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">
                    <Link to={`/admin/orders/${order._id}`} className="font-mono text-xs font-medium hover:text-accent transition-colors">
                      #{order._id.slice(-8).toUpperCase()}
                    </Link>
                    <p className="text-xs text-gray-400">{order.orderItems?.length} item(s)</p>
                  </td>
                  <td className="table-cell hidden md:table-cell">
                    <p className="font-medium">{order.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="table-cell hidden sm:table-cell text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="table-cell"><StatusBadge status={order.orderStatus} /></td>
                  <td className="table-cell font-semibold">${order.totalPrice?.toFixed(2)}</td>
                  <td className="table-cell hidden md:table-cell">
                    <span className={`text-xs font-medium ${order.isPaid ? 'text-green-600' : 'text-gray-400'}`}>
                      {order.isPaid ? '✓ Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/orders/${order._id}`} className="text-xs border border-gray-200 px-3 py-1.5 hover:border-black transition-colors tracking-widest uppercase">View</Link>
                      <button onClick={() => handleDelete(order._id)} className="text-xs border border-red-100 text-red-400 px-3 py-1.5 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors tracking-widest uppercase">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="text-center py-16 text-gray-400">No orders found</div>}
          <Pagination page={page} pages={pages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
}
