import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Scissors, Image, Users,
  Settings, LogOut, Menu, X, Bell,
} from 'lucide-react';
import '../../styles/admin.css';

const LINKS = [
  { to: '/admin/dashboard',    Icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/admin/appointments', Icon: Calendar,        label: 'Appointments' },
  { to: '/admin/services',     Icon: Scissors,        label: 'Services'     },
  { to: '/admin/gallery',      Icon: Image,           label: 'Gallery'      },
  { to: '/admin/customers',    Icon: Users,           label: 'Customers'    },
  { to: '/admin/settings',     Icon: Settings,        label: 'Settings'     },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('luxeora_admin');
    if (!isAdmin) {
      navigate('/admin-login', { replace: true });
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('luxeora_admin');
    navigate('/admin-login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? '' : ' admin-sidebar--collapsed'}`}>
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            <span className="admin-sidebar__logo-name">Luxéora</span>
            {sidebarOpen && <span className="admin-sidebar__logo-sub">Admin</span>}
          </div>
          <button className="admin-sidebar__toggle" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle sidebar">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {LINKS.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `admin-sidebar__link${isActive ? ' active' : ''}`}
              title={label}
            >
              <Icon size={18} />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <button className="admin-sidebar__logout" onClick={logout} title="Logout">
          <LogOut size={18} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* Main */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <h1 className="admin-topbar__title">Luxéora Beauty Studio</h1>
          <div className="admin-topbar__actions">
            <button className="admin-topbar__action" aria-label="Notifications">
              <Bell size={18} />
              <span className="admin-topbar__badge">3</span>
            </button>
            <Link to="/" target="_blank" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.78rem' }}>
              View Site
            </Link>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
