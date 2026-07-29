import fs from 'fs';
import path from 'path';

const DOMAIN = 'https://zhaaestheticsalon.in';
const TODAY = new Date().toISOString().split('T')[0];

const PUBLIC_ROUTES = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'weekly',
    image: {
      url: `${DOMAIN}/salon_green_theme_1.jpg`,
      title: 'ZHa Aesthetic Salon — Luxury Beauty Salon',
      caption: 'Professional beauty salon services',
    },
  },
  {
    path: '/services',
    priority: '0.95',
    changefreq: 'weekly',
  },
  {
    path: '/bridal-planner',
    priority: '0.90',
    changefreq: 'monthly',
  },
  {
    path: '/gallery',
    priority: '0.85',
    changefreq: 'weekly',
  },
  {
    path: '/book-appointment',
    priority: '0.90',
    changefreq: 'monthly',
  },
  {
    path: '/about',
    priority: '0.80',
    changefreq: 'monthly',
  },
  {
    path: '/contact',
    priority: '0.80',
    changefreq: 'monthly',
  },
  {
    path: '/offers',
    priority: '0.75',
    changefreq: 'weekly',
  },
  {
    path: '/testimonials',
    priority: '0.70',
    changefreq: 'weekly',
  },
];

function generateSitemapXML() {
  const urls = PUBLIC_ROUTES.map((route) => {
    const fullUrl = `${DOMAIN}${route.path}`;
    const imageBlock = route.image
      ? `
    <image:image>
      <image:loc>${route.image.url}</image:loc>
      <image:title>${route.image.title}</image:title>
      <image:caption>${route.image.caption}</image:caption>
    </image:image>`
      : '';

    return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>${imageBlock}
  </url>`;
  }).join('\n\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

${urls}

</urlset>
`;
}

const sitemapContent = generateSitemapXML();
const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');

fs.writeFileSync(outputPath, sitemapContent, 'utf-8');
console.log(`[Sitemap Generator] Successfully generated ${outputPath} with ${PUBLIC_ROUTES.length} public pages.`);
