import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { selectCartTotal, clearCart } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';
import toast from 'react-hot-toast';

const Field = ({ label, children, half }) => (
  <div className={half ? '' : ''}>
    <label className="label-field">{label}</label>
    {children}
  </div>
);

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items } = useSelector(s => s.cart);
  const { user }  = useSelector(s => s.auth);
  const { loading } = useSelector(s => s.order);
  const subtotal  = useSelector(selectCartTotal);
  const shipping  = subtotal >= 150 ? 0 : 9.99;
  const tax       = +(subtotal * 0.09).toFixed(2);
  const total     = +(subtotal + shipping + tax).toFixed(2);

  const [step, setStep] = useState(1);
  const [ship, setShip] = useState({
    fullName: user?.name || '', street: user?.address?.street || '',
    city: user?.address?.city || '', state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '', country: user?.address?.country || 'USA',
    phone: user?.phone || '',
  });
  const [payMethod, setPay] = useState('card');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  const goNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      const missing = Object.entries(ship).find(([, v]) => !v.trim());
      if (missing) { toast.error(`${missing[0]} is required`); return; }
    }
    setStep(s => s + 1);
  };

  const handlePlace = async () => {
    try {
      const result = await dispatch(createOrder({
        orderItems: items.map(i => ({ product: i.product, name: i.name, image: i.image, price: i.price, quantity: i.quantity, color: i.color, size: i.size })),
        shippingAddress: ship, paymentMethod: payMethod,
        itemsPrice: subtotal, shippingPrice: shipping, taxPrice: tax, totalPrice: total,
      })).unwrap();
      dispatch(clearCart());
      toast.success('Order placed!');
      navigate(`/order-success/${result._id}`);
    } catch (err) { toast.error(err || 'Failed to place order'); }
  };

  // Summary sidebar
  const Summary = () => (
    <div className="p-5 sm:p-6" style={{ background: '#f7f7f7' }}>
      <h3 className="text-xs tracking-widest uppercase font-semibold mb-4">Order Summary</h3>
      <div className="space-y-2 text-sm border-b border-gray-200 pb-4 mb-4">
        <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Tax (9%)</span><span>${tax.toFixed(2)}</span></div>
      </div>
      <div className="flex justify-between items-baseline">
        <span className="text-xs tracking-widest uppercase">Total</span>
        <span className="font-display text-xl font-semibold">${total.toFixed(2)}</span>
      </div>
      {/* Mini cart */}
      <div className="mt-5 space-y-3 border-t border-gray-200 pt-4">
        {items.slice(0, 3).map(item => (
          <div key={`${item.product}-${item.color}-${item.size}`} className="flex gap-2 text-xs">
            <img src={item.image} alt={item.name} className="w-10 h-12 object-cover bg-gray-200 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.name}</p>
              <p className="text-gray-400">{item.size} · ×{item.quantity}</p>
            </div>
            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        {items.length > 3 && <p className="text-xs text-gray-400">+{items.length - 3} more items</p>}
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 80 }} className="min-h-screen page-enter">
      <div className="border-b border-gray-100 py-8 px-4 sm:px-6" style={{ background: '#f7f7f7' }}>
        <div className="max-w-4xl mx-auto">
          <p className="section-subtitle mb-2">Secure Checkout</p>
          <h1 className="section-title">Complete Your Order</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Steps indicator */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all"
                  style={{ background: i + 1 <= step ? '#0a0a0a' : '#efefef', color: i + 1 <= step ? '#fafafa' : '#989898' }}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs tracking-widest uppercase font-medium hidden sm:block ${i + 1 <= step ? 'text-black' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < 2 && <div className="flex-1 h-px mx-2 sm:mx-4" style={{ background: i + 1 < step ? '#0a0a0a' : '#dcdcdc' }} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form area */}
          <div className="md:col-span-2">
            {/* Step 1 — Shipping */}
            {step === 1 && (
              <form onSubmit={goNext} className="space-y-4 animate-fade-in">
                <h2 className="font-display text-xl font-semibold mb-5">Shipping Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Field label="Full Name *">
                      <input className="input-field" value={ship.fullName} onChange={e => setShip(s => ({ ...s, fullName: e.target.value }))} placeholder="John Doe" required />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Street Address *">
                      <input className="input-field" value={ship.street} onChange={e => setShip(s => ({ ...s, street: e.target.value }))} placeholder="123 Main Street" required />
                    </Field>
                  </div>
                  <Field label="City *">
                    <input className="input-field" value={ship.city} onChange={e => setShip(s => ({ ...s, city: e.target.value }))} placeholder="New York" required />
                  </Field>
                  <Field label="State *">
                    <input className="input-field" value={ship.state} onChange={e => setShip(s => ({ ...s, state: e.target.value }))} placeholder="NY" required />
                  </Field>
                  <Field label="ZIP Code *">
                    <input className="input-field" value={ship.zipCode} onChange={e => setShip(s => ({ ...s, zipCode: e.target.value }))} placeholder="10001" required />
                  </Field>
                  <Field label="Country *">
                    <input className="input-field" value={ship.country} onChange={e => setShip(s => ({ ...s, country: e.target.value }))} placeholder="USA" required />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Phone *">
                      <input className="input-field" value={ship.phone} onChange={e => setShip(s => ({ ...s, phone: e.target.value }))} placeholder="+1 555 0100" required />
                    </Field>
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full py-4 mt-2" style={{ justifyContent: 'center' }}>
                  Continue to Payment →
                </button>
              </form>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && (
              <form onSubmit={goNext} className="animate-fade-in">
                <h2 className="font-display text-xl font-semibold mb-5">Payment Method</h2>
                <div className="space-y-3 mb-6">
                  {[['card','💳  Credit / Debit Card'],['cod','📦  Cash on Delivery'],['bank','🏦  Bank Transfer']].map(([val, label]) => (
                    <label key={val} className="flex items-center gap-4 p-4 border cursor-pointer transition-colors"
                      style={{ borderColor: payMethod === val ? '#0a0a0a' : '#dcdcdc', background: payMethod === val ? '#f7f7f7' : 'white' }}>
                      <input type="radio" name="payment" value={val} checked={payMethod === val} onChange={() => setPay(val)} className="accent-black" />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>
                {payMethod === 'card' && (
                  <div className="space-y-4 p-5 mb-6" style={{ background: '#f7f7f7', border: '1px solid #efefef' }}>
                    <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mb-3">Card Details — Demo Only (No real charge)</p>
                    <Field label="Card Number">
                      <input className="input-field font-mono" value={card.number} onChange={e => setCard(c => ({ ...c, number: e.target.value }))} placeholder="4242 4242 4242 4242" maxLength={19} />
                    </Field>
                    <Field label="Cardholder Name">
                      <input className="input-field" value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} placeholder="John Doe" />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Expiry">
                        <input className="input-field font-mono" value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: e.target.value }))} placeholder="MM/YY" maxLength={5} />
                      </Field>
                      <Field label="CVV">
                        <input className="input-field font-mono" value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value }))} placeholder="123" maxLength={4} type="password" />
                      </Field>
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-4">← Back</button>
                  <button type="submit" className="btn-primary flex-1 py-4" style={{ justifyContent: 'center' }}>Review Order →</button>
                </div>
              </form>
            )}

            {/* Step 3 — Review */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h2 className="font-display text-xl font-semibold mb-5">Review & Place Order</h2>
                <div className="space-y-3 mb-6">
                  {items.map(item => (
                    <div key={`${item.product}-${item.color}-${item.size}`} className="flex gap-3 pb-4 border-b border-gray-100">
                      <img src={item.image} alt={item.name} className="w-14 h-18 object-cover bg-gray-100 flex-shrink-0" style={{ height: 68 }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.color}{item.size ? ` · ${item.size}` : ''} · ×{item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 mb-6 text-sm" style={{ background: '#f7f7f7' }}>
                  <div className="grid grid-cols-2 gap-y-2">
                    <span className="text-gray-400">Ship to</span>
                    <span className="font-medium">{ship.fullName}, {ship.city}</span>
                    <span className="text-gray-400">Address</span>
                    <span>{ship.street}, {ship.zipCode}</span>
                    <span className="text-gray-400">Payment</span>
                    <span className="capitalize">{payMethod}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1 py-4">← Back</button>
                  <button onClick={handlePlace} disabled={loading} className="btn-primary flex-1 py-4 disabled:opacity-50" style={{ justifyContent: 'center' }}>
                    {loading ? 'Placing…' : `Place Order · $${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="order-first md:order-last">
            <Summary />
          </div>
        </div>
      </div>
    </div>
  );
}
