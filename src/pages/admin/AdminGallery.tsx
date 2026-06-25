import { useState } from 'react';
import { Plus, Trash2, ImagePlus } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  url: string;
}

const INITIAL_GALLERY: GalleryItem[] = [
  { id: 1, title: 'Classic Bridal Glamour', category: 'Bridal', url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80' },
  { id: 2, title: 'Luxury Skincare Ritual', category: 'Skincare', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80' },
  { id: 3, title: 'Balayage Hair Coloring', category: 'Hair', url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80' },
  { id: 4, title: 'Elegant Rose Gold Nails', category: 'Nails', url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80' },
  { id: 5, title: 'Premium Bridal Saree Draping', category: 'Bridal', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80' },
  { id: 6, title: 'Classic Bun Hairstyling', category: 'Hair', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80' },
];

export default function AdminGallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', category: 'Bridal', url: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.url) return;
    setGallery(prev => [...prev, { ...newItem, id: Date.now() }]);
    setNewItem({ title: '', category: 'Bridal', url: '' });
    setShowAdd(false);
  };

  const deleteItem = (id: number) => {
    if (window.confirm('Are you sure you want to delete this gallery image?')) {
      setGallery(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="admin-page-wrapper">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Gallery Management</h2>
          <p className="admin-page-desc">Add, delete, or organize photos in your premium portfolio.</p>
        </div>
        <button className="btn btn-primary" style={{ fontSize: '0.82rem', padding: '10px 20px' }} onClick={() => setShowAdd(v => !v)}>
          <Plus size={14} /> Add Image
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="admin-card" style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 className="admin-card__title" style={{ marginBottom: 'var(--space-lg)' }}>Add New Portfolio Photo</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="gallery-title">Photo Title</label>
              <input 
                id="gallery-title"
                className="form-input" 
                value={newItem.title}
                onChange={e => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Traditional Bridal Glow"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="gallery-category">Category</label>
              <select 
                id="gallery-category"
                className="form-input" 
                value={newItem.category}
                onChange={e => setNewItem(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="Bridal">Bridal</option>
                <option value="Hair">Hair</option>
                <option value="Skincare">Skincare</option>
                <option value="Nails">Nails</option>
                <option value="Makeup">Makeup</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label" htmlFor="gallery-url">Image URL</label>
              <input 
                id="gallery-url"
                className="form-input" 
                value={newItem.url}
                onChange={e => setNewItem(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                required
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
            <button className="btn btn-primary" type="submit" style={{ fontSize: '0.82rem' }}>
              <ImagePlus size={14} /> Upload to Gallery
            </button>
            <button className="btn btn-outline" type="button" style={{ fontSize: '0.82rem' }} onClick={() => setShowAdd(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Gallery Grid */}
      <div className="admin-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-xl)' }}>
        {gallery.map(item => (
          <div key={item.id} className="admin-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', paddingBottom: '70%', background: '#eee' }}>
              <img 
                src={item.url} 
                alt={item.title} 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <div style={{ padding: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--color-brown-deep)', fontSize: '0.875rem' }}>{item.title}</strong>
                <span className="admin-badge admin-badge--pending" style={{ fontSize: '0.7rem', padding: '2px 8px', marginTop: '4px', display: 'inline-block' }}>{item.category}</span>
              </div>
              <button 
                className="admin-action-btn admin-action-btn--danger" 
                onClick={() => deleteItem(item.id)}
                title="Delete Image"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
