import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, updateProduct, fetchProductById } from '../../store/slices/productSlice';
import { PageSpinner } from '../../components/common/UI';
import toast from 'react-hot-toast';

const CATEGORIES = ['shirts','pants','jackets','shoes','accessories','hoodies','suits','casual','formal','other'];
const SIZES_LIST  = ['XS','S','M','L','XL','XXL','28','30','32','34','36','38','40','41','42','43','44','45','One Size'];
const COLORS_LIST = ['Black','White','Charcoal','Navy','Brown','Tan','Burgundy','Beige','Olive','Grey','Slate','Off-White','Dark Brown','Midnight Blue'];

export default function AdminProductForm() {
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading } = useSelector(s => s.product);
  const fileRef  = useRef(null);

  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '',
    category: 'shirts', brand: 'Gent X', stock: '',
    featured: false, isNew: true,
    colors: [], sizes: [], tags: '',
  });
  const [existingImages, setExistingImages] = useState([]);
  // newFiles: { file, preview, color }
  const [newFiles, setNewFiles] = useState([]);
  const [removeIds, setRemoveIds] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (isEdit) dispatch(fetchProductById(id)); }, [id, isEdit, dispatch]);

  useEffect(() => {
    if (isEdit && product && product._id === id) {
      setForm({
        name: product.name, description: product.description,
        price: product.price, discountPrice: product.discountPrice || '',
        category: product.category, brand: product.brand,
        stock: product.stock, featured: product.featured, isNew: product.isNew,
        colors: product.colors || [], sizes: product.sizes || [],
        tags: product.tags?.join(', ') || '',
      });
      setExistingImages(product.images || []);
    }
  }, [product, id, isEdit]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(prev => [
      ...prev,
      ...files.map(file => ({ file, preview: URL.createObjectURL(file), color: '' }))
    ]);
  };

  const removeNewFile = (idx) => {
    setNewFiles(p => p.filter((_, i) => i !== idx));
  };

  const setNewFileColor = (idx, color) => {
    setNewFiles(p => p.map((item, i) => i === idx ? { ...item, color } : item));
  };

  const removeExisting = (img) => {
    setRemoveIds(p => [...p, img.public_id]);
    setExistingImages(p => p.filter(i => i.public_id !== img.public_id));
  };

  const toggleItem = (arr, item) => arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.category) {
      toast.error('Name, description, price and category are required'); return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'colors' || k === 'sizes') fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      fd.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)));
      if (removeIds.length) fd.append('removeImages', JSON.stringify(removeIds));

      // Append files + their color tags
      const imageColors = newFiles.map(f => f.color);
      fd.append('imageColors', JSON.stringify(imageColors));
      newFiles.forEach(({ file }) => fd.append('images', file));

      if (isEdit) {
        await dispatch(updateProduct({ id, formData: fd })).unwrap();
        toast.success('Product updated!');
      } else {
        await dispatch(createProduct(fd)).unwrap();
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err || 'Failed to save product');
    } finally { setSaving(false); }
  };

  if (isEdit && loading && !product) return <PageSpinner />;

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">{isEdit ? 'Edit' : 'New'}</p>
        <h1 className="font-display text-2xl md:text-3xl font-semibold">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid xl:grid-cols-3 gap-6">
        {/* Main fields */}
        <div className="xl:col-span-2 space-y-4 md:space-y-6">
          <div className="admin-card space-y-4">
            <h2 className="text-xs tracking-widest uppercase font-medium">Product Info</h2>
            <div>
              <label className="label-field">Name *</label>
              <input className="input-field" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Obsidian Slim-Fit Shirt" required />
            </div>
            <div>
              <label className="label-field">Description *</label>
              <textarea className="input-field resize-none" rows={4} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Describe the product..." required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-field">Price ($) *</label>
                <input type="number" step="0.01" min="0" className="input-field" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} placeholder="89.99" required />
              </div>
              <div>
                <label className="label-field">Sale Price ($)</label>
                <input type="number" step="0.01" min="0" className="input-field" value={form.discountPrice} onChange={e => setForm(f => ({...f, discountPrice: e.target.value}))} placeholder="Optional" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-field">Category *</label>
                <select className="input-field" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">Brand</label>
                <input className="input-field" value={form.brand} onChange={e => setForm(f => ({...f, brand: e.target.value}))} />
              </div>
            </div>
            <div>
              <label className="label-field">Tags (comma-separated)</label>
              <input className="input-field" value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} placeholder="shirt, slim-fit, cotton" />
            </div>
          </div>

          {/* Sizes */}
          <div className="admin-card">
            <h2 className="text-xs tracking-widest uppercase font-medium mb-3">Sizes</h2>
            <div className="flex flex-wrap gap-2">
              {SIZES_LIST.map(s => (
                <button type="button" key={s} onClick={() => setForm(f => ({...f, sizes: toggleItem(f.sizes, s)}))}
                  className={`px-2.5 py-1 text-xs border transition-colors ${form.sizes.includes(s) ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-gray-600'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="admin-card">
            <h2 className="text-xs tracking-widest uppercase font-medium mb-3">Colors</h2>
            <div className="flex flex-wrap gap-2">
              {COLORS_LIST.map(c => (
                <button type="button" key={c} onClick={() => setForm(f => ({...f, colors: toggleItem(f.colors, c)}))}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs border transition-colors ${form.colors.includes(c) ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-gray-600'}`}>
                  <span className="w-2.5 h-2.5 rounded-full border border-gray-300 flex-shrink-0"
                    style={{ backgroundColor: c.toLowerCase().replace(/[\s-]/g,'') }} />
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="admin-card">
            <h2 className="text-xs tracking-widest uppercase font-medium mb-1">Images</h2>
            <p className="text-[11px] text-gray-400 mb-3">Optionally assign a color to each image so customers see the right photo when selecting a color variant.</p>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Current Images</p>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map(img => (
                    <div key={img.public_id} className="relative group w-20">
                      <img src={img.url} alt="" className="w-20 h-24 object-cover bg-gray-100" />
                      {img.color && (
                        <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center py-0.5 truncate">{img.color}</span>
                      )}
                      <button type="button" onClick={() => removeExisting(img)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New image previews with color picker */}
            {newFiles.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">New Images — assign a color variant (optional)</p>
                <div className="space-y-3">
                  {newFiles.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 border border-gray-100 rounded">
                      <div className="relative flex-shrink-0">
                        <img src={item.preview} alt="" className="w-14 h-16 object-cover bg-gray-100" />
                        <button type="button" onClick={() => removeNewFile(i)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">×</button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 truncate mb-1">{item.file.name}</p>
                        <select
                          value={item.color}
                          onChange={e => setNewFileColor(i, e.target.value)}
                          className="input-field !py-1 !text-xs"
                        >
                          <option value="">No color (show for all)</option>
                          {form.colors.length > 0
                            ? form.colors.map(c => <option key={c} value={c}>{c}</option>)
                            : COLORS_LIST.map(c => <option key={c} value={c}>{c}</option>)
                          }
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
            <button type="button" onClick={() => fileRef.current.click()}
              className="border-2 border-dashed border-gray-200 hover:border-black transition-colors p-6 w-full text-center text-sm text-gray-400 hover:text-black">
              <div className="text-2xl mb-1">📁</div>
              Click to upload images (max 5MB each)
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="admin-card">
            <h2 className="text-xs tracking-widest uppercase font-medium mb-3">Inventory</h2>
            <label className="label-field">Stock Quantity</label>
            <input type="number" min="0" className="input-field" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} placeholder="0" />
          </div>

          <div className="admin-card space-y-3">
            <h2 className="text-xs tracking-widest uppercase font-medium">Options</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setForm(f => ({...f, featured: !f.featured}))}
                className={`w-5 h-5 border-2 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${form.featured ? 'bg-black border-black' : 'border-gray-300'}`}>
                {form.featured && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12"><path d="M10 3L5 8.5 2 5.5l-1 1L5 10.5l6-6.5z"/></svg>}
              </div>
              <span className="text-sm">Featured product</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setForm(f => ({...f, isNew: !f.isNew}))}
                className={`w-5 h-5 border-2 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${form.isNew ? 'bg-black border-black' : 'border-gray-300'}`}>
                {form.isNew && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12"><path d="M10 3L5 8.5 2 5.5l-1 1L5 10.5l6-6.5z"/></svg>}
              </div>
              <span className="text-sm">Mark as New Arrival</span>
            </label>
          </div>

          {/* Summary */}
          <div className="admin-card">
            <h2 className="text-xs tracking-widest uppercase font-medium mb-3">Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-400">Price</dt><dd>${form.price || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-400">Sale</dt><dd>{form.discountPrice ? `$${form.discountPrice}` : 'None'}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-400">Category</dt><dd className="capitalize">{form.category}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-400">Sizes</dt><dd>{form.sizes.length} selected</dd></div>
              <div className="flex justify-between"><dt className="text-gray-400">Colors</dt><dd>{form.colors.length} selected</dd></div>
              <div className="flex justify-between"><dt className="text-gray-400">Images</dt><dd>{existingImages.length + newFiles.length}</dd></div>
            </dl>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full py-3 md:py-4 disabled:opacity-50 text-sm">
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary w-full py-3 md:py-4 text-sm">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
