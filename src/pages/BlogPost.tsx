import { useParams, Link, Navigate } from 'react-router-dom';
import { Sparkles, Calendar, Clock, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { BLOG_POSTS } from '../data/blogData';
import '../styles/home.css';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  useSEO({
    title: `${post.title} — ZHa Aesthetic Salon Mohanur & Namakkal`,
    description: post.excerpt,
    canonical: `/blog/${post.slug}`,
    ogImage: post.image,
    breadcrumbs: [
      { name: 'Blog', url: '/blog' },
      { name: post.title, url: `/blog/${post.slug}` }
    ],
    schema: {
      '@type': 'BlogPosting',
      'headline': post.title,
      'description': post.excerpt,
      'image': [post.image],
      'datePublished': post.date,
      'dateModified': post.date,
      'author': {
        '@type': 'Organization',
        'name': post.author,
        'url': 'https://www.zhaaestheticsalon.in'
      },
      'publisher': {
        '@type': 'BeautySalon',
        'name': 'ZHa Aesthetic Salon',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://www.zhaaestheticsalon.in/logo.jpg'
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `https://www.zhaaestheticsalon.in/blog/${post.slug}`
      },
      'keywords': post.keywords.join(', ')
    }
  });

  return (
    <main style={{ paddingTop: 'calc(var(--nav-height) + 2rem)', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <article className="container" style={{ maxWidth: '840px', paddingBottom: '5rem' }}>
        {/* Navigation back link */}
        <Link 
          to="/blog" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: 'var(--color-champagne)', 
            fontSize: '14px', 
            textDecoration: 'none',
            marginBottom: '24px' 
          }}
        >
          <ArrowLeft size={16} /> Back to Articles
        </Link>

        {/* Category Badge */}
        <div style={{ marginBottom: '12px' }}>
          <span 
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              color: 'var(--color-champagne)',
              fontSize: '12px',
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: '100px',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', color: '#FFFFFF', fontWeight: 700, lineHeight: 1.25, marginBottom: '20px' }}>
          {post.title}
        </h1>

        {/* Meta Info */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <User size={14} style={{ color: 'var(--color-champagne)' }} /> {post.author}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} style={{ color: 'var(--color-champagne)' }} /> {post.date}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} style={{ color: 'var(--color-champagne)' }} /> {post.readTime}
          </span>
        </div>

        {/* Featured Image */}
        <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '40px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <img 
            src={post.image} 
            alt={`${post.title} - ZHa Aesthetic Salon Mohanur Namakkal`} 
            style={{ width: '100%', maxHeight: '460px', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Content paragraphs */}
        <div style={{ color: 'rgba(255, 255, 255, 0.88)', fontSize: '16px', lineHeight: 1.85 }}>
          {post.content.map((paragraph, idx) => {
            if (paragraph.startsWith('###')) {
              return (
                <h2 key={idx} style={{ fontSize: '22px', color: 'var(--color-champagne)', fontWeight: 600, marginTop: '36px', marginBottom: '16px' }}>
                  {paragraph.replace('### ', '')}
                </h2>
              );
            }
            return (
              <p key={idx} style={{ marginBottom: '20px' }}>
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Call to Action Box */}
        <div 
          style={{ 
            marginTop: '48px', 
            padding: '32px', 
            borderRadius: '20px', 
            background: 'linear-gradient(135deg, rgba(27, 77, 62, 0.4) 0%, rgba(11, 11, 11, 0.8) 100%)', 
            border: '1px solid var(--color-champagne)',
            textAlign: 'center' 
          }}
        >
          <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--color-champagne)', marginBottom: '12px' }}>
            <Sparkles size={24} />
          </div>
          <h3 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
            Ready to Experience Luxury Beauty in Mohanur & Namakkal?
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '14px', maxWidth: '560px', margin: '0 auto 24px' }}>
            Book your personalized hair styling, HD bridal trial, hydra facial, or keratin treatment with our certified experts today.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/book-appointment" className="btn btn-primary">
              Book Appointment <ArrowRight size={16} />
            </Link>
            <Link to="/services" className="btn btn-outline-white">
              Explore All Services
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
