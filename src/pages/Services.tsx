import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter } from 'lucide-react';
import { useScrollReveal } from '../components/shared';
import '../styles/services.css';

type Category = 'All' | 'Hair Care' | 'Skin Care' | 'Makeup' | 'Bridal' | 'Spa' | 'Nails';

const SERVICES = [
  { id: 1,  category: 'Makeup',    name: 'Bridal Makeup',          price: '₹8,999',  dur: '3-4 hrs', desc: 'Timeless bridal looks with luxury cosmetics for your most special day.', img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80' },
  { id: 2,  category: 'Skin Care', name: 'Luxury Facial',          price: '₹2,499',  dur: '60 min',  desc: 'Deep-cleansing luxury facial with premium serums and advanced techniques.', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80' },
  { id: 3,  category: 'Hair Care', name: 'Hair Styling',           price: '₹1,499',  dur: '45 min',  desc: 'Expert styling for every occasion — from everyday elegance to red-carpet glam.', img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80' },
  { id: 4,  category: 'Hair Care', name: 'Keratin Treatment',      price: '₹4,999',  dur: '2-3 hrs', desc: 'Professional smoothing treatment for frizz-free, silky hair.', img: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&q=80' },
  { id: 5,  category: 'Spa',       name: 'Premium Spa Therapy',    price: '₹3,499',  dur: '90 min',  desc: 'Full-body luxury spa experience using aromatic oils and hot stone techniques.', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80' },
  { id: 6,  category: 'Nails',     name: 'Nail Art',               price: '₹999',    dur: '60 min',  desc: 'Intricate nail art designs with premium gel, acrylic and chrome finishes.', img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80' },
  { id: 7,  category: 'Hair Care', name: 'Hair Spa',               price: '₹1,999',  dur: '60 min',  desc: 'Revitalising hair spa with nourishing masks and scalp massage.', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80' },
  { id: 8,  category: 'Makeup',    name: 'Party Makeup',           price: '₹2,999',  dur: '90 min',  desc: 'Glamorous party makeup for any celebration — from bold to elegant.', img: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80' },
  { id: 9,  category: 'Skin Care', name: 'Skin Rejuvenation',      price: '₹3,999',  dur: '75 min',  desc: 'Advanced skin rejuvenation with LED therapy and premium actives.', img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80' },
  { id: 10, category: 'Hair Care', name: 'Hair Coloring',          price: '₹2,999',  dur: '2 hrs',   desc: 'Premium hair color services using world-class ammonia-free pigments.', img: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80' },
  { id: 11, category: 'Bridal',    name: 'Saree Draping',          price: '₹1,499',  dur: '45 min',  desc: 'Expert saree draping in 20+ styles by our dedicated bridal stylists.', img: 'https://images.unsplash.com/photo-1610189844544-e1ff75a3fec5?w=600&q=80' },
  { id: 12, category: 'Hair Care', name: 'Hair Smoothening',       price: '₹5,999',  dur: '3 hrs',   desc: 'Long-lasting hair smoothening for permanently manageable, frizz-free hair.', img: 'https://images.unsplash.com/photo-1523263685509-57c1d050d19b?w=600&q=80' },
  { id: 13, category: 'Skin Care', name: 'Eyebrow Styling',        price: '₹499',    dur: '30 min',  desc: 'Perfect brow shaping and tinting by our expert aestheticians.', img: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=600&q=80' },
  { id: 14, category: 'Skin Care', name: 'Beauty Consultation',    price: '₹799',    dur: '45 min',  desc: 'One-on-one luxury beauty consultation with our certified specialists.', img: 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&q=80' },
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
          <h1 className="page-hero__title">Luxury Services</h1>
          <p className="page-hero__subtitle">14+ premium beauty services crafted to perfection for every modern woman.</p>
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
                  <Link to="/book" className="btn btn-primary service-card-full__cta">
                    Book Now <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
