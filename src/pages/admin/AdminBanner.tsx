import { useState } from 'react';
import { Save, Eye, Check } from 'lucide-react';

export default function AdminBanner() {
  const [banner, setBanner] = useState({
    smallHeading: 'Bespoke Hair Artistry',
    mainHeading: 'Transform Your Style, Reveal Your Confidence',
    description: 'Experience premium luxury hair styling, organic skincare therapies, and celebrity-grade bridal makeovers at ZHA Hair Saloon.',
    primaryBtn: 'Book Appointment',
    secondaryBtn: 'Explore Services',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
  });
  const [saved, setSaved] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBanner(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    localStorage.setItem('zha_hero_banner', JSON.stringify(banner));
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="admin-page-wrapper">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Home Banner Management</h2>
          <p className="admin-page-desc">Modify the landing page hero banner text, CTAs, and background asset.</p>
        </div>
      </div>

      <div className="admin-banner-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-2xl)' }}>
        {/* Editor Form */}
        <form onSubmit={handleSave} className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <h3 className="admin-card__title">Banner Configuration</h3>

          <div className="form-group">
            <label className="form-label">Upload Hero Background Image</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {banner.imageUrl && (
                <img 
                  src={banner.imageUrl} 
                  alt="Hero Preview" 
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

          <div className="form-group">
            <label className="form-label" htmlFor="banner-smallHeading">Small Top Label (Eyebrow)</label>
            <input 
              id="banner-smallHeading"
              className="form-input" 
              value={banner.smallHeading}
              onChange={e => setBanner(prev => ({ ...prev, smallHeading: e.target.value }))}
              placeholder="e.g. ZHA Hair Saloon"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="banner-mainHeading">Main Heading Title</label>
            <input 
              id="banner-mainHeading"
              className="form-input" 
              value={banner.mainHeading}
              onChange={e => setBanner(prev => ({ ...prev, mainHeading: e.target.value }))}
              placeholder="Main premium title text"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="banner-description">Hero Subtitle/Description</label>
            <textarea 
              id="banner-description"
              className="form-input" 
              rows={3}
              value={banner.description}
              onChange={e => setBanner(prev => ({ ...prev, description: e.target.value }))}
              placeholder="A brief premium caption describing the salon services"
              style={{ fontFamily: 'inherit', resize: 'vertical' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="banner-primaryBtn">Primary Button Label</label>
              <input 
                id="banner-primaryBtn"
                className="form-input" 
                value={banner.primaryBtn}
                onChange={e => setBanner(prev => ({ ...prev, primaryBtn: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="banner-secondaryBtn">Secondary Button Label</label>
              <input 
                id="banner-secondaryBtn"
                className="form-input" 
                value={banner.secondaryBtn}
                onChange={e => setBanner(prev => ({ ...prev, secondaryBtn: e.target.value }))}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
            <button className="btn btn-primary" type="submit" style={{ fontSize: '0.82rem' }}>
              <Save size={14} /> Update Banner
            </button>
            {saved && (
              <div style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
                <Check size={16} /> Banner updated successfully!
              </div>
            )}
          </div>
        </form>

        {/* Live Preview Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-accent)' }}>
            <Eye size={16} />
            <strong style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em', fontWeight: 600 }}>Live Hero Preview</strong>
          </div>
          <div className="banner-preview-card" style={{
            position: 'relative',
            height: '420px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid var(--admin-border)',
            boxShadow: 'var(--admin-shadow)',
            display: 'flex',
            alignItems: 'center',
            padding: '32px',
            background: '#0a0a0a',
          }}>
            {/* Background Image mock */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(135deg, rgba(11,11,11,0.92) 0%, rgba(24,24,24,0.7) 100%), url('${banner.imageUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0,
            }} />

            {/* Simulated Hero Content */}
            <div style={{ position: 'relative', zIndex: 1, color: 'white', maxWidth: '380px' }}>
              <div style={{ 
                fontSize: '10px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.2em', 
                color: 'var(--admin-accent)',
                fontWeight: 600,
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '12px', height: '1.5px', background: 'var(--admin-accent)', display: 'inline-block' }}></span>
                {banner.smallHeading}
              </div>
              <h2 style={{ 
                fontSize: '22px', 
                lineHeight: '1.25',
                color: 'white',
                marginBottom: '12px',
                fontWeight: 600,
                letterSpacing: '-0.5px'
              }}>
                {banner.mainHeading}
              </h2>
              <p style={{ 
                fontSize: '12.5px', 
                color: 'rgba(255,255,255,0.7)', 
                lineHeight: '1.5',
                marginBottom: '20px',
                fontWeight: 400
              }}>
                {banner.description}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: 'var(--admin-accent-gradient)',
                  color: '#000',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  {banner.primaryBtn}
                </div>
                <div style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  background: 'rgba(255,255,255,0.02)'
                }}>
                  {banner.secondaryBtn}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
