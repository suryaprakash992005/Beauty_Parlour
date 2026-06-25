import { Link } from 'react-router-dom';
import { Check, Crown, Gem, Star } from 'lucide-react';
import { useScrollReveal } from '../components/shared';
import '../styles/bridal.css';

const PACKAGES = [
  {
    id: 'silver',
    icon: Star,
    name: 'Silver Bridal',
    tagline: 'Elegant Simplicity',
    price: '₹24,999',
    duration: '6-8 hours',
    color: '#c0c0c0',
    popular: false,
    services: [
      'Bridal Makeup (Full Face)',
      'Saree Draping (1 Style)',
      'Hair Styling & Setting',
      'Basic Hair Spa Treatment',
      'Eyebrow Threading & Shaping',
      'Basic Nail Paint',
      'Pre-Bridal Facial',
      'Touch-Up Kit Provided',
    ],
  },
  {
    id: 'gold',
    icon: Crown,
    name: 'Gold Bridal',
    tagline: 'The Signature Experience',
    price: '₹49,999',
    duration: '8-10 hours',
    color: 'var(--color-champagne)',
    popular: true,
    services: [
      'Luxury Bridal Makeup (HD)',
      'Saree Draping (3 Styles)',
      'Bridal Hair Styling & Blowout',
      'Premium Hair Spa + Keratin',
      'Full Body Waxing & Threading',
      'Gel Nail Art (Both Hands)',
      'Luxury Facial + Body Scrub',
      'Engagement Look Included',
      'Personal Makeup Artist',
      'Touch-Up Kit & Bag',
    ],
  },
  {
    id: 'diamond',
    icon: Gem,
    name: 'Diamond Luxury Bridal',
    tagline: 'The Ultimate Transformation',
    price: '₹89,999',
    duration: '2 Days',
    color: '#b9f2ff',
    popular: false,
    services: [
      'Celebrity-Grade Bridal Makeup',
      'Unlimited Saree Draping Styles',
      'Full Bridal Glam Hair Setup',
      'Hair Smoothening + Spa',
      'Complete Body Waxing & Polish',
      '3D Nail Art Extension Set',
      'Diamond Facial + Skin Peel',
      'Full Body Luxury Spa',
      'Mehendi Look Included',
      'Engagement & Reception Looks',
      'Dedicated Bridal Coordinator',
      'Premium Gifting & Welcome Kit',
    ],
  },
];

export default function Bridal() {
  useScrollReveal();
  return (
    <main className="bridal-page">
      {/* Hero */}
      <section className="page-hero bridal-hero">
        <div
          className="page-hero__bg"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80')" }}
        />
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Luxury Bridal</div>
          <h1 className="page-hero__title">Bridal Packages</h1>
          <p className="page-hero__subtitle">
            Your wedding day deserves nothing less than perfection. Choose a bridal package crafted with love and luxury.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="section">
        <div className="container">
          <div className="section__header section__header--center reveal">
            <div className="section-label">Bridal Collections</div>
            <h2 className="section-title">Choose Your Perfect Bridal Package</h2>
            <p className="section-subtitle mx-auto">
              Every bride is unique. Our bespoke packages are designed to make your dream bridal look a reality.
            </p>
          </div>

          <div className="bridal-grid">
            {PACKAGES.map((pkg, i) => {
              const Icon = pkg.icon;
              return (
                <article
                  key={pkg.id}
                  id={`pkg-${pkg.id}`}
                  className={`bridal-card reveal delay-${i + 1}${pkg.popular ? ' bridal-card--popular' : ''}`}
                >
                  {pkg.popular && <div className="bridal-card__popular-badge">Most Popular</div>}

                  <div className="bridal-card__header">
                    <div className="bridal-card__icon" style={{ color: pkg.color }}>
                      <Icon size={28} />
                    </div>
                    <div className="bridal-card__name">{pkg.name}</div>
                    <div className="bridal-card__tagline">{pkg.tagline}</div>
                    <div className="bridal-card__price">{pkg.price}</div>
                    <div className="bridal-card__duration">⏱ {pkg.duration} experience</div>
                  </div>

                  <div className="gold-divider"><span className="gold-divider__icon">✦</span></div>

                  <ul className="bridal-card__services">
                    {pkg.services.map(s => (
                      <li key={s} className="bridal-card__service-item">
                        <Check size={14} className="bridal-card__check" />
                        {s}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/book"
                    className={`btn ${pkg.popular ? 'btn-gold' : 'btn-outline'} bridal-card__cta`}
                  >
                    Book Consultation
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ strip */}
      <section className="section section--cream">
        <div className="container">
          <div className="section__header section__header--center reveal">
            <div className="section-label">Questions</div>
            <h2 className="section-title">Bridal FAQs</h2>
          </div>
          <div className="bridal-faqs">
            {[
              { q: 'How far in advance should I book?', a: 'We recommend booking your bridal package at least 3-6 months in advance to secure your preferred date and time.' },
              { q: 'Can I do a bridal trial?', a: 'Absolutely! A bridal trial is included in our Gold and Diamond packages. Silver brides can add a trial at ₹2,999.' },
              { q: 'Do you offer home services?', a: 'Yes! Our Gold and Diamond packages include home service options within Mumbai. Additional charges may apply for distant areas.' },
              { q: 'What products do you use?', a: 'We use only premium, dermatologist-approved brands including MAC, Dior, Charlotte Tilbury, Huda Beauty, and more.' },
            ].map((faq, i) => (
              <div key={i} className={`bridal-faq reveal delay-${i % 2 === 0 ? 1 : 2}`}>
                <h3 className="bridal-faq__q">{faq.q}</h3>
                <p className="bridal-faq__a">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
