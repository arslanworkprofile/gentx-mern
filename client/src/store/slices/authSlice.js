import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

// Safe JSON parse
const parseUser = () => {
  try {
    const u = localStorage.getItem('gentx_user');
    return u ? JSON.parse(u) : null;
  } catch { return null; }
};

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/register', data);
    localStorage.setItem('gentx_token', res.data.token);
    localStorage.setItem('gentx_user', JSON.stringify(res.data.user));
    return res.data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Registration failed');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/login', data);
    localStorage.setItem('gentx_token', res.data.token);
    localStorage.setItem('gentx_user', JSON.stringify(res.data.user));
    return res.data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Login failed');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await API.put('/auth/profile', data);
    localStorage.setItem('gentx_user', JSON.stringify(res.data.user));
    return res.data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Update failed');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/auth/me');
    localStorage.setItem('gentx_user', JSON.stringify(res.data.user));
    return res.data;
  } catch (e) {
    // If token is invalid/expired, clear it silently — don't show error
    const status = e.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('gentx_token');
      localStorage.removeItem('gentx_user');
    }
    return rejectWithValue(null); // silent fail
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    parseUser(),
    token:   localStorage.getItem('gentx_token') || null,
    loading: false,
    error:   null,
  },
  reducers: {
    logout(state) {
      state.user  = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('gentx_token');
      localStorage.removeItem('gentx_user');
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending,  (s) => { s.loading = true;  s.error = null; })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(registerUser.fulfilled,(s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
      // Login
      .addCase(loginUser.pending,  (s) => { s.loading = true;  s.error = null; })
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(loginUser.fulfilled,(s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
      // Update profile
      .addCase(updateProfile.pending,  (s) => { s.loading = true;  s.error = null; })
      .addCase(updateProfile.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(updateProfile.fulfilled,(s, a) => { s.loading = false; s.user = a.payload.user; })
      // fetchMe — silent: if fails, clear token, don't crash
      .addCase(fetchMe.pending,  (s) => { s.loading = false; }) // don't block UI
      .addCase(fetchMe.rejected, (s) => { s.loading = false; s.user = null; s.token = null; })
      .addCase(fetchMe.fulfilled,(s, a) => { s.loading = false; if (a.payload?.user) s.user = a.payload.user; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
