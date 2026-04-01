// PrivateRoute.js
import React from 'react';
export default function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('gentx_user') || '{}')?.state?.user;
  if (!user) { window.location.href = '/login'; return null; }
  return children;
}
