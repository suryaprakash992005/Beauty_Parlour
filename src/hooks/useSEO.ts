import { useEffect } from 'react';

const SITE_NAME = 'ZHa Aesthetic Salon';
const DEFAULT_TITLE = `${SITE_NAME} — Best Beauty Salon in Mohanur & Namakkal`;
const DEFAULT_DESCRIPTION =
  'ZHa Aesthetic Salon is the premier unisex beauty salon & hair spa in Mohanur & Namakkal, Tamil Nadu. Expert hair styling, HD bridal makeup, keratin treatment, hydra facials, waxing & nails.';
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
 * Open Graph, Twitter Card, and JSON-LD schema injection.
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
  const pageTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
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
    setMeta('meta[name="robots"]', noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // Geo & Local SEO Meta
    setMeta('meta[name="geo.region"]', 'IN-TN');
    setMeta('meta[name="geo.placename"]', 'Mohanur, Namakkal, Tamil Nadu');
    setMeta('meta[name="geo.position"]', '11.0475;78.1458');
    setMeta('meta[name="ICBM"]', '11.0475, 78.1458');

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
    setMeta('meta[property="og:site_name"]', SITE_NAME);
    setMeta('meta[property="og:locale"]', 'en_IN');

    // ── Twitter Card ──
    setMeta('meta[name="twitter:card"]', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', pageTitle);
    setMeta('meta[name="twitter:description"]', pageDesc);
    setMeta('meta[name="twitter:image"]', ogImage);

    // ── Breadcrumb Schema ──
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          ...breadcrumbs.map((b, i) => ({
            '@type': 'ListItem',
            position: i + 2,
            name: b.name,
            item: `${SITE_URL}${b.url}`,
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

/** Page-level Local SEO configs covering both Mohanur & Namakkal targets */
export const PAGE_SEO = {
  home: {
    title: 'Best Beauty Salon in Mohanur & Namakkal | Hair Spa, Bridal & Skincare',
    description:
      'ZHa Aesthetic Salon is the best unisex beauty salon in Mohanur & Namakkal, Tamil Nadu. Expert hair styling, HD bridal makeup, keratin treatment, hydra facials, waxing & nails.',
    canonical: '/',
  },
  about: {
    title: 'About Us — Top Beauty Experts & Hair Stylists in Mohanur & Namakkal',
    description:
      'Meet certified hair stylists & makeup artists at ZHa Aesthetic Salon, Mohanur & Namakkal. Over 12 years of luxury beauty excellence in Namakkal district.',
    canonical: '/about',
  },
  services: {
    title: 'Hair, Skin & Bridal Beauty Services in Mohanur & Namakkal | ZHa Salon',
    description:
      'Explore all luxury beauty treatments at ZHa Aesthetic Salon in Mohanur & Namakkal: Hair cuts, hair spa, keratin, botox treatment, facials, HD bridal makeup & waxing.',
    canonical: '/services',
  },
  gallery: {
    title: 'Beauty & Bridal Transformation Portfolio — Mohanur & Namakkal',
    description:
      'View real bridal makeovers, hair styling, keratin treatment transformations & nail art from ZHa Aesthetic Salon in Mohanur & Namakkal.',
    canonical: '/gallery',
  },
  contact: {
    title: 'Contact Us — ZHa Aesthetic Salon Mohanur & Namakkal | Directions & Phone',
    description:
      'Visit ZHa Aesthetic Salon in Mohanur, Namakkal District, Tamil Nadu. Call +91 82709 04659 for appointment booking & Google Maps directions.',
    canonical: '/contact',
  },
  book: {
    title: 'Book Appointment Online — ZHa Aesthetic Salon Mohanur & Namakkal',
    description:
      'Book your appointment online at ZHa Aesthetic Salon in Mohanur & Namakkal. Premium hair design, hydra facials, HD bridal makeup, keratin & spa treatments.',
    canonical: '/book-appointment',
  },
  bridal: {
    title: 'Best Bridal Makeup Artist in Namakkal & Mohanur | Wedding Packages',
    description:
      'Luxury HD bridal makeup & pre-bridal packages in Mohanur & Namakkal. Saree draping, bridal hair styling, hydra facials & party makeup by senior artists.',
    canonical: '/bridal-planner',
  },
  testimonials: {
    title: 'Client Reviews & Ratings — ZHa Aesthetic Salon Mohanur & Namakkal',
    description:
      'Read 100% genuine customer reviews for ZHa Aesthetic Salon Mohanur & Namakkal. See why clients rate us as the best hair salon & bridal studio in Namakkal district.',
    canonical: '/testimonials',
  },
  offers: {
    title: 'Exclusive Beauty Offers & Deals in Mohanur & Namakkal | ZHa Salon',
    description:
      'Discover special discounts on hair spa, hydra facials, keratin treatments & bridal packages at ZHa Aesthetic Salon in Mohanur & Namakkal.',
    canonical: '/offers',
  },
  blog: {
    title: 'Beauty & Bridal Hair Care Blog — Mohanur & Namakkal | ZHa Salon',
    description:
      'Expert hair care advice, HD bridal makeup guides, keratin treatment tips & pre-wedding skincare routines from ZHa Aesthetic Salon Mohanur & Namakkal.',
    canonical: '/blog',
  },
};
