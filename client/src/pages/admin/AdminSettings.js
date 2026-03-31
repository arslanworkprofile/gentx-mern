import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSettings, updateGeneral,
  addHeroSlide, updateHeroSlide, deleteHeroSlide,
  addCategory, updateCategory, deleteCategory,
} from '../../store/slices/settingsSlice';
import { PageSpinner } from '../../components/common/UI';
import toast from 'react-hot-toast';

/* ── small helpers ─────────────────────────────────── */
const TabBtn = ({ active, onClick, children }) => (
  <button onClick={onClick}
    className={`px-5 py-3 text-xs tracking-widest uppercase font-medium border-b-2 transition-colors ${active ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}>
    {children}
  </button>
);

const Field = ({ label, children }) => (
  <div>
    <label className="label-field">{label}</label>
    {children}
  </div>
);

const ImagePreview = ({ src, onRemove, size = 'md' }) => {
  const dim = size === 'sm' ? 'w-16 h-16' : 'w-32 h-20';
  return src ? (
    <div className={`relative group ${dim} flex-shrink-0`}>
      <img src={src} alt="preview" className="w-full h-full object-cover bg-gray-100" />
      {onRemove && (
        <button type="button" onClick={onRemove}
          className="absolute inset-0 bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          ✕ Remove
        </button>
      )}
    </div>
  ) : null;
};

/* ══════════════════════════════════════════════════════
   HERO SLIDES SECTION
══════════════════════════════════════════════════════ */
function HeroSlidesManager({ settings }) {
  const dispatch = useDispatch();
  const fileRef  = useRef(null);
  const editRef  = useRef(null);

  const blank = { heading: 'Dress With Intent.', subheading: '', badge: 'New Collection — 2024', ctaLabel: 'Shop Collection', ctaLink: '/shop', ctaLabel2: 'New Arrivals', ctaLink2: '/shop?isNewArrival=true', imageUrl: '' };
  const [form,    setForm]    = useState(blank);
  const [file,    setFile]    = useState(null);
  const [preview, setPreview] = useState('');
  const [editing, setEditing] = useState(null); // slideId being edited
  const [editForm, setEditForm] = useState({});
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState('');
  const [saving,  setSaving]  = useState(false);

  const handleFileChange = (e, isEdit = false) => {
    const f = e.target.files[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    if (isEdit) { setEditFile(f); setEditPreview(url); }
    else        { setFile(f);    setPreview(url); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!file && !form.imageUrl) { toast.error('Please upload an image or enter an image URL'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('image', file);
      await dispatch(addHeroSlide(fd)).unwrap();
      toast.success('Hero slide added!');
      setForm(blank); setFile(null); setPreview('');
    } catch (err) { toast.error(err || 'Failed'); }
    finally { setSaving(false); }
  };

  const startEdit = (slide) => {
    setEditing(slide.id);
    setEditForm({ heading: slide.heading, subheading: slide.subheading, badge: slide.badge, ctaLabel: slide.ctaLabel, ctaLink: slide.ctaLink, ctaLabel2: slide.ctaLabel2 || '', ctaLink2: slide.ctaLink2 || '', imageUrl: slide.imageUrl, active: slide.active });
    setEditFile(null); setEditPreview('');
    setTimeout(() => editRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  const handleUpdate = async (slideId) => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(editForm).forEach(([k, v]) => fd.append(k, v));
      if (editFile) fd.append('image', editFile);
      await dispatch(updateHeroSlide({ slideId, formData: fd })).unwrap();
      toast.success('Slide updated!');
      setEditing(null);
    } catch (err) { toast.error(err || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (slideId) => {
    if (!window.confirm('Delete this hero slide?')) return;
    try { await dispatch(deleteHeroSlide(slideId)).unwrap(); toast.success('Slide deleted'); }
    catch (err) { toast.error(err || 'Failed'); }
  };

  const handleToggle = async (slide) => {
    const fd = new FormData();
    fd.append('active', !slide.active);
    fd.append('imageUrl', slide.imageUrl);
    fd.append('heading', slide.heading);
    try { await dispatch(updateHeroSlide({ slideId: slide.id, formData: fd })).unwrap(); toast.success('Slide updated'); }
    catch (err) { toast.error(err || 'Failed'); }
  };

  const slides = settings?.heroSlides || [];

  return (
    <div className="space-y-8">
      {/* Existing slides */}
      <div>
        <h3 className="text-xs tracking-widest uppercase font-semibold mb-4 text-gray-500">Current Slides ({slides.length})</h3>
        {slides.length === 0 && <p className="text-sm text-gray-400 italic">No hero slides yet. Add one below.</p>}
        <div className="space-y-3">
          {slides.map((slide, i) => (
            <div key={slide.id}>
              <div className={`flex gap-4 items-start p-4 border transition-colors ${editing === slide.id ? 'border-black' : 'border-gray-100 hover:border-gray-300'}`}>
                <img src={slide.imageUrl} alt="slide" className="w-28 h-16 object-cover bg-gray-100 flex-shrink-0" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1490551902236-7231eb14e87c?w=200&h=120&fit=crop'; }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-400">#{i + 1}</span>
                    <span className={`text-[9px] tracking-widest uppercase font-bold px-2 py-0.5 ${slide.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {slide.active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <p className="font-display text-sm font-semibold truncate">{slide.heading}</p>
                  <p className="text-xs text-gray-400 truncate">{slide.subheading}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleToggle(slide)}
                    className={`text-[10px] tracking-widest uppercase border px-3 py-1.5 transition-colors ${slide.active ? 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                    {slide.active ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => editing === slide.id ? setEditing(null) : startEdit(slide)}
                    className="text-[10px] tracking-widest uppercase border border-gray-200 px-3 py-1.5 hover:border-black transition-colors">
                    {editing === slide.id ? 'Cancel' : 'Edit'}
                  </button>
                  <button onClick={() => handleDelete(slide.id)}
                    className="text-[10px] tracking-widest uppercase border border-red-100 text-red-400 px-3 py-1.5 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors">
                    Del
                  </button>
                </div>
              </div>

              {/* Inline edit form */}
              {editing === slide.id && (
                <div ref={editRef} className="border border-t-0 border-black p-6 bg-gray-50 space-y-4">
                  <p className="text-xs tracking-widest uppercase font-semibold mb-2">Edit Slide</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Heading">
                      <input className="input-field" value={editForm.heading} onChange={e => setEditForm(f => ({...f, heading: e.target.value}))} />
                    </Field>
                    <Field label="Badge Text">
                      <input className="input-field" value={editForm.badge} onChange={e => setEditForm(f => ({...f, badge: e.target.value}))} />
                    </Field>
                    <Field label="Subheading">
                      <input className="input-field" value={editForm.subheading} onChange={e => setEditForm(f => ({...f, subheading: e.target.value}))} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="CTA 1 Label">
                        <input className="input-field" value={editForm.ctaLabel} onChange={e => setEditForm(f => ({...f, ctaLabel: e.target.value}))} />
                      </Field>
                      <Field label="CTA 1 Link">
                        <input className="input-field" value={editForm.ctaLink} onChange={e => setEditForm(f => ({...f, ctaLink: e.target.value}))} />
                      </Field>
                    </div>
                  </div>
                  {/* Image replacement */}
                  <Field label="Replace Image">
                    <div className="flex items-center gap-3">
                      <ImagePreview src={editPreview || editForm.imageUrl} />
                      <input ref={editRef} type="file" accept="image/*" className="hidden" id={`edit-file-${slide.id}`} onChange={e => handleFileChange(e, true)} />
                      <label htmlFor={`edit-file-${slide.id}`} className="btn-secondary text-xs px-4 py-2 cursor-pointer">
                        Choose New Image
                      </label>
                      <span className="text-xs text-gray-400">or</span>
                      <input className="input-field text-xs py-2" placeholder="Paste image URL" value={editFile ? '' : editForm.imageUrl} onChange={e => { setEditForm(f => ({...f, imageUrl: e.target.value})); setEditFile(null); setEditPreview(''); }} />
                    </div>
                  </Field>
                  <button onClick={() => handleUpdate(slide.id)} disabled={saving} className="btn-primary text-xs disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add new slide */}
      <div className="border border-dashed border-gray-200 p-6">
        <h3 className="text-xs tracking-widest uppercase font-semibold mb-5">Add New Slide</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Heading *">
              <input className="input-field" value={form.heading} onChange={e => setForm(f => ({...f, heading: e.target.value}))} placeholder="Dress With Intent." required />
            </Field>
            <Field label="Badge Text">
              <input className="input-field" value={form.badge} onChange={e => setForm(f => ({...f, badge: e.target.value}))} placeholder="New Collection — 2024" />
            </Field>
            <Field label="Subheading">
              <input className="input-field" value={form.subheading} onChange={e => setForm(f => ({...f, subheading: e.target.value}))} placeholder="Premium menswear for the modern gentleman." />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="CTA Button 1">
                <input className="input-field" value={form.ctaLabel} onChange={e => setForm(f => ({...f, ctaLabel: e.target.value}))} placeholder="Shop Collection" />
              </Field>
              <Field label="CTA Link 1">
                <input className="input-field" value={form.ctaLink} onChange={e => setForm(f => ({...f, ctaLink: e.target.value}))} placeholder="/shop" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="CTA Button 2">
                <input className="input-field" value={form.ctaLabel2} onChange={e => setForm(f => ({...f, ctaLabel2: e.target.value}))} placeholder="New Arrivals" />
              </Field>
              <Field label="CTA Link 2">
                <input className="input-field" value={form.ctaLink2} onChange={e => setForm(f => ({...f, ctaLink2: e.target.value}))} placeholder="/shop?isNewArrival=true" />
              </Field>
            </div>
          </div>

          <Field label="Hero Image *">
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <ImagePreview src={preview} onRemove={() => { setFile(null); setPreview(''); if (fileRef.current) fileRef.current.value = ''; }} />
              <input ref={fileRef} type="file" accept="image/*" className="hidden" id="new-slide-file" onChange={e => handleFileChange(e, false)} />
              <label htmlFor="new-slide-file" className="btn-secondary text-xs px-4 py-2 cursor-pointer">
                📁 Upload Image
              </label>
              <span className="text-xs text-gray-400">or</span>
              <input
                className="input-field text-xs py-2 max-w-xs"
                placeholder="Paste an image URL"
                value={file ? '' : form.imageUrl}
                onChange={e => { setForm(f => ({...f, imageUrl: e.target.value})); setFile(null); setPreview(''); }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Recommended: 1600×900px, landscape. Max 5MB.</p>
          </Field>

          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'Adding...' : '+ Add Hero Slide'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   CATEGORIES SECTION
══════════════════════════════════════════════════════ */
function CategoriesManager({ settings }) {
  const dispatch = useDispatch();
  const fileRef  = useRef(null);

  const [form,    setForm]    = useState({ label: '', value: '', imageUrl: '' });
  const [file,    setFile]    = useState(null);
  const [preview, setPreview] = useState('');
  const [editing, setEditing] = useState(null);
  const [editForm,setEditForm]= useState({});
  const [editFile,setEditFile]= useState(null);
  const [editPreview, setEditPreview] = useState('');
  const [saving,  setSaving]  = useState(false);

  const cats = (settings?.categories || []).slice().sort((a, b) => a.order - b.order);

  // Auto-generate slug from label
  const handleLabelChange = (val) => {
    setForm(f => ({ ...f, label: val, value: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.label || !form.value) { toast.error('Label and value are required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('label', form.label); fd.append('value', form.value);
      if (form.imageUrl) fd.append('imageUrl', form.imageUrl);
      if (file) fd.append('image', file);
      await dispatch(addCategory(fd)).unwrap();
      toast.success(`Category "${form.label}" added!`);
      setForm({ label: '', value: '', imageUrl: '' }); setFile(null); setPreview('');
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) { toast.error(err || 'Failed'); }
    finally { setSaving(false); }
  };

  const startEdit = (cat) => {
    setEditing(cat.id);
    setEditForm({ label: cat.label, value: cat.value, imageUrl: cat.imageUrl || '', active: cat.active });
    setEditFile(null); setEditPreview('');
  };

  const handleUpdate = async (catId) => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(editForm).forEach(([k, v]) => fd.append(k, v));
      if (editFile) fd.append('image', editFile);
      await dispatch(updateCategory({ catId, formData: fd })).unwrap();
      toast.success('Category updated!');
      setEditing(null);
    } catch (err) { toast.error(err || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (catId, label) => {
    if (!window.confirm(`Delete category "${label}"? Products in this category will remain but won't match this filter.`)) return;
    try { await dispatch(deleteCategory(catId)).unwrap(); toast.success('Category deleted'); }
    catch (err) { toast.error(err || 'Failed'); }
  };

  const handleToggle = async (cat) => {
    const fd = new FormData();
    fd.append('active', !cat.active);
    fd.append('label', cat.label); fd.append('value', cat.value);
    try { await dispatch(updateCategory({ catId: cat.id, formData: fd })).unwrap(); toast.success('Updated'); }
    catch (err) { toast.error(err || 'Failed'); }
  };

  return (
    <div className="space-y-8">
      {/* Existing categories */}
      <div>
        <h3 className="text-xs tracking-widest uppercase font-semibold mb-4 text-gray-500">
          Current Categories ({cats.length})
        </h3>
        <div className="space-y-2">
          {cats.map(cat => (
            <div key={cat.id}>
              <div className={`flex gap-4 items-center p-3.5 border transition-colors ${editing === cat.id ? 'border-black' : 'border-gray-100 hover:border-gray-300'}`}>
                {cat.imageUrl
                  ? <img src={cat.imageUrl} alt={cat.label} className="w-12 h-12 object-cover bg-gray-100 flex-shrink-0" onError={e => { e.target.style.display='none'; }} />
                  : <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0 text-xs">No img</div>
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{cat.label}</span>
                    <span className={`text-[9px] tracking-widest uppercase font-bold px-2 py-0.5 ${cat.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {cat.active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">/{cat.value}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleToggle(cat)}
                    className={`text-[10px] tracking-widest uppercase border px-3 py-1.5 transition-colors ${cat.active ? 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                    {cat.active ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => editing === cat.id ? setEditing(null) : startEdit(cat)}
                    className="text-[10px] tracking-widest uppercase border border-gray-200 px-3 py-1.5 hover:border-black transition-colors">
                    {editing === cat.id ? 'Cancel' : 'Edit'}
                  </button>
                  <button onClick={() => handleDelete(cat.id, cat.label)}
                    className="text-[10px] tracking-widest uppercase border border-red-100 text-red-400 px-3 py-1.5 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors">
                    Del
                  </button>
                </div>
              </div>

              {/* Inline edit */}
              {editing === cat.id && (
                <div className="border border-t-0 border-black p-5 bg-gray-50 space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Field label="Display Label">
                      <input className="input-field" value={editForm.label} onChange={e => setEditForm(f => ({...f, label: e.target.value}))} />
                    </Field>
                    <Field label="URL Slug">
                      <input className="input-field font-mono text-sm" value={editForm.value} onChange={e => setEditForm(f => ({...f, value: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'')}))} />
                    </Field>
                    <Field label="Image">
                      <div className="flex items-center gap-2">
                        <ImagePreview src={editPreview || editForm.imageUrl} size="sm" />
                        <input type="file" accept="image/*" className="hidden" id={`edit-cat-${cat.id}`} onChange={e => { const f = e.target.files[0]; if (f) { setEditFile(f); setEditPreview(URL.createObjectURL(f)); }}} />
                        <label htmlFor={`edit-cat-${cat.id}`} className="btn-secondary text-xs px-3 py-2 cursor-pointer whitespace-nowrap">Upload</label>
                        <input className="input-field text-xs py-2" placeholder="or URL" value={editFile ? '' : editForm.imageUrl} onChange={e => { setEditForm(f => ({...f, imageUrl: e.target.value})); setEditFile(null); setEditPreview(''); }} />
                      </div>
                    </Field>
                  </div>
                  <button onClick={() => handleUpdate(cat.id)} disabled={saving} className="btn-primary text-xs disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add new category */}
      <div className="border border-dashed border-gray-200 p-6">
        <h3 className="text-xs tracking-widest uppercase font-semibold mb-5">Add New Category</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Display Label *">
              <input className="input-field" value={form.label} onChange={e => handleLabelChange(e.target.value)} placeholder="e.g. Track Suits" required />
            </Field>
            <Field label="URL Slug *">
              <input className="input-field font-mono text-sm" value={form.value} onChange={e => setForm(f => ({...f, value: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'')}))} placeholder="e.g. track-suits" required />
              <p className="text-[10px] text-gray-400 mt-1">Auto-generated from label. Lowercase, no spaces.</p>
            </Field>
            <Field label="Category Image">
              <div className="flex items-center gap-2">
                <ImagePreview src={preview} size="sm" onRemove={() => { setFile(null); setPreview(''); if (fileRef.current) fileRef.current.value = ''; }} />
                <input ref={fileRef} type="file" accept="image/*" className="hidden" id="new-cat-file" onChange={e => { const f = e.target.files[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }}} />
                <label htmlFor="new-cat-file" className="btn-secondary text-xs px-3 py-2 cursor-pointer whitespace-nowrap">Upload</label>
                <input className="input-field text-xs py-2" placeholder="or paste URL" value={file ? '' : form.imageUrl} onChange={e => { setForm(f => ({...f, imageUrl: e.target.value})); setFile(null); setPreview(''); }} />
              </div>
            </Field>
          </div>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'Adding...' : '+ Add Category'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   GENERAL SETTINGS
══════════════════════════════════════════════════════ */
function GeneralSettings({ settings }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    storeName:    settings?.storeName    || 'Gent X',
    storeTagline: settings?.storeTagline || '',
    contactEmail: settings?.contactEmail || '',
    contactPhone: settings?.contactPhone || '',
    announcementText:   settings?.announcementBar?.text    || '',
    announcementActive: settings?.announcementBar?.active  ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(updateGeneral({
        storeName:    form.storeName,
        storeTagline: form.storeTagline,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        announcementBar: { text: form.announcementText, active: form.announcementActive },
      })).unwrap();
      toast.success('Settings saved!');
    } catch (err) { toast.error(err || 'Failed'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handle} className="space-y-6 max-w-2xl">
      <div className="admin-card space-y-5">
        <h3 className="text-xs tracking-widest uppercase font-semibold">Store Info</h3>
        <Field label="Store Name">
          <input className="input-field" value={form.storeName} onChange={e => setForm(f => ({...f, storeName: e.target.value}))} />
        </Field>
        <Field label="Tagline">
          <input className="input-field" value={form.storeTagline} onChange={e => setForm(f => ({...f, storeTagline: e.target.value}))} placeholder="Premium Fashion for the Modern Gentleman" />
        </Field>
      </div>

      <div className="admin-card space-y-5">
        <h3 className="text-xs tracking-widest uppercase font-semibold">Contact Info</h3>
        <Field label="Support Email">
          <input type="email" className="input-field" value={form.contactEmail} onChange={e => setForm(f => ({...f, contactEmail: e.target.value}))} placeholder="arslan.workprofile@gmail.com" />
        </Field>
        <Field label="Phone / WhatsApp">
          <input className="input-field" value={form.contactPhone} onChange={e => setForm(f => ({...f, contactPhone: e.target.value}))} placeholder="+923348544492" />
        </Field>
      </div>

      <div className="admin-card space-y-5">
        <h3 className="text-xs tracking-widest uppercase font-semibold">Announcement Bar</h3>
        <div className="flex items-center gap-3 mb-2">
          <div
            onClick={() => setForm(f => ({...f, announcementActive: !f.announcementActive}))}
            className={`w-5 h-5 border-2 flex items-center justify-center cursor-pointer transition-colors ${form.announcementActive ? 'bg-black border-black' : 'border-gray-300'}`}
          >
            {form.announcementActive && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12"><path d="M10 3L5 8.5 2 5.5l-1 1L5 10.5l6-6.5z"/></svg>}
          </div>
          <label className="text-sm cursor-pointer" onClick={() => setForm(f => ({...f, announcementActive: !f.announcementActive}))}>Show announcement bar</label>
        </div>
        <Field label="Announcement Text">
          <input className="input-field" value={form.announcementText} onChange={e => setForm(f => ({...f, announcementText: e.target.value}))} placeholder="Free Shipping on Orders Over $150 · Est. Delivery 3–5 Days" />
        </Field>
      </div>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
export default function AdminSettings() {
  const dispatch = useDispatch();
  const { settings, loading } = useSelector(s => s.settings);
  const [tab, setTab] = useState('hero');

  useEffect(() => { dispatch(fetchSettings()); }, [dispatch]);

  if (loading && !settings) return <PageSpinner />;

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Manage</p>
        <h1 className="font-display text-3xl font-semibold">Site Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Control hero images, categories, and store information.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-8 overflow-x-auto hide-scrollbar">
        <TabBtn active={tab === 'hero'}       onClick={() => setTab('hero')}>🖼 Hero Slides</TabBtn>
        <TabBtn active={tab === 'categories'} onClick={() => setTab('categories')}>🏷 Categories</TabBtn>
        <TabBtn active={tab === 'general'}    onClick={() => setTab('general')}>⚙ General</TabBtn>
      </div>

      <div className="admin-card">
        {tab === 'hero'       && <HeroSlidesManager   settings={settings} />}
        {tab === 'categories' && <CategoriesManager   settings={settings} />}
        {tab === 'general'    && <GeneralSettings      settings={settings} />}
      </div>
    </div>
  );
}
