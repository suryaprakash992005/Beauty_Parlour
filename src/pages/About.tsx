import { Award, Heart, Leaf, Users, MapPin } from 'lucide-react';
import { useScrollReveal } from '../components/shared';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';
import { SparklesText } from '../components/SparklesText';
import Breadcrumb from '../components/Breadcrumb';
import { useSEO, PAGE_SEO } from '../hooks/useSEO';
import '../styles/about.css';



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
          <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Our Story & Mission</div>
          <h1 className="page-hero__title">
            <SparklesText>Best Beauty Salon in Namakkal</SparklesText>
          </h1>
          <p className="page-hero__subtitle">
            ZHa Aesthetic Salon is recognized as the premier unisex beauty salon in Namakkal, located conveniently in Mohanur.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-champagne)', fontSize: '0.85rem', marginTop: '12px' }}>
            <MapPin size={14} />
            <span>1st Floor, MPS Traders Building, Mohanur, Namakkal District</span>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="about-story">
            <div className="about-story__img-col reveal-left">
              <div className="about-story__img-main">
                <img src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=700&q=80" alt="Best Beauty Salon interior in Namakkal - ZHa Aesthetic Salon Mohanur" loading="lazy" />
              </div>
              <div className="about-story__img-accent">
                <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80" alt="Luxury facial and skin care service in Namakkal" loading="lazy" />
              </div>
            </div>
            <div className="about-story__text reveal-right">
              <div className="section-label">Est. 2012</div>
              <h2 className="section-title">A Decade of Beauty & Styling Excellence in Namakkal</h2>
              <p className="section-subtitle" style={{ marginTop: 'var(--space-lg)' }}>
                ZHa Aesthetic Salon was founded with a singular vision — to establish the highest standard of luxury hair styling, HD bridal makeup, keratin treatment, and aesthetic skincare in Namakkal. Conveniently located in Mohanur, Namakkal District, our salon serves clients seeking world-class beauty transformations.
              </p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', lineHeight: 1.8, marginTop: 'var(--space-lg)' }}>
                We believe true style is a reflection of inner confidence. Every haircut, hair spa treatment, facial, and bridal makeover at ZHa Aesthetic Salon is delivered using advanced techniques and premium, dermatologist-approved products. Our certified hair stylists and bridal experts bring over 12 years of industry experience.
              </p>
              <div className="about-values">
                {[
                  { Icon: Heart,   label: 'Client-First',     desc: 'Your comfort, privacy, and satisfaction are our highest priority.' },
                  { Icon: Award,   label: 'Excellence',        desc: 'Certified hair stylists and bridal makeup artists in Namakkal.' },
                  { Icon: Leaf,    label: 'Clean Beauty',      desc: 'Dermatologist-approved luxury beauty & skincare products.' },
                  { Icon: Users,   label: 'Expert Team',       desc: 'Trained professionals for ladies, gentlemen, and brides.' },
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
                Book Your Appointment in Namakkal
              </InteractiveHoverButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
