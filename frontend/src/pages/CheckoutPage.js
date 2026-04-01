import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import api from '../api';
import { useCartStore, useAuthStore } from '../store';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({
    name: '', street: '', city: '', state: '', zip: '', country: 'Pakistan', phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((s, i) => s + (i.salePrice || i.price) * i.qty, 0);
  const shippingPrice = subtotal >= 5000 ? 0 : 350;
  const tax = 0;
  const total = subtotal + shippingPrice + tax;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({
        product: i._id,
        name: i.name,
        image: i.images?.[0] || '',
        price: i.salePrice || i.price,
        qty: i.qty,
        size: i.size,
        color: i.color,
      }));
      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: shipping,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice,
        taxPrice: tax,
        totalPrice: total,
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const validateShipping = () => {
    const { name, street, city, phone } = shipping;
    if (!name || !street || !city || !phone) { toast.error('Please fill all required fields'); return false; }
    return true;
  };

  return (
    <div className="checkout-page page">
      <div className="container">
        <div className="checkout-progress">
          {STEPS.map((s, i) => (
            <div key={s} className={`checkout-step${i <= step ? ' active' : ''}${i < step ? ' done' : ''}`}>
              <div className="checkout-step__circle">
                {i < step ? <FiCheck size={14} /> : i + 1}
              </div>
              <span>{s}</span>
              {i < STEPS.length - 1 && <div className="checkout-step__line" />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {/* STEP 0: Shipping */}
            {step === 0 && (
              <div className="checkout-section">
                <h2 className="checkout-section__title">Shipping Information</h2>
                <div className="checkout-grid">
                  {[
                    { key: 'name', label: 'Full Name', placeholder: 'John Doe', type: 'text', required: true },
                    { key: 'phone', label: 'Phone Number', placeholder: '+92 300 1234567', type: 'tel', required: true },
                    { key: 'street', label: 'Street Address', placeholder: 'House/Street/Area', type: 'text', required: true, full: true },
                    { key: 'city', label: 'City', placeholder: 'Karachi', type: 'text', required: true },
                    { key: 'state', label: 'Province', placeholder: 'Sindh', type: 'text' },
                    { key: 'zip', label: 'Postal Code', placeholder: '75000', type: 'text' },
                  ].map((f) => (
                    <div key={f.key} className={`form-group${f.full ? ' form-group--full' : ''}`}>
                      <label className="form-label">{f.label}{f.required && ' *'}</label>
                      <input
                        type={f.type}
                        className="form-input"
                        placeholder={f.placeholder}
                        value={shipping[f.key]}
                        onChange={(e) => setShipping({ ...shipping, [f.key]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-primary checkout-next"
                  onClick={() => { if (validateShipping()) setStep(1); }}
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* STEP 1: Payment */}
            {step === 1 && (
              <div className="checkout-section">
                <h2 className="checkout-section__title">Payment Method</h2>
                <div className="payment-methods">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
                    { value: 'bank', label: 'Bank Transfer', desc: 'Transfer to our account', icon: '🏦' },
                    { value: 'stripe', label: 'Credit / Debit Card', desc: 'Secure payment via Stripe', icon: '💳' },
                  ].map((m) => (
                    <label key={m.value} className={`payment-method${paymentMethod === m.value ? ' active' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value={m.value}
                        checked={paymentMethod === m.value}
                        onChange={() => setPaymentMethod(m.value)}
                      />
                      <span className="payment-method__icon">{m.icon}</span>
                      <div>
                        <p className="payment-method__label">{m.label}</p>
                        <p className="payment-method__desc">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="checkout-nav">
                  <button className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
                  <button className="btn btn-primary" onClick={() => setStep(2)}>Review Order</button>
                </div>
              </div>
            )}

            {/* STEP 2: Review */}
            {step === 2 && (
              <div className="checkout-section">
                <h2 className="checkout-section__title">Review Your Order</h2>

                <div className="review-section">
                  <p className="review-section__label">Shipping to</p>
                  <p className="review-section__value">
                    {shipping.name} · {shipping.phone}<br />
                    {shipping.street}, {shipping.city}, {shipping.state} {shipping.zip}, {shipping.country}
                  </p>
                  <button className="review-section__edit" onClick={() => setStep(0)}>Edit</button>
                </div>

                <div className="review-section">
                  <p className="review-section__label">Payment</p>
                  <p className="review-section__value">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'bank' ? 'Bank Transfer' : 'Credit Card'}</p>
                  <button className="review-section__edit" onClick={() => setStep(1)}>Edit</button>
                </div>

                <div className="review-items">
                  {items.map((item, i) => (
                    <div key={i} className="review-item">
                      <img src={item.images?.[0] || ''} alt={item.name} />
                      <div>
                        <p>{item.name}</p>
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span> · Color: {item.color}</span>}
                        <span> · Qty: {item.qty}</span>
                      </div>
                      <p>PKR {((item.salePrice || item.price) * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="checkout-nav">
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                  <button
                    className="btn btn-gold checkout-place"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : `Place Order · PKR ${total.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary sidebar */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="checkout-summary__items">
              {items.map((item, i) => (
                <div key={i} className="checkout-summary__item">
                  <span>{item.name} × {item.qty}</span>
                  <span>PKR {((item.salePrice || item.price) * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="checkout-summary__divider" />
            <div className="checkout-summary__row"><span>Subtotal</span><span>PKR {subtotal.toLocaleString()}</span></div>
            <div className="checkout-summary__row"><span>Shipping</span><span>{shippingPrice === 0 ? 'Free' : `PKR ${shippingPrice}`}</span></div>
            <div className="checkout-summary__divider" />
            <div className="checkout-summary__total"><span>Total</span><span>PKR {total.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
