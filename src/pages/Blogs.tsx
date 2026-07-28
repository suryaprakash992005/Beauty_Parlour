import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, MapPin, Tag } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { SparklesText } from '../components/SparklesText';
import { useSEO, PAGE_SEO } from '../hooks/useSEO';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  content: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b-1',
    title: 'Best Bridal Makeup in Namakkal — Ultimate Wedding Guide',
    slug: 'best-bridal-makeup-in-namakkal',
    category: 'Bridal Beauty',
    readTime: '5 min read',
    date: 'July 20, 2026',
    author: 'ZHa Beauty Experts',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80',
    excerpt: 'Planning your dream wedding? Discover why ZHa Aesthetic Salon in Mohanur offers the best HD bridal makeup, airbrush techniques, and customized bridal grooming packages in Namakkal.',
    content: [
      'Every bride deserves to feel like royalty on her special day. When searching for the best bridal makeup in Namakkal, brides seek a flawless, long-lasting look that enhances natural beauty while photographing magnificently.',
      'At ZHa Aesthetic Salon, located in Mohanur, Namakkal District, our certified bridal makeup artists specialize in HD Bridal Makeup, Airbrush Makeup, Traditional South Indian Bridal Makeover, Saree Draping, and Hair Styling.',
      'We recommend booking your pre-bridal skincare regime at least 2 to 3 months prior to the wedding. Our packages include gold facials, hair spa, body polishing, and customized nail art.'
    ]
  },
  {
    id: 'b-2',
    title: 'Best Hair Spa in Namakkal — Restore Shine & Scalp Health',
    slug: 'best-hair-spa-in-namakkal',
    category: 'Hair Care',
    readTime: '4 min read',
    date: 'July 15, 2026',
    author: 'Senior Hair Stylist',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    excerpt: 'Is your hair feeling dry, damaged, or frizzy? Learn why regular hair spa treatments at ZHa Aesthetic Salon in Mohanur, Namakkal nourish scalp roots and control hair fall.',
    content: [
      'Dust, pollution, humidity, and heat styling tools strip natural moisture from your hair strands. A professional hair spa treatment in Namakkal is essential for deep hydration and scalp rejuvenation.',
      'At ZHa Aesthetic Salon in Mohanur, our signature Hair Spa process includes intense root nourishment, essential oil scalp massage, steam treatment, and power-keratin conditioning.',
      'Regular monthly hair spa sessions improve blood circulation, strengthen hair follicles, prevent premature greying, and leave your hair silky soft and naturally radiant.'
    ]
  },
  {
    id: 'b-3',
    title: 'Benefits of Keratin Treatment for Silky Frizz-Free Hair',
    slug: 'benefits-of-keratin-treatment-namakkal',
    category: 'Hair Transformation',
    readTime: '6 min read',
    date: 'July 10, 2026',
    author: 'Master Hair Specialist',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    excerpt: 'Dreaming of manageable, straight, glossy hair every morning? Explore how keratin smoothening treatments at ZHa Salon in Namakkal transform unruly frizz into liquid silk.',
    content: [
      'Keratin is the natural protective protein that makes up your hair. Over time, chemical processing, sun exposure, and hard water deplete keratin layers, leading to unmanageable frizz.',
      'Our specialized Keratin Treatment at ZHa Aesthetic Salon in Mohanur infuses bio-keratin proteins deep into hair cuticles, sealing moisture and straightening wave texture for 4 to 6 months.',
      'Benefits include 90% frizz reduction, half the blow-drying time, intense shine, and protection against humidity in Namakkal.'
    ]
  },
  {
    id: 'b-4',
    title: 'Wedding Beauty Checklist: 3-Month Pre-Bridal Care Guide',
    slug: 'wedding-beauty-checklist-namakkal',
    category: 'Bridal Care',
    readTime: '5 min read',
    date: 'July 05, 2026',
    author: 'Bridal Director',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80',
    excerpt: 'Step-by-step pre-bridal timeline for Indian brides in Namakkal. From skin detox facials to trial makeup sessions, stay organized for your big day.',
    content: [
      'Month 3: Start monthly deep-hydration facials, scalp hair spa treatments, and body polishing at ZHa Aesthetic Salon.',
      'Month 2: Schedule your HD bridal makeup trial, finalize hairstyle choices, and complete eyebrow micro-grooming.',
      'Week 1: Gel nail extension, full body waxing, luxury pedicures, and soothing aromatherapy facial in Mohanur.'
    ]
  },
  {
    id: 'b-5',
    title: 'Top Hair Trends & Haircut Styles for 2026',
    slug: 'top-hair-trends-namakkal',
    category: 'Hair Styling',
    readTime: '4 min read',
    date: 'June 28, 2026',
    author: 'Styling Expert',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80',
    excerpt: 'Discover the trending haircuts, balayage hair colors, layered cuts, and curtain bangs taking Namakkal by storm this season.',
    content: [
      'From soft butterfly layers to rich caramel balayage highlights, modern hair styling is all about effortless elegance and healthy texture.',
      'Visit ZHa Aesthetic Salon in Mohanur for a personalized consultation with expert stylists who recommend cuts suited to your face shape.'
    ]
  },
  {
    id: 'b-6',
    title: 'Best Facial for Glowing Skin in Namakkal',
    slug: 'best-facial-for-glowing-skin-namakkal',
    category: 'Skin Care',
    readTime: '5 min read',
    date: 'June 20, 2026',
    author: 'Aesthetician',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    excerpt: 'Which facial treatment gives instant radiant glow? Compare HydraFacial, Gold facial, Vitamin C brightening, and Diamond polishing treatments in Namakkal.',
    content: [
      'Sun tan, hyperpigmentation, and daily stress dull natural skin tone. Our aesthetic facials at ZHa Salon Mohanur deep cleanse pores, extract impurities, and infuse antioxidant serums for long-lasting luminosity.'
    ]
  }
];

