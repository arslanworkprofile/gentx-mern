import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useCartStore } from '../store';
import './CartPage.css';

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((s, i) => s + (i.salePrice || i.price) * i.qty, 0);
  const shipping = subtotal >= 5000 ? 0 : 350;
  const total = subtotal + shipping;

  if (items.length === 0) return (
    <div className="page cart-empty">
      <FiShoppingBag size={48} className="cart-empty__icon" />
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything yet.</p>
      <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
    </div>
  );

  return (
    <div className="page cart-page">
      <div className="container">
        <h1 className="cart-page__title">Shopping Cart <span>({items.length})</span></h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            <div className="cart-items__header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>

            {items.map((item, idx) => (
              <div key={`${item._id}-${item.size}-${item.color}-${idx}`} className="cart-item">
                <div className="cart-item__product">
                  <Link to={`/product/${item._id}`}>
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/100x120'}
                      alt={item.name}
                    />
                  </Link>
                  <div className="cart-item__details">
                    <Link to={`/product/${item._id}`} className="cart-item__name">{item.name}</Link>
                    {item.size && <span className="cart-item__meta">Size: {item.size}</span>}
                    {item.color && <span className="cart-item__meta">Color: {item.color}</span>}
                    <button
                      className="cart-item__remove"
                      onClick={() => removeItem(item._id, item.size, item.color)}
                    >
                      <FiTrash2 size={14} /> Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item__price">
                  PKR {(item.salePrice || item.price).toLocaleString()}
                </div>

                <div className="cart-item__qty">
                  <button onClick={() => updateQty(item._id, item.size, item.color, Math.max(1, item.qty - 1))}>
                    <FiMinus size={12} />
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item._id, item.size, item.color, item.qty + 1)}>
                    <FiPlus size={12} />
                  </button>
                </div>

                <div className="cart-item__total">
                  PKR {((item.salePrice || item.price) * item.qty).toLocaleString()}
                </div>
              </div>
            ))}

            <div className="cart-items__footer">
              <button onClick={clearCart} className="btn btn-ghost">Clear Cart</button>
              <Link to="/shop" className="btn btn-ghost">Continue Shopping</Link>
            </div>
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2 className="cart-summary__title">Order Summary</h2>

            <div className="cart-summary__rows">
              <div className="cart-summary__row">
                <span>Subtotal</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="cart-summary__row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span style={{color:'var(--green)'}}>Free</span> : `PKR ${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p className="cart-summary__free-note">
                  Add PKR {(5000 - subtotal).toLocaleString()} more for free shipping
                </p>
              )}
              <div className="cart-summary__divider" />
              <div className="cart-summary__row cart-summary__row--total">
                <span>Total</span>
                <span>PKR {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              className="btn btn-primary cart-summary__checkout"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <FiArrowRight />
            </button>

            <div className="cart-summary__secure">
              🔒 Secure & Encrypted Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
