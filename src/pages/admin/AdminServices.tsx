import { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

interface Service {
  id: number; name: string; category: string; price: string; duration: string; active: boolean;
}

const INITIAL: Service[] = [
  { id: 1,  name: 'Hair Cut',            category: 'Hair Care', price: '499',   duration: '45 min',  active: true  },
  { id: 2,  name: 'Hair Coloring',       category: 'Hair Care', price: '2499',  duration: '2 hrs',   active: true  },
  { id: 3,  name: 'Hair Spa',            category: 'Hair Care', price: '1499',  duration: '60 min',  active: true  },
  { id: 4,  name: 'Keratin Treatment',   category: 'Hair Care', price: '4499',  duration: '2-3 hrs', active: true  },
  { id: 5,  name: 'Facial',              category: 'Skin Care', price: '1999',  duration: '60 min',  active: true  },
  { id: 6,  name: 'Bridal Makeup',       category: 'Bridal',    price: '9999',  duration: '3-4 hrs', active: true  },
  { id: 7,  name: 'Nail Art',            category: 'Nails',     price: '799',   duration: '45 min',  active: true  },
];

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>(INITIAL);
  const [editId, setEditId]   = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newSvc, setNewSvc]   = useState({ name: '', category: '', price: '', duration: '' });

  const toggle = (id: number) =>
    setServices(s => s.map(x => x.id === id ? { ...x, active: !x.active } : x));

  const del = (id: number) => setServices(s => s.filter(x => x.id !== id));

  const addService = () => {
    if (!newSvc.name || !newSvc.price) return;
    setServices(s => [...s, { ...newSvc, id: Date.now(), active: true }]);
    setNewSvc({ name: '', category: '', price: '', duration: '' });
    setShowAdd(false);
  };

  return (
    <div className="admin-page-wrapper">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Services</h2>
          <p className="admin-page-desc">Manage your beauty service catalog and pricing.</p>
        </div>
        <button id="add-service-btn" className="btn btn-primary" style={{ fontSize: '0.82rem', padding: '10px 20px' }}
          onClick={() => setShowAdd(v => !v)}>
          <Plus size={14} /> Add Service
        </button>
      </div>

      {showAdd && (
        <div className="admin-card" style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 className="admin-card__title" style={{ marginBottom: 'var(--space-lg)' }}>New Service</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)' }}>
            {(['name', 'category', 'price', 'duration'] as const).map(f => (
              <div key={f} className="form-group">
                <label className="form-label" htmlFor={`new-${f}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                <input id={`new-${f}`} className="form-input" value={newSvc[f]}
                  onChange={e => setNewSvc(p => ({ ...p, [f]: e.target.value }))}
                  placeholder={f === 'price' ? '₹0' : ''} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
            <button className="btn btn-primary" style={{ fontSize: '0.82rem' }} onClick={addService}>
              <Check size={14} /> Save Service
            </button>
            <button className="btn btn-outline" style={{ fontSize: '0.82rem' }} onClick={() => setShowAdd(false)}>
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Service Name</th><th>Category</th><th>Price (₹)</th>
              <th>Duration</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id}>
                <td><strong>{s.name}</strong></td>
                <td>{s.category}</td>
                <td>₹{s.price}</td>
                <td>{s.duration}</td>
                <td>
                  <button
                    className={`admin-badge admin-badge--${s.active ? 'confirmed' : 'cancelled'}`}
                    style={{ cursor: 'none', border: 'none', background: 'none', padding: 0 }}
                    onClick={() => toggle(s.id)}
                    title="Toggle status"
                  >
                    {s.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="admin-action-btn" title="Edit" onClick={() => setEditId(s.id === editId ? null : s.id)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="admin-action-btn admin-action-btn--danger" title="Delete" onClick={() => del(s.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
