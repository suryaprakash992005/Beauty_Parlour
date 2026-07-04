import { Star } from 'lucide-react';
import { useScrollReveal } from '../components/shared';
import { SparklesText } from '../components/SparklesText';

const TESTIMONIALS = [
  { id: 1,  name: 'Priya Sharma',    role: 'Bride',                rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', quote: 'My bridal makeup was absolutely flawless. Every guest was in awe. The team at Luxéora truly understands luxury beauty. I felt like a queen on my most special day.' },
  { id: 2,  name: 'Ananya Mehta',    role: 'Regular Client',       rating: 5, avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&q=80', quote: 'The facial treatment left my skin glowing for days. I have tried many salons in Mumbai, but Luxéora is in a completely different league. The ambience alone is worth it.' },
  { id: 3,  name: 'Kavitha Nair',    role: 'Lifestyle Blogger',    rating: 5, avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80', quote: 'Hair spa here is an experience I look forward to every month. The products and expertise are truly world-class. The staff remembers my preferences — that personalised touch is rare.' },
  { id: 4,  name: 'Sneha Joshi',     role: 'Entrepreneur',         rating: 5, avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80', quote: 'From the moment I walked in, I felt like royalty. The ambience, service, and results — simply exceptional. My keratin treatment lasted 6 months and my hair has never looked better.' },
  { id: 5,  name: 'Divya Patel',     role: 'Working Professional', rating: 5, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80', quote: 'The keratin treatment smoothened my hair beyond imagination. I wake up with perfect hair every single day now! Every penny spent here is worth it.' },
  { id: 6,  name: 'Riya Verma',      role: 'Fashion Enthusiast',   rating: 5, avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&q=80', quote: 'My party makeup turned heads all night. The makeup artist understood exactly my vibe — flawless and glamorous! I get so many compliments every time I visit Luxéora.' },
  { id: 7,  name: 'Neha Agarwal',    role: 'Bride',                rating: 5, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&q=80', quote: 'I booked the Diamond Bridal Package and it was the best decision of my life. My entire bridal look was beyond words. The team worked for 2 days to make me look perfect.' },
  { id: 8,  name: 'Pooja Rao',       role: 'Artist',               rating: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', quote: 'As an artist, I have a critical eye for detail. Luxéora passes with flying colours on every count — creativity, hygiene, technique, and client care.' },
  { id: 9,  name: 'Sunita Krishna',  role: 'Doctor',               rating: 4, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', quote: 'As a healthcare professional, I value cleanliness and hygiene. Luxéora maintains impeccable standards. The skin rejuvenation treatment was truly medically sound and effective.' },
];

export default function Testimonials() {
  useScrollReveal();
  return (
    <main>
      <section className="page-hero">
        <div className="page-hero__bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&q=80')" }} />
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Client Stories</div>
          <h1 className="page-hero__title">
            <SparklesText>Love From Our Clients</SparklesText>
          </h1>
          <p className="page-hero__subtitle">Real experiences from real women who chose Luxéora for their most beautiful moments.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__header section__header--center reveal">
            <div className="section-label">Testimonials</div>
            <h2 className="section-title">Words That Warm Our Hearts</h2>
            <p className="section-subtitle mx-auto">Over 8,000 happy clients and counting. Here is what some of them have to say.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-xl)', marginTop: 'var(--space-4xl)' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.id} className={`testimonial-full-card reveal delay-${(i % 4) + 1}`}>
                <div className="testimonial-full-card__stars">
                  {Array.from({ length: t.rating }, (_, j) => <Star key={j} size={14} fill="currentColor" />)}
                  {Array.from({ length: 5 - t.rating }, (_, j) => <Star key={j} size={14} fill="none" stroke="currentColor" />)}
                </div>
                <blockquote className="testimonial-full-card__quote">"{t.quote}"</blockquote>
                <div className="testimonial-full-card__author">
                  <img src={t.avatar} alt={t.name} className="testimonial-full-card__avatar" loading="lazy" />
                  <div>
                    <div className="testimonial-full-card__name">{t.name}</div>
                    <div className="testimonial-full-card__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .testimonial-full-card {
          background: var(--color-white);
          border-radius: var(--radius-xl);
          padding: var(--space-2xl);
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          transition: all 0.5s ease;
        }
        .testimonial-full-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: var(--color-border-gold); }
        .testimonial-full-card__stars { display: flex; gap: 3px; color: var(--color-champagne); }
        .testimonial-full-card__quote { font-family: var(--font-serif); font-size: var(--text-lg); font-style: italic; color: var(--color-brown-deep); line-height: 1.65; flex: 1; }
        .testimonial-full-card__author { display: flex; align-items: center; gap: var(--space-md); padding-top: var(--space-lg); border-top: 1px solid var(--color-border); }
        .testimonial-full-card__avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-border-gold); flex-shrink: 0; }
        .testimonial-full-card__name { font-weight: 600; font-size: var(--text-sm); color: var(--color-brown-deep); }
        .testimonial-full-card__role { font-size: var(--text-xs); color: var(--color-text-muted); }
      `}</style>
    </main>
  );
}
