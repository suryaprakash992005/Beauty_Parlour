import { useState } from 'react';
import { Users, Search, Phone, Mail, Calendar } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  visits: number;
  totalSpent: number;
  lastVisit: string;
  tier: 'VIP' | 'Regular' | 'New';
}

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 98765 43210', visits: 12, totalSpent: 45000, lastVisit: '2026-06-25', tier: 'VIP' },
  { id: 2, name: 'Ananya Mehta', email: 'ananya.m@example.com', phone: '+91 98234 56789', visits: 8, totalSpent: 18500, lastVisit: '2026-06-25', tier: 'Regular' },
  { id: 3, name: 'Kavitha Nair', email: 'kavitha.nair@example.com', phone: '+91 97654 32109', visits: 15, totalSpent: 38000, lastVisit: '2026-06-25', tier: 'VIP' },
  { id: 4, name: 'Divya Patel', email: 'divya.patel@example.com', phone: '+91 96543 21098', visits: 1, totalSpent: 4999, lastVisit: '2026-06-25', tier: 'New' },
  { id: 5, name: 'Sneha Joshi', email: 'sneha.j@example.com', phone: '+91 95432 10987', visits: 5, totalSpent: 12000, lastVisit: '2026-06-18', tier: 'Regular' },
  { id: 6, name: 'Riya Verma', email: 'riya.v@example.com', phone: '+91 94321 09876', visits: 9, totalSpent: 14500, lastVisit: '2026-06-20', tier: 'Regular' },
  { id: 7, name: 'Neha Agarwal', email: 'neha.a@example.com', phone: '+91 93210 98765', visits: 2, totalSpent: 18999, lastVisit: '2026-06-15', tier: 'New' },
];

export default function AdminCustomers() {
  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="admin-page-wrapper">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Client Directory</h2>
          <p className="admin-page-desc">View and manage your client records, visit histories, and loyalties.</p>
        </div>
      </div>

      {/* Search card */}
      <div className="admin-card" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-md) var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-cream-dark)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', width: '300px' }}>
          <Search size={16} style={{ color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search clients..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem', color: 'var(--color-brown-deep)' }}
          />
        </div>
      </div>

      {/* Client List */}
      <div className="admin-card">
        {filtered.length === 0 ? (
          <div style={{ padding: 'var(--space-3xl)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <Users size={48} style={{ margin: '0 auto 12px auto', strokeWidth: 1 }} />
            <p>No clients found.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Contact Info</th>
                <th>Visits</th>
                <th>Total Spent</th>
                <th>Last Visit</th>
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.name}</strong>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} style={{ color: 'var(--color-text-muted)' }} /> {c.phone}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}><Mail size={12} style={{ color: 'var(--color-text-muted)' }} /> {c.email}</div>
                    </div>
                  </td>
                  <td>{c.visits} visits</td>
                  <td><strong>₹{c.totalSpent.toLocaleString()}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} style={{ color: 'var(--color-text-muted)' }} /> {c.lastVisit}
                    </div>
                  </td>
                  <td>
                    <span 
                      className="admin-badge" 
                      style={{ 
                        backgroundColor: c.tier === 'VIP' ? 'rgba(212, 175, 116, 0.15)' : c.tier === 'Regular' ? 'rgba(183, 110, 121, 0.15)' : 'rgba(109, 76, 65, 0.15)',
                        color: c.tier === 'VIP' ? 'var(--color-champagne)' : c.tier === 'Regular' ? 'var(--color-rose-gold)' : 'var(--color-brown-mid)',
                        fontWeight: '600'
                      }}
                    >
                      {c.tier}
                    </span>
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
