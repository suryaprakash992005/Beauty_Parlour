import { useState, useEffect } from 'react';
import { X, ZoomIn, Sparkles } from 'lucide-react';
import { SparklesText } from '../components/SparklesText';
import { getGalleryItems } from '../services/gallery';
import type { GalleryItem } from '../services/gallery';
import Masonry from '../components/Masonry';
import '../styles/gallery.css';

type GalleryCategory = 'All' | 'Bridal' | 'Hair' | 'Makeup' | 'Nails' | 'Spa';

const CATS: GalleryCategory[] = ['All', 'Bridal', 'Hair', 'Makeup', 'Nails', 'Spa'];

export default function Gallery() {
  const [active, setActive] = useState<GalleryCategory>('All');
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    getGalleryItems()
      .then(data => {
        setGallery(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load gallery:', err);
        setError('Unable to load gallery photos at this time.');
        setLoading(false);
      });
  }, []);

  const normalizeCat = (dbCat: string): GalleryCategory => {
    const c = dbCat.toLowerCase().trim();
    if (c.includes('hair')) return 'Hair';
    if (c.includes('bridal')) return 'Bridal';
    if (c.includes('makeup')) return 'Makeup';
    if (c.includes('nails')) return 'Nails';
    if (c.includes('spa') || c.includes('skin')) return 'Spa';
    return 'All';
  };

  const filtered = active === 'All' 
    ? gallery 
    : gallery.filter(g => normalizeCat(g.category) === active);

  // Map the Supabase items to standard Masonry items with custom staggered heights
  const masonryItems = filtered.map((img, i) => {
    const heights = [580, 680, 780, 630];
    const height = heights[i % heights.length];
    return {
      id: String(img.id || i),
      img: img.url,
      url: '#',
      height: height,
      rawItem: img
    };
  });

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
          <div className="services-filter__inner">
            {CATS.map(cat => (
              <button
                key={cat}
                id={`gallery-filter-${cat}`}
                className={`services-filter__btn${active === cat ? ' active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
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
            <Masonry
              items={masonryItems}
              ease="power3.out"
              duration={0.6}
              stagger={0.05}
              animateFrom="bottom"
              scaleOnHover={true}
              hoverScale={0.97}
              blurToFocus={true}
              onItemClick={(item) => setLightbox(item.rawItem)}
              renderItem={(item) => (
                <>
                  <div className="gallery-item__overlay" style={{ opacity: 1, background: 'rgba(62, 39, 35, 0.45)' }}>
                    <ZoomIn size={24} />
                    <span>{item.rawItem.title}</span>
                  </div>
                  <span className="gallery-item__cat">{normalizeCat(item.rawItem.category)}</span>
                </>
              )}
            />
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
