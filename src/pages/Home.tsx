import { useEffect, useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Star, ArrowRight } from 'lucide-react';
import { Instagram } from '../components/BrandIcons';
import { useScrollReveal, useCounterAnimation } from '../components/shared';
import bridalBeforeImg from '../assets/bridal_before.png';
import bridalAfterImg from '../assets/bridal_after.png';
import '../styles/home.css';

/* ─── Data ─── */
const HERO_BGS = [
  '/salon_green_theme_1.jpg',
  '/salon_green_theme_2.jpg',
  '/salon_green_theme_3.jpg'
];

const SERVICES = [
  {
    id: 1, name: 'Hair Cut', price: '₹499', tag: null,
    desc: 'Professional precision haircut and styling tailored to your face shape.',
    img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 2, name: 'Hair Coloring', price: '₹2,499', tag: 'Trending',
    desc: 'Premium global coloring and highlights using ammonia-free pigments.',
    img: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 3, name: 'Hair Spa', price: '₹1,499', tag: null,
    desc: 'Nourishing hair spa treatment to restore scalp health, shine, and hair strength.',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 4, name: 'Keratin Treatment', price: '₹4,499', tag: 'Most Popular',
    desc: 'Professional protein smoothing treatment for frizz-free, silky, and manageable hair.',
    img: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 5, name: 'Facial', price: '₹1,999', tag: null,
    desc: 'Deep cleansing luxury facial using premium organic serums for a radiant glow.',
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 6, name: 'Bridal Makeup', price: '₹9,999', tag: 'Most Popular',
    desc: 'Exquisite HD bridal makeup and hair styling for your special day.',
    img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80&auto=format&fit=crop',
  },
];

