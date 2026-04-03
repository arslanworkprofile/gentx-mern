import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchSettings } from '../store/slices/settingsSlice';
import ProductCard from '../components/shop/ProductCard';
import { Pagination, PageSpinner, EmptyState } from '../components/common/UI';

const SIZES  = ['XS','S','M','L','XL','XXL','28','30','32','34','36','40','41','42','43','44','45','One Size'];
const COLORS = ['Black','White','Charcoal','Navy','Brown','Tan','Burgundy','Beige','Olive','Grey','Slate','Off-White'];
const SORTS  = [
  { value: 'newest',     label: 'Newest' },
  { value: 'popular',    label: 'Popular' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'price_asc',  label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
];

export default function ShopPage() {
  const dispatch = useDispatch();
  const { products, loading, page, pages, total } = useSelector(s => s.product);
  const { settings } = useSelector(s => s.settings);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Dynamic categories from DB, fallback to static
  const CATEGORIES = (settings?.categories || []).filter(c => c.active);

  const getParam = (k, def = '') => searchParams.get(k) || def;

  const [filters, setFilters] = useState({
    search: getParam('search'), category: getParam('category'),
    color: getParam('color'), size: getParam('size'),
    minPrice: getParam('minPrice'), maxPrice: getParam('maxPrice'),
    sort: getParam('sort', 'newest'), page: getParam('page', '1'),
  });

  const applyFilters = useCallback((f) => {
    const params = {};
    Object.entries(f).forEach(([k, v]) => { if (v && v !== '1') params[k] = v; });
    if (f.page && f.page !== '1') params.page = f.page;
    setSearchParams(params);
    const query = { ...f, limit: 12 };
    Object.keys(query).forEach(k => { if (!query[k]) delete query[k]; });
    dispatch(fetchProducts(query));
  }, [dispatch, setSearchParams]);

  useEffect(() => {
    dispatch(fetchSettings());
  }, []); // eslint-disable-line

  useEffect(() => {
    const f = {
      search: getParam('search'), category: getParam('category'),
      color: getParam('color'), size: getParam('size'),
      minPrice: getParam('minPrice'), maxPrice: getParam('maxPrice'),
      sort: getParam('sort', 'newest'), page: getParam('page', '1'),
    };
    setFilters(f);
    applyFilters(f);
  }, [searchParams.toString()]); // eslint-disable-line

  const update = (key, value) => {
    const next = { ...filters, [key]: value, page: '1' };
    setFilters(next);
    applyFilters(next);
  };

  const clearAll = () => {
    const reset = { search:'', category:'', color:'', size:'', minPrice:'', maxPrice:'', sort:'newest', page:'1' };
    setFilters(reset);
    setSearchParams({});
    dispatch(fetchProducts({ limit: 12, sort: 'newest' }));
  };

  const activeCount = [filters.category, filters.color, filters.size, filters.minPrice, filters.maxPrice].filter(Boolean).length;

  // ── Filter sidebar content ──
  const FilterContent = () => (
    <div className="space-y-7">
      {/* Category */}
      {CATEGORIES.length > 0 && (
        <div>
          <h4 className="label-field mb-3">Category</h4>
          <div className="space-y-1.5">
            <button onClick={() => update('category', '')}
              className={`w-full text-left text-sm py-1.5 px-2 transition-colors ${!filters.category ? 'font-semibold text-black bg-gray-100' : 'text-gray-500 hover:text-black'}`}>
              All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button key={cat.value} onClick={() => update('category', filters.category === cat.value ? '' : cat.value)}
                className={`w-full text-left text-sm py-1.5 px-2 transition-colors capitalize ${filters.category === cat.value ? 'font-semibold text-black bg-gray-100' : 'text-gray-500 hover:text-black'}`}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div>
        <h4 className="label-field mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice}
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
            onBlur={() => applyFilters(filters)}
            className="input-field text-sm py-2 text-center" />
          <span className="text-gray-300 flex-shrink-0">—</span>
          <input type="number" placeholder="Max" value={filters.maxPrice}
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
            onBlur={() => applyFilters(filters)}
            className="input-field text-sm py-2 text-center" />
        </div>
      </div>

      {/* Size */}
      <div>
        <h4 className="label-field mb-3">Size</h4>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map(s => (
            <button key={s} onClick={() => update('size', filters.size === s ? '' : s)}
              className="px-2.5 py-1.5 text-xs border transition-colors"
              style={{
                background: filters.size === s ? '#0a0a0a' : 'white',
                color: filters.size === s ? '#fafafa' : '#525252',
                borderColor: filters.size === s ? '#0a0a0a' : '#dcdcdc',
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h4 className="label-field mb-3">Color</h4>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(c => (
            <button key={c} title={c} onClick={() => update('color', filters.color === c ? '' : c)}
              className="w-7 h-7 rounded-full transition-all"
              style={{
                background: c.toLowerCase().replace(/[\s-]/g,'') === 'off-white' ? '#f5f5f0' : c.toLowerCase().replace(' ', ''),
                border: filters.color === c ? '2.5px solid #0a0a0a' : '2px solid #dcdcdc',
                transform: filters.color === c ? 'scale(1.2)' : 'scale(1)',
              }} />
          ))}
        </div>
        {filters.color && (
          <button onClick={() => update('color', '')} className="text-xs text-gray-400 hover:text-black mt-2 transition-colors">
            Clear: {filters.color} ✕
          </button>
        )}
      </div>

      {activeCount > 0 && (
        <button onClick={clearAll} className="btn-secondary w-full py-2.5 text-xs">
          Clear All ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div style={{ paddingTop: 80 }} className="page-enter min-h-screen">
      {/* Page header */}
      <div className="border-b border-gray-100 py-8 sm:py-12 px-4 sm:px-6" style={{ background: '#f7f7f7' }}>
        <div className="max-w-7xl mx-auto">
          <p className="section-subtitle mb-2">Explore</p>
          <h1 className="section-title">
            {filters.category
              ? CATEGORIES.find(c => c.value === filters.category)?.label || filters.category
              : 'All Products'}
          </h1>
          {filters.search && (
            <p className="text-gray-500 text-sm mt-2">
              Results for "<span className="text-black font-medium">{filters.search}</span>"
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-gray-200 px-4 py-2.5 text-xs tracking-widest uppercase hover:border-black transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              Filters {activeCount > 0 && `(${activeCount})`}
            </button>
            <p className="text-xs text-gray-400">{loading ? '…' : `${total} products`}</p>
          </div>
          <select value={filters.sort} onChange={e => update('sort', e.target.value)}
            className="text-xs border border-gray-200 px-3 py-2.5 outline-none bg-white hover:border-gray-400 cursor-pointer transition-colors">
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div className="flex gap-8 lg:gap-10">
          {/* Desktop sidebar */}
          <aside className="w-52 flex-shrink-0 hidden lg:block">
            <FilterContent />
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <PageSpinner />
            ) : products.length === 0 ? (
              <EmptyState icon="🛍️" title="No products found"
                description="Try adjusting your filters or search term." />
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
                <Pagination page={page} pages={pages} onPageChange={n => update('page', String(n))} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-[340px] bg-white flex flex-col animate-slide-in overflow-x-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold tracking-widest uppercase">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="p-1 text-gray-400 hover:text-black">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterContent />
            </div>
            <div className="p-5 border-t border-gray-100">
              <button onClick={() => setFiltersOpen(false)} className="btn-primary w-full py-3.5">
                Show {total} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
