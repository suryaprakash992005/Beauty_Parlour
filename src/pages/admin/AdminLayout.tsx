import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Scissors, Image, Settings, LogOut, Menu, X, Sliders, Star
} from 'lucide-react';
import { getSalonSettings } from '../../services/settings';
import '../../styles/admin.css';

const LINKS = [
  { to: '/admin/dashboard', Icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/services',  Icon: Scissors,        label: 'Services'  },
  { to: '/admin/gallery',   Icon: Image,           label: 'Gallery'   },
  { to: '/admin/banner',    Icon: Sliders,         label: 'Home Banner' },
  { to: '/admin/reviews',   Icon: Star,            label: 'Reviews'    },
  { to: '/admin/settings',  Icon: Settings,        label: 'Settings'  },
];

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [logoUrl, setLogoUrl] = useState('/logo.jpg');

  useEffect(() => {
    const isAdmin = localStorage.getItem('zha_admin');
    if (!isAdmin) {
      navigate('/admin-login', { replace: true });
    }
    getSalonSettings()
      .then(s => {
        if (s.logoUrl) setLogoUrl(s.logoUrl);
      })
      .catch(() => {});
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('zha_admin');
    navigate('/admin-login');
  };

  // Get current page title dynamically based on route
  const getPageTitle = () => {
    const currentLink = LINKS.find(link => location.pathname === link.to);
    return currentLink ? currentLink.label : 'Admin Panel';
  };

  return (
    <div className="admin-layout">
      {/* Overlay for mobile drawer */}
      {mobileMenuOpen && (
        <div 
          className="admin-sidebar-overlay" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'admin-sidebar--mobile-open' : ''}`}>
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid var(--color-champagne, #D4AF37)',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#1e1510'
            }}>
              <img src={logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
              <span className="admin-sidebar__logo-name" style={{ margin: 0 }}>ZHA Hair Saloon</span>
              <span className="admin-sidebar__logo-sub">Admin Panel</span>
            </div>
          </div>
          {/* Close button for mobile drawer */}
          <button className="admin-sidebar__mobile-close" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {LINKS.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `admin-sidebar__link${isActive ? ' active' : ''}`}
              title={label}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="admin-sidebar__logout" onClick={logout} title="Logout">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Container */}
      <div className="admin-main">
        {/* Top Navbar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <button className="admin-hamburger" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={22} />
            </button>
            <h1 className="admin-topbar__title">{getPageTitle()}</h1>
          </div>
          <div className="admin-topbar__actions">
            <Link to="/" target="_blank" className="btn btn-outline admin-view-site-btn">
              View Website
            </Link>
            <div className="admin-profile">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80" 
                alt="Profile" 
                className="admin-profile__avatar"
              />
              <div className="admin-profile__info">
                <span className="admin-profile__name">ZHA Admin</span>
                <span className="admin-profile__role">Owner</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
