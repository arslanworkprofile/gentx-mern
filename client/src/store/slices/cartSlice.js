import { createSlice } from '@reduxjs/toolkit';

const saved = localStorage.getItem('gentx_cart');

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: saved ? JSON.parse(saved) : [],
  },
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const key = `${item.product}-${item.color}-${item.size}`;
      const exists = state.items.find(i => `${i.product}-${i.color}-${i.size}` === key);
      if (exists) {
        exists.quantity = Math.min(exists.quantity + (item.quantity || 1), 10);
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
      }
      localStorage.setItem('gentx_cart', JSON.stringify(state.items));
    },
    removeFromCart(state, action) {
      const { product, color, size } = action.payload;
      state.items = state.items.filter(i => !(i.product === product && i.color === color && i.size === size));
      localStorage.setItem('gentx_cart', JSON.stringify(state.items));
    },
    updateQuantity(state, action) {
      const { product, color, size, quantity } = action.payload;
      const item = state.items.find(i => i.product === product && i.color === color && i.size === size);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => !(i.product === product && i.color === color && i.size === size));
        } else {
          item.quantity = Math.min(quantity, 10);
        }
      }
      localStorage.setItem('gentx_cart', JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      localStorage.removeItem('gentx_cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartTotal      = (s) => s.cart.items.reduce((a, i) => a + i.price * i.quantity, 0);
export const selectCartItemCount  = (s) => s.cart.items.reduce((a, i) => a + i.quantity, 0);

export default cartSlice.reducer;
