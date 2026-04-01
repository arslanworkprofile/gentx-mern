import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import api from '../../api';
import toast from 'react-hot-toast';
import './Admin.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetch = () => api.get('/products?limit=100').then(r => { setProducts(r.data.products); setLoading(false); });
  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetch();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="admin-page page">
      <div className="container">
        <div className="admin-header">
          <div>
            <p className="admin-breadcrumb"><Link to="/admin">Dashboard</Link> / Products</p>
            <h1 className="admin-title">Products</h1>
          </div>
          <Link to="/admin/products/new" className="btn btn-gold"><FiPlus /> Add Product</Link>
        </div>

        {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
          <div className="admin-table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <img src={p.images?.[0]} alt={p.name} style={{width:48,height:60,objectFit:'cover',borderRadius:1}} />
                    </td>
                    <td>{p.name}</td>
                    <td><span className="badge badge-black">{p.category}</span></td>
                    <td>PKR {p.price.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${p.stock === 0 ? 'badge-red' : p.stock < 10 ? 'badge-gold' : 'badge-green'}`}>{p.stock}</span>
                    </td>
                    <td>
                      <div style={{display:'flex',gap:8}}>
                        <button className="admin-action-btn" onClick={() => navigate(`/admin/products/${p._id}/edit`)}><FiEdit2 /></button>
                        <button className="admin-action-btn admin-action-btn--danger" onClick={() => handleDelete(p._id, p.name)}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
