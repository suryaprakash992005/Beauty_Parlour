import { useState } from 'react';
import { Filter, Sparkles } from 'lucide-react';
import { useScrollReveal } from '../components/shared';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';
import { SparklesText } from '../components/SparklesText';
import { useServices } from '../hooks/useServices';
import '../styles/services.css';

const fallbackImage = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80';

export default function Services() {
  const { services, categories, loading, error } = useServices();
  const [active, setActive] = useState<string>('All');

  useScrollReveal();

  const filterCategories = ['All', ...categories];

  const filtered = active === 'All' 
    ? services 
    : services.filter(s => s.category.toLowerCase().trim() === active.toLowerCase().trim());

  const renderSkeletons = () => (
    <div className="services-grid-full">
      {Array.from({ length: 6 }).map((_, i) => (
        <article key={i} className="service-card-full skeleton-loading">
          <div className="service-card-full__img-wrap skeleton-element" style={{ height: '240px' }} />
          <div className="service-card-full__body">
            <div className="skeleton-element" style={{ height: '24px', width: '65%', borderRadius: '4px' }} />
            <div className="skeleton-element" style={{ height: '16px', width: '100%', borderRadius: '4px', marginTop: '12px' }} />
            <div className="skeleton-element" style={{ height: '16px', width: '85%', borderRadius: '4px', marginTop: '6px' }} />
            <div className="skeleton-element" style={{ height: '32px', width: '100%', borderRadius: '4px', marginTop: '20px' }} />
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <main className="services-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero__bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&q=80')" }} />
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Our Offerings</div>
          <h1 className="page-hero__title">
            <SparklesText>Luxury Services</SparklesText>
          </h1>
          <p className="page-hero__subtitle">
            Premium hair and beauty services crafted to perfection by ZHA Hair Saloon.
          </p>
        </div>
      </section>

      {/* Filter */}
      <div className="services-filter">
        <div className="container">
          <div className="services-filter__inner">
            <Filter size={14} style={{ color: 'var(--color-rose-gold)' }} />
            {filterCategories.map(cat => (
              <button
                key={cat}
                id={`filter-${cat.replace(' ', '-')}`}
                className={`services-filter__btn${active === cat ? ' active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="section" style={{ paddingTop: 'var(--space-4xl)' }}>
        <div className="container">
          {loading ? (
            renderSkeletons()
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
              <p>{error}</p>
            </div>
          ) : services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <Sparkles size={32} style={{ color: 'var(--color-champagne)', opacity: 0.6 }} />
              <h3 className="font-serif" style={{ fontSize: '24px', color: 'var(--color-text)' }}>No Offerings Listed</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', maxWidth: '400px', marginInline: 'auto' }}>
                We are currently updating our luxury portfolio. Please check back shortly or contact our front desk.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <Sparkles size={24} style={{ color: 'var(--color-champagne)', opacity: 0.5 }} />
              <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>No service offerings listed under {active} category.</p>
            </div>
          ) : (
            <div className="services-grid-full">
              {filtered.map((s, i) => (
                <article key={s.id || i} className={`service-card-full reveal delay-${(i % 4) + 1}`}>
                  <div className="service-card-full__img-wrap">
                    <img 
                      src={s.imageUrl || fallbackImage} 
                      alt={s.name} 
                      loading="lazy" 
                      className="service-card-full__img" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImage;
                      }}
                    />
                    <span className="service-card-full__cat">{s.category}</span>
                  </div>
                  <div className="service-card-full__body">
                    <h3 className="service-card-full__name">{s.name}</h3>
                    <p className="service-card-full__desc">{s.description}</p>
                    <div className="service-card-full__meta">
                      <span className="service-card-full__dur">⏱ {s.duration}</span>
                      <span className="service-card-full__price">{s.price && String(s.price).startsWith('₹') ? s.price : `₹${s.price || '0'}`} <small>onwards</small></span>
                    </div>
                    <InteractiveHoverButton to="/book-appointment" className="service-card-full__cta">
                      Book Now
                    </InteractiveHoverButton>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
