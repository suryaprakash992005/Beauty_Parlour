import { useEffect, useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Star, ArrowRight } from 'lucide-react';
import { Instagram } from '../components/BrandIcons';
import { useScrollReveal, useCounterAnimation } from '../components/shared';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';
import ShinyText from '../components/ShinyText';
import { getHomepageBanner } from '../services/homepage';
import type { HomepageBanner } from '../services/homepage';
import { getServices } from '../services/services';
import type { ServiceItem } from '../services/services';
import { getPublishedReviews } from '../services/reviews';
import { getRelativeDateString } from './Testimonials';
import bridalBeforeImg from '../assets/bridal_before.png';
import bridalAfterImg from '../assets/bridal_after.png';
import '../styles/home.css';

/* ─── Data ─── */
const HERO_BGS = [
  '/salon_green_theme_1.jpg',
  '/salon_green_theme_2.jpg',
  '/salon_green_theme_3.jpg'
];

interface TestimonialData {
  id: string | number;
  reviewer_name: string;
  rating: number;
  review_text: string;
  review_date: string;
}

const FALLBACK_TESTIMONIALS: TestimonialData[] = [
  { id: 'f-1', review_text: 'My bridal makeup was absolutely flawless. Every guest was in awe. The team at ZHA Aesthetic Salon truly understands luxury beauty.', reviewer_name: 'Priya Sharma', rating: 5, review_date: '2026-06-15' },
  { id: 'f-2', review_text: 'The facial treatment left my skin glowing for days. I have tried many salons, but ZHA Aesthetic Salon is in a completely different league.', reviewer_name: 'Ananya Mehta', rating: 5, review_date: '2026-06-20' },
  { id: 'f-3', review_text: 'Hair spa here is an experience I look forward to every month. The products and expertise are truly world-class.', reviewer_name: 'Kavitha Nair', rating: 5, review_date: '2026-06-25' },
  { id: 'f-4', review_text: 'From the moment I walked in, I felt like royalty. The ambience, service, and results — simply exceptional.', reviewer_name: 'Sneha Joshi', rating: 5, review_date: '2026-07-01' },
  { id: 'f-5', review_text: 'The keratin treatment smoothened my hair beyond imagination. I wake up with perfect hair every single day now!', reviewer_name: 'Divya Patel', rating: 5, review_date: '2026-07-04' },
  { id: 'f-6', review_text: 'My party makeup turned heads all night. The makeup artist understood exactly my vibe — flawless and glamorous!', reviewer_name: 'Riya Verma', rating: 5, review_date: '2026-07-08' }
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
  const [bgIndex, setBgIndex] = useState(0);
  const [banner, setBanner] = useState<HomepageBanner | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [homeReviews, setHomeReviews] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedBgs, setLoadedBgs] = useState<string[]>([]);

  useScrollReveal([services]);

  useEffect(() => {
    const urls = [
      banner?.imageUrl || HERO_BGS[0],
      HERO_BGS[1],
      HERO_BGS[2]
    ];

    let active = true;

    async function preloadSequentially() {
      for (const url of urls) {
        if (!url) continue;
        try {
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
              if (active) {
                setLoadedBgs(prev => {
                  if (prev.includes(url)) return prev;
                  return [...prev, url];
                });
              }
              resolve();
            };
            img.onerror = () => resolve();
          });
        } catch (e) {
          console.error('Failed to preload image:', url, e);
        }
      }
    }

    preloadSequentially();

    return () => {
      active = false;
    };
  }, [banner]);

  useEffect(() => {
    // Load Homepage Banner config
    getHomepageBanner()
      .then(data => setBanner(data))
      .catch(err => console.error('Failed to load banner:', err));

    // Load Featured Services
    getServices()
      .then(data => {
        setServices(data.slice(0, 6));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load featured services:', err);
        setLoading(false);
      });

    // Load Client Testimonials
    getPublishedReviews()
      .then(data => {
        if (data && data.length > 0) {
          setHomeReviews(data.map(r => ({
            id: r.id!,
            reviewer_name: r.reviewer_name,
            rating: r.rating,
            review_text: r.review_text,
            review_date: r.review_date
          })));
        } else {
          setHomeReviews(FALLBACK_TESTIMONIALS);
        }
      })
      .catch(err => {
        console.error('Failed to load testimonials:', err);
        setHomeReviews(FALLBACK_TESTIMONIALS);
      });

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
        
        {HERO_BGS.map((bg, idx) => {
          const url = idx === 0 && banner?.imageUrl ? banner.imageUrl : bg;
          const isLoaded = loadedBgs.includes(url);
          return (
            <div
              key={idx}
              className="hero__image-overlay"
              style={{
                backgroundImage: isLoaded ? `url('${url}')` : 'none',
                opacity: idx === bgIndex && isLoaded ? 1.0 : 0,
                transition: 'opacity 1.5s ease-in-out'
              }}
              aria-hidden="true"
            />
          );
        })}

        {/* Soft luxury dark overlay to protect text contrast while background is Bright */}
        <div className="hero__dark-overlay" />

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
            {banner?.smallHeading || 'ZHA Aesthetic Salon'}
          </div>
          <h1 className="hero__title">
            <ShinyText
              text={banner?.mainHeading || 'Transform Your Style With Professional Beauty Experts'}
              disabled={false}
              speed={3.5}
              color="rgba(255, 255, 255, 0.95)"
              shineColor="#D4AF37"
              spread={120}
              yoyo={false}
              pauseOnHover={false}
              direction="left"
            />
          </h1>
          <p className="hero__subtitle">
            {banner?.subtitle || banner?.description || 'Where premium style meets expert care. Experience the ultimate hair design, cosmetics, nail artistry, and soothing spa therapies.'}
          </p>
          <div className="hero__actions">
            <InteractiveHoverButton to="/book-appointment">
              {banner?.primaryBtn || 'Book Appointment'}
            </InteractiveHoverButton>
            <Link to="/services" className="btn btn-outline-white">
              {banner?.secondaryBtn || 'Explore Services'}
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

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div className="book-loader" style={{ width: '28px', height: '28px', borderTopColor: 'var(--color-champagne)' }} />
            </div>
          ) : services.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '14px' }}>No services available.</p>
          ) : (
            <div className="services-grid">
              {services.map((s, i) => (
                <article
                  key={s.id || i}
                  className={`service-card reveal delay-${(i % 4) + 1}`}
                  aria-label={s.name}
                >
                  <div className="service-card__img-wrap">
                    <img className="service-card__img" src={s.imageUrl} alt={s.name} loading="lazy" />
                  </div>
                  <div className="service-card__body">
                    <h3 className="service-card__name">{s.name}</h3>
                    <p className="service-card__desc">{s.description}</p>
                    <div className="service-card__footer" style={{ justifyContent: 'center' }}>
                      <InteractiveHoverButton to="/book-appointment" className="interactive-hover-btn--sm">
                        Book Now
                      </InteractiveHoverButton>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

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
              Drag the slider to witness the professional styling transformations at ZHA Aesthetic Salon.
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
          {[...homeReviews, ...homeReviews].map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-card__stars">
                {Array.from({ length: t.rating }, (_, j) => <Star key={j} size={14} fill="currentColor" />)}
                {Array.from({ length: 5 - t.rating }, (_, j) => <Star key={j} size={14} fill="none" stroke="currentColor" />)}
              </div>
              <blockquote className="testimonial-card__quote">"{t.review_text}"</blockquote>
              <div className="testimonial-card__author" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                <div className="testimonial-card__name">{t.reviewer_name}</div>
                <div className="testimonial-card__role" style={{ fontSize: '0.68rem', color: 'var(--color-text-light)' }}>
                  {getRelativeDateString(t.review_date)}
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
