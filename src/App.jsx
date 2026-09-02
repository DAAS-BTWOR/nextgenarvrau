import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Join from './pages/Join';
import Events from './pages/Events';
import Members from './pages/Members';
import Esports from './pages/Esports';
import Feedback from './pages/Feedback';
import Contact from './pages/Contact';

// Admin Suite Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminEvents from './pages/admin/AdminEvents';
import AdminEsports from './pages/admin/AdminEsports';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminCms from './pages/admin/AdminCms';

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <AuthProvider>
      <ToastProvider>
        <ScrollToTop />
        <div className="app-container">
          {/* Only render public Navbar & Footer on public pages & admin login */}
          {!isAdminRoute && <Navbar />}

          <main className={!isAdminRoute ? 'main-content' : ''}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/join" element={<Join />} />
              <Route path="/events" element={<Events />} />
              <Route path="/members" element={<Members />} />
              <Route path="/esports" element={<Esports />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/contact" element={<Contact />} />

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Suite */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="members" element={<AdminMembers />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="esports" element={<AdminEsports />} />
                <Route path="feedback" element={<AdminFeedback />} />
                <Route path="cms" element={<AdminCms />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {!isAdminRoute && location.pathname !== '/admin/login' && <Footer />}
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
