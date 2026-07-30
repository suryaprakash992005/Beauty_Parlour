import { useEffect } from 'react';

const SITE_NAME = 'ZHA Aesthetic Salon';
const DEFAULT_TITLE = `${SITE_NAME} | Beauty Salon in Mohanur | Hair Spa, Facial & Bridal`;
const DEFAULT_DESCRIPTION =
  'ZHA Aesthetic Salon is the premier beauty salon in Mohanur, Namakkal. Professional hair spa, facials, HD bridal makeup, keratin treatment, threading & waxing. Book now!';
const SITE_URL = 'https://www.zhaaestheticsalon.in';
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  noIndex?: boolean;
  breadcrumbs?: Array<{ name: string; url: string }>;
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Sets dynamic per-page SEO: <title>, meta description, canonical,
 * Open Graph, Twitter Card, and optional JSON-LD schema injection.
 */
export function useSEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = OG_IMAGE,
  noIndex = false,
  breadcrumbs,
  schema,
}: SEOProps = {}) {
  const pageTitle = title ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`) : DEFAULT_TITLE;
  const pageDesc = description || DEFAULT_DESCRIPTION;
  const pageUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  useEffect(() => {
    // ── Document Title ──
    document.title = pageTitle;

    // ── Meta helpers ──
    const setMeta = (selector: string, value: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        const match = selector.match(/\[(\w+)="([^"]+)"\]/);
        if (match) el.setAttribute(match[1], match[2]);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    setMeta('meta[name="description"]', pageDesc);
    setMeta('meta[name="robots"]', noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large');

    // ── Canonical ──
    let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.rel = 'canonical';
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = pageUrl;

    // ── Open Graph ──
    setMeta('meta[property="og:title"]', pageTitle);
    setMeta('meta[property="og:description"]', pageDesc);
    setMeta('meta[property="og:url"]', pageUrl);
    setMeta('meta[property="og:type"]', ogType);
    setMeta('meta[property="og:image"]', ogImage);

    // ── Twitter Card ──
    setMeta('meta[name="twitter:title"]', pageTitle);
    setMeta('meta[name="twitter:description"]', pageDesc);
    setMeta('meta[name="twitter:image"]', ogImage);

    // ── Breadcrumb Schema ──
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
          ...breadcrumbs.map((b, i) => ({
            '@type': 'ListItem',
            position: i + 2,
            name: b.name,
            item: SITE_URL + b.url,
          })),
        ],
      };
      injectSchema('__breadcrumb-schema__', breadcrumbSchema);
    }

    // ── Custom Page Schema ──
    if (schema) {
      const s = Array.isArray(schema)
        ? { '@context': 'https://schema.org', '@graph': schema }
        : schema;
      injectSchema('__page-schema__', s);
    }

    return () => {
      removeSchema('__breadcrumb-schema__');
      removeSchema('__page-schema__');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageTitle, pageDesc, pageUrl]);
}

function injectSchema(id: string, data: Record<string, unknown>) {
  removeSchema(id);
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function removeSchema(id: string) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
}

/** Page-level SEO configs for all routes */
export const PAGE_SEO = {
  home: {
    title: 'ZHA Aesthetic Salon | Beauty Salon in Mohanur | Hair Spa, Facial & Bridal',
    description:
      'ZHA Aesthetic Salon is the premier beauty salon in Mohanur, Namakkal. Professional hair spa, facials, HD bridal makeup, keratin treatment, threading & waxing. Book now!',
    canonical: '/',
  },
  about: {
    title: 'About ZHA Aesthetic Salon | Premier Beauty Parlour in Mohanur, Namakkal',
    description:
      'Learn about ZHA Aesthetic Salon in Mohanur. Over a decade of luxury beauty expertise — certified hair stylists, facial experts, and premium bridal makeup artists.',
    canonical: '/about',
  },
  services: {
    title: 'Beauty Services in Mohanur | Hair Spa, Facial, Keratin & Makeup | ZHA Salon',
    description:
      'Explore beauty salon services in Mohanur: Hair Spa, HD Bridal Makeup, Keratin Treatment, Facials, Hair Colouring, Waxing, Threading, Manicure & Pedicure.',
    canonical: '/services',
  },
  gallery: {
    title: 'Beauty Portfolio & Bridal Makeovers | ZHA Aesthetic Salon Mohanur',
    description:
      'View our gallery of real bridal makeovers, hair spa transformations, skin facials, and beauty treatments at ZHA Aesthetic Salon in Mohanur, Namakkal.',
    canonical: '/gallery',
  },
  contact: {
    title: 'Contact ZHA Aesthetic Salon | Beauty Parlour in Mohanur, Namakkal',
    description:
      'Contact ZHA Aesthetic Salon in Mohanur, Namakkal. Call +91 82709 04659 or visit our salon opposite Taluka Office, Nehru Nagar, Mohanur.',
    canonical: '/contact',
  },
  book: {
    title: 'Book Appointment Online | ZHA Aesthetic Salon Mohanur',
    description:
      'Book your beauty appointment online at ZHA Aesthetic Salon Mohanur. Choose your preferred date & time for hair, facial, bridal, or spa services.',
    canonical: '/book-appointment',
  },
  bridal: {
    title: 'Bridal Makeup in Mohanur | HD & Airbrush Packages | ZHA Aesthetic Salon',
    description:
      'Plan your dream wedding look with ZHA Aesthetic Salon Mohanur. HD & Airbrush bridal makeup, saree draping, bridal hair styling & pre-bridal packages.',
    canonical: '/bridal-planner',
  },
  testimonials: {
    title: 'Client Reviews & Ratings | ZHA Aesthetic Salon Mohanur',
    description:
      'Read 5-star Google reviews from happy clients in Mohanur & Namakkal. Experience why ZHA Aesthetic Salon is Mohanur\'s favorite beauty destination.',
    canonical: '/testimonials',
  },
  offers: {
    title: 'Exclusive Beauty Offers & Deals in Mohanur | ZHA Aesthetic Salon',
    description:
      'Discover limited-time beauty offers, facial discounts, and bridal package savings at ZHA Aesthetic Salon in Mohanur, Namakkal.',
    canonical: '/offers',
  },
  blog: {
    title: 'Beauty Tips & Hair Care Blog | ZHA Aesthetic Salon Mohanur',
    description:
      'Read expert hair care advice, skin care tips, bridal makeup guides, and beauty trends from the professional stylists at ZHA Aesthetic Salon Mohanur.',
    canonical: '/blog',
  },
};
