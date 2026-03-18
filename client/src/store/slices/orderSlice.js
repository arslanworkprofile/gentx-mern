import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const createOrder = createAsyncThunk('order/create', async (data, { rejectWithValue }) => {
  try { const res = await API.post('/orders', data); return res.data.order; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const fetchMyOrders = createAsyncThunk('order/fetchMy', async (_, { rejectWithValue }) => {
  try { const res = await API.get('/orders/myorders'); return res.data.orders; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const fetchOrderById = createAsyncThunk('order/fetchById', async (id, { rejectWithValue }) => {
  try { const res = await API.get(`/orders/${id}`); return res.data.order; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const payOrder = createAsyncThunk('order/pay', async (id, { rejectWithValue }) => {
  try { const res = await API.put(`/orders/${id}/pay`); return res.data.order; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const fetchAllOrders = createAsyncThunk('order/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await API.get(`/orders?${query}`);
    return res.data;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const updateOrderStatus = createAsyncThunk('order/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try { const res = await API.put(`/orders/${id}/status`, { status }); return res.data.order; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const deleteOrder = createAsyncThunk('order/delete', async (id, { rejectWithValue }) => {
  try { await API.delete(`/orders/${id}`); return id; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const fetchOrderStats = createAsyncThunk('order/fetchStats', async (_, { rejectWithValue }) => {
  try { const res = await API.get('/orders/stats'); return res.data.stats; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [], order: null, myOrders: [],
    stats: null, page: 1, pages: 1, total: 0,
    loading: false, error: null,
  },
  reducers: { clearOrder(s) { s.order = null; s.error = null; } },
  extraReducers: (b) => {
    const p = (s) => { s.loading = true; s.error = null; };
    const r = (s, a) => { s.loading = false; s.error = a.payload; };
    b
      .addCase(createOrder.pending, p).addCase(createOrder.rejected, r)
      .addCase(createOrder.fulfilled, (s, a) => { s.loading = false; s.order = a.payload; })
      .addCase(fetchMyOrders.pending, p).addCase(fetchMyOrders.rejected, r)
      .addCase(fetchMyOrders.fulfilled, (s, a) => { s.loading = false; s.myOrders = a.payload; })
      .addCase(fetchOrderById.pending, p).addCase(fetchOrderById.rejected, r)
      .addCase(fetchOrderById.fulfilled, (s, a) => { s.loading = false; s.order = a.payload; })
      .addCase(payOrder.pending, p).addCase(payOrder.rejected, r)
      .addCase(payOrder.fulfilled, (s, a) => { s.loading = false; s.order = a.payload; })
      .addCase(fetchAllOrders.pending, p).addCase(fetchAllOrders.rejected, r)
      .addCase(fetchAllOrders.fulfilled, (s, a) => { s.loading = false; Object.assign(s, a.payload); })
      .addCase(updateOrderStatus.fulfilled, (s, a) => {
        s.loading = false;
        const idx = s.orders.findIndex(o => o._id === a.payload._id);
        if (idx !== -1) s.orders[idx] = a.payload;
        if (s.order?._id === a.payload._id) s.order = a.payload;
      })
      .addCase(deleteOrder.fulfilled, (s, a) => { s.orders = s.orders.filter(o => o._id !== a.payload); })
      .addCase(fetchOrderStats.fulfilled, (s, a) => { s.loading = false; s.stats = a.payload; });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
