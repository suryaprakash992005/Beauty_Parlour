import { TrendingUp, Users, Calendar, Star, ArrowUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const APPOINTMENTS = [
  { id: 1, name: 'Priya Sharma',  service: 'Bridal Makeup',   time: '10:00 AM', date: 'Today',    status: 'confirmed' },
  { id: 2, name: 'Ananya Mehta',  service: 'Luxury Facial',   time: '11:30 AM', date: 'Today',    status: 'pending'   },
  { id: 3, name: 'Kavitha Nair',  service: 'Hair Spa',         time: '02:00 PM', date: 'Today',    status: 'confirmed' },
  { id: 4, name: 'Divya Patel',   service: 'Keratin Treatment',time: '04:00 PM', date: 'Today',    status: 'pending'   },
  { id: 5, name: 'Sneha Joshi',   service: 'Party Makeup',     time: '10:00 AM', date: 'Tomorrow', status: 'confirmed' },
];

export default function AdminDashboard() {
  const stats = [
    { label: "Today's Appointments", value: '14',  icon: Calendar,   change: '+3',  color: '#b76e79' },
    { label: 'Monthly Revenue',       value: '₹2.4L', icon: TrendingUp, change: '+18%', color: '#d4af74' },
    { label: 'Total Clients',         value: '8,241', icon: Users,      change: '+122', color: '#9d5560' },
    { label: 'Avg. Rating',           value: '4.9',   icon: Star,       change: '↑0.1', color: '#b76e79' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Dashboard</h2>
          <p className="admin-page-desc">Welcome back! Here's what's happening at Luxéora today.</p>
        </div>
        <Link to="/admin/appointments" className="btn btn-primary" style={{ fontSize: '0.82rem', padding: '10px 20px' }}>
          View All Appointments <ArrowRight size={14} />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="admin-stats-grid">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="admin-stat-card">
              <div className="admin-stat-card__header">
                <div className="admin-stat-card__icon" style={{ background: s.color + '22', color: s.color }}>
                  <Icon size={20} />
                </div>
                <span className="admin-stat-card__change" style={{ color: '#22c55e' }}>
                  <ArrowUp size={12} /> {s.change}
                </span>
              </div>
              <div className="admin-stat-card__value">{s.value}</div>
              <div className="admin-stat-card__label">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent appointments */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h3 className="admin-card__title">Today's Appointments</h3>
          <Link to="/admin/appointments" className="admin-card__link">View All</Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client</th><th>Service</th><th>Time</th><th>Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {APPOINTMENTS.map(a => (
              <tr key={a.id}>
                <td><strong>{a.name}</strong></td>
                <td>{a.service}</td>
                <td>{a.time}</td>
                <td>{a.date}</td>
                <td>
                  <span className={`admin-badge admin-badge--${a.status}`}>{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick actions */}
      <div className="admin-quick-actions">
        {[
          { label: 'Add Service', to: '/admin/services', desc: 'Create a new beauty service', icon: '✂️' },
          { label: 'Upload Photos', to: '/admin/gallery', desc: 'Add gallery images', icon: '📸' },
          { label: 'View Customers', to: '/admin/customers', desc: 'Manage client database', icon: '👥' },
          { label: 'Settings', to: '/admin/settings', desc: 'Update studio info', icon: '⚙️' },
        ].map(q => (
          <Link key={q.label} to={q.to} className="admin-quick-card">
            <span className="admin-quick-card__icon">{q.icon}</span>
            <strong className="admin-quick-card__label">{q.label}</strong>
            <span className="admin-quick-card__desc">{q.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
