import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiUpload, FiX, FiPlus } from 'react-icons/fi';
import api from '../../api';
import toast from 'react-hot-toast';
import './Admin.css';

const CATEGORIES = ['shirts', 'pants', 'suits', 'shoes', 'jackets', 'watches', 'accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42'];

const EMPTY = {
  name: '', description: '', price: '', salePrice: '',
  category: 'shirts', brand: 'GentX', stock: '',
  images: [], sizes: [], colors: [],
  isFeatured: false, isNewArrival: false, isBestSeller: false,
  tags: '',
};

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/products/${id}`).then(r => {
      const p = r.data;
      setForm({
        name: p.name, description: p.description, price: p.price,
        salePrice: p.salePrice || '', category: p.category,
        brand: p.brand, stock: p.stock, images: p.images || [],
        sizes: p.sizes || [], colors: p.colors || [],
        isFeatured: p.isFeatured, isNewArrival: p.isNewArrival,
        isBestSeller: p.isBestSeller, tags: (p.tags || []).join(', '),
      });
      setFetching(false);
    }).catch(() => { toast.error('Failed to load product'); setFetching(false); });
  }, [id, isEdit]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleSize = (s) => set('sizes',
    form.sizes.includes(s) ? form.sizes.filter(x => x !== s) : [...form.sizes, s]
  );

  const addColor = () => {
    if (!newColorName) return;
    set('colors', [...form.colors, { name: newColorName, hex: newColorHex }]);
    setNewColorName(''); setNewColorHex('#000000');
  };
  const removeColor = (i) => set('colors', form.colors.filter((_, idx) => idx !== i));

  const addImage = () => {
    if (!newImage.trim()) return;
    set('images', [...form.images, newImage.trim()]);
    setNewImage('');
  };
  const removeImage = (i) => set('images', form.images.filter((_, idx) => idx !== i));

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      set('images', [...form.images, data.url]);
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock || !form.description)
      return toast.error('Please fill all required fields');

    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        stock: Number(form.stock),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="page loading-screen"><div className="spinner" /></div>;

  return (
    <div className="admin-page page">
      <div className="container">
        <div className="admin-header">
          <div>
            <p className="admin-breadcrumb">
              <Link to="/admin">Dashboard</Link> / <Link to="/admin/products">Products</Link> / {isEdit ? 'Edit' : 'New Product'}
            </p>
            <h1 className="admin-title">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="product-edit-form">
          <div className="product-edit-layout">
            {/* LEFT COLUMN */}
            <div className="product-edit-main">

              {/* Basic Info */}
              <div className="admin-form-card">
                <h2 className="admin-form-card__title">Basic Information</h2>

                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Classic Oxford Shirt" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-input" rows={5} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the product..." required style={{ resize: 'vertical' }} />
                </div>

                <div className="admin-form-row">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Brand</label>
                    <input className="form-input" value={form.brand} onChange={e => set('brand', e.target.value)} />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="form-group">
                    <label className="form-label">Price (PKR) *</label>
                    <input type="number" min="0" className="form-input" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sale Price (PKR)</label>
                    <input type="number" min="0" className="form-input" value={form.salePrice} onChange={e => set('salePrice', e.target.value)} placeholder="Leave blank if no sale" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock *</label>
                    <input type="number" min="0" className="form-input" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input className="form-input" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="formal, cotton, summer" />
                </div>
              </div>

              {/* Images */}
              <div className="admin-form-card">
                <h2 className="admin-form-card__title">Product Images</h2>

                <div className="image-upload-row">
                  <input className="form-input" value={newImage} onChange={e => setNewImage(e.target.value)} placeholder="Paste image URL..." />
                  <button type="button" className="btn btn-outline" onClick={addImage}><FiPlus /> Add URL</button>
                </div>

                <div className="image-upload-divider">
                  <span>or upload file</span>
                </div>

                <label className="image-upload-btn">
                  <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
                  <FiUpload size={18} />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </label>

                {form.images.length > 0 && (
                  <div className="image-preview-grid">
                    {form.images.map((img, i) => (
                      <div key={i} className="image-preview-item">
                        <img src={img} alt={`Product ${i + 1}`} />
                        <button type="button" className="image-preview-remove" onClick={() => removeImage(i)}>
                          <FiX size={14} />
                        </button>
                        {i === 0 && <span className="image-preview-main">Main</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sizes */}
              <div className="admin-form-card">
                <h2 className="admin-form-card__title">Sizes</h2>
                <div className="sizes-grid">
                  {SIZES.map(s => (
                    <button
                      key={s} type="button"
                      className={`size-toggle${form.sizes.includes(s) ? ' active' : ''}`}
                      onClick={() => toggleSize(s)}
                    >{s}</button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="admin-form-card">
                <h2 className="admin-form-card__title">Colors</h2>
                <div className="color-add-row">
                  <input className="form-input" value={newColorName} onChange={e => setNewColorName(e.target.value)} placeholder="Color name (e.g. Navy Blue)" />
                  <input type="color" value={newColorHex} onChange={e => setNewColorHex(e.target.value)} className="color-picker" title="Pick color" />
                  <button type="button" className="btn btn-outline" onClick={addColor}><FiPlus /> Add</button>
                </div>
                {form.colors.length > 0 && (
                  <div className="colors-list">
                    {form.colors.map((c, i) => (
                      <div key={i} className="color-chip">
                        <span className="color-chip__dot" style={{ background: c.hex }} />
                        <span>{c.name}</span>
                        <button type="button" onClick={() => removeColor(i)}><FiX size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="product-edit-sidebar">
              <div className="admin-form-card">
                <h2 className="admin-form-card__title">Visibility</h2>
                {[
                  { key: 'isFeatured', label: 'Featured Product' },
                  { key: 'isNewArrival', label: 'New Arrival' },
                  { key: 'isBestSeller', label: 'Best Seller' },
                ].map(f => (
                  <label key={f.key} className="toggle-label">
                    <span>{f.label}</span>
                    <div className={`toggle${form[f.key] ? ' toggle--on' : ''}`} onClick={() => set(f.key, !form[f.key])}>
                      <div className="toggle__thumb" />
                    </div>
                  </label>
                ))}
              </div>

              <div className="admin-form-card">
                <h2 className="admin-form-card__title">Preview</h2>
                <div className="product-preview">
                  {form.images[0]
                    ? <img src={form.images[0]} alt="Preview" className="product-preview__img" />
                    : <div className="product-preview__placeholder"><FiUpload size={32} /></div>
                  }
                  <p className="product-preview__name">{form.name || 'Product Name'}</p>
                  <p className="product-preview__cat">{form.category}</p>
                  <p className="product-preview__price">
                    {form.salePrice
                      ? <><span style={{ color: 'var(--gold)' }}>PKR {Number(form.salePrice).toLocaleString()}</span> <span style={{ textDecoration: 'line-through', color: 'var(--gray-400)', fontSize: 12 }}>PKR {Number(form.price).toLocaleString()}</span></>
                      : `PKR ${Number(form.price || 0).toLocaleString()}`
                    }
                  </p>
                </div>
              </div>

              <button type="submit" className="btn btn-gold product-edit-submit" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
              </button>
              <Link to="/admin/products" className="btn btn-ghost product-edit-cancel">Cancel</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
