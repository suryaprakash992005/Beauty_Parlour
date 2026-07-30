import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { BLOG_POSTS } from './Blog';
import { useSEO } from '../hooks/useSEO';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';
import '../styles/services.css';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? BLOG_POSTS[slug] : null;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  useSEO({
    title: post.seoTitle,
    description: post.seoDescription,
    canonical: `/blog/${post.slug}`,
    breadcrumbs: [
      { name: 'Blog', url: '/blog' },
      { name: post.title, url: `/blog/${post.slug}` }
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': post.title,
      'description': post.seoDescription,
      'image': post.coverImage,
      'author': {
        '@type': 'Organization',
        'name': 'ZHA Aesthetic Salon Mohanur'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'ZHA Aesthetic Salon',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://www.zhaaestheticsalon.in/logo.jpg'
        }
      },
      'datePublished': post.date,
      'mainEntityOfPage': `https://www.zhaaestheticsalon.in/blog/${post.slug}`
    }
  });

  return (
    <main className="blog-post-page">
      {/* ── Breadcrumb ── */}
      <nav className="breadcrumb-bar" aria-label="Breadcrumb">
        <div className="container">
          <ol className="breadcrumb-list">
            <li><Link to="/">Home</Link></li>
            <li><span>/</span></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><span>/</span></li>
            <li className="active">{post.title}</li>
          </ol>
        </div>
      </nav>

      {/* ── Post Header ── */}
      <article className="blog-post-article">
        <header className="blog-post-header">
          <div className="container" style={{ maxWidth: '900px' }}>
            <span className="blog-card__category">{post.category}</span>
            <h1 className="blog-post__h1">{post.title}</h1>
            <div className="blog-post__meta">
              <span><User size={14} /> {post.author}</span>
              <span><Calendar size={14} /> {post.date}</span>
              <span><Clock size={14} /> {post.readTime}</span>
            </div>
          </div>
        </header>

        {/* ── Cover Image ── */}
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="blog-post__cover">
            <img src={post.coverImage} alt={post.title} width="900" height="500" loading="eager" />
          </div>
        </div>

        {/* ── Post Body Content ── */}
        <div className="container" style={{ maxWidth: '800px' }}>
          <div 
            className="blog-post__content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* ── FAQs Section ── */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="blog-post__faqs">
              <h2 className="blog-post__h2">
                <HelpCircle size={20} style={{ color: 'var(--color-champagne)', display: 'inline', marginRight: '8px' }} />
                Frequently Asked Questions
              </h2>
              <div className="faqs-accordion">
                {post.faqs.map((faq, i) => (
                  <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                    <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span>{faq.question}</span>
                      <ChevronDown size={18} className="faq-chevron" />
                    </button>
                    {openFaq === i && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Related Posts ── */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="blog-post__related">
              <h2 className="blog-post__h2">Related Guides</h2>
              <div className="related-services-grid">
                {post.relatedPosts.map(rel => (
                  <Link key={rel.slug} to={`/blog/${rel.slug}`} className="related-service-card">
                    <span>{rel.title}</span>
                    <ArrowRight size={16} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* ── CTA Banner ── */}
      <section className="service-cta-banner" style={{ marginTop: '60px' }}>
        <div className="container text-center">
          <div className="section-label mx-auto" style={{ justifyContent: 'center' }}>
            <Sparkles size={12} /> ZHA Aesthetic Salon Mohanur
          </div>
          <h2 className="service-cta__title">Experience Professional Beauty Services in Mohanur</h2>
          <p className="service-cta__desc">Book your hair spa, facial, or bridal makeup consultation today.</p>
          <div className="service-cta__actions">
            <InteractiveHoverButton to="/book-appointment">
              Book Appointment Online
            </InteractiveHoverButton>
            <Link to="/services" className="btn btn-outline-white">
              Explore All Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
