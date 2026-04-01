import React from 'react';
export default function AdminRoute({ children }) {
  const stored = JSON.parse(localStorage.getItem('gentx_user') || '{}');
  const user = stored?.state?.user;
  if (!user || !user.isAdmin) { window.location.href = '/'; return null; }
  return children;
}
