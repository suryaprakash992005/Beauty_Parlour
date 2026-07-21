import { useEffect } from 'react';

const SITE_NAME = 'ZHa Aesthetic Salon';
const DEFAULT_TITLE = `${SITE_NAME} — Best Beauty Salon in Mohanur, Namakkal`;
const DEFAULT_DESCRIPTION =
  'ZHa Aesthetic Salon in Mohanur, Namakkal — Professional hair styling, bridal makeup, keratin treatment, facials & luxury spa. Book now!';
const SITE_URL = 'https://zhaaestheticsalon.com';
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
        // parse attr=val from selector like name="description"
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
      // Cleanup page-specific schema on unmount
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
    title: 'Best Beauty Salon in Mohanur, Namakkal — Hair, Bridal & Spa',
    description:
      'ZHa Aesthetic Salon in Mohanur is your premium beauty destination. Expert hair styling, bridal makeup, keratin treatment, facials, waxing & spa. Book an appointment today!',
    canonical: '/',
  },
  about: {
    title: 'About ZHa Aesthetic Salon — Our Story & Expert Team',
    description:
      'Discover the story behind ZHa Aesthetic Salon in Mohanur, Namakkal. Over a decade of luxury beauty expertise — certified stylists, premium products, and a passion for elegance.',
    canonical: '/about',
  },
  services: {
    title: 'Beauty Services in Mohanur — Hair, Skin, Bridal & More',
    description:
      'Explore all beauty services at ZHa Aesthetic Salon in Mohanur: hair cuts, blow dry, keratin, hair spa, facials, bridal makeup, waxing, threading, manicure & pedicure.',
    canonical: '/services',
  },
  gallery: {
    title: 'Portfolio Gallery — ZHa Aesthetic Salon Mohanur',
    description:
      'Browse our stunning portfolio of bridal makeovers, hair transformations, nail art, and skin treatments at ZHa Aesthetic Salon in Mohanur, Namakkal.',
    canonical: '/gallery',
  },
  contact: {
    title: 'Contact Us — ZHa Aesthetic Salon Mohanur',
    description:
      'Get in touch with ZHa Aesthetic Salon in Mohanur, Namakkal. Call +91 82709 04659, visit us at Nehru Nagar, or send us a message online.',
    canonical: '/contact',
  },
  book: {
    title: 'Book an Appointment — ZHa Aesthetic Salon Mohanur',
    description:
      'Book your beauty appointment online at ZHa Aesthetic Salon in Mohanur, Namakkal. Choose from hair styling, facials, bridal makeup, keratin, waxing & more.',
    canonical: '/book-appointment',
  },
  bridal: {
    title: 'Bridal Makeup & Packages — ZHa Aesthetic Salon Mohanur',
    description:
      'Plan your dream bridal look with ZHa Aesthetic Salon in Mohanur. Comprehensive bridal packages including HD bridal makeup, hairstyling, saree draping & pre-bridal grooming.',
    canonical: '/bridal-planner',
  },
  testimonials: {
    title: 'Client Reviews & Testimonials — ZHa Aesthetic Salon',
    description:
      'Read genuine client reviews about ZHa Aesthetic Salon in Mohanur. See what our happy customers say about our hair, bridal, and spa services.',
    canonical: '/testimonials',
  },
  offers: {
    title: 'Exclusive Beauty Offers & Deals — ZHa Aesthetic Salon',
    description:
      'Discover exclusive seasonal offers, bridal discounts, and loyalty deals at ZHa Aesthetic Salon in Mohanur, Namakkal. Premium beauty at exceptional value.',
    canonical: '/offers',
  },
};
