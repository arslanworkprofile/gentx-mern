import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('gentx_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

API.interceptors.response.use(
  (res) => res,
  (err) => {
    // Only redirect to login on 401 if NOT on auth endpoints
    // and NOT a fetchMe call (which fires on page load)
    if (err.response?.status === 401) {
      const url = err.config?.url || '';
      const isAuthCall = url.includes('/auth/');
      if (!isAuthCall) {
        localStorage.removeItem('gentx_token');
        localStorage.removeItem('gentx_user');
        // Don't redirect if already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

export default API;
