import { Award, Heart, Leaf, Users } from 'lucide-react';
import { useScrollReveal, useCounterAnimation } from '../components/shared';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';
import { SparklesText } from '../components/SparklesText';
import '../styles/about.css';

const TEAM = [
  { name: 'Meera Kapoor',   role: 'Founder & Creative Director',   img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80', exp: '15 Years' },
  { name: 'Aisha Rahman',   role: 'Senior Bridal Artist',          img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', exp: '10 Years' },
  { name: 'Preethi Nair',   role: 'Hair Specialist & Colorist',    img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80', exp: '12 Years' },
  { name: 'Deepa Suresh',   role: 'Skin & Spa Therapist',          img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80', exp: '8 Years' },
];

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
  useScrollReveal();
  return (
    <main className="about-page">
      <section className="page-hero">
        <div className="page-hero__bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=1400&q=80')" }} />
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Our Story</div>
          <h1 className="page-hero__title">
            <SparklesText>About Zha Aesthetic Salon</SparklesText>
          </h1>
          <p className="page-hero__subtitle">Born from a passion for premium hair styling, redefined for professional elegance.</p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="about-story">
            <div className="about-story__img-col reveal-left">
              <div className="about-story__img-main">
                <img src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=700&q=80" alt="Zha Aesthetic Salon" />
              </div>
              <div className="about-story__img-accent">
                <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80" alt="Luxury Service" />
              </div>
            </div>
            <div className="about-story__text reveal-right">
              <div className="section-label">Est. 2012</div>
              <h2 className="section-title">A Decade of Luxury Styling Excellence</h2>
              <p className="section-subtitle" style={{ marginTop: 'var(--space-lg)' }}>
                Zha Aesthetic Salon was born from a singular vision — to create an aesthetic sanctuary for premium hair, bridal, and nail care. Founded in 2012 by professional styling experts, Zha Aesthetic Salon has grown into Mumbai's most coveted premium styling destination.
              </p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', lineHeight: 1.8, marginTop: 'var(--space-lg)' }}>
                We believe style is a statement of confidence. Every haircut, treatment, and makeover at Zha Aesthetic Salon is delivered with precise techniques and premium products. Our certified specialists bring together years of collective expertise in hair styling, bridal makeup, and aesthetics.
              </p>
              <div className="about-values">
                {[
                  { Icon: Heart,   label: 'Client-First',     desc: 'Your comfort and satisfaction are our highest priority.' },
                  { Icon: Award,   label: 'Excellence',        desc: 'We never compromise on quality, products, or artistry.' },
                  { Icon: Leaf,    label: 'Clean Beauty',      desc: 'All products are cruelty-free and dermatologist approved.' },
                  { Icon: Users,   label: 'Expert Team',       desc: 'Certified artists with international training.' },
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

      {/* Team */}
      <section className="section">
        <div className="container">
          <div className="section__header section__header--center reveal">
            <div className="section-label">Meet The Team</div>
            <h2 className="section-title">The Artists Behind Your Transformation</h2>
            <p className="section-subtitle mx-auto">Our certified beauty experts are passionate about making you look and feel extraordinary.</p>
          </div>
          <div className="team-grid">
            {TEAM.map((member, i) => (
              <div key={member.name} className={`team-card reveal delay-${i + 1}`}>
                <div className="team-card__img-wrap">
                  <img src={member.img} alt={member.name} className="team-card__img" loading="lazy" />
                </div>
                <div className="team-card__info">
                  <h3 className="team-card__name">{member.name}</h3>
                  <p className="team-card__role">{member.role}</p>
                  <span className="gold-badge" style={{ marginTop: '0.5rem' }}>{member.exp} Exp.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
