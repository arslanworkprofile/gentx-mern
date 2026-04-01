import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import { fetchMe } from './store/slices/authSlice';

// Layout
import Navbar        from './components/layout/Navbar';
import Footer        from './components/layout/Footer';
import AdminLayout   from './components/layout/AdminLayout';

// Pages – Shop / User
import HomePage        from './pages/HomePage';
import ShopPage        from './pages/ShopPage';
import ProductPage     from './pages/ProductPage';
import CartPage        from './pages/CartPage';
import CheckoutPage    from './pages/CheckoutPage';
import OrderSuccess    from './pages/OrderSuccess';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import DashboardPage   from './pages/user/DashboardPage';
import OrdersPage      from './pages/user/OrdersPage';
import OrderDetailPage from './pages/user/OrderDetailPage';
import ProfilePage     from './pages/user/ProfilePage';

// Info pages
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ReturnPolicyPage  from './pages/ReturnPolicyPage';
import TermsPage         from './pages/TermsPage';
import ContactPage       from './pages/ContactPage';
import AboutPage         from './pages/AboutPage';

// Admin pages
import AdminDashboard   from './pages/admin/AdminDashboard';
import AdminProducts    from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders      from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminUsers       from './pages/admin/AdminUsers';
import AdminSettings    from './pages/admin/AdminSettings';

import './styles/index.css';

// ── Route guards ─────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, token } = useSelector(s => s.auth);
  if (!user && !token) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, token } = useSelector(s => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (user && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useSelector(s => s.auth);
  return user ? <Navigate to="/" replace /> : children;
};

// ── App shell ────────────────────────────────────────────
const AppInner = () => {
  const { token } = useSelector(s => s.auth);
  const dispatch  = useDispatch();

  // Validate stored token on mount (silent — won't block anything)
  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, []); // eslint-disable-line

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '13px',
            borderRadius: '0',
            background: '#0a0a0a',
            color: '#fafafa',
            padding: '12px 16px',
          },
          success: { iconTheme: { primary: '#c9a96e', secondary: '#0a0a0a' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fafafa' } },
          duration: 3500,
        }}
      />

      <Routes>
        {/* ── Admin routes (own layout, no public nav) ── */}
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index                    element={<AdminDashboard />} />
          <Route path="products"          element={<AdminProducts />} />
          <Route path="products/new"      element={<AdminProductForm />} />
          <Route path="products/edit/:id" element={<AdminProductForm />} />
          <Route path="orders"            element={<AdminOrders />} />
          <Route path="orders/:id"        element={<AdminOrderDetail />} />
          <Route path="users"             element={<AdminUsers />} />
          <Route path="settings"          element={<AdminSettings />} />
        </Route>

        {/* ── Public routes (Navbar + Footer) ── */}
        <Route path="/*" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/"                  element={<HomePage />} />
                <Route path="/shop"              element={<ShopPage />} />
                <Route path="/product/:id"       element={<ProductPage />} />
                <Route path="/cart"              element={<CartPage />} />
                <Route path="/about"             element={<AboutPage />} />
                <Route path="/contact"           element={<ContactPage />} />
                <Route path="/privacy"           element={<PrivacyPolicyPage />} />
                <Route path="/returns"           element={<ReturnPolicyPage />} />
                <Route path="/terms"             element={<TermsPage />} />

                {/* Auth — redirect if logged in */}
                <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

                {/* Protected user pages */}
                <Route path="/checkout"           element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/order-success/:id"  element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                <Route path="/dashboard"          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/orders"             element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                <Route path="/orders/:id"         element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
                <Route path="/profile"            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}
