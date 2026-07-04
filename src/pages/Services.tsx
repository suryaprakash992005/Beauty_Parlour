import { useState } from 'react';
import { Filter } from 'lucide-react';
import { useScrollReveal } from '../components/shared';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';
import { SparklesText } from '../components/SparklesText';
import '../styles/services.css';

type Category = 'All' | 'Hair Care' | 'Skin Care' | 'Makeup' | 'Bridal' | 'Spa' | 'Nails';

const SERVICES = [
  { id: 1,  category: 'Hair Care', name: 'Hair Cut',            price: '₹499',   dur: '45 min',  desc: 'Professional precision haircut and styling tailored to your face shape. Includes wash.', img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80' },
  { id: 2,  category: 'Hair Care', name: 'Hair Coloring',       price: '₹2,499', dur: '2 hrs',   desc: 'Premium global coloring and highlights using world-class ammonia-free pigments.', img: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80' },
  { id: 3,  category: 'Hair Care', name: 'Hair Spa',            price: '₹1,499', dur: '60 min',  desc: 'Nourishing hair spa treatment to restore scalp health, shine, and hair strength.', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80' },
  { id: 4,  category: 'Hair Care', name: 'Keratin Treatment',   price: '₹4,499', dur: '2-3 hrs', desc: 'Professional protein smoothing treatment for frizz-free, silky, and manageable hair.', img: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&q=80' },
  { id: 5,  category: 'Skin Care', name: 'Facial',              price: '₹1,999', dur: '60 min',  desc: 'Deep cleansing luxury facial using premium organic serums for a radiant glow.', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80' },
  { id: 6,  category: 'Bridal',    name: 'Bridal Makeup',       price: '₹9,999', dur: '3-4 hrs', desc: 'Exquisite HD bridal makeup, hair styling, and saree draping for your special day.', img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80' },
  { id: 7,  category: 'Nails',     name: 'Nail Art',            price: '₹799',   dur: '45 min',  desc: 'Custom hand-painted nail art with premium gel, chrome, and acrylic extensions.', img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80' },
  { id: 8,  category: 'Skin Care', name: 'Waxing',              price: '₹999',   dur: '45 min',  desc: 'Gentle full body waxing using premium honey and chocolate organic wax.', img: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80' },
  { id: 9,  category: 'Skin Care', name: 'Threading',           price: '₹149',   dur: '15 min',  desc: 'Precision threading for perfectly shaped eyebrows and facial hair removal.', img: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=600&q=80' },
  { id: 10, category: 'Spa',       name: 'Pedicure',            price: '₹999',   dur: '45 min',  desc: 'Relaxing luxury foot spa, scrub, and massage to revitalize your tired feet.', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80' },
  { id: 11, category: 'Spa',       name: 'Manicure',            price: '₹799',   dur: '45 min',  desc: 'Classic hand massage, cuticle care, and nail shaping for beautiful hands.', img: 'https://images.unsplash.com/photo-1610189844544-e1ff75a3fec5?w=600&q=80' },
];

const CATEGORIES: Category[] = ['All', 'Hair Care', 'Skin Care', 'Makeup', 'Bridal', 'Spa', 'Nails'];

export default function Services() {
  const [active, setActive] = useState<Category>('All');
  useScrollReveal();

  const filtered = active === 'All' ? SERVICES : SERVICES.filter(s => s.category === active);

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
          <p className="page-hero__subtitle">11 premium hair and beauty services crafted to perfection by ZHA Hair Saloon.</p>
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
          <div className="services-grid-full">
            {filtered.map((s, i) => (
              <article key={s.id} className={`service-card-full reveal delay-${(i % 4) + 1}`}>
                <div className="service-card-full__img-wrap">
                  <img src={s.img} alt={s.name} loading="lazy" className="service-card-full__img" />
                  <span className="service-card-full__cat">{s.category}</span>
                </div>
                <div className="service-card-full__body">
                  <h3 className="service-card-full__name">{s.name}</h3>
                  <p className="service-card-full__desc">{s.desc}</p>
                  <div className="service-card-full__meta">
                    <span className="service-card-full__dur">⏱ {s.dur}</span>
                    <span className="service-card-full__price">{s.price} <small>onwards</small></span>
                  </div>
                  <InteractiveHoverButton to="/book-appointment" className="service-card-full__cta">
                    Book Now
                  </InteractiveHoverButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
