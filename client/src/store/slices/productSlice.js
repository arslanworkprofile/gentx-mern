import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchProducts = createAsyncThunk('product/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await API.get(`/products?${query}`);
    return res.data;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const fetchProductById = createAsyncThunk('product/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await API.get(`/products/${id}`);
    return res.data.product;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const fetchAdminProducts = createAsyncThunk('product/fetchAdmin', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await API.get(`/products/admin/all?${query}`);
    return res.data;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const createProduct = createAsyncThunk('product/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.product;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const updateProduct = createAsyncThunk('product/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.product;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const deleteProduct = createAsyncThunk('product/delete', async (id, { rejectWithValue }) => {
  try { await API.delete(`/products/${id}`); return id; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const toggleProduct = createAsyncThunk('product/toggle', async (id, { rejectWithValue }) => {
  try {
    const res = await API.patch(`/products/${id}/toggle`);
    return { id, isActive: res.data.isActive };
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [], product: null,
    page: 1, pages: 1, total: 0,
    loading: false, error: null,
  },
  reducers: { clearProduct(s) { s.product = null; } },
  extraReducers: (b) => {
    b
      .addCase(fetchProducts.pending,      (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchProducts.fulfilled,    (s, a) => { s.loading = false; Object.assign(s, a.payload); })
      .addCase(fetchProducts.rejected,     (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchProductById.pending,   (s) => { s.loading = true;  s.product = null; })
      .addCase(fetchProductById.fulfilled, (s, a) => { s.loading = false; s.product = a.payload; })
      .addCase(fetchProductById.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchAdminProducts.pending,   (s) => { s.loading = true; })
      .addCase(fetchAdminProducts.fulfilled, (s, a) => { s.loading = false; Object.assign(s, a.payload); })
      .addCase(fetchAdminProducts.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(deleteProduct.fulfilled, (s, a) => { s.products = s.products.filter(p => p._id !== a.payload); })
      .addCase(toggleProduct.fulfilled, (s, a) => {
        const p = s.products.find(x => x._id === a.payload.id);
        if (p) p.isActive = a.payload.isActive;
      });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
