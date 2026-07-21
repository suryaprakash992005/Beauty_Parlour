import { Award, Heart, Leaf, Users } from 'lucide-react';
import { useScrollReveal, useCounterAnimation } from '../components/shared';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';
import { SparklesText } from '../components/SparklesText';
import Breadcrumb from '../components/Breadcrumb';
import { useSEO, PAGE_SEO } from '../hooks/useSEO';
import '../styles/about.css';

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useCounterAnimation(value);
  return (
    <div className="about-stat">
      <div className="about-stat__num"><span ref={ref}>0</span>{suffix}</div>
      <div className="about-stat__label">{label}</div>
    </div>
  );
}

export default function About() {
  useSEO({
    ...PAGE_SEO.about,
    breadcrumbs: [{ name: 'About Us', url: '/about' }],
  });
  useScrollReveal();

  return (
    <main className="about-page">
      <section className="page-hero">
        <div className="page-hero__bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=1400&q=80')" }} />
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <Breadcrumb items={[{ label: 'About Us' }]} />
          <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Our Story</div>
          <h1 className="page-hero__title">
            <SparklesText>About ZHa Aesthetic Salon</SparklesText>
          </h1>
          <p className="page-hero__subtitle">Born from a passion for luxury hair styling and aesthetic excellence in Mohanur, Namakkal.</p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="about-story">
            <div className="about-story__img-col reveal-left">
              <div className="about-story__img-main">
                <img src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=700&q=80" alt="ZHa Aesthetic Salon interior in Mohanur" loading="lazy" />
              </div>
              <div className="about-story__img-accent">
                <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80" alt="Luxury facial and skin care service" loading="lazy" />
              </div>
            </div>
            <div className="about-story__text reveal-right">
              <div className="section-label">Est. 2012</div>
              <h2 className="section-title">A Decade of Luxury Styling Excellence in Mohanur</h2>
              <p className="section-subtitle" style={{ marginTop: 'var(--space-lg)' }}>
                ZHa Aesthetic Salon was born from a singular vision — to create an aesthetic sanctuary for premium hair, bridal makeup, skin care, and spa therapy. Founded in 2012 by professional styling experts, ZHa Aesthetic Salon has grown into Mohanur's most coveted luxury beauty destination.
              </p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', lineHeight: 1.8, marginTop: 'var(--space-lg)' }}>
                We believe style is a statement of confidence. Every haircut, keratin treatment, facial, and bridal makeover at ZHa Aesthetic Salon is delivered with precise techniques and dermatologist-approved products. Our certified specialists bring together years of collective expertise to make Mohanur look and feel extraordinary.
              </p>
              <div className="about-values">
                {[
                  { Icon: Heart,   label: 'Client-First',     desc: 'Your comfort, privacy, and satisfaction are our highest priority.' },
                  { Icon: Award,   label: 'Excellence',        desc: 'We never compromise on quality, products, or artistry.' },
                  { Icon: Leaf,    label: 'Clean Beauty',      desc: 'All products are cruelty-free and dermatologist approved.' },
                  { Icon: Users,   label: 'Expert Team',       desc: 'Certified artists with professional salon training.' },
                ].map(({ Icon, label, desc }) => (
                  <div key={label} className="about-value">
                    <Icon size={20} style={{ color: 'var(--color-rose-gold)' }} />
                    <div>
                      <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{label}</strong>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <InteractiveHoverButton to="/book-appointment" className="mt-xl">
                Book Your Experience
              </InteractiveHoverButton>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section section--dark">
        <div className="container">
          <div className="about-stats">
            <StatItem value={8000}  suffix="+"  label="Happy Clients" />
            <StatItem value={12}    suffix="+"  label="Years Experience" />
            <StatItem value={20}    suffix="+"  label="Expert Artists" />
            <StatItem value={98}    suffix="%"  label="Satisfaction Rate" />
          </div>
        </div>
      </section>

    </main>
  );
}
