import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Sparkles, Clock, Tag } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  imageUrl: string;
  active: boolean;
}

const INITIAL_SERVICES: Service[] = [
  { 
    id: 1, 
    name: 'Hair Cut & Styling', 
    category: 'Hair Care', 
    description: 'Precision cut, wash, conditioning treatment, and premium blow-dry finish.',
    price: '499', 
    duration: '45 min', 
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80',
    active: true 
  },
  { 
    id: 2, 
    name: 'Balayage Hair Coloring', 
    category: 'Hair Care', 
    description: 'Expert hand-painted custom coloring for natural, sun-kissed luxury tones.',
    price: '2499', 
    duration: '2 hrs', 
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80',
    active: true 
  },
  { 
    id: 3, 
    name: 'Revitalizing Hair Spa', 
    category: 'Hair Care', 
    description: 'Deep nourishing steam mask, essential oil head massage, and hair repair serum.',
    price: '1499', 
    duration: '60 min', 
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
    active: true 
  },
  { 
    id: 4, 
    name: 'Premium Keratin Infusion', 
    category: 'Hair Care', 
    description: 'Smooth frizz-free protein treatment that restores shine and straightens structure.',
    price: '4499', 
    duration: '2.5 hrs', 
    imageUrl: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=600&q=80',
    active: true 
  },
  { 
    id: 5, 
    name: 'Luxury Skincare Facial', 
    category: 'Skin Care', 
    description: 'Organic gold-dust peel off mask, pore vacuum extraction, and hydrating collagen serum.',
    price: '1999', 
    duration: '60 min', 
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
    active: true 
  },
  { 
    id: 6, 
    name: 'Classic Bridal Glamour', 
    category: 'Bridal', 
    description: 'Flawless airbrush HD makeup, luxury false lashes, hair setup, and saree/lehenga draping.',
    price: '9999', 
    duration: '4 hrs', 
    imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80',
    active: true 
  },
  { 
    id: 7, 
    name: 'Premium Gel Nail Art', 
    category: 'Nails', 
    description: 'Nail shaping, cuticle trimming, premium gel polish application, and custom creative nail art.',
    price: '799', 
    duration: '45 min', 
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',
    active: true 
  },
];

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentId, setCurrentId] = useState<number | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Hair Care');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    setFormName('');
    setFormCategory('Hair Care');
    setFormDescription('');
    setFormPrice('');
    setFormDuration('');
    setFormImageUrl('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80');
    setShowModal(true);
  };

  const handleOpenEdit = (svc: Service) => {
    setModalMode('edit');
    setCurrentId(svc.id);
    setFormName(svc.name);
    setFormCategory(svc.category);
    setFormDescription(svc.description);
    setFormPrice(svc.price);
    setFormDuration(svc.duration);
    setFormImageUrl(svc.imageUrl);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(x => x.id !== id));
    }
  };

  const handleToggleActive = (id: number) => {
    setServices(prev => prev.map(x => x.id === id ? { ...x, active: !x.active } : x));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newService: Service = {
        id: Date.now(),
        name: formName,
        category: formCategory,
        description: formDescription,
        price: formPrice,
        duration: formDuration,
        imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80',
        active: true
      };
      setServices(prev => [...prev, newService]);
    } else if (modalMode === 'edit' && currentId !== null) {
      setServices(prev => prev.map(x => x.id === currentId ? {
        ...x,
        name: formName,
        category: formCategory,
        description: formDescription,
        price: formPrice,
        duration: formDuration,
        imageUrl: formImageUrl
      } : x));
    }
    setShowModal(false);
  };

  return (
    <div className="admin-page-wrapper">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)' }}>
        <div>
          <h2 className="admin-page-title">Services Management</h2>
          <p className="admin-page-desc">Add, edit, or configure the luxury treatments and pricing catalogs displayed on the site.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Services Premium Grid */}
      <div className="admin-services-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 'var(--space-xl)' }}>
        {services.map(svc => (
          <div key={svc.id} className="admin-service-cms-card" style={{
            background: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s'
          }}>
            {/* Image & Category badge */}
            <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
              <img 
                src={svc.imageUrl} 
                alt={svc.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span className="admin-service-category-badge" style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(11, 11, 11, 0.85)',
                color: 'var(--color-champagne)',
                fontSize: '0.68rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '4px 10px',
                borderRadius: '100px',
                backdropFilter: 'blur(4px)'
              }}>
                {svc.category}
              </span>
            </div>

            {/* Info Body */}
            <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'white', margin: 0 }}>
                {svc.name}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: '1.5', margin: 0, flex: 1 }}>
                {svc.description}
              </p>

              {/* Meta details */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderTop: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
                margin: '8px 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-light)', fontSize: '0.78rem' }}>
                  <Clock size={14} />
                  <span>{svc.duration}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-champagne)', fontSize: '1rem', fontWeight: 700 }}>
                  <Tag size={14} />
                  <span>₹{svc.price}</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <button 
                  onClick={() => handleToggleActive(svc.id)}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: '100px',
                    border: 'none',
                    cursor: 'pointer',
                    background: svc.active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: svc.active ? '#22c55e' : '#ef4444'
                  }}
                >
                  {svc.active ? '● Active' : '○ Inactive'}
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="admin-action-btn" 
                    title="Edit Service"
                    onClick={() => handleOpenEdit(svc)}
                  >
                    <Edit2 size={13} />
                  </button>
                  <button 
                    className="admin-action-btn admin-action-btn--danger" 
                    title="Delete Service"
                    onClick={() => handleDelete(svc.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog for Add/Edit Form */}
      {showModal && (
        <div className="admin-modal-overlay" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <form onSubmit={handleSave} className="admin-card admin-modal-card" style={{
            width: '100%',
            maxWidth: '520px',
            padding: 'var(--space-2xl)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
            animation: 'zoomIn 0.3s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: 'var(--color-champagne)' }} />
                {modalMode === 'add' ? 'Create New Service' : 'Edit Service Settings'}
              </h3>
              <button type="button" onClick={() => setShowModal(false)} style={{ color: 'var(--color-text-muted)', border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="modal-name">Service Name *</label>
              <input 
                id="modal-name"
                className="form-input" 
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="e.g. Balayage Highlights"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="modal-category">Category *</label>
                <select 
                  id="modal-category"
                  className="form-input" 
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                >
                  <option value="Hair Care">Hair Care</option>
                  <option value="Skin Care">Skin Care</option>
                  <option value="Bridal">Bridal</option>
                  <option value="Nails">Nails</option>
                  <option value="Makeup">Makeup</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Upload Image *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {formImageUrl && (
                    <img 
                      src={formImageUrl} 
                      alt="Preview" 
                      style={{ width: '42px', height: '42px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--admin-border)' }} 
                    />
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', width: '100%' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="modal-price">Price (₹) *</label>
                <input 
                  id="modal-price"
                  className="form-input" 
                  value={formPrice}
                  onChange={e => setFormPrice(e.target.value)}
                  placeholder="e.g. 1500"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="modal-duration">Duration *</label>
                <input 
                  id="modal-duration"
                  className="form-input" 
                  value={formDuration}
                  onChange={e => setFormDuration(e.target.value)}
                  placeholder="e.g. 60 min"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="modal-desc">Description *</label>
              <textarea 
                id="modal-desc"
                className="form-input" 
                rows={3}
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                placeholder="Brief summary of service benefits..."
                style={{ fontFamily: 'inherit', resize: 'vertical' }}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', marginTop: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
              <button className="btn btn-outline" type="button" onClick={() => setShowModal(false)} style={{ fontSize: '0.82rem' }}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" style={{ fontSize: '0.82rem' }}>
                Save Configurations
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
