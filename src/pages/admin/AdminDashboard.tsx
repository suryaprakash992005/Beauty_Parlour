import { Scissors, Image, Sliders, Settings, Clock, Plus, Upload, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  // Website Content Management Stats
  const stats = [
    { 
      label: 'Services', 
      value: '7 Treatments', 
      icon: Scissors, 
      desc: 'Active cataloged treatments', 
      to: '/admin/services',
      color: '#22C55E' 
    },
    { 
      label: 'Gallery Images', 
      value: '6 Photos', 
      icon: Image, 
      desc: 'Portfolio transformations', 
      to: '/admin/gallery',
      color: '#3B82F6' 
    },
    { 
      label: 'Homepage Banner', 
      value: 'Active', 
      icon: Sliders, 
      desc: 'Hero slide configurations', 
      to: '/admin/banner',
      color: '#10B981' 
    },
    { 
      label: 'Last Updated', 
      value: 'Just Now', 
      icon: Clock, 
      desc: 'System sync status', 
      to: '/admin/settings',
      color: '#F59E0B' 
    },
  ];

  const quickActions = [
    {
      title: 'Add Service',
      desc: 'Create and list a new treatment option',
      to: '/admin/services',
      icon: Plus,
      badge: 'Services Manager'
    },
    {
      title: 'Upload Gallery Image',
      desc: 'Add a new before/after photo to looking book',
      to: '/admin/gallery',
      icon: Upload,
      badge: 'Portfolio Media'
    },
    {
      title: 'Update Hero Banner',
      desc: 'Modify landing page headings and background slider',
      to: '/admin/banner',
      icon: Edit,
      badge: 'Banner Config'
    },
    {
      title: 'Website Settings',
      desc: 'Edit address, phone number, and social links',
      to: '/admin/settings',
      icon: Settings,
      badge: 'General Config'
    }
  ];

  return (
    <div className="admin-dashboard-wrap">
      {/* Welcome Hero Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #131A35 0%, #0D2619 50%, #0F1210 100%)',
          border: '1px solid var(--admin-border)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--admin-shadow)',
          flexWrap: 'wrap',
          gap: '24px'
        }}
      >
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '6px 14px',
            borderRadius: '100px',
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 500
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
            <span>All systems operational</span>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'white', marginTop: '16px', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            Welcome back, Admin 👋
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.65)', margin: 0, lineHeight: '1.5' }}>
            Here's what's happening with your saloon today. Real-time insights, instant actions.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Activity Widget */}
          <div style={{
            width: '130px',
            height: '110px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Activity
            </span>
            <span style={{ fontSize: '24px', fontWeight: 600, color: 'white', lineHeight: '1' }}>
              18
            </span>
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#22C55E', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ↗ Live
            </span>
          </div>
          
          {/* Today Widget */}
          <div style={{
            width: '130px',
            height: '110px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Today
            </span>
            <span style={{ fontSize: '20px', fontWeight: 600, color: 'white', lineHeight: '1' }}>
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </span>
          </div>
        </div>
      </div>

      {/* Overview Metric Cards (4 Columns) */}
      <div className="admin-stats-grid">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Link key={i} to={s.to} className="admin-stat-card">
              <div className="admin-stat-card__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="admin-stat-card__label" style={{ color: 'var(--admin-text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {s.label}
                </span>
                <div className="admin-stat-card__icon" style={{ color: s.color, background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="admin-stat-card__value" style={{ fontSize: '24px', fontWeight: 600, margin: '14px 0 4px', color: 'var(--admin-text)', letterSpacing: '-0.5px' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                {s.desc}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Panel */}
      <div className="admin-card">
        <div className="admin-card__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 className="admin-card__title" style={{ margin: 0 }}>Quick Actions</h3>
          <span style={{ fontSize: '12px', color: 'var(--admin-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CMS Shortcuts</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {quickActions.map(q => {
            const Icon = q.icon;
            return (
              <Link 
                key={q.title} 
                to={q.to} 
                className="admin-shortcut-row"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '24px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  height: '160px',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--admin-accent)', background: 'var(--admin-accent-light)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(34, 197, 94, 0.15)' }}>
                    <Icon size={20} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {q.badge}
                  </span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '15px', color: 'var(--admin-text)', marginBottom: '4px', fontWeight: 600 }}>
                    {q.title}
                  </strong>
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--admin-text-secondary)', lineHeight: '1.4' }}>
                    {q.desc}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
