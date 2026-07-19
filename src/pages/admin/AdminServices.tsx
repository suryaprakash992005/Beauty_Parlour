import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Sparkles, Clock, CloudUpload, CheckCircle } from 'lucide-react';
import { getServices, addService, updateService, deleteService, uploadServiceImage } from '../../services/services';
import type { ServiceItem } from '../../services/services';

export default function AdminServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentId, setCurrentId] = useState<number | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Hair Care');
  const [formDescription, setFormDescription] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  // Drag and drop states
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setUploadProgress(30);
      const timer1 = setTimeout(() => setUploadProgress(70), 150);
      const timer2 = setTimeout(() => setUploadProgress(100), 300);
      reader.onloadend = () => {
        setFormImageUrl(reader.result as string);
        setUploadSuccess(true);
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      setUploadProgress(20);
      const timer1 = setTimeout(() => setUploadProgress(60), 200);
      const timer2 = setTimeout(() => setUploadProgress(100), 400);
      reader.onloadend = () => {
        setFormImageUrl(reader.result as string);
        setUploadSuccess(true);
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateUpload = () => {
    document.getElementById('service-primary-file')?.click();
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    setFormName('');
    setFormCategory('Hair Care');
    setFormDescription('');
    setFormDuration('');
    setFormImageUrl('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80');
    setUploadProgress(null);
    setUploadSuccess(false);
    setShowModal(true);
  };

  const handleOpenEdit = (svc: ServiceItem) => {
    setModalMode('edit');
    setCurrentId(svc.id || null);
    setFormName(svc.name);
    setFormCategory(svc.category);
    setFormDescription(svc.description);
    setFormDuration(svc.duration);
    setFormImageUrl(svc.imageUrl);
    setUploadProgress(null);
    setUploadSuccess(false);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        setServices(prev => prev.filter(x => x.id !== id));
      } catch (err) {
        console.error('Failed to delete service:', err);
        alert('Failed to delete service.');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalImageUrl = formImageUrl;
      if (formImageUrl.startsWith('data:')) {
        finalImageUrl = await uploadServiceImage(formImageUrl);
      }

      if (modalMode === 'add') {
        const newService = await addService({
          name: formName,
          category: formCategory,
          description: formDescription,
          duration: formDuration,
          imageUrl: finalImageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80'
        });
        setServices(prev => [...prev, newService]);
      } else if (modalMode === 'edit' && currentId !== null) {
        const updatedService = await updateService(currentId, {
          name: formName,
          category: formCategory,
          description: formDescription,
          duration: formDuration,
          imageUrl: finalImageUrl
        });
        setServices(prev => prev.map(x => x.id === currentId ? updatedService : x));
      }
      setShowModal(false);
    } catch (err: any) {
      console.error('Error saving service:', err);
      alert(`Error saving service: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div className="book-loader" style={{ width: '32px', height: '32px', borderTopColor: 'var(--admin-accent)' }} />
      </div>
    );
  }

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
                  <span>{svc.duration || 'No duration specified'}</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '12px' }}>
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
                    onClick={() => handleDelete(svc.id!)}
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
          <div className="admin-card admin-modal-card" style={{
            width: '100%',
            maxWidth: '840px',
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

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-xl)', alignItems: 'start' }}>
              {/* Left Column: Form Fields */}
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
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
                  <label className="form-label" htmlFor="modal-duration">Duration</label>
                  <input 
                    id="modal-duration"
                    className="form-input" 
                    value={formDuration}
                    onChange={e => setFormDuration(e.target.value)}
                    placeholder="e.g. 60 min"
                  />
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

                <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                  <button className="btn btn-outline" type="button" onClick={() => setShowModal(false)} style={{ fontSize: '0.82rem' }}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" type="submit" disabled={saving} style={{ fontSize: '0.82rem' }}>
                    {saving ? 'Saving...' : 'Save Configurations'}
                  </button>
                </div>
              </form>

              {/* Right Column: Drag and Drop Upload Zone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <label className="form-label">Service Cover Image *</label>
                
                <input 
                  type="file" 
                  id="service-primary-file"
                  accept="image/*" 
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                <div 
                  className={`admin-drag-drop-zone ${dragActive ? 'active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={simulateUpload}
                  style={{
                    border: '2px dashed var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    background: 'rgba(255, 255, 255, 0.01)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--space-2xl)',
                    minHeight: '220px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  {uploadProgress === null ? (
                    <>
                      <CloudUpload size={40} style={{ color: 'var(--color-champagne)', marginBottom: '12px' }} />
                      <strong style={{ display: 'block', fontSize: '0.875rem', color: 'white', marginBottom: '4px' }}>Drag & Drop Image Here</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-light)' }}>or click to simulate local upload</span>
                    </>
                  ) : !uploadSuccess ? (
                    <div style={{ width: '100%' }}>
                      <div className="book-loader" style={{ width: '28px', height: '28px', borderTopColor: 'var(--color-champagne)', marginBottom: '12px' }}></div>
                      <strong style={{ display: 'block', fontSize: '0.875rem', color: 'white', marginBottom: '8px' }}>Uploading...</strong>
                      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'var(--color-champagne)', width: `${uploadProgress}%`, transition: 'width 0.15s ease' }}></div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ animation: 'zoomIn 0.3s ease' }}>
                      <CheckCircle size={40} style={{ color: '#22c55e', marginBottom: '12px' }} />
                      <strong style={{ display: 'block', fontSize: '0.875rem', color: 'white', marginBottom: '4px' }}>Upload Completed!</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-light)' }}>Cover preview loaded successfully</span>
                    </div>
                  )}
                </div>

                {formImageUrl && (
                  <div style={{ marginTop: '8px', animation: 'fadeIn 0.3s ease' }}>
                    <span className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.78rem' }}>Image Preview:</span>
                    <img 
                      src={formImageUrl} 
                      alt="Service Preview" 
                      style={{ width: '100%', height: '150px', borderRadius: 'var(--radius-lg)', objectFit: 'cover', border: '1px solid var(--color-border)' }} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
