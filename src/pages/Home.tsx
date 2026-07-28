import { useEffect, useRef, useCallback, useState, useMemo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Star, ArrowRight, ChevronDown, MapPin } from 'lucide-react';
import { useScrollReveal, useCounterAnimation } from '../components/shared';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';
import ShinyText from '../components/ShinyText';
import { getHomepageBanner } from '../services/homepage';
import type { HomepageBanner } from '../services/homepage';
import { getServices } from '../services/services';
import type { ServiceItem } from '../services/services';
import { getPublishedReviews } from '../services/reviews';
import { getRelativeDateString } from './Testimonials';
import { getGalleryItems } from '../services/gallery';
import { useSEO, PAGE_SEO } from '../hooks/useSEO';
import bridalBeforeImg from '../assets/bridal_before.png';
import bridalAfterImg from '../assets/bridal_after.png';
import '../styles/home.css';

// Lazy-load heavy below-the-fold 3D Dome Gallery
const DomeGallery = lazy(() => import('../components/DomeGallery'));

/* ─── Responsive Hero Background Assets ─── */
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth <= 768;

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

const HOMEPAGE_FAQS = [
  {
    q: 'Which is the best salon in Namakkal?',
    a: 'ZHa Aesthetic Salon is widely recognized as the best unisex beauty salon in Namakkal, located in Mohanur. We offer top-rated hair styling, HD bridal makeup, keratin treatments, luxury facials, and spa care.'
  },
  {
    q: 'Where can I get bridal makeup in Namakkal?',
    a: 'ZHa Aesthetic Salon provides the best bridal makeup in Namakkal. Located in Mohanur, we specialize in HD bridal makeup, airbrush makeup, saree draping, bridal hair styling, and comprehensive pre-bridal grooming packages.'
  },
  {
    q: 'Which salon offers keratin treatment in Namakkal?',
    a: 'ZHa Aesthetic Salon offers professional keratin treatment and hair smoothening in Namakkal, using certified luxury products for long-lasting, frizz-free, silky smooth hair.'
  },
  {
    q: 'Which is the best unisex salon in Namakkal?',
    a: 'ZHa Aesthetic Salon is the leading unisex salon in Namakkal, located in Mohanur, offering dedicated expert hair stylists, aesthetic facial therapists, and grooming services for ladies and gentlemen.'
  },
  {
    q: 'Where is ZHa Aesthetic Salon located?',
    a: 'ZHa Aesthetic Salon is located at 1st Floor, MPS Traders Building, Opposite Taluka Office, Nehru Nagar, Mohanur, Namakkal District, Tamil Nadu - 637015. Call +91 96889 99188 to book your appointment.'
  }
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
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
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
      <img className="slider-img" src={bridalBeforeImg} alt="Before Makeup Transformation at Best Beauty Salon in Namakkal" loading="lazy" decoding="async" width="600" height="450" />
      <img className="slider-img slider-after" ref={afterRef} src={bridalAfterImg} alt="After HD Bridal Makeup Transformation at ZHa Aesthetic Salon Mohanur Namakkal" loading="lazy" decoding="async" width="600" height="450" />
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
  useSEO(PAGE_SEO.home);
  const [bgIndex, setBgIndex] = useState(0);
  const [banner, setBanner] = useState<HomepageBanner | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [homeReviews, setHomeReviews] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useScrollReveal([services]);

  useEffect(() => {
    // Load Homepage Banner config
    getHomepageBanner()
      .then(data => setBanner(data))
      .catch(err => console.error('Failed to load banner:', err));

    // Load Featured Services
    getServices()
      .then(data => {
        setServices(data.filter(s => s.active !== false).slice(0, 6));
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

    // Load Portfolio Gallery items for Dome
    getGalleryItems()
      .then(data => {
        if (data && data.length > 0) {
          setGalleryImages(data.map(img => img.url));
        }
      })
      .catch(err => console.error('Failed to load gallery for dome:', err));

    const slideTimer = setInterval(() => {
      setBgIndex(prev => (prev + 1) % 3);
    }, 5500);

    return () => clearInterval(slideTimer);
  }, []);

  // Memoized Particle data (Lightweight count for mobile)
  const particles = useMemo(() => {
    const count = IS_MOBILE ? 5 : 12;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * (IS_MOBILE ? 35 : 50) + 15,
      x: Math.random() * 100,
      y: Math.random() * 100,
      tx: (Math.random() - 0.5) * 40,
      ty: -(Math.random() * 40 + 10),
      dur: Math.random() * 5 + 6,
      delay: Math.random() * 3,
    }));
  }, []);

  // Stable hero slides list for Desktop, Tablet, and Mobile
  const heroSlides = useMemo(() => {
    const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth <= 1024;
    const primary = banner?.imageUrl || (isMobileOrTablet ? '/salon_green_theme_1_mobile.jpg' : 'https://rkbxikbzjemccuppiuuu.supabase.co/storage/v1/object/public/hero/hero_1784208729302.webp');
    const slide2  = isMobileOrTablet ? '/salon_green_theme_2_mobile.jpg' : '/salon_green_theme_2.jpg';
    const slide3  = isMobileOrTablet ? '/salon_green_theme_3_mobile.jpg' : '/salon_green_theme_3.jpg';
    return [primary, slide2, slide3];
  }, [banner?.imageUrl]);

  // Preload all hero slides into memory so transitions on mobile/desktop are 100% instant and gapless
  useEffect(() => {
    heroSlides.forEach(url => {
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });
  }, [heroSlides]);

  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero" aria-label="Hero">
        <div className="hero__bg" />
        
        {heroSlides.map((url, idx) => {
          const isVisible = idx === bgIndex;
          return (
            <div
              key={idx}
              className="hero__image-overlay"
              style={{
                backgroundImage: `url('${url}')`,
                opacity: isVisible ? 1.0 : 0,
                transition: 'opacity 1.5s cubic-bezier(0.25, 1, 0.5, 1)',
                willChange: 'opacity'
              }}
              aria-hidden="true"
            />
          );
        })}

        {/* Soft luxury dark overlay */}
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
            {banner?.smallHeading || 'ZHA Aesthetic Salon — Mohanur, Namakkal'}
          </div>
          <h1 className="hero__title">
            <ShinyText
              text={banner?.mainHeading || 'Best Beauty Salon in Namakkal | Premium Unisex Salon'}
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
            {banner?.subtitle || banner?.description || 'ZHa Aesthetic Salon is the premier unisex beauty parlour in Namakkal, located in Mohanur. Experience luxury hair styling, HD bridal makeup, keratin treatment, hair spa & glowing skin facials.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-champagne)', fontSize: '0.85rem', marginTop: '10px' }}>
            <MapPin size={14} />
            <span>Located in Mohanur, Namakkal District, Tamil Nadu</span>
          </div>
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
      <section className="section" aria-label="Featured Services in Namakkal">
        <div className="container">
          <div className="section__header section__header--center reveal">
            <div className="section-label">Top Hair, Skin & Bridal Care</div>
            <h2 className="section-title">Best Salon Services in Namakkal</h2>
            <p className="section-subtitle mx-auto">
              From HD bridal makeup and keratin treatment to hair spa and aesthetic skin facials, every service is delivered with certified expertise at our Mohanur salon.
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
                  aria-label={`${s.name} in Namakkal`}
                >
                  <div className="service-card__img-wrap">
                    <img 
                      className="service-card__img" 
                      src={s.imageUrl} 
                      alt={`${s.name} in Namakkal - ZHa Aesthetic Salon Mohanur`} 
                      loading="lazy" 
                      decoding="async" 
                      width="400" 
                      height="280" 
                    />
                  </div>
                  <div className="service-card__body">
                    <h3 className="service-card__name">{s.name}</h3>
                    <p className="service-card__desc">{s.description}</p>
                    <div className="service-card__footer" style={{ justifyContent: 'center' }}>
                      <InteractiveHoverButton to="/book-appointment" state={{ service: s.name }} className="interactive-hover-btn--sm">
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
              View All Services in Namakkal <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ── */}
      <section className="before-after" aria-label="Transformation Gallery">
        <div className="container">
          <div className="section__header section__header--center reveal" style={{ color: 'white' }}>
            <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Hair & Bridal Transformations</div>
            <h2 className="section-title" style={{ color: 'var(--color-white)' }}>Best Hair Stylist & Makeup Artist in Namakkal</h2>
            <p className="section-subtitle mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Drag the slider to witness real bridal and hair transformations at ZHA Aesthetic Salon, Mohanur, Namakkal District.
            </p>
          </div>
          <BeforeAfterSlider />
        </div>
      </section>

      {/* ── OFFERS ── */}
      <section className="offers-banner" aria-label="Current Offers">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section__header section__header--center reveal">
            <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Exclusive Deals in Namakkal</div>
            <h2 className="section-title" style={{ color: 'var(--color-white)' }}>Premium Salon Offers For You</h2>
          </div>
          <div className="offers-grid">
            {[
              { discount: '30% OFF', title: 'Bridal Package Namakkal', desc: 'Book any HD bridal makeup package and receive a complimentary luxury hair spa.', tag: 'Limited Time Offer' },
              { discount: '₹999',    title: 'Glowing Skin Facial',    desc: 'Signature luxury glow facial starting at just ₹999 at our Mohanur salon.', tag: 'New Client Special' },
              { discount: '2 FOR 1', title: 'Hair Spa & Stylist Package', desc: 'Bring a friend and enjoy double the hair care treatments at half the price.', tag: 'Popular Deal' },
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
            <div className="section-label">Client Reviews</div>
            <h2 className="section-title">What Clients Say About The Best Salon in Namakkal</h2>
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

      {/* ── FREQUENTLY ASKED QUESTIONS (SEO FAQ SECTION) ── */}
      <section className="section" aria-label="Frequently Asked Questions" style={{ backgroundColor: 'var(--color-bg-dark, #121212)' }}>
        <div className="container">
          <div className="section__header section__header--center reveal">
            <div className="section-label">Got Questions?</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle mx-auto">
              Everything you need to know about ZHa Aesthetic Salon, the best unisex beauty salon in Namakkal.
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {HOMEPAGE_FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(212, 175, 55, 0.15)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      gap: '16px'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown 
                      size={18} 
                      style={{ 
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                        color: 'var(--color-champagne)',
                        flexShrink: 0
                      }} 
                    />
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 24px 20px 24px', color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.95rem', lineHeight: '1.65' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM / DOME GALLERY ── */}
      <section className="instagram-section" aria-label="Instagram Gallery">
        <div className="container">
          <div className="section__header section__header--center reveal">
            <div className="section-label">Follow Us</div>
            <h2 className="section-title">@zha_aesthetic_salon</h2>
            <p className="section-subtitle mx-auto">Follow our journey of aesthetic styling on Instagram and get inspired daily.</p>
          </div>
          <div style={{ width: '100%', height: '520px', position: 'relative', marginTop: 'var(--space-xl)', overflow: 'hidden' }} className="reveal">
            <Suspense fallback={
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <div className="book-loader" style={{ width: '32px', height: '32px', borderTopColor: 'var(--color-champagne)' }} />
              </div>
            }>
              <DomeGallery 
                images={galleryImages.length > 0 ? galleryImages : undefined} 
                fit={0.45}
                minRadius={480}
                maxRadius={900}
                grayscale={false}
                overlayBlurColor="var(--color-bg)"
                openedImageWidth="340px"
                openedImageHeight="400px"
                openedImageBorderRadius="20px"
                imageBorderRadius="16px"
                dragSensitivity={15}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