export default function Blogs() {
  useSEO(PAGE_SEO.blogs);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <main className="blogs-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero__bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1400&q=80')" }} />
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <Breadcrumb items={[{ label: 'Blogs' }]} />
          <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Expert Insights</div>
          <h1 className="page-hero__title">
            <SparklesText>Beauty Blog & Hair Care Tips</SparklesText>
          </h1>
          <p className="page-hero__subtitle">
            Expert beauty advice, bridal makeup trends, keratin treatment guides & hair care secrets from ZHa Aesthetic Salon in Namakkal, Mohanur.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-champagne)', fontSize: '0.85rem', marginTop: '12px' }}>
            <MapPin size={14} />
            <span>Serving Namakkal, Mohanur & Namakkal District</span>
          </div>
        </div>
      </section>

      {/* Main Blog Grid */}
      <section className="section">
        <div className="container">
          {selectedPost ? (
            /* Detailed Post View */
            <div style={{ maxWidth: '840px', margin: '0 auto' }}>
              <button 
                onClick={() => setSelectedPost(null)}
                className="btn btn-outline"
                style={{ marginBottom: '24px', fontSize: '13px', padding: '8px 18px' }}
              >
                ← Back to All Articles
              </button>

              <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '28px', border: '1px solid var(--color-border)' }}>
                <img 
                  src={selectedPost.image} 
                  alt={`${selectedPost.title} - ZHa Aesthetic Salon Namakkal`} 
                  style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', color: 'var(--color-champagne)', fontSize: '13px', marginBottom: '16px' }}>
                <span><Tag size={13} style={{ display: 'inline', marginRight: '4px' }} />{selectedPost.category}</span>
                <span><Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />{selectedPost.date}</span>
                <span><Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />{selectedPost.readTime}</span>
              </div>

              <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF', marginBottom: '20px', lineHeight: '1.25' }}>{selectedPost.title}</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.05rem', lineHeight: '1.8' }}>
                {selectedPost.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Call to action box */}
              <div 
                style={{ 
                  marginTop: '40px', 
                  padding: '32px', 
                  borderRadius: '16px', 
                  backgroundColor: 'rgba(212, 175, 55, 0.08)', 
                  border: '1px solid var(--color-champagne)',
                  textAlign: 'center'
                }}
              >
                <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', marginBottom: '8px' }}>Ready to Experience The Best Salon in Namakkal?</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                  Visit ZHa Aesthetic Salon in Mohanur or book your appointment online today.
                </p>
                <Link to="/book-appointment" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  Book Your Appointment <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            /* Articles Grid */
            <div className="services-grid-full">
              {BLOG_POSTS.map(post => (
                <article 
                  key={post.id} 
                  className="service-card-full"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="service-card-full__img-wrap">
                    <img 
                      src={post.image} 
                      alt={`${post.title} - ZHa Aesthetic Salon Namakkal`} 
                      loading="lazy" 
                      decoding="async"
                      className="service-card-full__img" 
                      width="400"
                      height="280"
                    />
                    <span className="service-card-full__cat">{post.category}</span>
                  </div>
                  <div className="service-card-full__body">
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--color-champagne)', marginBottom: '8px' }}>
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="service-card-full__name" style={{ fontSize: '1.25rem', lineHeight: '1.35' }}>{post.title}</h3>
                    <p className="service-card-full__desc" style={{ WebkitLineClamp: 3 }}>{post.excerpt}</p>
                    <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-champagne)', fontWeight: 600, fontSize: '13px' }}>
                      Read Article <ArrowRight size={14} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
