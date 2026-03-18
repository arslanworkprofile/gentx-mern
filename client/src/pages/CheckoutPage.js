import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartTotal, clearCart } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';
import toast from 'react-hot-toast';

const INPUT = 'input-field';
const LABEL = 'label-field';

export default function CheckoutPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items } = useSelector(s => s.cart);
  const { user }  = useSelector(s => s.auth);
  const { loading } = useSelector(s => s.order);
  const subtotal  = useSelector(selectCartTotal);
  const shipping  = subtotal >= 150 ? 0 : 9.99;
  const tax       = subtotal * 0.09;
  const total     = subtotal + shipping + tax;

  const [step, setStep] = useState(1); // 1=shipping, 2=payment, 3=review
  const [shippingData, setShippingData] = useState({
    fullName: user?.name || '', street: user?.address?.street || '',
    city: user?.address?.city || '', state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '', country: user?.address?.country || 'USA',
    phone: user?.phone || '',
  });
  const [payMethod, setPayMethod] = useState('card');
  const [cardData, setCardData]   = useState({ number:'', name:'', expiry:'', cvv:'' });

  const handleShipping = (e) => {
    e.preventDefault();
    const required = ['fullName','street','city','state','zipCode','country','phone'];
    for (const k of required) {
      if (!shippingData[k].trim()) { toast.error(`${k} is required`); return; }
    }
    setStep(2);
  };

  const handlePayment = (e) => { e.preventDefault(); setStep(3); };

  const handlePlaceOrder = async () => {
    try {
      const orderItems = items.map(i => ({
        product: i.product, name: i.name, image: i.image,
        price: i.price, quantity: i.quantity, color: i.color, size: i.size,
      }));
      const result = await dispatch(createOrder({
        orderItems, shippingAddress: shippingData,
        paymentMethod: payMethod,
        itemsPrice: subtotal, shippingPrice: shipping,
        taxPrice: tax, totalPrice: total,
      })).unwrap();
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/order-success/${result._id}`);
    } catch (err) {
      toast.error(err || 'Failed to place order');
    }
  };

  const steps = ['Shipping', 'Payment', 'Review'];

  return (
    <div className="pt-20 min-h-screen page-enter">
      <div className="bg-gray-50 border-b border-gray-100 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="section-subtitle mb-2">Checkout</p>
          <h1 className="section-title">Complete Your Order</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Steps */}
        <div className="flex items-center mb-12">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center text-xs font-semibold transition-colors ${i + 1 <= step ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs tracking-widest uppercase font-medium ${i + 1 <= step ? 'text-black' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-px mx-4 ${i + 1 < step ? 'bg-black' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Forms */}
          <div className="md:col-span-2">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <form onSubmit={handleShipping} className="space-y-5 animate-fade-in">
                <h2 className="font-display text-xl font-semibold mb-6">Shipping Address</h2>
                <div>
                  <label className={LABEL}>Full Name</label>
                  <input className={INPUT} value={shippingData.fullName} onChange={e => setShippingData(d => ({...d, fullName: e.target.value}))} placeholder="John Doe" />
                </div>
                <div>
                  <label className={LABEL}>Street Address</label>
                  <input className={INPUT} value={shippingData.street} onChange={e => setShippingData(d => ({...d, street: e.target.value}))} placeholder="123 Main Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>City</label>
                    <input className={INPUT} value={shippingData.city} onChange={e => setShippingData(d => ({...d, city: e.target.value}))} placeholder="New York" />
                  </div>
                  <div>
                    <label className={LABEL}>State</label>
                    <input className={INPUT} value={shippingData.state} onChange={e => setShippingData(d => ({...d, state: e.target.value}))} placeholder="NY" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>ZIP Code</label>
                    <input className={INPUT} value={shippingData.zipCode} onChange={e => setShippingData(d => ({...d, zipCode: e.target.value}))} placeholder="10001" />
                  </div>
                  <div>
                    <label className={LABEL}>Country</label>
                    <input className={INPUT} value={shippingData.country} onChange={e => setShippingData(d => ({...d, country: e.target.value}))} placeholder="USA" />
                  </div>
                </div>
                <div>
                  <label className={LABEL}>Phone</label>
                  <input className={INPUT} value={shippingData.phone} onChange={e => setShippingData(d => ({...d, phone: e.target.value}))} placeholder="+1 555 0100" />
                </div>
                <button type="submit" className="btn-primary w-full py-4 mt-4">Continue to Payment</button>
              </form>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <form onSubmit={handlePayment} className="animate-fade-in">
                <h2 className="font-display text-xl font-semibold mb-6">Payment Method</h2>
                <div className="space-y-3 mb-8">
                  {[['card','💳 Credit / Debit Card'],['cod','📦 Cash on Delivery'],['bank','🏦 Bank Transfer']].map(([val, label]) => (
                    <label key={val} className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${payMethod === val ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                      <input type="radio" name="payment" value={val} checked={payMethod === val} onChange={() => setPayMethod(val)} className="accent-black" />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>
                {payMethod === 'card' && (
                  <div className="space-y-4 p-6 bg-gray-50 border border-gray-100 mb-6">
                    <p className="text-xs text-gray-400 tracking-wider uppercase mb-4">Card Details (Demo — no real charge)</p>
                    <div>
                      <label className={LABEL}>Card Number</label>
                      <input className={INPUT} value={cardData.number} onChange={e => setCardData(d => ({...d, number: e.target.value}))} placeholder="4242 4242 4242 4242" maxLength={19} />
                    </div>
                    <div>
                      <label className={LABEL}>Cardholder Name</label>
                      <input className={INPUT} value={cardData.name} onChange={e => setCardData(d => ({...d, name: e.target.value}))} placeholder="John Doe" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={LABEL}>Expiry</label>
                        <input className={INPUT} value={cardData.expiry} onChange={e => setCardData(d => ({...d, expiry: e.target.value}))} placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div>
                        <label className={LABEL}>CVV</label>
                        <input className={INPUT} value={cardData.cvv} onChange={e => setCardData(d => ({...d, cvv: e.target.value}))} placeholder="123" maxLength={4} type="password" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-4">Back</button>
                  <button type="submit" className="btn-primary flex-1 py-4">Review Order</button>
                </div>
              </form>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h2 className="font-display text-xl font-semibold mb-6">Review Your Order</h2>
                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={`${item.product}-${item.color}-${item.size}`} className="flex gap-4 border-b border-gray-100 pb-4">
                      <img src={item.image || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100'} alt={item.name} className="w-16 h-20 object-cover bg-gray-100 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.color} · {item.size} · Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-4 mb-6 text-sm">
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-gray-500">Ship to:</span>
                    <span>{shippingData.fullName}, {shippingData.city}</span>
                    <span className="text-gray-500">Payment:</span>
                    <span className="capitalize">{payMethod}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1 py-4">Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 py-4 disabled:opacity-50">
                    {loading ? 'Placing Order...' : `Place Order · $${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          <div>
            <div className="bg-gray-50 p-6 sticky top-28">
              <h3 className="font-medium tracking-wider text-xs uppercase mb-4">Summary</h3>
              <div className="space-y-2.5 text-sm border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>${tax.toFixed(2)}</span></div>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs tracking-widest uppercase">Total</span>
                <span className="font-display text-xl font-semibold">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
