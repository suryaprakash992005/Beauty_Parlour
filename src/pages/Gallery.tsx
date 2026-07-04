import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { useScrollReveal } from '../components/shared';
import '../styles/gallery.css';

type GalleryCategory = 'All' | 'Bridal' | 'Hair' | 'Makeup' | 'Nails' | 'Spa';

const GALLERY = [
  { id: 1,  cat: 'Bridal', alt: 'Bridal Makeup',       img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',  tall: true  },
  { id: 2,  cat: 'Hair',   alt: 'Hair Styling',        img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80',  tall: false },
  { id: 3,  cat: 'Makeup', alt: 'Party Makeup',        img: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80',  tall: false },
  { id: 4,  cat: 'Nails',  alt: 'Nail Art',            img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',  tall: true  },
  { id: 5,  cat: 'Spa',    alt: 'Spa Treatment',       img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',  tall: false },
  { id: 6,  cat: 'Hair',   alt: 'Hair Coloring',       img: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80',  tall: true  },
  { id: 7,  cat: 'Bridal', alt: 'Saree Draping',       img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80',  tall: false },
  { id: 8,  cat: 'Hair',   alt: 'Hair Spa',            img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',  tall: false },
  { id: 9,  cat: 'Makeup', alt: 'Eye Makeup',          img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80',  tall: true  },
  { id: 10, cat: 'Spa',    alt: 'Luxury Facial',       img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',  tall: false },
  { id: 11, cat: 'Bridal', alt: 'Bridal Hair',         img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80',  tall: false },
  { id: 12, cat: 'Hair',   alt: 'Keratin Treatment',   img: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&q=80',  tall: true  },
  { id: 13, cat: 'Makeup', alt: 'Glam Makeup',         img: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?w=600&q=80',  tall: false },
  { id: 14, cat: 'Nails',  alt: 'Gel Nails',           img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&fit=crop&crop=bottom',  tall: false },
  { id: 15, cat: 'Spa',    alt: 'Body Massage',        img: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80',  tall: true  },
  { id: 16, cat: 'Bridal', alt: 'Reception Look',      img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80',  tall: false },
];

const CATS: GalleryCategory[] = ['All', 'Bridal', 'Hair', 'Makeup', 'Nails', 'Spa'];

export default function Gallery() {
  const [active, setActive]   = useState<GalleryCategory>('All');
  const [lightbox, setLightbox] = useState<typeof GALLERY[0] | null>(null);
  useScrollReveal();

  const filtered = active === 'All' ? GALLERY : GALLERY.filter(g => g.cat === active);

  return (
    <main className="gallery-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero__bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80')" }} />
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Our Work</div>
          <h1 className="page-hero__title">Beauty Gallery</h1>
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
          <div className="gallery-masonry">
            {filtered.map((img, i) => (
              <div
                key={img.id}
                className={`gallery-item reveal delay-${(i % 4) + 1}${img.tall ? ' gallery-item--tall' : ''}`}
                onClick={() => setLightbox(img)}
                data-hover
                role="button"
                tabIndex={0}
                aria-label={`View ${img.alt}`}
                onKeyDown={e => e.key === 'Enter' && setLightbox(img)}
              >
                <img src={img.img} alt={img.alt} loading="lazy" className="gallery-item__img" />
                <div className="gallery-item__overlay">
                  <ZoomIn size={24} />
                  <span>{img.alt}</span>
                </div>
                <span className="gallery-item__cat">{img.cat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true" aria-label={lightbox.alt}>
          <button className="lightbox__close" onClick={() => setLightbox(null)} aria-label="Close lightbox">
            <X size={24} />
          </button>
          <div className="lightbox__img-wrap" onClick={e => e.stopPropagation()}>
            <img src={lightbox.img.replace('w=600', 'w=1200')} alt={lightbox.alt} className="lightbox__img" />
            <p className="lightbox__caption">{lightbox.alt}</p>
          </div>
        </div>
      )}
    </main>
  );
}
