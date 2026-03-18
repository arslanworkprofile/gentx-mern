import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PageSpinner, Pagination } from '../../components/common/UI';
import API from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const fetchUsers = async (p = 1, q = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 20 });
      if (q) params.append('search', q);
      const res = await API.get(`/users?${params}`);
      setUsers(res.data.users);
      setPage(res.data.page);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(1, search); }, [search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try { await API.delete(`/users/${id}`); toast.success('User deleted'); fetchUsers(page, search); }
    catch (e) { toast.error(e.response?.data?.message || 'Delete failed'); }
  };

  const handleBlock = async (id, isBlocked) => {
    try {
      await API.patch(`/users/${id}/block`);
      toast.success(isBlocked ? 'User unblocked' : 'User blocked');
      fetchUsers(page, search);
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Manage</p>
        <h1 className="font-display text-3xl font-semibold">Users</h1>
      </div>

      <div className="admin-card mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
              className="input-field pl-10" />
          </div>
          <p className="text-xs text-gray-400 whitespace-nowrap">{total} users</p>
        </div>
      </div>

      {loading ? <PageSpinner /> : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs tracking-widest uppercase text-gray-400">
                <th className="text-left table-cell">User</th>
                <th className="text-left table-cell hidden md:table-cell">Joined</th>
                <th className="text-left table-cell">Role</th>
                <th className="text-left table-cell">Status</th>
                <th className="text-right table-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u._id} className={`hover:bg-gray-50 transition-colors ${u.isBlocked ? 'opacity-60' : ''}`}>
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell hidden md:table-cell text-gray-500 text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="table-cell">
                    <span className={`text-[10px] tracking-widest uppercase font-medium px-2 py-0.5 ${u.role === 'admin' ? 'bg-accent text-black' : 'bg-gray-100 text-gray-500'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`text-xs font-medium ${u.isBlocked ? 'text-red-500' : 'text-green-600'}`}>
                      {u.isBlocked ? '⛔ Blocked' : '✓ Active'}
                    </span>
                  </td>
                  <td className="table-cell text-right">
                    {u.role !== 'admin' && (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleBlock(u._id, u.isBlocked)}
                          className={`text-xs tracking-widest uppercase border px-3 py-1.5 transition-colors ${u.isBlocked ? 'border-green-200 text-green-600 hover:bg-green-500 hover:text-white hover:border-green-500' : 'border-yellow-200 text-yellow-600 hover:bg-yellow-500 hover:text-white hover:border-yellow-500'}`}>
                          {u.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                        <button onClick={() => handleDelete(u._id, u.name)}
                          className="text-xs tracking-widest uppercase border border-red-100 text-red-400 px-3 py-1.5 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors">
                          Del
                        </button>
                      </div>
                    )}
                    {u.role === 'admin' && <span className="text-xs text-gray-400">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div className="text-center py-16 text-gray-400">No users found</div>}
          <Pagination page={page} pages={pages} onPageChange={(p) => { setPage(p); fetchUsers(p, search); }} />
        </div>
      )}
    </div>
  );
}