const TESTIMONIALS = [
  { id: 1, quote: 'My bridal makeup was absolutely flawless. Every guest was in awe. The team at ZHA Hair Saloon truly understands luxury beauty.', name: 'Priya Sharma', role: 'Bride, Mumbai', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { id: 2, quote: 'The facial treatment left my skin glowing for days. I have tried many salons, but ZHA Hair Saloon is in a completely different league.', name: 'Ananya Mehta', role: 'Regular Client', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&q=80' },
  { id: 3, quote: 'Hair spa here is an experience I look forward to every month. The products and expertise are truly world-class.', name: 'Kavitha Nair', role: 'Lifestyle Blogger', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80' },
  { id: 4, quote: 'From the moment I walked in, I felt like royalty. The ambience, service, and results — simply exceptional.', name: 'Sneha Joshi', role: 'Entrepreneur', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80' },
  { id: 5, quote: 'The keratin treatment smoothened my hair beyond imagination. I wake up with perfect hair every single day now!', name: 'Divya Patel', role: 'Working Professional', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80' },
  { id: 6, quote: 'My party makeup turned heads all night. The makeup artist understood exactly my vibe — flawless and glamorous!', name: 'Riya Verma', role: 'Fashion Enthusiast', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&q=80' },
];

const INSTAGRAM_IMGS = [
  'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=80',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&q=80',
  'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=400&q=80',
  'https://images.unsplash.com/photo-1510706019490-f8f2be44b6b0?w=400&q=80',
];

/* ─── Counter Stat ─── */
function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useCounterAnimation(value);
  return (
    <div className="stats__item reveal">
      <div className="stats__number">
        <span ref={ref}>0</span>
        <span className="stats__suffix">{suffix}</span>
      </div>
      <div className="stats__label">{label}</div>
    </div>
  );
}

/* ─── Before / After Slider ─── */
function BeforeAfterSlider() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const afterRef  = useRef<HTMLImageElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const dragging  = useRef(false);

  const setPos = useCallback((clientX: number) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const pct  = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    if (afterRef.current)  afterRef.current.style.clipPath = `inset(0 0 0 ${pct}%)`;
    if (handleRef.current) handleRef.current.style.left   = `${pct}%`;
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      setPos(x);
    };
    const stop = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('mouseup',  stop);
    window.addEventListener('touchend', stop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup',  stop);
      window.removeEventListener('touchend', stop);
    };
  }, [setPos]);

  return (
    <div
      className="slider-wrap"
      ref={wrapRef}
      onMouseDown={() => { dragging.current = true; }}
      onTouchStart={() => { dragging.current = true; }}
      onMouseMove={e => { if (dragging.current) setPos(e.clientX); }}
      onTouchMove={e => { if (dragging.current) setPos(e.touches[0].clientX); }}
    >
      <img className="slider-img" src={bridalBeforeImg} alt="Before" />
      <img className="slider-img slider-after" ref={afterRef} src={bridalAfterImg} alt="After" />
      <div className="slider-handle" ref={handleRef} />
      <div className="slider-labels">
        <span className="slider-label">Before</span>
        <span className="slider-label">After</span>
      </div>
    </div>
  );
}

/* ─── Home Page ─── */
export default function Home() {
  useScrollReveal();
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex(prev => (prev + 1) % HERO_BGS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Particle data
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    tx: (Math.random() - 0.5) * 60,
    ty: -(Math.random() * 60 + 10),
    dur: Math.random() * 6 + 6,
    delay: Math.random() * 4,
  }));

  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero" aria-label="Hero">
        <div className="hero__bg" />
        {HERO_BGS.map((bg, idx) => (
          <div
            key={idx}
            className="hero__image-overlay"
            style={{
              backgroundImage: `url('${bg}')`,
              opacity: idx === bgIndex ? 0.5 : 0,
              transition: 'opacity 1.5s ease-in-out'
            }}
            aria-hidden="true"
          />
        ))}

        {/* Floating particles */}
        <div className="hero__particles" aria-hidden="true">
          {particles.map(p => (
            <div
              key={p.id}
              className="hero__particle"
              style={{
                width: p.size, height: p.size,
                left: `${p.x}%`, top: `${p.y}%`,
                '--tx': `${p.tx}px`, '--ty': `${p.ty}px`,
                '--duration': `${p.dur}s`, '--delay': `${p.delay}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <div className="container hero__content">
          <div className="hero__eyebrow">
            <Sparkles size={12} />
            ZHA Hair Saloon
          </div>
          <h1 className="hero__title">
            Transform Your Style With <em>Professional</em> Beauty Experts
          </h1>
          <p className="hero__subtitle">
            Where premium style meets expert care. Experience the ultimate hair design, bridal cosmetics, nail artistry, and soothing spa therapies at ZHA Hair Saloon.
          </p>
          <div className="hero__actions">
            <Link to="/book-appointment" className="btn btn-gold">
              Book Appointment <ArrowRight size={16} />
            </Link>
            <Link to="/services" className="btn btn-outline-white">
              Explore Services
            </Link>
          </div>
        </div>

        <div className="hero__scroll-indicator" aria-hidden="true">
          <div className="hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats" aria-label="Statistics">
        <div className="container">
          <div className="stats__grid">
            <Stat value={8000}  suffix="+"  label="Happy Clients" />
            <Stat value={12}    suffix="+"  label="Years of Excellence" />
            <Stat value={11}    suffix=""   label="Premium Offerings" />
            <Stat value={98}    suffix="%"  label="Client Satisfaction" />
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section" aria-label="Featured Services">
        <div className="container">
          <div className="section__header section__header--center reveal">
            <div className="section-label">What We Offer</div>
            <h2 className="section-title">Luxury Services Curated For You</h2>
            <p className="section-subtitle mx-auto">
              From bridal artistry to everyday indulgences, every service is delivered with unmatched expertise and premium products.
            </p>
          </div>

          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <article
                key={s.id}
                className={`service-card reveal delay-${(i % 4) + 1}`}
                aria-label={s.name}
              >
                <div className="service-card__img-wrap">
                  <img className="service-card__img" src={s.img} alt={s.name} loading="lazy" />
                  {s.tag && <span className="gold-badge service-card__badge">{s.tag}</span>}
                </div>
                <div className="service-card__body">
                  <h3 className="service-card__name">{s.name}</h3>
                  <p className="service-card__desc">{s.desc}</p>
                  <div className="service-card__footer">
                    <div className="service-card__price">
                      {s.price} <small>onwards</small>
                    </div>
                    <Link to="/book-appointment" className="btn btn-outline" style={{ padding: '8px 18px', fontSize: '0.75rem' }}>
                      Book Now
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-3xl">
            <Link to="/services" className="btn btn-primary">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ── */}
      <section className="before-after" aria-label="Transformation Gallery">
        <div className="container">
          <div className="section__header section__header--center reveal" style={{ color: 'white' }}>
            <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Transformations</div>
            <h2 className="section-title" style={{ color: 'var(--color-white)' }}>See The Difference We Make</h2>
            <p className="section-subtitle mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Drag the slider to witness the professional styling transformations at ZHA Hair Saloon.
            </p>
          </div>
          <BeforeAfterSlider />
        </div>
      </section>

      {/* ── OFFERS ── */}
      <section className="offers-banner" aria-label="Current Offers">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section__header section__header--center reveal">
            <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Exclusive Deals</div>
            <h2 className="section-title" style={{ color: 'var(--color-white)' }}>Premium Offers For You</h2>
          </div>
          <div className="offers-grid">
            {[
              { discount: '30% OFF', title: 'Bridal Season Special', desc: 'Book any bridal package and get a complimentary hair spa included.', tag: 'Limited Time' },
              { discount: '₹999',    title: 'Luxury Facial',         desc: 'Our signature luxury facial starting at just ₹999. First visit exclusive.', tag: 'New Client Offer' },
              { discount: '2 FOR 1', title: 'Bring A Friend',        desc: 'Bring your bestie and enjoy double the services at the price of one.', tag: 'Friends & Family' },
            ].map((o, i) => (
              <div key={i} className={`offer-card reveal delay-${i + 1}`}>
                <div className="offer-card__discount">{o.discount}</div>
                <h3 className="offer-card__title">{o.title}</h3>
                <p className="offer-card__desc">{o.desc}</p>
                <span className="offer-card__tag">{o.tag}</span>
                <br /><br />
                <Link to="/book-appointment" className="btn btn-outline-white" style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}>
                  Claim Offer
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials" aria-label="Client Testimonials">
        <div className="container">
          <div className="section__header section__header--center reveal">
            <div className="section-label">Client Love</div>
            <h2 className="section-title">Words From Our Beautiful Clients</h2>
          </div>
        </div>
        <div className="testimonials-track" aria-label="Testimonials carousel">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-card__stars">{Array.from({ length: 5 }, (_, j) => <Star key={j} size={14} fill="currentColor" />)}</div>
              <blockquote className="testimonial-card__quote">"{t.quote}"</blockquote>
              <div className="testimonial-card__author">
                <img className="testimonial-card__avatar" src={t.avatar} alt={t.name} loading="lazy" />
                <div>
                  <div className="testimonial-card__name">{t.name}</div>
                  <div className="testimonial-card__role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INSTAGRAM ── */}
      <section className="instagram-section" aria-label="Instagram Gallery">
        <div className="container">
          <div className="section__header section__header--center reveal">
            <div className="section-label">Follow Us</div>
            <h2 className="section-title">@zhahairsaloon</h2>
            <p className="section-subtitle mx-auto">Follow our journey of premium hair styling on Instagram and get inspired daily.</p>
          </div>
          <div className="instagram-grid">
            {INSTAGRAM_IMGS.map((src, i) => (
              <a key={i} href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className={`instagram-item reveal delay-${(i % 4) + 1}`}>
                <img className="instagram-item__img" src={src} alt={`Instagram post ${i + 1}`} loading="lazy" />
                <div className="instagram-item__overlay"><Instagram size={22} /></div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
