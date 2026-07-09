import { useState, useEffect } from 'react';
import { Filter, Sparkles } from 'lucide-react';
import { useScrollReveal } from '../components/shared';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';
import { SparklesText } from '../components/SparklesText';
import { getServices } from '../services/services';
import type { ServiceItem } from '../services/services';
import '../styles/services.css';

type Category = 'All' | 'Hair Care' | 'Skin Care' | 'Makeup' | 'Bridal' | 'Spa' | 'Nails';

const CATEGORIES: Category[] = ['All', 'Hair Care', 'Skin Care', 'Makeup', 'Bridal', 'Spa', 'Nails'];

export default function Services() {
  const [active, setActive] = useState<Category>('All');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useScrollReveal();

  useEffect(() => {
    getServices()
      .then(data => {
        // Filter active services only for customer-facing list
        setServices(data.filter(s => s.active !== false));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load services:', err);
        setError('Unable to load services at this time.');
        setLoading(false);
      });
  }, []);

  const filtered = active === 'All' 
    ? services 
    : services.filter(s => s.category.toLowerCase().trim() === active.toLowerCase().trim());

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
            {CATEGORIES.map(cat => (
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
              <div className="book-loader" style={{ width: '32px', height: '32px', borderTopColor: 'var(--color-champagne)' }} />
              <span style={{ fontSize: '14px', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Loading luxury offerings...</span>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
              <p>{error}</p>
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
                    <img src={s.imageUrl} alt={s.name} loading="lazy" className="service-card-full__img" />
                    <span className="service-card-full__cat">{s.category}</span>
                  </div>
                  <div className="service-card-full__body">
                    <h3 className="service-card-full__name">{s.name}</h3>
                    <p className="service-card-full__desc">{s.description}</p>
                    <div className="service-card-full__meta">
                      <span className="service-card-full__dur">⏱ {s.duration}</span>
                      <span className="service-card-full__price">{s.price.startsWith('₹') ? s.price : `₹${s.price}`} <small>onwards</small></span>
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
