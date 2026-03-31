import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchSettings = createAsyncThunk('settings/fetch', async (_, { rejectWithValue }) => {
  try { const res = await API.get('/settings'); return res.data.settings; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const updateGeneral = createAsyncThunk('settings/updateGeneral', async (data, { rejectWithValue }) => {
  try { const res = await API.put('/settings/general', data); return res.data.settings; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

// Hero slides
export const addHeroSlide = createAsyncThunk('settings/addHero', async (formData, { rejectWithValue }) => {
  try { const res = await API.post('/settings/hero', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); return res.data.settings; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const updateHeroSlide = createAsyncThunk('settings/updateHero', async ({ slideId, formData }, { rejectWithValue }) => {
  try { const res = await API.put(`/settings/hero/${slideId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); return res.data.settings; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const deleteHeroSlide = createAsyncThunk('settings/deleteHero', async (slideId, { rejectWithValue }) => {
  try { const res = await API.delete(`/settings/hero/${slideId}`); return res.data.settings; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

// Categories
export const addCategory = createAsyncThunk('settings/addCategory', async (formData, { rejectWithValue }) => {
  try { const res = await API.post('/settings/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); return res.data.settings; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const updateCategory = createAsyncThunk('settings/updateCategory', async ({ catId, formData }, { rejectWithValue }) => {
  try { const res = await API.put(`/settings/categories/${catId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); return res.data.settings; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const deleteCategory = createAsyncThunk('settings/deleteCategory', async (catId, { rejectWithValue }) => {
  try { const res = await API.delete(`/settings/categories/${catId}`); return res.data.settings; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { settings: null, loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    const p = (s) => { s.loading = true; s.error = null; };
    const f = (s, a) => { s.loading = false; s.settings = a.payload; };
    const r = (s, a) => { s.loading = false; s.error = a.payload; };
    [fetchSettings, updateGeneral, addHeroSlide, updateHeroSlide, deleteHeroSlide, addCategory, updateCategory, deleteCategory]
      .forEach(thunk => b.addCase(thunk.pending, p).addCase(thunk.fulfilled, f).addCase(thunk.rejected, r));
  },
});

export default settingsSlice.reducer;
