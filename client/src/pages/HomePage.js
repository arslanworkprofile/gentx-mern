import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/shop/ProductCard';
import { PageSpinner } from '../components/common/UI';

const categories = [
  { label: 'Shirts',      to: '/shop?category=shirts',      img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=600&fit=crop' },
  { label: 'Jackets',     to: '/shop?category=jackets',     img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop' },
  { label: 'Accessories', to: '/shop?category=accessories', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=600&fit=crop' },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector(s => s.product);

  useEffect(() => {
    dispatch(fetchProducts({ featured: 'true', limit: 4 }));
  }, [dispatch]);

  return (
    <div className="page-enter">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="image1.png" alt="Gent X Hero"
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-xl">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-medium mb-6 animate-fade-in">New Collection — 2024</p>
            <h1 className="font-display text-5xl md:text-7xl font-semibold text-white leading-none mb-6" style={{ animationDelay: '0.1s' }}>
              Dress With<br /><span className="italic text-accent">Intent.</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg mb-10 leading-relaxed max-w-md" style={{ animationDelay: '0.2s' }}>
              Premium menswear crafted for those who understand that style is not what you wear — it's how you carry it.
            </p>
            <div className="flex flex-wrap gap-4" style={{ animationDelay: '0.3s' }}>
              <Link to="/shop" className="btn-accent">Shop Collection</Link>
              <Link to="/shop?isNew=true" className="btn-secondary border-white text-white hover:bg-white hover:text-black">New Arrivals</Link>
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-[9px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-white animate-bounce" style={{ animation: 'scrollLine 1.5s ease infinite' }} />
          </div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────── */}
      <div className="bg-black py-4 overflow-hidden">
        <div className="flex gap-16 animate-marquee whitespace-nowrap" style={{ animation: 'marquee 20s linear infinite' }}>
          {Array(6).fill(['Premium Fabrics', '·', 'Timeless Design', '·', 'Modern Fit', '·', 'Free Shipping $150+', '·']).flat().map((t, i) => (
            <span key={i} className={`text-[10px] tracking-[0.3em] uppercase ${t === '·' ? 'text-accent' : 'text-white/50'}`}>{t}</span>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* ── Category Grid ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-12">
          <p className="section-subtitle mb-3">Shop by Category</p>
          <h2 className="section-title">Curated for You</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <Link key={cat.label} to={cat.to}
              className="relative overflow-hidden group aspect-[4/5] block"
              style={{ animationDelay: `${i * 0.1}s` }}>
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
                <h3 className="font-display text-2xl font-semibold text-white">{cat.label}</h3>
                <div className="w-10 h-10 border border-white/40 flex items-center justify-center text-white/70 group-hover:bg-accent group-hover:border-accent group-hover:text-black transition-all duration-300">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────── */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-subtitle mb-3">Handpicked</p>
              <h2 className="section-title">Featured Pieces</h2>
            </div>
            <Link to="/shop" className="text-xs tracking-widest uppercase font-medium border-b border-black pb-0.5 hover:text-accent hover:border-accent transition-colors hidden md:block">
              View All
            </Link>
          </div>
          {loading ? <PageSpinner /> : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
          <div className="text-center mt-12 md:hidden">
            <Link to="/shop" className="btn-secondary inline-block">View All Products</Link>
          </div>
        </div>
      </section>

      {/* ── Brand Statement ───────────────────────────────── */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-subtitle mb-4">The Gent X Promise</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-6">
              Built to Last.<br /><em className="not-italic text-accent">Made to Impress.</em>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Every Gent X piece is conceived with a singular purpose: to make the man wearing it feel unshakeable. We source only the finest materials — Egyptian cotton, Italian leather, Japanese selvedge denim — and work with master craftsmen who share our obsession with detail.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
              {[['500+', 'SKUs crafted'], ['98%', 'Satisfaction rate'], ['3yr', 'Quality guarantee']].map(([num, label]) => (
                <div key={label}>
                  <p className="font-display text-3xl font-semibold text-black">{num}</p>
                  <p className="text-xs text-gray-500 tracking-wider mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=750&fit=crop" alt="Gent X craftsmanship" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-accent p-6 hidden md:block">
              <p className="font-display text-4xl font-bold text-black">∞</p>
              <p className="text-[10px] tracking-widest uppercase text-black/70 mt-1">Timeless Style</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────── */}
      <section className="bg-gray-950 py-24">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="text-accent text-xs tracking-[0.3em] uppercase mb-4">Stay in the Know</p>
          <h2 className="font-display text-4xl font-semibold text-white mb-4">The Inner Circle</h2>
          <p className="text-gray-500 text-sm mb-10 leading-relaxed">Early access to new drops, exclusive offers, and style content for the modern gentleman.</p>
          <form onSubmit={e => e.preventDefault()} className="flex gap-0">
            <input type="email" placeholder="Your email address" className="flex-1 bg-gray-900 text-white text-sm px-5 py-4 border border-gray-700 outline-none focus:border-accent placeholder-gray-600 transition-colors" />
            <button type="submit" className="btn-accent px-6 py-4 whitespace-nowrap">Subscribe</button>
          </form>
          <p className="text-gray-600 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
