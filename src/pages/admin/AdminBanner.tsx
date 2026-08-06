import { useState, useEffect, useRef } from 'react';
import {
  Save, Eye, Check, CloudUpload,
  Trash2, Plus, Image as ImageIcon, AlertCircle, ArrowUp, ArrowDown
} from 'lucide-react';
import {
  getHomepageBanner,
  updateHomepageBanner,
  uploadHeroAsset,
  deleteHeroAsset,
} from '../../services/homepage';
import type { HomepageBanner } from '../../services/homepage';

// ─── Per-slide state ─────────────────────────────────────────────────────────
interface SlideItem {
  id: string;           // local unique key
  url: string;          // final Supabase URL (empty while pending upload)
  previewUrl: string;   // data-URL for preview before upload
  file: File | null;    // raw file pending upload
  uploading: boolean;
  uploadProgress: number;
  error: string | null;
}

function makeId() {
  return Math.random().toString(36).slice(2);
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function AdminBanner() {
  const [banner, setBanner] = useState<HomepageBanner>({
    smallHeading: 'Bespoke Hair Artistry',
    mainHeading: 'Transform Your Style, Reveal Your Confidence',
    subtitle: 'Luxury Beauty Experience',
    description:
      'Experience premium luxury hair styling, organic skincare therapies, and celebrity-grade bridal makeovers at Zha Aesthetic Salon.',
    primaryBtn: 'Book Appointment',
    secondaryBtn: 'Explore Services',
    imageUrl: '',
    slideUrls: [],
  });

  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Preview auto-advance
  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setPreviewIndex(prev => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(t);
  }, [slides.length]);

  // Load banner on mount
  useEffect(() => {
    getHomepageBanner()
      .then(data => {
        setBanner(data);
        // Populate slide list from existing slideUrls
        const initialSlides: SlideItem[] = data.slideUrls.map(url => ({
          id: makeId(),
          url,
          previewUrl: url,
          file: null,
          uploading: false,
          uploadProgress: 100,
          error: null,
        }));
        setSlides(initialSlides);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load banner settings:', err);
        setLoading(false);
      });
  }, []);

  // ── File picker ref ──────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImages = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setSlides(prev => [
          ...prev,
          {
            id: makeId(),
            url: '',
            previewUrl,
            file,
            uploading: false,
            uploadProgress: 0,
            error: null,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleAddImages(e.target.files);
    e.target.value = ''; // reset so same file can be re-added
  };

  const handleDropZone = (e: React.DragEvent) => {
    e.preventDefault();
    handleAddImages(e.dataTransfer.files);
  };

  // ── Remove slide ─────────────────────────────────────────────────────────
  const handleRemoveSlide = async (slide: SlideItem) => {
    setSlides(prev => prev.filter(s => s.id !== slide.id));
    // If already uploaded to Supabase, delete from storage
    if (slide.url && slide.url.startsWith('http')) {
      await deleteHeroAsset(slide.url).catch(() => {/* ignore */});
    }
    setPreviewIndex(0);
  };

  // ── Reorder slides ───────────────────────────────────────────────────────
  const moveSlide = (index: number, direction: -1 | 1) => {
    const newSlides = [...slides];
    const target = index + direction;
    if (target < 0 || target >= newSlides.length) return;
    [newSlides[index], newSlides[target]] = [newSlides[target], newSlides[index]];
    setSlides(newSlides);
    setPreviewIndex(target);
  };

  // ── Upload all pending slides, then save banner ──────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    try {
      // Upload any slides that still have a local file pending
      const uploaded: SlideItem[] = [];
      for (const slide of slides) {
        if (slide.file && !slide.url) {
          // Mark uploading
          setSlides(prev =>
            prev.map(s => s.id === slide.id ? { ...s, uploading: true, uploadProgress: 30 } : s)
          );
          try {
            const url = await uploadHeroAsset(slide.file);
            setSlides(prev =>
              prev.map(s =>
                s.id === slide.id ? { ...s, uploading: false, uploadProgress: 100, url, error: null } : s
              )
            );
            uploaded.push({ ...slide, url });
          } catch (err: any) {
            setSlides(prev =>
              prev.map(s =>
                s.id === slide.id
                  ? { ...s, uploading: false, error: err.message || 'Upload failed' }
                  : s
              )
            );
            throw err;
          }
        } else {
          uploaded.push(slide);
        }
      }

      const slideUrls = uploaded.map(s => s.url).filter(Boolean);
      const updated = await updateHomepageBanner({
        smallHeading: banner.smallHeading,
        mainHeading: banner.mainHeading,
        subtitle: banner.description,
        description: banner.description,
        primaryBtn: banner.primaryBtn,
        secondaryBtn: banner.secondaryBtn,
        imageUrl: slideUrls[0] || banner.imageUrl,
        slideUrls,
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

  // ─── Loading State ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div className="book-loader" style={{ width: '32px', height: '32px', borderTopColor: 'var(--admin-accent)' }} />
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="admin-page-wrapper">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Home Banner Management</h2>
          <p className="admin-page-desc">
            Manage hero slideshow images and banner text. Add multiple images — they will transition smoothly one by one.
          </p>
        </div>
      </div>

      <div className="admin-banner-grid">
        {/* ── Left: Editor Form ── */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

          {/* ── Slideshow Images Section ── */}
          <div className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 className="admin-card__title" style={{ margin: 0 }}>
                Hero Slideshow Images
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {slides.length} slide{slides.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Drop Zone */}
            <div
              style={{
                border: '2px dashed var(--color-border)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: 'rgba(255,255,255,0.01)',
                marginBottom: slides.length > 0 ? '16px' : 0,
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDropZone}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileInput}
              />
              <CloudUpload size={24} style={{ color: 'var(--color-champagne)', marginBottom: '6px' }} />
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>
                Click or drag to add images
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                PNG, JPG, WEBP — multiple files supported
              </div>
            </div>

            {/* Slide Grid */}
            {slides.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {slides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '56px 1fr auto',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: previewIndex === idx ? 'rgba(212,175,55,0.06)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${previewIndex === idx ? 'rgba(212,175,55,0.3)' : 'var(--color-border)'}`,
                      cursor: 'pointer',
                    }}
                    onClick={() => setPreviewIndex(idx)}
                  >
                    {/* Thumbnail */}
                    <div style={{ width: '56px', height: '38px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                      {slide.previewUrl ? (
                        <img
                          src={slide.previewUrl}
                          alt={`Slide ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ImageIcon size={14} style={{ color: 'var(--color-text-muted)' }} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '2px' }}>
                        Slide {idx + 1}
                        {idx === 0 && (
                          <span style={{ marginLeft: '6px', fontSize: '10px', color: 'var(--color-champagne)', fontWeight: 500 }}>(Cover)</span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {slide.uploading ? (
                          <span style={{ color: 'var(--color-champagne)' }}>Uploading…</span>
                        ) : slide.error ? (
                          <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertCircle size={10} /> {slide.error}
                          </span>
                        ) : slide.url ? (
                          <span style={{ color: '#22c55e' }}>Uploaded ✓</span>
                        ) : (
                          <span style={{ color: 'var(--color-champagne)' }}>Pending save</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      <button
                        type="button"
                        title="Move up"
                        disabled={idx === 0}
                        onClick={e => { e.stopPropagation(); moveSlide(idx, -1); }}
                        style={{
                          width: '26px', height: '26px', borderRadius: '6px', border: 'none',
                          background: idx === 0 ? 'transparent' : 'rgba(255,255,255,0.05)',
                          color: idx === 0 ? 'var(--color-border)' : 'white',
                          cursor: idx === 0 ? 'default' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        title="Move down"
                        disabled={idx === slides.length - 1}
                        onClick={e => { e.stopPropagation(); moveSlide(idx, 1); }}
                        style={{
                          width: '26px', height: '26px', borderRadius: '6px', border: 'none',
                          background: idx === slides.length - 1 ? 'transparent' : 'rgba(255,255,255,0.05)',
                          color: idx === slides.length - 1 ? 'var(--color-border)' : 'white',
                          cursor: idx === slides.length - 1 ? 'default' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        type="button"
                        title="Remove slide"
                        onClick={e => { e.stopPropagation(); handleRemoveSlide(slide); }}
                        style={{
                          width: '26px', height: '26px', borderRadius: '6px', border: 'none',
                          background: 'rgba(239,68,68,0.08)',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {slides.length === 0 && (
              <div style={{ textAlign: 'center', padding: '12px 0 4px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                No slides yet — add at least one image.
              </div>
            )}

            {/* Add More Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                marginTop: '12px',
                width: '100%',
                padding: '9px',
                borderRadius: '8px',
                border: '1px dashed var(--color-border)',
                background: 'transparent',
                color: 'var(--color-champagne)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Plus size={14} /> Add More Images
            </button>
          </div>

          {/* ── Banner Text Config ── */}
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <h3 className="admin-card__title">Banner Text & CTAs</h3>

            <div className="form-group">
              <label className="form-label" htmlFor="banner-smallHeading">Small Top Label (Eyebrow)</label>
              <input
                id="banner-smallHeading"
                className="form-input"
                value={banner.smallHeading}
                onChange={e => setBanner(prev => ({ ...prev, smallHeading: e.target.value }))}
                placeholder="e.g. ZHA Aesthetic Salon"
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
              <label className="form-label" htmlFor="banner-description">Hero Subtitle / Description</label>
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

            <div className="admin-grid-2col">
              <div className="form-group">
                <label className="form-label" htmlFor="banner-primaryBtn">Primary Button</label>
                <input
                  id="banner-primaryBtn"
                  className="form-input"
                  value={banner.primaryBtn}
                  onChange={e => setBanner(prev => ({ ...prev, primaryBtn: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="banner-secondaryBtn">Secondary Button</label>
                <input
                  id="banner-secondaryBtn"
                  className="form-input"
                  value={banner.secondaryBtn}
                  onChange={e => setBanner(prev => ({ ...prev, secondaryBtn: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* ── Save Button ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={saving || slides.length === 0}
                style={{ fontSize: '0.82rem' }}
              >
                <Save size={14} /> {saving ? 'Saving…' : 'Save Banner'}
              </button>
              {saved && (
                <div style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
                  <Check size={16} /> Banner updated successfully!
                </div>
              )}
              {slides.length === 0 && !saving && (
                <div style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>
                  Add at least one slide image to save.
                </div>
              )}
            </div>
            {errorMsg && (
              <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
                <AlertCircle size={14} /> {errorMsg}
              </div>
            )}
          </div>
        </form>

        {/* ── Right: Live Preview ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-accent)' }}>
              <Eye size={16} />
              <strong style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em', fontWeight: 600 }}>
                Live Hero Preview
              </strong>
            </div>
            {slides.length > 1 && (
              <div style={{ display: 'flex', gap: '6px' }}>
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPreviewIndex(i)}
                    style={{
                      width: i === previewIndex ? '20px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      border: 'none',
                      background: i === previewIndex ? 'var(--color-champagne)' : 'rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div
            style={{
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
            }}
          >
            {/* Background Image with fade */}
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `linear-gradient(135deg, rgba(11,11,11,0.88) 0%, rgba(24,24,24,0.65) 100%), url('${slide.previewUrl}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: i === previewIndex ? 1 : 0,
                  transition: 'opacity 0.8s ease',
                  zIndex: i === previewIndex ? 1 : 0,
                }}
              />
            ))}

            {/* No slides placeholder */}
            {slides.length === 0 && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-muted)',
                  gap: '8px',
                  zIndex: 1,
                }}
              >
                <ImageIcon size={32} style={{ opacity: 0.4 }} />
                <span style={{ fontSize: '13px' }}>No images added yet</span>
              </div>
            )}

            {/* Hero Content Preview */}
            <div style={{ position: 'relative', zIndex: 2, color: 'white', maxWidth: '380px' }}>
              <div style={{
                fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em',
                color: 'var(--admin-accent)', fontWeight: 600, marginBottom: '8px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span style={{ width: '12px', height: '1.5px', background: 'var(--admin-accent)', display: 'inline-block' }} />
                {banner.smallHeading}
              </div>
              <h2 style={{ fontSize: '22px', lineHeight: '1.25', color: 'white', marginBottom: '12px', fontWeight: 600 }}>
                {banner.mainHeading}
              </h2>
              <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', marginBottom: '20px' }}>
                {banner.description}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{
                  padding: '8px 16px', borderRadius: '6px', background: 'var(--admin-accent-gradient)',
                  color: '#000', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                }}>
                  {banner.primaryBtn}
                </div>
                <div style={{
                  padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white', fontSize: '11px', fontWeight: 600,
                }}>
                  {banner.secondaryBtn}
                </div>
              </div>
            </div>

            {/* Slide count badge */}
            {slides.length > 0 && (
              <div style={{
                position: 'absolute', bottom: '12px', right: '12px', zIndex: 2,
                fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 600,
                background: 'rgba(0,0,0,0.4)', padding: '3px 8px', borderRadius: '100px',
              }}>
                {previewIndex + 1} / {slides.length}
              </div>
            )}
          </div>

          {/* Hint */}
          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center', margin: 0 }}>
            Preview auto-advances every 3 seconds. Slides transition at 5.5s on the live site.
          </p>
        </div>
      </div>
    </div>
  );
}
