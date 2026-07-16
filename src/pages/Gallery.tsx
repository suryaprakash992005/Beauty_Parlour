import { useState, useEffect } from 'react';
import { X, ZoomIn, Sparkles } from 'lucide-react';
import { useScrollReveal } from '../components/shared';
import { SparklesText } from '../components/SparklesText';
import { getGalleryItems } from '../services/gallery';
import type { GalleryItem } from '../services/gallery';
import '../styles/gallery.css';

import GooeyNav from '../components/GooeyNav';

type GalleryCategory = 'All' | 'Bridal' | 'Hair' | 'Makeup' | 'Nails' | 'Spa';

const CATS: GalleryCategory[] = ['All', 'Bridal', 'Hair', 'Makeup', 'Nails', 'Spa'];

export default function Gallery() {
  const [active, setActive] = useState<GalleryCategory>('All');
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  
  useScrollReveal([gallery, active]);

  useEffect(() => {
    getGalleryItems()
      .then(data => {
        setGallery(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const normalizeCat = (cat: string): GalleryCategory => {
    const c = cat.toLowerCase();
    if (c.includes('bridal')) return 'Bridal';
    if (c.includes('hair')) return 'Hair';
    if (c.includes('makeup')) return 'Makeup';
    if (c.includes('nail')) return 'Nails';
    if (c.includes('spa')) return 'Spa';
    return 'All';
  };

  const filtered = active === 'All' 
    ? gallery 
    : gallery.filter(g => normalizeCat(g.category) === active);

  return (
    <main className="gallery-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero__bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80')" }} />
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Our Work</div>
          <h1 className="page-hero__title">
            <SparklesText>Beauty Gallery</SparklesText>
          </h1>
          <p className="page-hero__subtitle">A curated showcase of transformations, artistry, and luxury experiences.</p>
        </div>
      </section>

      {/* Filters */}
      <div className="services-filter">
        <div className="container">
          <div className="services-filter__inner" style={{ display: 'flex', justifyContent: 'center' }}>
            <GooeyNav
              items={CATS.map(cat => ({ label: cat, href: '#' }))}
              activeIndex={CATS.indexOf(active)}
              onChange={(index) => setActive(CATS[index])}
            />
          </div>
        </div>
      </div>

      {/* Masonry */}
      <section className="section" style={{ paddingTop: 'var(--space-4xl)' }}>
        <div className="container">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
              <div className="book-loader" style={{ width: '32px', height: '32px', borderTopColor: 'var(--color-champagne)' }} />
              <span style={{ fontSize: '14px', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Loading portfolio transformations...</span>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
              <p>{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <Sparkles size={24} style={{ color: 'var(--color-champagne)', opacity: 0.5 }} />
              <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>No photos listed under {active} category.</p>
            </div>
          ) : (
            <div className="gallery-masonry">
              {filtered.map((img, i) => (
                <div
                  key={img.id || i}
                  className={`gallery-item reveal delay-${(i % 4) + 1}`}
                  onClick={() => setLightbox(img)}
                  data-hover
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${img.title}`}
                  onKeyDown={e => e.key === 'Enter' && setLightbox(img)}
                >
                  <img src={img.url} alt={img.title} loading="lazy" className="gallery-item__img" />
                  <div className="gallery-item__overlay">
                    <ZoomIn size={24} />
                    <span>{img.title}</span>
                  </div>
                  <span className="gallery-item__cat">{normalizeCat(img.category)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true" aria-label={lightbox.title}>
          <button className="lightbox__close" onClick={() => setLightbox(null)} aria-label="Close lightbox">
            <X size={24} />
          </button>
          <div className="lightbox__img-wrap" onClick={e => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.title} className="lightbox__img" />
            <p className="lightbox__caption">{lightbox.title}</p>
          </div>
        </div>
      )}
    </main>
  );
}
