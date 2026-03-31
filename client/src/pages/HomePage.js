import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchSettings } from '../store/slices/settingsSlice';
import ProductCard from '../components/shop/ProductCard';
import { PageSpinner } from '../components/common/UI';

const features = [
  { icon: '🚚', title: 'Free Shipping',   desc: 'On all orders over $150' },
  { icon: '↩',  title: '30-Day Returns',  desc: 'Hassle-free, no questions asked' },
  { icon: '🔒', title: 'Secure Payment',  desc: 'SSL encrypted checkout' },
  { icon: '✦',  title: 'Premium Quality', desc: 'Curated materials only' },
];

// ── Dynamic Hero with multiple slides ─────────────────
function HeroSection({ slides = [] }) {
  const [current, setCurrent] = useState(0);
  const activeSlides = slides.filter(s => s.active);
  const slide = activeSlides[current] || activeSlides[0];

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % activeSlides.length), 6000);
    return () => clearInterval(t);
  }, [activeSlides.length]);

  if (!slide) return (
    <section className="relative flex items-center overflow-hidden bg-gray-900" style={{ height: '100vh', minHeight: 600 }}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-white font-semibold" style={{ fontSize: 'clamp(2.75rem,7vw,5.5rem)' }}>
          Dress With<br /><em className="italic" style={{ color: '#c9a96e' }}>Intent.</em>
        </h1>
        <div className="flex flex-wrap gap-4 mt-10">
          <Link to="/shop" className="btn-accent">Shop Collection</Link>
        </div>
      </div>
    </section>
  );

  return (
    <section className="relative flex items-center overflow-hidden" style={{ height: '100vh', minHeight: 600 }}>
      {/* Background image with transition */}
      {activeSlides.map((s, i) => (
        <div key={s.id || i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: 1 }}>
          <img src={s.imageUrl} alt={s.heading} className="w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.55) 55%, rgba(10,10,10,0.1) 100%)' }} />
        </div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full" style={{ zIndex: 2 }}>
        <div className="max-w-2xl">
          {slide.badge && (
            <p className="text-[10px] tracking-[0.35em] uppercase font-semibold mb-6" style={{ color: '#c9a96e' }}>
              {slide.badge}
            </p>
          )}
          <h1 className="font-display font-semibold text-white leading-none mb-6"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)' }}
            dangerouslySetInnerHTML={{ __html: slide.heading.replace(/\.$/, '.<br/><em class="italic" style="color:#c9a96e">Intent.</em>').includes('Intent') ? slide.heading.replace('Intent.', '<em class="italic" style="color:#c9a96e">Intent.</em>') : slide.heading }}
          />
          {slide.subheading && (
            <p className="text-white/60 mb-10 leading-relaxed max-w-md" style={{ fontSize: 'clamp(0.9rem,2vw,1.1rem)' }}>
              {slide.subheading}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            {slide.ctaLabel && (
              <Link to={slide.ctaLink || '/shop'} className="btn-accent">{slide.ctaLabel}</Link>
            )}
            {slide.ctaLabel2 && (
              <Link to={slide.ctaLink2 || '/shop'} className="btn-secondary" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>
                {slide.ctaLabel2}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Slide dots */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 3 }}>
          {activeSlides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className="transition-all duration-300"
              style={{ width: i === current ? 24 : 8, height: 3, background: i === current ? '#c9a96e' : 'rgba(255,255,255,0.4)' }} />
          ))}
        </div>
      )}

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30" style={{ zIndex: 3 }}>
        <span className="text-[9px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-8 overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <div className="w-full" style={{ height: '50%', background: '#c9a96e', animation: 'scrollLine 1.8s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  );
}

