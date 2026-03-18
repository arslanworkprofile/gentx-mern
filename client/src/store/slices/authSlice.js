import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

const savedUser  = localStorage.getItem('gentx_user');
const savedToken = localStorage.getItem('gentx_token');

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/register', data);
    localStorage.setItem('gentx_token', res.data.token);
    localStorage.setItem('gentx_user', JSON.stringify(res.data.user));
    return res.data;
  } catch (e) { return rejectWithValue(e.response?.data?.message || 'Registration failed'); }
});

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/login', data);
    localStorage.setItem('gentx_token', res.data.token);
    localStorage.setItem('gentx_user', JSON.stringify(res.data.user));
    return res.data;
  } catch (e) { return rejectWithValue(e.response?.data?.message || 'Login failed'); }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await API.put('/auth/profile', data);
    localStorage.setItem('gentx_user', JSON.stringify(res.data.user));
    return res.data;
  } catch (e) { return rejectWithValue(e.response?.data?.message || 'Update failed'); }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/auth/me');
    localStorage.setItem('gentx_user', JSON.stringify(res.data.user));
    return res.data;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    savedUser  ? JSON.parse(savedUser)  : null,
    token:   savedToken || null,
    loading: false,
    error:   null,
  },
  reducers: {
    logout(state) {
      state.user = null; state.token = null; state.error = null;
      localStorage.removeItem('gentx_token');
      localStorage.removeItem('gentx_user');
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending  = (s)    => { s.loading = true;  s.error = null; };
    const rejected = (s, a) => { s.loading = false; s.error = a.payload; };
    const fulfilled = (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token || s.token; };
    builder
      .addCase(registerUser.pending,  pending).addCase(registerUser.rejected,  rejected).addCase(registerUser.fulfilled,  fulfilled)
      .addCase(loginUser.pending,     pending).addCase(loginUser.rejected,     rejected).addCase(loginUser.fulfilled,     fulfilled)
      .addCase(updateProfile.pending, pending).addCase(updateProfile.rejected, rejected)
      .addCase(updateProfile.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; })
      .addCase(fetchMe.pending, pending).addCase(fetchMe.rejected, rejected)
      .addCase(fetchMe.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
