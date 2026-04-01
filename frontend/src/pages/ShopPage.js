import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown, FiGrid, FiList } from 'react-icons/fi';
import api from '../api';
import ProductCard from '../components/ProductCard';
import './ShopPage.css';

const CATEGORIES = ['shirts','pants','suits','shoes','jackets','watches','accessories'];
const SIZES = ['XS','S','M','L','XL','XXL','28','30','32','34','36','38'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ShopPage() {
  const { category: catParam } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const category = catParam || searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);
  const newArrival = searchParams.get('newArrival') || '';
  const bestSeller = searchParams.get('bestSeller') || '';
  const featured = searchParams.get('featured') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      if (sort) params.set('sort', sort);
      if (page) params.set('page', page);
      if (newArrival) params.set('newArrival', newArrival);
      if (bestSeller) params.set('bestSeller', bestSeller);
      if (featured) params.set('featured', featured);
      params.set('limit', '12');

      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, search, sort, page, newArrival, bestSeller, featured]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const pageTitle = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : search ? `Search: "${search}"`
    : newArrival ? 'New Arrivals'
    : bestSeller ? 'Best Sellers'
    : featured ? 'Featured'
    : 'All Products';

  return (
    <div className="shop-page page">
      {/* Breadcrumb */}
      <div className="shop-breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{pageTitle}</span>
        </div>
      </div>

      <div className="container">
        <div className="shop-layout">
          {/* Sidebar */}
          <aside className={`shop-sidebar${sidebarOpen ? ' shop-sidebar--open' : ''}`}>
            <div className="shop-sidebar__header">
              <h3>Filters</h3>
              <button onClick={() => setSidebarOpen(false)} className="shop-sidebar__close"><FiX /></button>
            </div>

            {/* Categories */}
            <div className="filter-section">
              <p className="filter-section__title">Category</p>
              <div className="filter-list">
                <button
                  className={`filter-item${!category ? ' active' : ''}`}
                  onClick={() => { window.location.href = '/shop'; }}
                >All</button>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c}
                    to={`/shop/${c}`}
                    className={`filter-item${category === c ? ' active' : ''}`}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="filter-section">
              <p className="filter-section__title">Sort By</p>
              <div className="filter-list">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    className={`filter-item${sort === o.value ? ' active' : ''}`}
                    onClick={() => setParam('sort', o.value)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="filter-section">
              <p className="filter-section__title">Collection</p>
              <div className="filter-list">
                {[
                  { label: 'New Arrivals', key: 'newArrival' },
                  { label: 'Best Sellers', key: 'bestSeller' },
                  { label: 'Featured', key: 'featured' },
                ].map((f) => (
                  <button
                    key={f.key}
                    className={`filter-item${searchParams.get(f.key) ? ' active' : ''}`}
                    onClick={() => setParam(f.key, searchParams.get(f.key) ? '' : 'true')}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

          {/* Main */}
          <div className="shop-main">
            <div className="shop-toolbar">
              <div className="shop-toolbar__left">
                <button className="btn btn-ghost shop-filter-btn" onClick={() => setSidebarOpen(true)}>
                  <FiFilter size={16} /> Filters
                </button>
                <p className="shop-count">{loading ? '...' : `${total} products`}</p>
              </div>
              <select
                className="shop-sort-select"
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <h1 className="shop-title">{pageTitle}</h1>

            {loading ? (
              <div className="products-grid">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 420, borderRadius: 2 }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="shop-empty">
                <p>No products found.</p>
                <Link to="/shop" className="btn btn-outline" style={{ marginTop: 16 }}>Clear Filters</Link>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="pagination">
                    {[...Array(pages)].map((_, i) => (
                      <button
                        key={i}
                        className={`pagination__btn${page === i + 1 ? ' active' : ''}`}
                        onClick={() => setParam('page', i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
