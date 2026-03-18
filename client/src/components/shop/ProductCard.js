import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const price    = product.discountPrice > 0 ? product.discountPrice : product.price;
  const img      = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400';

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    dispatch(addToCart({
      product: product._id, name: product.name, image: img,
      price, color: product.colors?.[0] || '', size: product.sizes?.[0] || '',
    }));
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/product/${product._id}`} className="block group">
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
        <img src={img} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew      && <span className="badge-new">New</span>}
          {product.discountPrice > 0 && <span className="badge-sale">Sale</span>}
          {product.stock === 0 && <span className="badge-stock">Sold Out</span>}
        </div>
        {/* Quick add */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button onClick={handleQuickAdd} disabled={product.stock === 0}
            className={`w-full py-3 text-xs tracking-widest uppercase font-medium transition-colors duration-200 ${product.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-accent hover:text-black'}`}>
            {product.stock === 0 ? 'Out of Stock' : 'Quick Add'}
          </button>
        </div>
        {/* Wishlist */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-accent"
          onClick={e => { e.preventDefault(); toast('Wishlist coming soon'); }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-[10px] text-gray-400 tracking-widest uppercase">{product.category}</p>
        <h3 className="font-display text-base font-medium text-black group-hover:text-accent transition-colors duration-200 leading-snug">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-black">${price.toFixed(2)}</span>
            {product.discountPrice > 0 && (
              <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-accent fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <span className="text-xs text-gray-500">{product.rating}</span>
            </div>
          )}
        </div>
        {/* Color dots */}
        {product.colors?.length > 0 && (
          <div className="flex gap-1.5 pt-1">
            {product.colors.slice(0, 4).map(c => (
              <div key={c} title={c} className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: c.toLowerCase().replace(' ', '') === 'off-white' ? '#f5f5f0' : c.toLowerCase() }} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
