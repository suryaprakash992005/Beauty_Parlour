import { useState, useEffect } from 'react';
import { 
  Sparkles, Search, Filter, Calendar, Clock, User, Phone, Mail, 
  CheckCircle2, Eye, RefreshCw, X
} from 'lucide-react';
import { getTryOns, updateTryOnStatus, type TryOnRecord } from '../../services/tryon';

interface Toast {
  type: 'success' | 'error';
  message: string;
  id: number;
}

export default function AdminTryOn() {
  const [records, setRecords] = useState<TryOnRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending Review' | 'Confirmed' | 'Completed'>('all');
  
  // Fullscreen Preview Modal States
  const [activePreview, setActivePreview] = useState<TryOnRecord | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    fetchRecordsList();
  }, []);

  const fetchRecordsList = async () => {
    setLoading(true);
    try {
      const data = await getTryOns();
      setRecords(data);
    } catch {
      showToast('Failed to load try-on records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateTryOnStatus(id, newStatus);
      showToast(`Booking status updated to ${newStatus}!`);
      // Update local state
      setRecords(prev => prev.map(r => r.id === id ? { ...r, booking_status: newStatus } : r));
    } catch {
      showToast('Failed to update status.', 'error');
    }
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.selected_transformation_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || r.booking_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-page-wrapper">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <h2 className="admin-page-title">Virtual Try-On Leads</h2>
          <p className="admin-page-desc">Review customer portrait uploads, AI previews, and schedule requested consultation appointments.</p>
        </div>
        <button 
          onClick={fetchRecordsList} 
          className="btn btn-outline" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={15} />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="admin-card" style={{ padding: 'var(--space-md) var(--space-lg)', marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flex: 1, minWidth: '280px', maxWidth: '500px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input 
              type="text" 
              placeholder="Search by name, email, or style..." 
              className="form-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', height: '38px' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--color-text-muted)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={15} style={{ color: 'var(--color-text-muted)' }} />
            <select 
              className="form-input"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              style={{ width: '150px', padding: '6px 12px' }}
            >
              <option value="all">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <div className="book-loader" style={{ width: '32px', height: '32px', borderTopColor: 'var(--admin-accent)' }} />
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--color-text-muted)' }}>
          <Sparkles size={24} style={{ marginBottom: '12px', color: 'rgba(255,255,255,0.1)' }} />
          <h4 style={{ margin: '0 0 6px 0', color: 'white' }}>No try-on leads found</h4>
          <p style={{ margin: 0, fontSize: '0.82rem' }}>Customers booking appointments from the try-on portal will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {filteredRecords.map(lead => (
            <div key={lead.id} className="admin-card tryon-lead-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px' }}>
              
              {/* Images Preview Block */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', height: '180px', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'relative', height: '100%' }}>
                  <img src={lead.uploaded_image_url} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '0.62rem', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Original</span>
                </div>
                <div style={{ position: 'relative', height: '100%' }}>
                  <img src={lead.generated_preview_url} alt="AI Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(16, 185, 129, 0.8)', color: 'black', fontWeight: 600, fontSize: '0.62rem', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>AI Look</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setActivePreview(lead)}
                  style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyItems: 'center', cursor: 'pointer', color: 'white', justifyContent: 'center' }}
                  title="Expand Comparison View"
                >
                  <Eye size={14} />
                </button>
              </div>

              {/* Lead Information */}
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={14} style={{ color: 'var(--admin-accent)' }} />
                  {lead.customer_name}
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={12} /> {lead.customer_phone}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={12} /> {lead.customer_email}
                  </span>
                </div>
              </div>

              {/* Transformation specs */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ display: 'block', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selected Style</span>
                <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'white', marginTop: '2px' }}>{lead.selected_transformation_name}</span>
                
                <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '0.78rem', color: 'var(--admin-accent)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {lead.appointment_date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {lead.appointment_time}
                  </span>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '4px' }}>
                <span className={`admin-status-badge ${
                  lead.booking_status === 'Confirmed' ? 'active' : 
                  lead.booking_status === 'Completed' ? 'completed' : 'pending'
                }`} style={{ textTransform: 'capitalize' }}>
                  {lead.booking_status}
                </span>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {lead.booking_status === 'Pending Review' && (
                    <button 
                      onClick={() => handleStatusChange(lead.id!, 'Confirmed')} 
                      className="btn btn-outline" 
                      style={{ fontSize: '0.72rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', borderColor: '#10b981', color: '#10b981' }}
                    >
                      <CheckCircle2 size={12} />
                      <span>Confirm Appointment</span>
                    </button>
                  )}
                  {lead.booking_status === 'Confirmed' && (
                    <button 
                      onClick={() => handleStatusChange(lead.id!, 'Completed')} 
                      className="btn btn-outline" 
                      style={{ fontSize: '0.72rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    >
                      <CheckCircle2 size={12} />
                      <span>Mark Complete</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Full Comparison Overlay Modal */}
      {activePreview && (
        <div className="admin-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <div className="admin-card admin-modal-card" style={{ width: '90%', maxWidth: '800px', padding: 'var(--space-2xl)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            <button 
              type="button" 
              onClick={() => setActivePreview(null)} 
              style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--color-text-muted)', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'white' }}>
              Comparison View: {activePreview.customer_name}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: '380px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Uploaded Photo</span>
                <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                  <img src={activePreview.uploaded_image_url} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#060c09' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Transformation Output</span>
                <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid #10b981' }}>
                  <img src={activePreview.generated_preview_url} alt="Transformed" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#060c09' }} />
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                Look Requested: <span style={{ color: 'white', fontWeight: 600 }}>{activePreview.selected_transformation_name}</span>
              </div>
              <button className="btn btn-outline" onClick={() => setActivePreview(null)}>Close Preview</button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts list */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 4000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
