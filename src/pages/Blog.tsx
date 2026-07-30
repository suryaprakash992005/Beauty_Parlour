import { Link } from 'react-router-dom';
import { Sparkles, Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { useSEO, PAGE_SEO } from '../hooks/useSEO';
import '../styles/services.css';

export interface BlogPostData {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  coverImage: string;
  contentHtml: string;
  faqs: { question: string; answer: string }[];
  relatedPosts: { slug: string; title: string }[];
}

export const BLOG_POSTS: Record<string, BlogPostData> = {
  'benefits-of-hair-spa': {
    slug: 'benefits-of-hair-spa',
    title: 'Top 7 Benefits of Regular Hair Spa Treatments in Mohanur',
    seoTitle: 'Benefits of Hair Spa Treatment in Mohanur | ZHA Aesthetic Salon',
    seoDescription: 'Discover why getting a regular Hair Spa in Mohanur transforms damaged hair into healthy, shiny locks. Prevents hair fall, dandruff & stress relief.',
    excerpt: 'Is your hair feeling dull, frizzy, or prone to breakage? Learn how professional hair spa treatments at ZHA Aesthetic Salon Mohanur restore vitality and scalp health.',
    category: 'Hair Care',
    date: '2026-07-25',
    readTime: '4 min read',
    author: 'Senior Stylist at ZHA Salon',
    coverImage: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1000&q=80',
    contentHtml: `
      <h2>Why Hair Spa is Essential for Healthy Hair</h2>
      <p>Modern lifestyle, pollution, hard water, and sun exposure can take a severe toll on your hair. At ZHA Aesthetic Salon in Mohanur, our professional Hair Spa treatments act as a deep conditioning therapy that nourishes hair roots, strengthens follicles, and repairs environmental damage.</p>
      
      <h2>1. Deep Conditioning & Hydration</h2>
      <p>Standard shampoos and conditioners only clean the surface. Hair Spa treatments penetrate deep into the scalp and hair cortex, restoring natural oils and hydration lost to heat styling or harsh weather in Tamil Nadu.</p>

      <h2>2. Prevents Hair Fall & Follicle Weakening</h2>
      <p>Our acupressure scalp massage during hair spa boosts blood circulation to hair roots. Enhanced blood flow delivers essential nutrients to hair follicles, dramatically reducing hair fall and encouraging fresh hair growth.</p>

      <h2>3. Controls Dandruff & Scalp Flaking</h2>
      <p>Excess sebum and dead skin cells clog scalp pores, leading to itching and flakes. Hair Spa deep-cleans scalp pores and regulates sebum production for a clean, balanced scalp environment.</p>

      <h2>4. Stress Relief & Relaxation</h2>
      <p>The 20-minute therapeutic head, neck, and shoulder massage included in our Mohanur hair spa session melts away daily stress, headaches, and tension.</p>
    `,
    faqs: [
      { question: 'How often should I get a Hair Spa at ZHA Salon in Mohanur?', answer: 'For healthy hair maintenance, once every 3 to 4 weeks is optimal. For damaged or colour-treated hair, bi-weekly sessions are recommended.' }
    ],
    relatedPosts: [
      { slug: 'how-to-choose-bridal-makeup', title: 'How to Choose the Perfect Bridal Makeup Artist in Mohanur' },
      { slug: 'facial-guide-glowing-skin', title: 'Ultimate Guide to Facials for Glowing Skin' }
    ]
  },
  'how-to-choose-bridal-makeup': {
    slug: 'how-to-choose-bridal-makeup',
    title: 'How to Choose the Perfect Bridal Makeup Look & Artist in Mohanur',
    seoTitle: 'Bridal Makeup Selection Guide in Mohanur | ZHA Aesthetic Salon',
    seoDescription: 'Planning your wedding in Mohanur or Namakkal? Expert advice on choosing between HD & Airbrush bridal makeup, trial sessions, skin care & draping.',
    excerpt: 'Your wedding day is one of the most memorable events of your life. Follow our ultimate guide to selecting the ideal bridal makeup package and artist in Mohanur.',
    category: 'Bridal Beauty',
    date: '2026-07-20',
    readTime: '5 min read',
    author: 'Bridal Makeup Director',
    coverImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1000&q=80',
    contentHtml: `
      <h2>Finding Your Dream Bridal Look in Mohanur</h2>
      <p>Bridal makeup is more than cosmetics — it is about enhancing your natural radiance so you feel confident from the muhurtham to the reception. Here is what to consider when booking bridal makeup in Mohanur and Namakkal.</p>

      <h2>1. HD vs Airbrush Bridal Makeup</h2>
      <p>HD Makeup uses high-pigment cream foundations applied with professional brushes for a soft-focus photo finish. Airbrush Makeup sprays lightweight waterproof foundation for a 16-hour sweat-proof layer ideal for humid Tamil Nadu weddings.</p>

      <h2>2. Book a Bridal Consultation & Trial Session</h2>
      <p>Never leave your wedding look to guesswork. At ZHA Aesthetic Salon Mohanur, we offer bridal consultation sessions to test shades against your saree and jewellery.</p>

      <h2>3. Start Pre-Bridal Skin Alignment 2 Months Before</h2>
      <p>Smooth makeup requires a well-hydrated skin base. We recommend pre-bridal facials, body polishing, and hair spa treatments starting 60 days before your wedding date.</p>
    `,
    faqs: [
      { question: 'Does ZHA Aesthetic Salon travel to wedding venues in Namakkal district?', answer: 'Yes! Our bridal team travels to venues and homes across Mohanur, Namakkal, Salem, and Karur.' }
    ],
    relatedPosts: [
      { slug: 'benefits-of-hair-spa', title: 'Top 7 Benefits of Regular Hair Spa Treatments' },
      { slug: 'facial-guide-glowing-skin', title: 'Ultimate Guide to Facials for Glowing Skin' }
    ]
  },
  'facial-guide-glowing-skin': {
    slug: 'facial-guide-glowing-skin',
    title: 'Ultimate Facial Guide: Which Skin Treatment is Right For You?',
    seoTitle: 'Facial Guide for Glowing Skin in Mohanur | ZHA Aesthetic Salon',
    seoDescription: 'Find the best facial treatment in Mohanur for your skin type. Gold, Diamond, Vitamin C & Hydrating facial care at ZHA Aesthetic Salon Namakkal.',
    excerpt: 'Confused between Gold, Diamond, and Vitamin C facials? Discover how to pick the perfect facial treatment for instant radiance and youthful skin.',
    category: 'Skin Care',
    date: '2026-07-15',
    readTime: '4 min read',
    author: 'Skin Care Therapist',
    coverImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1000&q=80',
    contentHtml: `
      <h2>Choosing the Right Facial in Mohanur</h2>
      <p>Every skin type requires unique nutrients. Whether you struggle with sun tan, acne scars, hyperpigmentation, or dry skin, ZHA Aesthetic Salon Mohanur offers specialized facial therapies.</p>

      <h2>1. Vitamin C Brightening Facial</h2>
      <p>Ideal for sun-tanned or dull skin. Concentrated Vitamin C extracts lighten dark spots and even out skin tone after sun exposure.</p>

      <h2>2. Luxury 24K Gold Glow Facial</h2>
      <p>Perfect before weddings, parties, or special festivals. Gold leaf extracts boost skin elasticity and impart a luminous bridal radiance.</p>

      <h2>3. Deep Hydration Collagen Facial</h2>
      <p>Recommended for dry or mature skin. Infuses hyaluronic acid and collagen peptides to plump skin and reduce fine lines.</p>
    `,
    faqs: [
      { question: 'When is the best time to get a facial before an event in Mohanur?', answer: 'We recommend getting your facial 2 to 3 days before your special event for optimal glow and skin settling.' }
    ],
    relatedPosts: [
      { slug: 'benefits-of-hair-spa', title: 'Top 7 Benefits of Regular Hair Spa Treatments' },
      { slug: 'how-to-choose-bridal-makeup', title: 'How to Choose the Perfect Bridal Makeup Look' }
    ]
  }
};

export default function Blog() {
  useSEO(PAGE_SEO.blog);

  return (
    <main className="blog-page">
      {/* ── Breadcrumb ── */}
      <nav className="breadcrumb-bar" aria-label="Breadcrumb">
        <div className="container">
          <ol className="breadcrumb-list">
            <li><Link to="/">Home</Link></li>
            <li><span>/</span></li>
            <li className="active">Blog & Guides</li>
          </ol>
        </div>
      </nav>

      {/* ── Header ── */}
      <section className="blog-hero">
        <div className="container text-center">
          <div className="section-label mx-auto" style={{ justifyContent: 'center' }}>
            <Sparkles size={12} /> ZHA Beauty Journal
          </div>
          <h1 className="section-title">Beauty Tips & Styling Guides in Mohanur</h1>
          <p className="section-subtitle mx-auto">
            Expert hair care advice, skin glow secrets, and bridal beauty tips from the certified stylists at ZHA Aesthetic Salon.
          </p>
        </div>
      </section>

      {/* ── Blog Grid ── */}
      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {Object.values(BLOG_POSTS).map(post => (
              <article key={post.slug} className="blog-card">
                <div className="blog-card__media">
                  <img src={post.coverImage} alt={post.title} loading="lazy" width="400" height="250" />
                  <span className="blog-card__category">{post.category}</span>
                </div>
                <div className="blog-card__body">
                  <div className="blog-card__meta">
                    <span><Calendar size={13} /> {post.date}</span>
                    <span><Clock size={13} /> {post.readTime}</span>
                  </div>
                  <h2 className="blog-card__title">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="blog-card__excerpt">{post.excerpt}</p>
                  <div className="blog-card__footer">
                    <span className="blog-card__author"><User size={13} /> {post.author}</span>
                    <Link to={`/blog/${post.slug}`} className="read-more-link">
                      Read Guide <ArrowRight size={14} />
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
