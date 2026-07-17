import { Tag } from 'lucide-react';
import { useScrollReveal } from '../components/shared';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';
import { SparklesText } from '../components/SparklesText';

export default function Offers() {
  useScrollReveal();
  const OFFERS = [
    { id: 1, tag: 'Bridal Season', discount: '30% OFF', title: 'Bridal Package Special', desc: 'Book any Silver, Gold or Diamond bridal package and save 30% this monsoon season. Limited slots available.', validity: 'Valid till 31st July 2026', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', color: '#D4AF37' },
    { id: 2, tag: 'First Visit',   discount: '₹999',   title: 'Signature Facial for ₹999', desc: 'New clients get our signature revitalising facial at just ₹999 (regular ₹1,999). Make your first visit unforgettable.', validity: 'Valid for first visit only', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', color: '#AA8010' },
    { id: 3, tag: 'Friends',       discount: '2 FOR 1', title: 'Bring A Friend Deal',    desc: 'Bring your bestie and both enjoy the same service — pay for one, two enjoy! Valid on facials, hair spa, and nail art.', validity: 'Mon–Thu only', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', color: '#D4AF37' },
    { id: 4, tag: 'Weekend',       discount: '20% OFF', title: 'Sunday Luxury Special',  desc: 'Every Sunday is Luxury Day at ZHA Hair Saloon. Enjoy 20% off on all Skin Care and Spa services.', validity: 'Every Sunday', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80', color: '#D4AF37' },
    { id: 5, tag: 'Hair Month',    discount: '₹3,499', title: 'Keratin + Hair Spa Combo', desc: 'Get our premium keratin treatment + a nourishing hair spa together at just ₹3,499 (worth ₹5,998).', validity: 'Valid till 15th Aug 2026', img: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80', color: '#AA8010' },
    { id: 6, tag: 'Loyalty',       discount: 'FREE',   title: 'Loyalty Card — 6th Visit Free', desc: 'Join the ZHA Hair Saloon Loyalty Club. Your 6th visit earns you a complimentary service worth up to ₹2,000.', validity: 'Ongoing program', img: 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&q=80', color: '#D4AF37' },
  ];

  return (
    <main>
      <section className="page-hero">
        <div className="page-hero__bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1400&q=80')" }} />
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Exclusive Deals</div>
          <h1 className="page-hero__title">
            <SparklesText>Luxury Offers</SparklesText>
          </h1>
          <p className="page-hero__subtitle">Premium beauty experiences at exceptional value. Limited time only.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__header section__header--center reveal">
            <div className="section-label">Current Promotions</div>
            <h2 className="section-title">Exclusive Offers Just For You</h2>
            <p className="section-subtitle mx-auto">Indulge in the finest beauty treatments at prices that celebrate you. Act fast — limited availability.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-xl)', marginTop: 'var(--space-4xl)' }}>
            {OFFERS.map((o, i) => (
              <article key={o.id} className={`offer-full-card reveal delay-${(i % 3) + 1}`} style={{ '--accent': o.color } as React.CSSProperties}>
                <div className="offer-full-card__img-wrap">
                  <img src={o.img} alt={o.title} className="offer-full-card__img" loading="lazy" />
                  <div className="offer-full-card__discount">{o.discount}</div>
                  <span className="offer-full-card__tag"><Tag size={10} /> {o.tag}</span>
                </div>
                <div className="offer-full-card__body">
                  <h3 className="offer-full-card__title">{o.title}</h3>
                  <p className="offer-full-card__desc">{o.desc}</p>
                  <div className="offer-full-card__validity">🗓 {o.validity}</div>
                  <InteractiveHoverButton to="/book-appointment" className="offer-full-card__cta">
                    Claim Offer
                  </InteractiveHoverButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .offer-full-card {
          background: var(--color-bg-dark);
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 1px solid var(--color-border);
          transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .offer-full-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-xl); }
        .offer-full-card__img-wrap { position: relative; height: 200px; overflow: hidden; }
        .offer-full-card__img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .offer-full-card:hover .offer-full-card__img { transform: scale(1.08); }
        .offer-full-card__discount {
          position: absolute;
          top: var(--space-md);
          right: var(--space-md);
          background: var(--accent, var(--color-rose-gold));
          color: white;
          font-family: var(--font-serif);
          font-size: 1.6rem;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: var(--radius-lg);
          line-height: 1;
        }
        .offer-full-card__tag {
          position: absolute;
          bottom: var(--space-md);
          left: var(--space-md);
          background: rgba(18, 14, 14, 0.75);
          color: var(--color-champagne);
          font-size: var(--text-xs);
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 4px;
          backdrop-filter: blur(6px);
        }
        .offer-full-card__body { padding: var(--space-xl); display: flex; flex-direction: column; gap: var(--space-sm); }
        .offer-full-card__title { font-family: var(--font-serif); font-size: var(--text-xl); color: #ffffff; }
        .offer-full-card__desc { font-size: var(--text-sm); color: rgba(255, 255, 255, 0.75); line-height: 1.7; }
        .offer-full-card__validity { font-size: var(--text-xs); color: var(--color-champagne); font-weight: 600; letter-spacing: 0.04em; }
        .offer-full-card__cta { width: 100%; justify-content: center; margin-top: var(--space-md); }
      `}</style>
    </main>
  );
}
