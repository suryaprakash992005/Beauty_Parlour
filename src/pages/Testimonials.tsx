import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useScrollReveal } from '../components/shared';
import { SparklesText } from '../components/SparklesText';
import { getPublishedReviews } from '../services/reviews';
import Breadcrumb from '../components/Breadcrumb';
import { useSEO, PAGE_SEO } from '../hooks/useSEO';

interface TestimonialData {
  id: string | number;
  reviewer_name: string;
  rating: number;
  review_text: string;
  review_date: string;
}

const FALLBACK_TESTIMONIALS: TestimonialData[] = [
  { id: 'f-1', reviewer_name: 'Priya Sharma', rating: 5, review_text: 'My bridal makeup was absolutely flawless. Every guest was in awe. The team at Zha Aesthetic Salon truly understands luxury beauty. I felt like a queen on my most special day.', review_date: '2026-06-15' },
  { id: 'f-2', reviewer_name: 'Ananya Mehta', rating: 5, review_text: 'The facial treatment left my skin glowing for days. I have tried many salons in Mumbai, but Zha Aesthetic Salon is in a completely different league. The ambience alone is worth it.', review_date: '2026-06-20' },
  { id: 'f-3', reviewer_name: 'Kavitha Nair', rating: 5, review_text: 'Hair spa here is an experience I look forward to every month. The products and expertise are truly world-class. The staff remembers my preferences — that personalised touch is rare.', review_date: '2026-06-25' },
  { id: 'f-4', reviewer_name: 'Sneha Joshi', rating: 5, review_text: 'From the moment I walked in, I felt like royalty. The ambience, service, and results — simply exceptional. My keratin treatment lasted 6 months and my hair has never looked better.', review_date: '2026-07-01' },
  { id: 'f-5', reviewer_name: 'Divya Patel', rating: 5, review_text: 'The keratin treatment smoothened my hair beyond imagination. I wake up with perfect hair every single day now! Every penny spent here is worth it.', review_date: '2026-07-04' },
  { id: 'f-6', reviewer_name: 'Riya Verma', rating: 5, review_text: 'My party makeup turned heads all night. The makeup artist understood exactly my vibe — flawless and glamorous! I get so many compliments every time I visit Zha Aesthetic Salon.', review_date: '2026-07-08' }
];

export function getRelativeDateString(dateStr: string): string {
  try {
    const rDate = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - rDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Today';
    if (diffDays <= 2) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }
    const months = Math.floor(diffDays / 30);
    if (months < 12) {
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
    const years = Math.floor(months / 12);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  } catch {
    return dateStr;
  }
}

export default function Testimonials() {
  useSEO({
    ...PAGE_SEO.testimonials,
    breadcrumbs: [{ name: 'Testimonials', url: '/testimonials' }],
  });
  const [reviews, setReviews] = useState<TestimonialData[]>([]);
  useScrollReveal([reviews]);

  useEffect(() => {
    getPublishedReviews()
      .then(data => {
        if (data && data.length > 0) {
          setReviews(data.map(r => ({
            id: r.id!,
            reviewer_name: r.reviewer_name,
            rating: r.rating,
            review_text: r.review_text,
            review_date: r.review_date
          })));
        } else {
          setReviews(FALLBACK_TESTIMONIALS);
        }
      })
      .catch(err => {
        console.error('Error loading reviews:', err);
        setReviews(FALLBACK_TESTIMONIALS);
      });
  }, []);

  return (
    <main>
      <section className="page-hero">
        <div className="page-hero__bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&q=80')" }} />
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <Breadcrumb items={[{ label: 'Testimonials' }]} />
          <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Client Stories</div>
          <h1 className="page-hero__title">
            <SparklesText>Reviews — ZHa Aesthetic Salon Mohanur</SparklesText>
          </h1>
          <p className="page-hero__subtitle">Real experiences from real clients who chose ZHa Aesthetic Salon in Mohanur for their beauty and hair transformation.</p>
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
            {reviews.map((t, i) => (
              <div key={t.id} className={`testimonial-full-card reveal delay-${(i % 4) + 1}`}>
                <div className="testimonial-full-card__stars">
                  {Array.from({ length: t.rating }, (_, j) => <Star key={j} size={14} fill="currentColor" />)}
                  {Array.from({ length: 5 - t.rating }, (_, j) => <Star key={j} size={14} fill="none" stroke="currentColor" />)}
                </div>
                <blockquote className="testimonial-full-card__quote">"{t.review_text}"</blockquote>
                <div className="testimonial-full-card__author" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--color-border)' }}>
                  <div className="testimonial-full-card__name">{t.reviewer_name}</div>
                  <div className="testimonial-full-card__role" style={{ fontSize: '0.72rem', color: 'var(--color-text-light)' }}>
                    {getRelativeDateString(t.review_date)}
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
        .testimonial-full-card__author { display: flex; align-items: center; gap: var(--space-md); }
        .testimonial-full-card__name { font-weight: 600; font-size: var(--text-sm); color: var(--color-brown-deep); }
        .testimonial-full-card__role { font-size: var(--text-xs); color: var(--color-text-muted); }
      `}</style>
    </main>
  );
}
