import { useState } from 'react';
import { Plus, Trash2, ImagePlus, CloudUpload, CheckCircle } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  url: string;
  beforeUrl?: string;
}

const INITIAL_GALLERY: GalleryItem[] = [
  { id: 1, title: 'Classic Bridal Glamour', category: 'Bridal', url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80' },
  { id: 2, title: 'Luxury Skincare Ritual', category: 'Skincare', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80' },
  { id: 3, title: 'Balayage Hair Coloring', category: 'Hair', url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80', beforeUrl: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=800&q=80' },
  { id: 4, title: 'Elegant Rose Gold Nails', category: 'Nails', url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80' },
  { id: 5, title: 'Premium Bridal Saree Draping', category: 'Bridal', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80' },
  { id: 6, title: 'Classic Bun Hairstyling', category: 'Hair', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80' },
];

export default function AdminGallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [showAdd, setShowAdd] = useState(false);
  
  // Upload States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Bridal');
  const [url, setUrl] = useState('');
  const [beforeUrl, setBeforeUrl] = useState('');
  const [isBeforeAfter, setIsBeforeAfter] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBeforeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBeforeUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag & drop upload simulator
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    setUploadSuccess(false);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          setUploadSuccess(true);
          setUrl('https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80');
          if (isBeforeAfter) {
            setBeforeUrl('https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=800&q=80');
          }
          return 100;
        }
        return prev + 20;
      });
    }, 100);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    
    const newItem: GalleryItem = {
      id: Date.now(),
      title,
      category,
      url,
      beforeUrl: isBeforeAfter && beforeUrl ? beforeUrl : undefined
    };

    setGallery(prev => [newItem, ...prev]);
    
    setTitle('');
    setCategory('Bridal');
    setUrl('');
    setBeforeUrl('');
    setIsBeforeAfter(false);
    setUploadProgress(null);
    setUploadSuccess(false);
    setShowAdd(false);
  };

  const deleteItem = (id: number) => {
    if (window.confirm('Are you sure you want to delete this photo from the gallery?')) {
      setGallery(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="admin-page-wrapper">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)' }}>
        <div>
          <h2 className="admin-page-title">Gallery Management</h2>
          <p className="admin-page-desc">Upload, delete, and organize look transitions inside the public portfolio.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(v => !v)}>
          <Plus size={16} /> Add Photo
        </button>
      </div>

      {showAdd && (
        <div className="admin-card" style={{ marginBottom: 'var(--space-xl)', animation: 'slideIn 0.3s ease' }}>
          <h3 className="admin-card__title" style={{ marginBottom: 'var(--space-lg)' }}>Add New Portfolio Photo</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-xl)' }} className="admin-gallery-upload-layout">
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="gallery-title">Photo Label/Title</label>
                <input 
                  id="gallery-title"
                  className="form-input" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Traditional Bridal Glow"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="gallery-category">Category</label>
                  <select 
                    id="gallery-category"
                    className="form-input" 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    <option value="Bridal">Bridal</option>
                    <option value="Hair">Hair Care</option>
                    <option value="Skincare">Skin Care</option>
                    <option value="Nails">Nails</option>
                    <option value="Makeup">Makeup</option>
                  </select>
                </div>

                <div className="form-group" style={{ justifyContent: 'center' }}>
                  <label className="checkbox-option" style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={isBeforeAfter} 
                      onChange={e => setIsBeforeAfter(e.target.checked)} 
                    />
                    <span>Before / After Look</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Upload Portfolio Image *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {url && (
                    <img 
                      src={url} 
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

              {isBeforeAfter && (
                <div className="form-group" style={{ animation: 'slideIn 0.3s ease' }}>
                  <label className="form-label">Upload "Before" Transform Image *</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {beforeUrl && (
                      <img 
                        src={beforeUrl} 
                        alt="Before Preview" 
                        style={{ width: '42px', height: '42px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--admin-border)' }} 
                      />
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleBeforeFileChange}
                      style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', width: '100%' }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: '8px' }}>
                <button className="btn btn-primary" type="submit" style={{ fontSize: '0.82rem' }}>
                  <ImagePlus size={14} /> Upload to Gallery
                </button>
                <button className="btn btn-outline" type="button" style={{ fontSize: '0.82rem' }} onClick={() => setShowAdd(false)}>
                  Cancel
                </button>
              </div>
            </form>

            {/* Drag and drop panel */}
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
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {uploadProgress === null ? (
                <>
                  <CloudUpload size={44} style={{ color: 'var(--color-champagne)', marginBottom: '12px' }} />
                  <strong style={{ display: 'block', fontSize: '0.875rem', color: 'white', marginBottom: '4px' }}>Drag & Drop Image Here</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>or click to simulate local upload</span>
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
                  <CheckCircle size={44} style={{ color: '#22c55e', marginBottom: '12px' }} />
                  <strong style={{ display: 'block', fontSize: '0.875rem', color: 'white', marginBottom: '4px' }}>Upload Completed!</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Mock image URLs successfully populated</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid - Pinterest Masonry */}
      <div className="admin-gallery-masonry" style={{ columns: '3', columnGap: '20px' }}>
        {gallery.map(item => (
          <div 
            key={item.id} 
            className="admin-card admin-gallery-card" 
            style={{ 
              padding: 0, 
              overflow: 'hidden', 
              display: 'inline-block', 
              width: '100%', 
              marginBottom: '20px', 
              position: 'relative' 
            }}
          >
            <div className="admin-gallery-img-container" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
              <img 
                src={item.url} 
                alt={item.title} 
                style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.3s ease' }} 
              />
              
              {/* Overlay Content */}
              <div 
                className="admin-gallery-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(11,11,11,0.9) 0%, rgba(11,11,11,0.2) 60%, rgba(11,11,11,0.4) 100%)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: 1, /* Keep visible by default for easier CMS touch interaction, but with premium hover scaling */
                  zIndex: 2,
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="admin-service-category-badge" style={{ margin: 0, fontSize: '10px', padding: '3px 8px' }}>
                    {item.category}
                  </span>
                  {item.beforeUrl && (
                    <span style={{
                      background: 'var(--admin-accent-light)',
                      color: 'var(--admin-accent)',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: '100px'
                    }}>
                      Before/After
                    </span>
                  )}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{item.title}</span>
                  <button 
                    className="admin-action-btn admin-action-btn--danger" 
                    onClick={() => deleteItem(item.id)}
                    title="Delete Image"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
