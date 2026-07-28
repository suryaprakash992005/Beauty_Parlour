import { useEffect } from 'react';

const SITE_NAME = 'ZHa Aesthetic Salon';
const DEFAULT_TITLE = 'Best Beauty Salon in Namakkal | ZHa Aesthetic Salon | Hair, Bridal & Spa';
const DEFAULT_DESCRIPTION =
  'Visit ZHa Aesthetic Salon, the best premium unisex beauty salon in Namakkal, located in Mohanur. Expert hair styling, bridal makeup, keratin treatment, facials, hair spa, nails, waxing and skincare.';
const DEFAULT_KEYWORDS =
  'Best Salon in Namakkal, Best Beauty Salon Namakkal, Hair Salon Namakkal, Unisex Salon Namakkal, Beauty Parlour Namakkal, Luxury Salon Namakkal, Bridal Makeup Namakkal, Keratin Treatment Namakkal, Hair Spa Namakkal, Facial Namakkal, Waxing Namakkal, Hair Styling Namakkal, Hair Colour Namakkal, Pedicure Namakkal, Manicure Namakkal, Nail Extension Namakkal, Salon Near Me, Best Salon Near Me, Salon in Mohanur, Beauty Salon Mohanur, Bridal Makeup Mohanur, Hair Spa Mohanur, Hair Cut Mohanur, Salon Near Mohanur';
const SITE_URL = 'https://zhaaestheticsalon.in';
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  noIndex?: boolean;
  breadcrumbs?: Array<{ name: string; url: string }>;
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Sets dynamic per-page SEO: <title>, meta description, keywords, canonical,
 * Open Graph, Twitter Card, and optional JSON-LD schema injection.
 */
export function useSEO({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website',
  ogImage = OG_IMAGE,
  noIndex = false,
  breadcrumbs,
  schema,
}: SEOProps = {}) {
  const pageTitle = title ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`) : DEFAULT_TITLE;
  const pageDesc = description || DEFAULT_DESCRIPTION;
  const pageKeywords = keywords || DEFAULT_KEYWORDS;
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
    setMeta('meta[name="keywords"]', pageKeywords);
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
  }, [pageTitle, pageDesc, pageUrl, pageKeywords]);
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

/** Page-level SEO configs targeting Namakkal as primary location & Mohanur as exact physical location */
export const PAGE_SEO = {
  home: {
    title: 'Best Beauty Salon in Namakkal | ZHa Aesthetic Salon | Hair, Bridal & Spa',
    description:
      'Visit ZHa Aesthetic Salon, the best premium unisex beauty salon in Namakkal, located in Mohanur. Expert hair styling, bridal makeup, keratin treatment, facials, hair spa, nails, waxing and skincare.',
    canonical: '/',
  },
  about: {
    title: 'About ZHa Aesthetic Salon — Best Beauty Salon in Namakkal',
    description:
      'Discover ZHa Aesthetic Salon, the top unisex beauty salon in Namakkal, located in Mohanur. Certified hair stylists, HD bridal makeup artists & luxury skin care experts.',
    canonical: '/about',
  },
  services: {
    title: 'Hair Cut, Keratin & Bridal Services in Namakkal — ZHa Salon',
    description:
      'Top beauty services in Namakkal: hair cut, keratin treatment, HD bridal makeup, hair spa, facials, waxing & nail extensions at ZHa Aesthetic Salon in Mohanur.',
    canonical: '/services',
  },
  gallery: {
    title: 'Bridal Makeup & Hair Transformation Gallery in Namakkal',
    description:
      'View stunning hair transformations, HD bridal makeup, and glowing skin facials at ZHa Aesthetic Salon, the best salon in Namakkal, located in Mohanur.',
    canonical: '/gallery',
  },
  contact: {
    title: 'Contact ZHa Aesthetic Salon — Best Salon in Namakkal, Mohanur',
    description:
      'Contact ZHa Aesthetic Salon located at 1st Floor, MPS Traders Building, opposite Taluka Office, Mohanur, Namakkal District. Call +91 96889 99188.',
    canonical: '/contact',
  },
  book: {
    title: 'Book Salon Appointment in Namakkal — ZHa Aesthetic Salon',
    description:
      'Book your haircut, HD bridal makeup, keratin treatment or hair spa online at ZHa Aesthetic Salon, the best beauty salon in Namakkal, located in Mohanur.',
    canonical: '/book-appointment',
  },
  bridal: {
    title: 'Best Bridal Makeup in Namakkal — Packages & Airbrush Makeup',
    description:
      'Book the best bridal makeup in Namakkal at ZHa Aesthetic Salon in Mohanur. HD bridal makeup, airbrush makeup, saree draping & pre-bridal grooming.',
    canonical: '/bridal-planner',
  },
  testimonials: {
    title: 'Client Reviews & Ratings — Best Salon in Namakkal',
    description:
      'Read authentic client reviews for ZHa Aesthetic Salon, the highest-rated unisex beauty salon in Namakkal, located in Mohanur. Premium hair, bridal & spa care.',
    canonical: '/testimonials',
  },
  offers: {
    title: 'Exclusive Beauty Offers in Namakkal — ZHa Aesthetic Salon',
    description:
      'Claim special discounts on bridal makeup, hair spa, facial packages and keratin treatment at ZHa Aesthetic Salon, the top luxury salon in Namakkal, Mohanur.',
    canonical: '/offers',
  },
  blogs: {
    title: 'Beauty Blog & Hair Care Tips in Namakkal — ZHa Aesthetic Salon',
    description:
      'Read expert beauty advice, bridal makeup trends, keratin treatment benefits, and hair care tips from ZHa Aesthetic Salon in Namakkal, Mohanur.',
    canonical: '/blogs',
  },
};