// ── Dynamic Category Grid ──────────────────────────────
function CategoryGrid({ categories = [] }) {
  const active = categories.filter(c => c.active).slice(0, 3);
  if (!active.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="mb-10 sm:mb-14">
        <p className="section-subtitle mb-3">Shop by Category</p>
        <h2 className="section-title">Curated for You</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {active.map((cat) => (
          <Link key={cat.id || cat.value} to={`/shop?category=${cat.value}`}
            className="relative overflow-hidden group block" style={{ aspectRatio: '3/4' }}>
            <img
              src={cat.imageUrl || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=750&fit=crop'}
              alt={cat.label}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 transition-opacity duration-500"
              style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.15) 50%, transparent 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex items-end justify-between">
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-white">{cat.label}</h3>
                <div className="w-9 h-9 flex items-center justify-center text-white/60 group-hover:bg-[#c9a96e] group-hover:text-black flex-shrink-0 transition-all duration-300"
                  style={{ border: '1px solid rgba(255,255,255,0.3)' }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* Show all categories as chips below */}
      {categories.filter(c => c.active).length > 3 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {categories.filter(c => c.active).slice(3).map(cat => (
            <Link key={cat.value} to={`/shop?category=${cat.value}`}
              className="text-xs tracking-widest uppercase border border-gray-200 px-4 py-2 hover:border-black hover:text-black transition-colors text-gray-500">
              {cat.label}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────
export default function HomePage() {
  const dispatch = useDispatch();
  const { products, loading: productsLoading } = useSelector(s => s.product);
  const { settings } = useSelector(s => s.settings);

  useEffect(() => {
    dispatch(fetchProducts({ featured: 'true', limit: 4 }));
    dispatch(fetchSettings());
  }, [dispatch]);

  return (
    <div className="page-enter">

      {/* Hero — dynamic from DB */}
      <HeroSection slides={settings?.heroSlides || []} />

      {/* Marquee */}
      <div className="bg-black py-4 overflow-hidden">
        <div className="flex gap-14 whitespace-nowrap" style={{ animation: 'marquee 22s linear infinite' }}>
          {[...Array(3)].fill(['Premium Fabrics','·','Timeless Design','·','Modern Fit','·','Free Returns','·','Est. 2024','·']).flat().map((t, i) => (
            <span key={i} className={`text-[10px] tracking-[0.28em] uppercase ${t === '·' ? 'text-[#c9a96e]' : 'text-white/40'}`}>{t}</span>
          ))}
        </div>
      </div>

      {/* Features strip */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {features.map(f => (
              <div key={f.title} className="flex flex-col sm:flex-row items-center sm:items-start gap-3 py-6 px-4 sm:px-6 text-center sm:text-left">
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase mb-0.5">{f.title}</p>
                  <p className="text-xs text-gray-400 leading-snug hidden sm:block">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories — dynamic from DB */}
      <CategoryGrid categories={settings?.categories || []} />

      {/* Featured products */}
      <section style={{ background: '#f7f7f7' }} className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10 sm:mb-14">
            <div>
              <p className="section-subtitle mb-3">Handpicked</p>
              <h2 className="section-title">Featured Pieces</h2>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-semibold hover:text-[#c9a96e] transition-colors">
              View All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          {productsLoading
            ? <PageSpinner />
            : <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">{products.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}</div>
          }
          <div className="text-center mt-10 sm:hidden">
            <Link to="/shop" className="btn-secondary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Brand statement */}
      <section className="py-16 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="section-subtitle mb-4">The Gent X Promise</p>
            <h2 className="font-display font-semibold leading-tight mb-6" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
              Built to Last.<br /><em className="italic" style={{ color: '#c9a96e' }}>Made to Impress.</em>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8 text-sm sm:text-base">
              Every Gent X piece is conceived with a singular purpose: to make the man wearing it feel unshakeable. We source only the finest materials and work with craftsmen who share our obsession with detail.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
              {[['500+','Products'],['98%','Satisfaction'],['3yr','Guarantee']].map(([n,l]) => (
                <div key={l}>
                  <p className="font-display text-2xl sm:text-3xl font-semibold">{n}</p>
                  <p className="text-xs text-gray-400 tracking-wider mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden" style={{ aspectRatio: '4/5' }}>
              <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&h=875&fit=crop&q=80" alt="Gent X" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-5 -left-5 p-5 hidden md:flex flex-col items-center justify-center" style={{ background: '#c9a96e', width: 100, height: 100 }}>
              <p className="font-display text-3xl font-bold text-black">∞</p>
              <p className="text-[9px] tracking-widest uppercase text-black/70 mt-1">Timeless</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 sm:py-28" style={{ background: '#0d0d0d' }}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <p className="section-subtitle mb-4">Stay in the Know</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-4">The Inner Circle</h2>
          <p className="text-gray-500 text-sm mb-10 leading-relaxed">Early access to new drops, exclusive offers, and style content.</p>
          <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row">
            <input type="email" placeholder="Your email address"
              className="flex-1 text-white text-sm px-5 py-4 outline-none placeholder-gray-600 transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRight: 'none' }}
              onFocus={e => { e.target.style.borderColor = '#c9a96e'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
            <button type="submit" className="btn-accent px-6 py-4 whitespace-nowrap" style={{ borderRadius: 0 }}>Subscribe</button>
          </form>
          <p className="text-gray-600 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
