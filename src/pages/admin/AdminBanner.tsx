import { useState, useEffect, useRef } from 'react';
import {
  CloudUpload, Trash2, GripVertical, Plus, Eye, EyeOff,
  CheckCircle, AlertCircle, X
} from 'lucide-react';
import {
  getAllBannerSlides,
  addBannerSlide,
  deleteBannerSlide,
  reorderBannerSlides,
  toggleBannerSlide,
  uploadBannerImage,
} from '../../services/homepage';
import type { BannerSlide } from '../../services/homepage';

/* ── Small toast ── */
function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      background: type === 'success' ? '#064e3b' : '#450a0a',
      border: `1px solid ${type === 'success' ? '#22c55e' : '#ef4444'}`,
      color: 'white', padding: '12px 20px', borderRadius: '10px',
      display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)', animation: 'zoomIn 0.25s ease'
    }}>
      {type === 'success'
        ? <CheckCircle size={16} style={{ color: '#22c55e', flexShrink: 0 }} />
        : <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
      }
      {msg}
    </div>
  );
}

export default function AdminBanner() {
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActiveUpload, setDragActiveUpload] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Drag-to-reorder state
  const dragItemRef = useRef<number | null>(null);
  const dragOverRef = useRef<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getAllBannerSlides();
      setSlides(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load slides', 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── Upload new slide ──────────────────────────────────────────
  async function handleUpload(file: File) {
    if (!file.type.startsWith('image/')) {
      showToast('Only image files are allowed.', 'error');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadBannerImage(file);
      const nextOrder = slides.length > 0 ? Math.max(...slides.map(s => s.sortOrder)) + 1 : 0;
      const newSlide = await addBannerSlide(url, nextOrder);
      setSlides(prev => [...prev, newSlide]);
      showToast('Slide added successfully!');
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  }

  function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) Array.from(files).forEach(handleUpload);
    e.target.value = '';
  }

  function onDragOver(e: React.DragEvent) { e.preventDefault(); setDragActiveUpload(true); }
  function onDragLeave() { setDragActiveUpload(false); }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActiveUpload(false);
    if (e.dataTransfer.files) Array.from(e.dataTransfer.files).forEach(handleUpload);
  }

  // ── Delete ────────────────────────────────────────────────────
  async function handleDelete(id: number) {
    if (!confirm('Delete this banner slide? This cannot be undone.')) return;
    try {
      await deleteBannerSlide(id);
      setSlides(prev => prev.filter(s => s.id !== id));
      showToast('Slide deleted.');
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  }

  // ── Toggle visible/hidden ────────────────────────────────────
  async function handleToggle(slide: BannerSlide) {
    try {
      await toggleBannerSlide(slide.id, !slide.isActive);
      setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, isActive: !s.isActive } : s));
      showToast(slide.isActive ? 'Slide hidden.' : 'Slide visible.');
    } catch (err: any) {
      showToast(err.message || 'Toggle failed', 'error');
    }
  }

  // ── Drag-to-reorder ──────────────────────────────────────────
  function onDragStart(idx: number) { dragItemRef.current = idx; }
  function onDragEnterCard(idx: number) { dragOverRef.current = idx; }

  async function onDragEnd() {
    const from = dragItemRef.current;
    const to   = dragOverRef.current;
    if (from === null || to === null || from === to) {
      dragItemRef.current = null;
      dragOverRef.current = null;
      return;
    }

    const reordered = [...slides];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    // Assign sequential sort orders
    const updated = reordered.map((s, i) => ({ ...s, sortOrder: i }));
    setSlides(updated);
    dragItemRef.current = null;
    dragOverRef.current = null;

    try {
      await reorderBannerSlides(updated.map(s => ({ id: s.id, sortOrder: s.sortOrder })));
      showToast('Order saved!');
    } catch (err: any) {
      showToast(err.message || 'Reorder failed', 'error');
      load(); // rollback
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div className="book-loader" style={{ width: '32px', height: '32px', borderTopColor: 'var(--admin-accent)' }} />
      </div>
    );
  }

  return (
    <div className="admin-page-wrapper">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Full-screen preview overlay */}
      {previewUrl && (
        <div
          onClick={() => setPreviewUrl(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out'
          }}
        >
          <button
            onClick={() => setPreviewUrl(null)}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
              borderRadius: '50%', width: '40px', height: '40px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '12px', objectFit: 'contain' }}
          />
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Banner Slides</h2>
          <p className="admin-page-desc">
            Upload images, drag to reorder, and toggle visibility. Images appear on the home page hero slider.
          </p>
        </div>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
          {slides.filter(s => s.isActive).length} active · {slides.length} total slides
        </div>
      </div>

      {/* ── Upload Zone ── */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActiveUpload ? 'var(--admin-accent)' : 'var(--admin-border)'}`,
          borderRadius: '16px',
          background: dragActiveUpload ? 'rgba(34,197,94,0.04)' : 'rgba(255,255,255,0.01)',
          padding: '40px 32px',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.25s',
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={onFileInputChange}
          disabled={uploading}
        />

        {uploading ? (
          <>
            <div className="book-loader" style={{ width: '28px', height: '28px', borderTopColor: 'var(--admin-accent)' }} />
            <strong style={{ color: 'white', fontSize: '14px' }}>Uploading…</strong>
          </>
        ) : (
          <>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'rgba(34,197,94,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Plus size={26} style={{ color: 'var(--admin-accent)' }} />
            </div>
            <strong style={{ color: 'white', fontSize: '15px' }}>Add Banner Images</strong>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
              Drag & drop images here, or <span style={{ color: 'var(--admin-accent)', fontWeight: 600 }}>click to browse</span>
            </span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginTop: '-4px' }}>
              Supports JPG, PNG, WebP · Multiple files allowed
            </span>
          </>
        )}
      </div>

      {/* ── Slides Grid ── */}
      {slides.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          color: 'var(--color-text-muted)', fontSize: '14px'
        }}>
          <CloudUpload size={42} style={{ opacity: 0.3, marginBottom: '12px', display: 'block', margin: '0 auto 12px' }} />
          <p>No banner slides yet.</p>
          <p style={{ marginTop: '4px', opacity: 0.6 }}>Upload your first image above to get started.</p>
        </div>
      ) : (
        <>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            <GripVertical size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            Drag cards to reorder — changes are saved automatically.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px',
          }}>
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragEnter={() => onDragEnterCard(idx)}
                onDragEnd={onDragEnd}
                style={{
                  background: 'var(--admin-card-bg)',
                  border: `1px solid ${slide.isActive ? 'var(--admin-border)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: '14px',
                  overflow: 'hidden',
                  opacity: slide.isActive ? 1 : 0.45,
                  transition: 'opacity 0.3s, transform 0.2s',
                  cursor: 'grab',
                  userSelect: 'none',
                }}
              >
                {/* Slide image */}
                <div
                  onClick={() => setPreviewUrl(slide.imageUrl)}
                  style={{
                    position: 'relative',
                    aspectRatio: '16/9',
                    overflow: 'hidden',
                    background: '#111',
                    cursor: 'zoom-in',
                  }}
                >
                  <img
                    src={slide.imageUrl}
                    alt={`Slide ${idx + 1}`}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Order badge */}
                  <div style={{
                    position: 'absolute', top: '10px', left: '10px',
                    background: 'rgba(0,0,0,0.75)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white', padding: '3px 10px',
                    borderRadius: '100px', fontSize: '12px', fontWeight: 700,
                    backdropFilter: 'blur(4px)',
                  }}>
                    #{idx + 1}
                  </div>
                  {!slide.isActive && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(0,0,0,0.45)',
                    }}>
                      <EyeOff size={28} style={{ color: 'rgba(255,255,255,0.5)' }} />
                    </div>
                  )}
                </div>

                {/* Actions row */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  gap: '8px',
                }}>
                  {/* Drag handle hint */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '12px', minWidth: 0, overflow: 'hidden' }}>
                    <GripVertical size={14} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {slide.isActive ? 'Visible' : 'Hidden'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    {/* Toggle visibility */}
                    <button
                      onClick={() => handleToggle(slide)}
                      title={slide.isActive ? 'Hide slide' : 'Show slide'}
                      style={{
                        width: '32px', height: '32px',
                        borderRadius: '8px',
                        background: slide.isActive ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${slide.isActive ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
                        color: slide.isActive ? '#22c55e' : 'rgba(255,255,255,0.4)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      {slide.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(slide.id)}
                      title="Delete slide"
                      style={{
                        width: '32px', height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
