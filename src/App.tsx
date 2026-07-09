import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { WhatsAppButton, ScrollToTop } from './components/shared';

// Public Pages
import Home from './pages/Home';
import Services from './pages/Services';
import BridalPlanner from './pages/BridalPlanner';
import Gallery from './pages/Gallery';
import Offers from './pages/Offers';
import About from './pages/About';
import Contact from './pages/Contact';
import Book from './pages/Book';
import Testimonials from './pages/Testimonials';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminGallery from './pages/admin/AdminGallery';
import AdminBanner from './pages/admin/AdminBanner';
import AdminSettings from './pages/admin/AdminSettings';

// Public Site Wrapper Layout
function PublicLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
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
      </Routes>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Login - No headers, footers or floating FABs */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Dashboard Pages */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="banner" element={<AdminBanner />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Public Routes */}
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </Router>
  );
}
