import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const price    = product.discountPrice > 0 ? product.discountPrice : product.price;
  const img      = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500&h=600&fit=crop';
  const savings  = product.discountPrice > 0 ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!product.stock) return;
    dispatch(addToCart({
      product: product._id, name: product.name, image: img,
      price, color: product.colors?.[0] || '', size: product.sizes?.[0] || '',
    }));
    toast.success(`Added to cart`);
  };

  return (
    <Link to={`/product/${product._id}`} className="block group">
      {/* Image */}
      <div
        className="relative overflow-hidden bg-gray-100"
        style={{ aspectRatio: '3/4' }}
      >
        <img
          src={img} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.isNewArrival && <span className="badge-new">New</span>}
          {savings > 0            && <span className="badge-sale">-{savings}%</span>}
          {product.stock === 0    && <span className="badge-stock">Sold Out</span>}
        </div>

        {/* Wishlist btn */}
        <button
          onClick={e => { e.preventDefault(); toast('Wishlist coming soon'); }}
          className="absolute top-2.5 right-2.5 w-8 h-8 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#c9a96e]"
          aria-label="Wishlist"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Quick add */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleQuickAdd}
            disabled={!product.stock}
            className={`w-full py-3 text-[10px] tracking-[0.18em] uppercase font-semibold transition-colors duration-200 ${
              product.stock
                ? 'bg-black text-white hover:bg-[#c9a96e] hover:text-black'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {product.stock ? 'Quick Add' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3.5 space-y-1.5">
        <p className="text-[9px] text-gray-400 tracking-[0.2em] uppercase">{product.category}</p>
        <h3 className="font-display text-sm sm:text-base font-medium text-black group-hover:text-[#c9a96e] transition-colors duration-200 leading-snug line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">${price.toFixed(2)}</span>
            {savings > 0 && (
              <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 fill-current" style={{ color: '#c9a96e' }} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span className="text-[10px] text-gray-400">{product.rating}</span>
            </div>
          )}
        </div>

        {/* Color swatches */}
        {product.colors?.length > 0 && (
          <div className="flex gap-1.5 pt-0.5">
            {product.colors.slice(0, 5).map(c => (
              <div
                key={c} title={c}
                className="w-3 h-3 rounded-full border border-gray-200"
                style={{ background: c.toLowerCase().replace(/[\s-]/g,'') === 'off-white' ? '#f5f5f0' : c.toLowerCase().replace(' ','') }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[9px] text-gray-400 self-center">+{product.colors.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
