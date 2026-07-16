import { useState, useEffect } from 'react';
import { Save, Eye, Check, CloudUpload, CheckCircle, Video } from 'lucide-react';
import { getHomepageBanner, updateHomepageBanner, uploadHeroAsset } from '../../services/homepage';
import type { HomepageBanner } from '../../services/homepage';

export default function AdminBanner() {
  const [banner, setBanner] = useState<HomepageBanner>({
    smallHeading: 'Bespoke Hair Artistry',
    mainHeading: 'Transform Your Style, Reveal Your Confidence',
    description: 'Experience premium luxury hair styling, organic skincare therapies, and celebrity-grade bridal makeovers at ZHA Hair Saloon.',
    primaryBtn: 'Book Appointment',
    secondaryBtn: 'Explore Services',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
    videoUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Uploader drag and progress states
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [videoDragActive, setVideoDragActive] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number | null>(null);
  const [videoUploadSuccess, setVideoUploadSuccess] = useState(false);

  useEffect(() => {
    getHomepageBanner()
      .then(data => {
        setBanner(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load banner settings:', err);
        setLoading(false);
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setUploadProgress(30);
      const t1 = setTimeout(() => setUploadProgress(75), 150);
      const t2 = setTimeout(() => setUploadProgress(100), 300);
      reader.onloadend = () => {
        setBanner(prev => ({ ...prev, imageUrl: reader.result as string }));
        setUploadSuccess(true);
        clearTimeout(t1);
        clearTimeout(t2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setVideoUploadProgress(30);
      const t1 = setTimeout(() => setVideoUploadProgress(75), 200);
      const t2 = setTimeout(() => setVideoUploadProgress(100), 400);
      reader.onloadend = () => {
        setBanner(prev => ({ ...prev, videoUrl: reader.result as string }));
        setVideoUploadSuccess(true);
        clearTimeout(t1);
        clearTimeout(t2);
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
      const t1 = setTimeout(() => setUploadProgress(60), 200);
      const t2 = setTimeout(() => setUploadProgress(100), 400);
      reader.onloadend = () => {
        setBanner(prev => ({ ...prev, imageUrl: reader.result as string }));
        setUploadSuccess(true);
        clearTimeout(t1);
        clearTimeout(t2);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateUpload = () => {
    document.getElementById('banner-image-file')?.click();
  };

  const handleVideoDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setVideoDragActive(true);
    } else if (e.type === "dragleave") {
      setVideoDragActive(false);
    }
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVideoDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      setVideoUploadProgress(20);
      const t1 = setTimeout(() => setVideoUploadProgress(60), 250);
      const t2 = setTimeout(() => setVideoUploadProgress(100), 500);
      reader.onloadend = () => {
        setBanner(prev => ({ ...prev, videoUrl: reader.result as string }));
        setVideoUploadSuccess(true);
        clearTimeout(t1);
        clearTimeout(t2);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateVideoUpload = () => {
    document.getElementById('banner-video-file')?.click();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      let finalImageUrl = banner.imageUrl;
      if (banner.imageUrl && banner.imageUrl.startsWith('data:')) {
        finalImageUrl = await uploadHeroAsset(banner.imageUrl, false);
      }

      let finalVideoUrl = banner.videoUrl;
      if (banner.videoUrl && banner.videoUrl.startsWith('data:')) {
        finalVideoUrl = await uploadHeroAsset(banner.videoUrl, true);
      }

      const updated = await updateHomepageBanner({
        smallHeading: banner.smallHeading,
        mainHeading: banner.mainHeading,
        description: banner.description,
        primaryBtn: banner.primaryBtn,
        secondaryBtn: banner.secondaryBtn,
        imageUrl: finalImageUrl,
        videoUrl: finalVideoUrl
      });

      setBanner(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error('Error saving banner settings:', err);
      setErrorMsg(err.message || String(err));
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            {/* Image Upload Zone */}
            <div className="form-group">
              <label className="form-label">Hero Background Image</label>
              <input 
                type="file" 
                id="banner-image-file"
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
                  padding: 'var(--space-xl)',
                  minHeight: '160px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {uploadProgress === null ? (
                  <>
                    <CloudUpload size={32} style={{ color: 'var(--color-champagne)', marginBottom: '8px' }} />
                    <strong style={{ display: 'block', fontSize: '0.8rem', color: 'white', marginBottom: '2px' }}>Drag & Drop Image</strong>
                    <span style={{ fontSize: '0.68rem', color: 'var(--color-text-light)' }}>or click to upload image</span>
                  </>
                ) : !uploadSuccess ? (
                  <div style={{ width: '100%' }}>
                    <div className="book-loader" style={{ width: '22px', height: '22px', borderTopColor: 'var(--color-champagne)', marginBottom: '8px' }}></div>
                    <strong style={{ display: 'block', fontSize: '0.8rem', color: 'white', marginBottom: '4px' }}>Uploading...</strong>
                    <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'var(--color-champagne)', width: `${uploadProgress}%`, transition: 'width 0.15s ease' }}></div>
                    </div>
                  </div>
                ) : (
                  <div style={{ animation: 'zoomIn 0.3s ease' }}>
                    <CheckCircle size={32} style={{ color: '#22c55e', marginBottom: '8px' }} />
                    <strong style={{ display: 'block', fontSize: '0.8rem', color: 'white', marginBottom: '2px' }}>Image Loaded!</strong>
                    <span style={{ fontSize: '0.68rem', color: '#22c55e', fontWeight: 600 }}>Ready to save</span>
                  </div>
                )}
              </div>
            </div>

            {/* Video Upload Zone */}
            <div className="form-group">
              <label className="form-label">Hero Video Cover (Optional)</label>
              <input 
                type="file" 
                id="banner-video-file"
                accept="video/*" 
                onChange={handleVideoFileChange}
                style={{ display: 'none' }}
              />
              <div 
                className={`admin-drag-drop-zone ${videoDragActive ? 'active' : ''}`}
                onDragEnter={handleVideoDrag}
                onDragOver={handleVideoDrag}
                onDragLeave={handleVideoDrag}
                onDrop={handleVideoDrop}
                onClick={simulateVideoUpload}
                style={{
                  border: '2px dashed var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  background: 'rgba(255, 255, 255, 0.01)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--space-xl)',
                  minHeight: '160px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {videoUploadProgress === null ? (
                  <>
                    <Video size={32} style={{ color: 'var(--color-champagne)', marginBottom: '8px' }} />
                    <strong style={{ display: 'block', fontSize: '0.8rem', color: 'white', marginBottom: '2px' }}>Drag & Drop Video</strong>
                    <span style={{ fontSize: '0.68rem', color: 'var(--color-text-light)' }}>or click to upload video</span>
                  </>
                ) : !videoUploadSuccess ? (
                  <div style={{ width: '100%' }}>
                    <div className="book-loader" style={{ width: '22px', height: '22px', borderTopColor: 'var(--color-champagne)', marginBottom: '8px' }}></div>
                    <strong style={{ display: 'block', fontSize: '0.8rem', color: 'white', marginBottom: '4px' }}>Uploading...</strong>
                    <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'var(--color-champagne)', width: `${videoUploadProgress}%`, transition: 'width 0.15s ease' }}></div>
                    </div>
                  </div>
                ) : (
                  <div style={{ animation: 'zoomIn 0.3s ease' }}>
                    <CheckCircle size={32} style={{ color: '#22c55e', marginBottom: '8px' }} />
                    <strong style={{ display: 'block', fontSize: '0.8rem', color: 'white', marginBottom: '2px' }}>Video Loaded!</strong>
                    <span style={{ fontSize: '0.68rem', color: '#22c55e', fontWeight: 600 }}>Ready to save</span>
                  </div>
                )}
              </div>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <button className="btn btn-primary" type="submit" disabled={saving} style={{ fontSize: '0.82rem' }}>
                <Save size={14} /> {saving ? 'Saving...' : 'Update Banner'}
              </button>
              {saved && (
                <div style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
                  <Check size={16} /> Banner updated successfully!
                </div>
              )}
            </div>
            {errorMsg && (
              <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', marginTop: '4px' }}>
                ✕ {errorMsg}
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
