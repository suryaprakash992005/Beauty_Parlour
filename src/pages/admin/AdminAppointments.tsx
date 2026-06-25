import { useState } from 'react';
import { Calendar, Search, Check, X, Clock, Trash2 } from 'lucide-react';

interface Appointment {
  id: number;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes: string;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: 1, name: 'Priya Sharma', phone: '+91 98765 43210', service: 'Bridal Makeup', date: '2026-06-25', time: '10:00 AM', status: 'confirmed', notes: 'Prefers light pink lipstick.' },
  { id: 2, name: 'Ananya Mehta', phone: '+91 98234 56789', service: 'Luxury Facial', date: '2026-06-25', time: '11:30 AM', status: 'pending', notes: 'Sensitive skin, check products.' },
  { id: 3, name: 'Kavitha Nair', phone: '+91 97654 32109', service: 'Hair Spa', date: '2026-06-25', time: '02:00 PM', status: 'confirmed', notes: 'Wants additional styling tips.' },
  { id: 4, name: 'Divya Patel', phone: '+91 96543 21098', service: 'Keratin Treatment', date: '2026-06-25', time: '04:00 PM', status: 'pending', notes: 'First-time keratin treatment.' },
  { id: 5, name: 'Sneha Joshi', phone: '+91 95432 10987', service: 'Party Makeup', date: '2026-06-26', time: '10:00 AM', status: 'confirmed', notes: 'Attending wedding reception.' },
  { id: 6, name: 'Riya Verma', phone: '+91 94321 09876', service: 'Nail Art', date: '2026-06-26', time: '01:00 PM', status: 'confirmed', notes: 'Brings design reference.' },
  { id: 7, name: 'Neha Agarwal', phone: '+91 93210 98765', service: 'Bridal Season Special', date: '2026-06-27', time: '09:00 AM', status: 'pending', notes: 'Needs saree draping too.' },
];

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  const updateStatus = (id: number, newStatus: 'confirmed' | 'pending' | 'cancelled') => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const deleteAppointment = (id: number) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(prev => prev.filter(a => a.id !== id));
    }
  };

  const filtered = appointments.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                          a.service.toLowerCase().includes(search.toLowerCase()) ||
                          a.phone.includes(search);
    const matchesFilter = filter === 'all' || a.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="admin-page-wrapper">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Appointments</h2>
          <p className="admin-page-desc">Manage customer bookings, approve pending requests, or reschedule.</p>
        </div>
      </div>

      {/* Filters and search */}
      <div className="admin-card" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-md) var(--space-lg)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="admin-search-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-cream-dark)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', width: '300px' }}>
            <Search size={16} style={{ color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search appointments..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem', color: 'var(--color-brown-deep)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(f => (
              <button 
                key={f}
                className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.78rem', padding: '6px 12px', textTransform: 'capitalize' }}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="admin-card">
        {filtered.length === 0 ? (
          <div style={{ padding: 'var(--space-3xl)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <Calendar size={48} style={{ margin: '0 auto 12px auto', strokeWidth: 1 }} />
            <p>No appointments found.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client Details</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td>
                    <div>
                      <strong>{a.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{a.phone}</div>
                    </div>
                  </td>
                  <td>{a.service}</td>
                  <td>
                    <div>
                      <div>{a.date}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        {a.time}
                      </div>
                    </div>
                  </td>
                  <td style={{ maxWidth: '200px', fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                    {a.notes || 'No notes'}
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge--${a.status}`}>{a.status}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {a.status !== 'confirmed' && (
                        <button 
                          className="admin-action-btn" 
                          style={{ color: '#22c55e', borderColor: '#22c55e' }}
                          title="Confirm"
                          onClick={() => updateStatus(a.id, 'confirmed')}
                        >
                          <Check size={14} />
                        </button>
                      )}
                      {a.status !== 'cancelled' && (
                        <button 
                          className="admin-action-btn" 
                          style={{ color: '#ef4444', borderColor: '#ef4444' }}
                          title="Cancel"
                          onClick={() => updateStatus(a.id, 'cancelled')}
                        >
                          <X size={14} />
                        </button>
                      )}
                      <button 
                        className="admin-action-btn admin-action-btn--danger"
                        title="Delete"
                        onClick={() => deleteAppointment(a.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
