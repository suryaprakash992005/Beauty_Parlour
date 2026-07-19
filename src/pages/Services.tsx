import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useScrollReveal } from '../components/shared';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';
import { SparklesText } from '../components/SparklesText';
import { getServices } from '../services/services';
import type { ServiceItem } from '../services/services';
import PillNav from '../components/PillNav';
import '../styles/services.css';

type Category = 'All' | 'Hair Care' | 'Skin Care' | 'Makeup' | 'Bridal' | 'Spa' | 'Nails';

const CATEGORIES: Category[] = ['All', 'Hair Care', 'Skin Care', 'Makeup', 'Bridal', 'Spa', 'Nails'];

export default function Services() {
  const [active, setActive] = useState<Category>('All');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useScrollReveal([services, active]);

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

  const filtered = services.filter(s => {
    const matchesCategory = active === 'All' || s.category.toLowerCase().trim() === active.toLowerCase().trim();
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Map categories to PillNav items
  const pillNavItems = CATEGORIES.map(cat => ({
    label: cat,
    href: `#${cat}`
  }));

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
            Premium hair and beauty services crafted to perfection by Zha Aesthetic Salon.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="services-filter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md) 16px', borderBottom: '1px solid var(--color-border)' }}>
        <PillNav
          items={pillNavItems}
          activeHref={`#${active}`}
          relative={true}
          baseColor="#1e1510"
          pillColor="transparent"
          hoveredPillTextColor="#1e1510"
          pillTextColor="var(--color-champagne)"
          onItemClick={(item) => setActive(item.label as Category)}
          initialLoadAnimation={false}
          disableMobileCollapse={true}
        />
        
        {/* Search Space */}
        <div className="services-search-container" style={{ width: '100%', maxWidth: '480px', position: 'relative', marginTop: '4px' }}>
          <input
            type="text"
            placeholder="Search for haircuts, spa, facial..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              paddingLeft: '40px',
              borderRadius: '50px',
              border: '1.5px solid var(--color-border)',
              background: 'rgba(255, 255, 255, 0.02)',
              color: 'var(--color-text)',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-champagne)';
              e.target.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-border)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <svg
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
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
              <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>
                {searchQuery 
                  ? `No services found matching "${searchQuery}"${active !== 'All' ? ` under ${active}` : ''}.`
                  : `No service offerings listed under ${active} category.`
                }
              </p>
            </div>
          ) : (
            <div className="services-grid-full">
              {filtered.map((s, i) => (
                <article key={s.id || i} className={`service-card-full delay-${(i % 4) + 1}`}>
                  <div className="service-card-full__img-wrap">
                    <img src={s.imageUrl} alt={s.name} loading="lazy" className="service-card-full__img" />
                    <span className="service-card-full__cat">{s.category}</span>
                  </div>
                  <div className="service-card-full__body">
                    <h3 className="service-card-full__name">{s.name}</h3>
                    <p className="service-card-full__desc">{s.description}</p>
                    {s.duration && (
                      <div className="service-card-full__meta">
                        <span className="service-card-full__dur">⏱ {s.duration}</span>
                      </div>
                    )}
                    <InteractiveHoverButton to="/book-appointment" state={{ service: s.name }} className="service-card-full__cta">
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
