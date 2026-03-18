import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProducts, deleteProduct, toggleProduct } from '../../store/slices/productSlice';
import { PageSpinner, Pagination } from '../../components/common/UI';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const dispatch = useDispatch();
  const { products, loading, page, pages, total } = useSelector(s => s.product);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAdminProducts({ page: currentPage, limit: 15, ...(search && { search }) }));
  }, [dispatch, currentPage, search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try { await dispatch(deleteProduct(id)).unwrap(); toast.success('Product deleted'); }
    catch (e) { toast.error(e || 'Delete failed'); }
  };

  const handleToggle = async (id) => {
    try { await dispatch(toggleProduct(id)).unwrap(); toast.success('Status updated'); }
    catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Manage</p>
          <h1 className="font-display text-3xl font-semibold">Products</h1>
        </div>
        <Link to="/admin/products/new" className="btn-primary flex items-center gap-2">
          <span>+</span> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="admin-card mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search products..." className="input-field pl-10" />
          </div>
          <p className="text-xs text-gray-400 whitespace-nowrap">{total} total</p>
        </div>
      </div>

      {loading ? <PageSpinner /> : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs tracking-widest uppercase text-gray-400">
                <th className="text-left table-cell">Product</th>
                <th className="text-left table-cell hidden md:table-cell">Category</th>
                <th className="text-left table-cell">Price</th>
                <th className="text-left table-cell hidden sm:table-cell">Stock</th>
                <th className="text-left table-cell hidden lg:table-cell">Status</th>
                <th className="text-right table-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=60'} alt={p.name} className="w-10 h-12 object-cover bg-gray-100 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-black line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell hidden md:table-cell capitalize text-gray-600">{p.category}</td>
                  <td className="table-cell">
                    <div>
                      <p className="font-medium">${(p.discountPrice > 0 ? p.discountPrice : p.price).toFixed(2)}</p>
                      {p.discountPrice > 0 && <p className="text-xs text-gray-400 line-through">${p.price.toFixed(2)}</p>}
                    </div>
                  </td>
                  <td className="table-cell hidden sm:table-cell">
                    <span className={`text-xs font-medium ${p.stock === 0 ? 'text-red-500' : p.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {p.stock === 0 ? 'Out' : p.stock}
                    </span>
                  </td>
                  <td className="table-cell hidden lg:table-cell">
                    <button onClick={() => handleToggle(p._id)}
                      className={`text-[10px] tracking-widest uppercase font-medium px-2.5 py-1 border transition-colors ${p.isActive ? 'border-green-200 text-green-600 hover:bg-red-50 hover:border-red-200 hover:text-red-500' : 'border-red-200 text-red-500 hover:bg-green-50 hover:border-green-200 hover:text-green-600'}`}>
                      {p.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/products/edit/${p._id}`}
                        className="text-xs tracking-widest uppercase border border-gray-200 px-3 py-1.5 hover:border-black transition-colors">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(p._id, p.name)}
                        className="text-xs tracking-widest uppercase border border-red-100 text-red-400 px-3 py-1.5 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors">
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p>No products found</p>
            </div>
          )}
          <div className="mt-4">
            <Pagination page={page} pages={pages} onPageChange={setCurrentPage} />
          </div>
        </div>
      )}
    </div>
  );
}
