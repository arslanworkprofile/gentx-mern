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
import HomePage         from './pages/HomePage';
import ShopPage         from './pages/ShopPage';
import ProductPage      from './pages/ProductPage';
import CartPage         from './pages/CartPage';
import CheckoutPage     from './pages/CheckoutPage';
import OrderSuccess     from './pages/OrderSuccess';
import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import DashboardPage    from './pages/user/DashboardPage';
import OrdersPage       from './pages/user/OrdersPage';
import OrderDetailPage  from './pages/user/OrderDetailPage';
import ProfilePage      from './pages/user/ProfilePage';

// Info pages
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ReturnPolicyPage  from './pages/ReturnPolicyPage';
import TermsPage         from './pages/TermsPage';
import ContactPage       from './pages/ContactPage';
import AboutPage         from './pages/AboutPage';

// Pages – Admin
import AdminDashboard   from './pages/admin/AdminDashboard';
import AdminProducts    from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders      from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminUsers       from './pages/admin/AdminUsers';

import './styles/index.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector(s => s.auth);
  return user ? children : <Navigate to="/login" replace />;
};
const AdminRoute = ({ children }) => {
  const { user } = useSelector(s => s.auth);
  return user?.role === 'admin' ? children : <Navigate to="/" replace />;
};
const PublicRoute = ({ children }) => {
  const { user } = useSelector(s => s.auth);
  return !user ? children : <Navigate to="/" replace />;
};

const AppInner = () => {
  const { token } = useSelector(s => s.auth);
  const dispatch  = useDispatch();
  useEffect(() => { if (token) dispatch(fetchMe()); }, [token, dispatch]);

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: 'DM Sans, sans-serif', fontSize: '14px', borderRadius: '0', background: '#0a0a0a', color: '#fafafa' },
          success: { iconTheme: { primary: '#c9a96e', secondary: '#0a0a0a' } },
        }}
      />
      <Routes>
        {/* ── Admin (no nav/footer) ── */}
        <Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index                    element={<AdminDashboard />} />
          <Route path="products"          element={<AdminProducts />} />
          <Route path="products/new"      element={<AdminProductForm />} />
          <Route path="products/edit/:id" element={<AdminProductForm />} />
          <Route path="orders"            element={<AdminOrders />} />
          <Route path="orders/:id"        element={<AdminOrderDetail />} />
          <Route path="users"             element={<AdminUsers />} />
        </Route>

        {/* ── Public (with nav/footer) ── */}
        <Route path="/*" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Shop */}
                <Route path="/"                element={<HomePage />} />
                <Route path="/shop"            element={<ShopPage />} />
                <Route path="/product/:id"     element={<ProductPage />} />
                <Route path="/cart"            element={<CartPage />} />
                <Route path="/checkout"        element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

                {/* Auth */}
                <Route path="/login"           element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register"        element={<PublicRoute><RegisterPage /></PublicRoute>} />

                {/* User account */}
                <Route path="/dashboard"       element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/orders"          element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                <Route path="/orders/:id"      element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
                <Route path="/profile"         element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                {/* Info pages */}
                <Route path="/privacy"         element={<PrivacyPolicyPage />} />
                <Route path="/returns"         element={<ReturnPolicyPage />} />
                <Route path="/terms"           element={<TermsPage />} />
                <Route path="/contact"         element={<ContactPage />} />
                <Route path="/about"           element={<AboutPage />} />
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
  return <Provider store={store}><AppInner /></Provider>;
}
