import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Calendar, User, Clock } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { BLOG_POSTS } from '../data/blogData';
import '../styles/home.css';

export default function Blog() {
  useSEO({
    title: 'Beauty & Hair Care Blog — ZHa Aesthetic Salon Mohanur & Namakkal',
    description: 'Expert beauty tips, bridal makeup guides, hair spa advice, keratin insights & skincare routines from ZHa Aesthetic Salon Mohanur & Namakkal.',
    canonical: '/blog',
    breadcrumbs: [{ name: 'Blog', url: '/blog' }],
    schema: {
      '@type': 'Blog',
      'name': 'ZHa Aesthetic Salon Beauty Blog',
      'description': 'Beauty, bridal makeup, hair care & skincare insights from ZHa Aesthetic Salon in Mohanur & Namakkal, Tamil Nadu.',
      'publisher': {
        '@type': 'BeautySalon',
        'name': 'ZHa Aesthetic Salon',
        'url': 'https://www.zhaaestheticsalon.in'
      }
    }
  });

  return (
    <main style={{ paddingTop: 'calc(var(--nav-height) + 2rem)', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* ── HEADER ── */}
      <section className="section" aria-label="Blog Header" style={{ paddingBottom: '2rem' }}>
        <div className="container">
          <div className="section__header section__header--center">
            <div className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={12} /> Beauty Journal & Guides
            </div>
            <h1 className="section-title">Beauty & Styling Insights</h1>
            <p className="section-subtitle mx-auto">
              Expert hair care tips, HD bridal makeup guides, keratin treatment advice, and skincare routines curated by top stylists in Mohanur & Namakkal.
            </p>
          </div>
        </div>
      </section>

      {/* ── ARTICLES GRID ── */}
      <section className="section" style={{ paddingTop: '1rem', paddingBottom: '5rem' }}>
        <div className="container">
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '28px' 
            }}
          >
            {BLOG_POSTS.map((post) => (
              <article 
                key={post.slug}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--color-border-light, rgba(212, 175, 55, 0.15))',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, border-color 0.3s ease'
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
                  <img 
                    src={post.image} 
                    alt={`${post.title} - ZHa Aesthetic Salon Mohanur Namakkal`} 
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  />
                  <span 
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(11, 11, 11, 0.85)',
                      color: 'var(--color-champagne)',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '100px',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {post.category}
                  </span>
                </div>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {post.date}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {post.readTime}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.4, marginBottom: '12px' }}>
                    <Link to={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {post.title}
                    </Link>
                  </h2>

                  <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, marginBottom: '20px', flexGrow: 1 }}>
                    {post.excerpt}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-champagne)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <User size={12} /> {post.author}
                    </span>
                    <Link 
                      to={`/blog/${post.slug}`} 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        color: 'var(--color-champagne)', 
                        fontSize: '13px', 
                        fontWeight: 600,
                        textDecoration: 'none' 
                      }}
                    >
                      Read Article <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
