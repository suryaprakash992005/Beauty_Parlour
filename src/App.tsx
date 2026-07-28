import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { WhatsAppButton, ScrollToTop, PageTransition } from './components/shared';

// Public Pages (Eager Loaded)
import Home from './pages/Home';
import Services from './pages/Services';
import BridalPlanner from './pages/BridalPlanner';
import Gallery from './pages/Gallery';
import Offers from './pages/Offers';
import About from './pages/About';
import Contact from './pages/Contact';
import Book from './pages/Book';
import Testimonials from './pages/Testimonials';
import Blogs from './pages/Blogs';
import NotFound from './pages/NotFound';

// Auth & Admin Pages (Lazy Loaded for High Performance)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const ForgotPassword = lazy(() => import('./pages/admin/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/admin/ResetPassword'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'));
const AdminBanner = lazy(() => import('./pages/admin/AdminBanner'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));

function AdminFallback() {
  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0B0B0B', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
    >
      <div 
        className="book-loader" 
        style={{ 
          width: '32px', 
          height: '32px', 
          borderWidth: '3px', 
          borderColor: 'var(--admin-accent, #22C55E)', 
          borderTopColor: 'transparent' 
        }} 
      />
    </div>
  );
}

function PublicLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/bridal-planner" element={<BridalPlanner />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-appointment" element={<Book />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog" element={<Navigate to="/blogs" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<AdminFallback />}>
          <Routes>
            {/* Auth Pages */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Admin Console Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="banner" element={<AdminBanner />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Admin Shortcuts / Aliases */}
            <Route path="/products" element={<Navigate to="/admin/services" replace />} />
            <Route path="/categories" element={<Navigate to="/admin/services" replace />} />
            <Route path="/banners" element={<Navigate to="/admin/banner" replace />} />

            {/* Public Site Routes */}
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
