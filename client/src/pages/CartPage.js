import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart, selectCartTotal } from '../store/slices/cartSlice';
import { EmptyState } from '../components/common/UI';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items } = useSelector(s => s.cart);
  const { user }  = useSelector(s => s.auth);
  const subtotal  = useSelector(selectCartTotal);
  const shipping  = subtotal >= 150 ? 0 : 9.99;
  const tax       = subtotal * 0.09;
  const total     = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!user) { toast.error('Please sign in to checkout'); navigate('/login'); return; }
    navigate('/checkout');
  };

  if (!items.length) return (
    <div style={{ paddingTop: 80 }} className="min-h-screen">
      <EmptyState icon="🛒" title="Your cart is empty"
        description="Add some items from the shop to get started."
        action={<Link to="/shop" className="btn-primary inline-flex">Continue Shopping</Link>} />
    </div>
  );

  return (
    <div style={{ paddingTop: 80 }} className="min-h-screen page-enter">
      {/* Header */}
      <div className="border-b border-gray-100 py-8 sm:py-12 px-4 sm:px-6" style={{ background: '#f7f7f7' }}>
        <div className="max-w-7xl mx-auto">
          <p className="section-subtitle mb-2">Review</p>
          <h1 className="section-title">Shopping Cart <span className="text-gray-400 text-2xl">({items.length})</span></h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Items list */}
          <div className="lg:col-span-2">
            {/* Desktop header row */}
            <div className="hidden sm:grid grid-cols-12 text-[10px] tracking-[0.2em] uppercase text-gray-400 pb-4 border-b border-gray-100 mb-2">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-3 text-center">Qty</div>
              <div className="col-span-1 text-right">Total</div>
            </div>

            <div className="space-y-0 divide-y divide-gray-50">
              {items.map(item => {
                const key = `${item.product}-${item.color}-${item.size}`;
                return (
                  <div key={key} className="py-5 sm:py-6 grid grid-cols-12 gap-3 sm:gap-4 items-center">
                    {/* Image + info */}
                    <div className="col-span-12 sm:col-span-6 flex gap-3 sm:gap-4">
                      <Link to={`/product/${item.product}`} className="flex-shrink-0">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200'}
                          alt={item.name}
                          className="object-cover bg-gray-100"
                          style={{ width: 72, height: 88 }}
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.product}`}
                          className="font-display text-sm font-medium hover:text-[#c9a96e] transition-colors line-clamp-2">
                          {item.name}
                        </Link>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.color && <span className="text-xs text-gray-400">{item.color}</span>}
                          {item.color && item.size && <span className="text-gray-200">·</span>}
                          {item.size  && <span className="text-xs text-gray-400">{item.size}</span>}
                        </div>
                        <button
                          onClick={() => { dispatch(removeFromCart({ product: item.product, color: item.color, size: item.size })); toast.success('Removed'); }}
                          className="text-xs text-red-400 hover:text-red-600 transition-colors mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-4 sm:col-span-2 text-center">
                      <p className="text-xs text-gray-400 sm:hidden mb-1">Price</p>
                      <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                    </div>

                    {/* Qty */}
                    <div className="col-span-5 sm:col-span-3 flex justify-center">
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => dispatch(updateQuantity({ product: item.product, color: item.color, size: item.size, quantity: item.quantity - 1 }))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-base leading-none"
                        >−</button>
                        <span className="w-9 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ product: item.product, color: item.color, size: item.size, quantity: item.quantity + 1 }))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-base leading-none"
                        >+</button>
                      </div>
                    </div>

                    {/* Line total */}
                    <div className="col-span-3 sm:col-span-1 text-right">
                      <p className="text-xs text-gray-400 sm:hidden mb-1">Total</p>
                      <span className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-6 mt-2 border-t border-gray-100">
              <Link to="/shop" className="flex items-center gap-2 text-xs tracking-widest uppercase hover:text-[#c9a96e] transition-colors">
                ← Continue Shopping
              </Link>
              <button onClick={() => { dispatch(clearCart()); toast.success('Cart cleared'); }}
                className="text-xs text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="p-6 sm:p-8 sticky top-24" style={{ background: '#f7f7f7' }}>
              <h2 className="font-display text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Est. Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs bg-white p-3 border border-gray-200 text-gray-500">
                    Add <span className="font-medium text-black">${(150 - subtotal).toFixed(2)}</span> for{' '}
                    <span className="text-green-600 font-medium">free shipping</span>
                  </p>
                )}
              </div>
              <div className="border-t border-gray-200 mt-5 pt-5 flex justify-between items-baseline">
                <span className="text-xs tracking-widest uppercase font-medium">Total</span>
                <span className="font-display text-2xl font-semibold">${total.toFixed(2)}</span>
              </div>
              <button onClick={handleCheckout} className="btn-primary w-full mt-6 py-4" style={{ justifyContent: 'center' }}>
                Proceed to Checkout
              </button>
              {!user && (
                <p className="text-xs text-center text-gray-400 mt-3">
                  <Link to="/login" className="underline hover:text-black">Sign in</Link> to checkout
                </p>
              )}
              <div className="flex items-center justify-center gap-3 mt-5">
                {['VISA','MC','AMEX','PP'].map(b => (
                  <span key={b} className="text-[9px] tracking-widest uppercase text-gray-300 border border-gray-200 px-2 py-1">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
