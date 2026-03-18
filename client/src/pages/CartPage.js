import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart, selectCartTotal } from '../store/slices/cartSlice';
import { useSelector as useAuth } from 'react-redux';
import { EmptyState } from '../components/common/UI';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items } = useSelector(s => s.cart);
  const total     = useSelector(selectCartTotal);
  const { user }  = useSelector(s => s.auth);

  const shipping  = total >= 150 ? 0 : 9.99;
  const tax       = total * 0.09;
  const grandTotal = total + shipping + tax;

  const handleCheckout = () => {
    if (!user) { toast.error('Please sign in to checkout'); navigate('/login'); return; }
    navigate('/checkout');
  };

  if (items.length === 0) return (
    <div className="pt-28 min-h-screen">
      <EmptyState icon="🛒" title="Your cart is empty"
        description="Looks like you haven't added anything yet."
        action={<Link to="/shop" className="btn-primary inline-block">Continue Shopping</Link>} />
    </div>
  );

  return (
    <div className="pt-20 min-h-screen page-enter">
      <div className="bg-gray-50 border-b border-gray-100 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="section-subtitle mb-2">Review</p>
          <h1 className="section-title">Your Cart ({items.length})</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-0">
            <div className="hidden md:grid grid-cols-12 text-xs tracking-widest uppercase text-gray-400 pb-4 border-b border-gray-100 mb-2">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-1 text-right">Total</div>
            </div>

            {items.map((item, idx) => (
              <div key={`${item.product}-${item.color}-${item.size}`}
                className="grid grid-cols-12 gap-4 items-center py-6 border-b border-gray-100 animate-fade-in"
                style={{ animationDelay: `${idx * 0.05}s` }}>
                {/* Image + info */}
                <div className="col-span-12 md:col-span-6 flex gap-4">
                  <Link to={`/product/${item.product}`} className="flex-shrink-0">
                    <img src={item.image || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200'} alt={item.name}
                      className="w-20 h-24 object-cover bg-gray-100" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product}`} className="font-display text-base font-medium hover:text-accent transition-colors line-clamp-2">{item.name}</Link>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.color && <span className="text-xs text-gray-500">{item.color}</span>}
                      {item.color && item.size && <span className="text-xs text-gray-300">·</span>}
                      {item.size  && <span className="text-xs text-gray-500">{item.size}</span>}
                    </div>
                    <button onClick={() => { dispatch(removeFromCart({ product: item.product, color: item.color, size: item.size })); toast.success('Item removed'); }}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors mt-2">Remove</button>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-4 md:col-span-2 text-center">
                  <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                </div>

                {/* Qty */}
                <div className="col-span-5 md:col-span-3 flex items-center justify-center">
                  <div className="flex items-center border border-gray-200">
                    <button onClick={() => dispatch(updateQuantity({ product: item.product, color: item.color, size: item.size, quantity: item.quantity - 1 }))}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-sm">−</button>
                    <span className="w-10 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ product: item.product, color: item.color, size: item.size, quantity: item.quantity + 1 }))}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-sm">+</button>
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-3 md:col-span-1 text-right">
                  <span className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-6">
              <Link to="/shop" className="flex items-center gap-2 text-xs tracking-widest uppercase hover:text-accent transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </Link>
              <button onClick={() => { dispatch(clearCart()); toast.success('Cart cleared'); }}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors tracking-wider uppercase">Clear Cart</button>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 sticky top-28">
              <h2 className="font-display text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${total.toFixed(2)}</span></div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between"><span className="text-gray-500">Tax (9%)</span><span>${tax.toFixed(2)}</span></div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400 bg-white p-3 border border-gray-200">
                    Add ${(150 - total).toFixed(2)} more for <span className="text-green-600 font-medium">free shipping</span>
                  </p>
                )}
              </div>
              <div className="border-t border-gray-200 mt-6 pt-6 flex justify-between items-baseline">
                <span className="font-medium tracking-wider uppercase text-xs">Total</span>
                <span className="font-display text-2xl font-semibold">${grandTotal.toFixed(2)}</span>
              </div>
              <button onClick={handleCheckout} className="w-full btn-primary mt-6 py-4 text-sm">
                Proceed to Checkout
              </button>
              <div className="flex items-center justify-center gap-4 mt-6">
                {['visa','mastercard','amex','paypal'].map(b => (
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
