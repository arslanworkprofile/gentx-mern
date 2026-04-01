import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { PageSpinner, StarRating } from '../components/common/UI';
import toast from 'react-hot-toast';
import API from '../utils/api';

export default function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector(s => s.product);
  const { user } = useSelector(s => s.auth);

  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize]   = useState('');
  const [qty, setQty]   = useState(1);
  const [tab, setTab]   = useState('description');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearProduct());
  }, [id, dispatch]);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || '');
      setSelectedSize(product.sizes?.[0] || '');
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product.sizes?.length && !selectedSize) return toast.error('Please select a size');
    if (product.stock === 0) return toast.error('Out of stock');
    dispatch(addToCart({
      product: product._id, name: product.name,
      image: product.images?.[0]?.url || '',
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      color: selectedColor, size: selectedSize, quantity: qty,
    }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!review.comment.trim()) return toast.error('Please write a comment');
    setSubmitting(true);
    try {
      await API.post(`/products/${id}/reviews`, review);
      toast.success('Review submitted!');
      dispatch(fetchProductById(id));
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  if (loading) return <PageSpinner />;
  if (!product) return (
    <div className="pt-32 text-center">
      <p className="text-gray-500">Product not found.</p>
      <Link to="/shop" className="btn-primary mt-6 inline-block">Back to Shop</Link>
    </div>
  );

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const savings = product.discountPrice > 0 ? ((1 - product.discountPrice / product.price) * 100).toFixed(0) : 0;

  return (
    <div className="page-enter" style={{ paddingTop: 80 }}>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-black transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-black truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">

          {/* ── Gallery ── */}
          <div className="space-y-3">
            <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
              <img
                src={product.images?.[selectedImg]?.url || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600'}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {product.isNew && <span className="absolute top-4 left-4 badge-new">New Arrival</span>}
              {savings > 0 && <span className="absolute top-4 right-4 badge-sale">−{savings}%</span>}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)}
                    className={`flex-shrink-0 w-20 h-24 overflow-hidden border-2 transition-all ${i === selectedImg ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="sticky top-24 self-start">
            <p className="section-subtitle mb-2">{product.brand}</p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold mb-3">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <StarRating rating={product.rating} numReviews={product.numReviews} />
              <span className="text-xs text-gray-400">{product.sold} sold</span>
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-display text-3xl font-semibold">${displayPrice.toFixed(2)}</span>
              {product.discountPrice > 0 && <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>}
              {savings > 0 && <span className="text-sm text-green-600 font-medium">Save {savings}%</span>}
            </div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p className="label-field mb-2">Color: <span className="text-black normal-case font-normal">{selectedColor}</span></p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)} title={c}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c ? 'border-black scale-110' : 'border-gray-200 hover:border-gray-500'}`}
                      style={{ backgroundColor: c.toLowerCase().replace(/[\s-]/g,'') === 'off-white' ? '#f5f5f0' : c.toLowerCase().replace(' ','') }} />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="label-field">Size</p>
                  <button className="text-xs text-gray-500 underline hover:text-black">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 text-xs border font-medium transition-all ${selectedSize === s ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-700 hover:border-black'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="label-field mb-2">Quantity</p>
              <div className="flex items-center border border-gray-200 w-fit">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-lg">−</button>
                <span className="w-12 text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-lg">+</button>
              </div>
              <p className="text-xs text-gray-400 mt-2">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
            </div>

            <div className="flex gap-3 mb-8">
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className={`flex-1 btn-primary py-4 text-sm ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button onClick={() => toast('Wishlist coming soon')}
                className="w-12 h-12 border border-gray-200 flex items-center justify-center hover:border-black transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Trust badges */}
            <div className="border-t border-gray-100 pt-6 grid grid-cols-3 gap-4 text-center">
              {[['🚚', 'Free Shipping', '$150+'], ['🔄', 'Free Returns', '30 days'], ['🔒', 'Secure Payment', 'Encrypted']].map(([icon, title, sub]) => (
                <div key={title}>
                  <div className="text-xl mb-1">{icon}</div>
                  <p className="text-xs font-medium">{title}</p>
                  <p className="text-[10px] text-gray-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-20">
          <div className="flex border-b border-gray-100">
            {['description', 'details', 'reviews'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-3 text-xs tracking-widest uppercase font-medium transition-all ${tab === t ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}>
                {t}{t === 'reviews' ? ` (${product.numReviews})` : ''}
              </button>
            ))}
          </div>

          <div className="pt-8">
            {tab === 'description' && (
              <div className="max-w-2xl prose prose-sm text-gray-600 leading-relaxed">
                <p>{product.description}</p>
              </div>
            )}
            {tab === 'details' && (
              <div className="max-w-lg">
                <dl className="divide-y divide-gray-100">
                  {[['Brand', product.brand], ['Category', product.category], ['Available Colors', product.colors?.join(', ')], ['Available Sizes', product.sizes?.join(', ')], ['Stock', `${product.stock} units`], ['SKU', product._id?.slice(-8).toUpperCase()]].map(([k, v]) => v && (
                    <div key={k} className="flex py-3 gap-4">
                      <dt className="text-xs tracking-wider uppercase text-gray-500 w-36 flex-shrink-0">{k}</dt>
                      <dd className="text-sm text-black capitalize">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {tab === 'reviews' && (
              <div className="max-w-2xl space-y-8">
                {product.reviews?.length === 0 && <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>}
                {product.reviews?.map(r => (
                  <div key={r._id} className="border-b border-gray-100 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{r.name}</p>
                        <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                      <StarRating rating={r.rating} size="sm" />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                  </div>
                ))}

                {user && (
                  <div className="pt-4">
                    <h4 className="font-display text-lg font-semibold mb-4">Write a Review</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="label-field">Rating</label>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(n => (
                            <button key={n} type="button" onClick={() => setReview(r => ({...r, rating: n}))}>
                              <svg className={`w-6 h-6 transition-colors ${n <= review.rating ? 'text-accent fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="label-field">Comment</label>
                        <textarea value={review.comment} onChange={e => setReview(r => ({...r, comment: e.target.value}))}
                          rows={4} className="input-field resize-none" placeholder="Share your experience with this product..." />
                      </div>
                      <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                        {submitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
