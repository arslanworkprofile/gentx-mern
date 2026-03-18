import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/shop/ProductCard';
import { Pagination, PageSpinner, EmptyState } from '../components/common/UI';

const CATEGORIES = ['shirts','pants','jackets','shoes','accessories','hoodies','suits','casual','formal','other'];
const SIZES      = ['XS','S','M','L','XL','XXL','28','30','32','34','36','40','41','42','43','44','45','One Size'];
const COLORS     = ['Black','White','Charcoal','Navy','Brown','Tan','Burgundy','Beige','Olive','Grey','Slate','Off-White'];
const SORTS      = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'popular',    label: 'Most Popular' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

export default function ShopPage() {
  const dispatch = useDispatch();
  const { products, loading, page, pages, total } = useSelector(s => s.product);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const getParam = (k, def = '') => searchParams.get(k) || def;

  const [filters, setFilters] = useState({
    search:   getParam('search'),
    category: getParam('category'),
    color:    getParam('color'),
    size:     getParam('size'),
    minPrice: getParam('minPrice'),
    maxPrice: getParam('maxPrice'),
    sort:     getParam('sort', 'newest'),
    page:     getParam('page', '1'),
  });

  const applyFilters = useCallback((f) => {
    const params = {};
    Object.entries(f).forEach(([k, v]) => { if (v) params[k] = v; });
    setSearchParams(params);
    const query = { ...f, limit: 12 };
    Object.keys(query).forEach(k => { if (!query[k]) delete query[k]; });
    dispatch(fetchProducts(query));
  }, [dispatch, setSearchParams]);

  useEffect(() => {
    const f = {
      search:   getParam('search'),
      category: getParam('category'),
      color:    getParam('color'),
      size:     getParam('size'),
      minPrice: getParam('minPrice'),
      maxPrice: getParam('maxPrice'),
      sort:     getParam('sort', 'newest'),
      page:     getParam('page', '1'),
    };
    setFilters(f);
    applyFilters(f);
    // eslint-disable-next-line
  }, [searchParams.toString()]);

  const update = (key, value) => {
    const next = { ...filters, [key]: value, page: '1' };
    setFilters(next);
    applyFilters(next);
  };

  const clearAll = () => {
    const reset = { search:'', category:'', color:'', size:'', minPrice:'', maxPrice:'', sort:'newest', page:'1' };
    setFilters(reset);
    applyFilters(reset);
  };

  const activeCount = [filters.category, filters.color, filters.size, filters.minPrice, filters.maxPrice].filter(Boolean).length;

  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Category */}
      <div>
        <h4 className="label-field mb-3">Category</h4>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <div onClick={() => update('category', filters.category === cat ? '' : cat)}
                className={`w-4 h-4 border flex items-center justify-center transition-colors cursor-pointer ${filters.category === cat ? 'bg-black border-black' : 'border-gray-300 group-hover:border-gray-600'}`}>
                {filters.category === cat && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12"><path d="M10 3L5 8.5 2 5.5l-1 1L5 10.5l6-6.5z"/></svg>}
              </div>
              <span className={`text-sm capitalize transition-colors ${filters.category === cat ? 'text-black font-medium' : 'text-gray-600 group-hover:text-black'}`}>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="label-field mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => setFilters(f => ({...f, minPrice: e.target.value}))}
            onBlur={() => applyFilters(filters)} className="input-field text-sm py-2" />
          <span className="text-gray-400 text-sm">–</span>
          <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => setFilters(f => ({...f, maxPrice: e.target.value}))}
            onBlur={() => applyFilters(filters)} className="input-field text-sm py-2" />
        </div>
      </div>

      {/* Size */}
      <div>
        <h4 className="label-field mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(s => (
            <button key={s} onClick={() => update('size', filters.size === s ? '' : s)}
              className={`px-2.5 py-1.5 text-xs border transition-colors ${filters.size === s ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600 hover:border-gray-600'}`}>
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
            <button key={c} onClick={() => update('color', filters.color === c ? '' : c)}
              title={c} className={`w-7 h-7 rounded-full border-2 transition-all ${filters.color === c ? 'border-black scale-110' : 'border-gray-100 hover:border-gray-400'}`}
              style={{ backgroundColor: c.toLowerCase().replace(/-| /g,'') === 'off-white' ? '#f5f5f0' : c.toLowerCase().replace(' ','') }}>
            </button>
          ))}
        </div>
      </div>

      {activeCount > 0 && (
        <button onClick={clearAll} className="w-full btn-secondary text-sm py-2.5">
          Clear All Filters ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-20 page-enter">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="section-subtitle mb-2">Explore</p>
          <h1 className="section-title">
            {filters.category ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1) : 'All Products'}
          </h1>
          {filters.search && <p className="text-gray-500 text-sm mt-2">Results for "<span className="text-black font-medium">{filters.search}</span>"</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 text-xs tracking-widest uppercase font-medium border border-gray-200 px-4 py-2.5 hover:border-black transition-colors md:hidden">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              Filters {activeCount > 0 && `(${activeCount})`}
            </button>
            <p className="text-xs text-gray-500">{loading ? '...' : `${total} products`}</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 tracking-wider uppercase hidden sm:block">Sort:</label>
            <select value={filters.sort} onChange={e => update('sort', e.target.value)}
              className="text-xs border border-gray-200 px-3 py-2 outline-none bg-white hover:border-gray-400 transition-colors cursor-pointer">
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="w-56 flex-shrink-0 hidden md:block">
            <FilterSidebar />
          </aside>

          {/* Mobile sidebar drawer */}
          {filtersOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-medium tracking-wider text-sm uppercase">Filters</h3>
                  <button onClick={() => setFiltersOpen(false)}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FilterSidebar />
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <PageSpinner />
            ) : products.length === 0 ? (
              <EmptyState icon="🛍️" title="No products found" description="Try adjusting your filters or search term." />
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
                <Pagination page={page} pages={pages} onPageChange={n => update('page', String(n))} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
