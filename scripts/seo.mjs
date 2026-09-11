/**
 * seo.mjs — write robots.txt and sitemap.xml before every build.
 *
 * Generated rather than hand-kept so a new route cannot quietly go missing from
 * the sitemap, and so lastmod reflects the build rather than the day somebody
 * remembered to edit it.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = (process.env.VITE_SITE_URL || 'https://pravesha.in').replace(/\/$/, '');

/* Every indexable route, with how important it is relative to the others. */
const ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/terms', priority: '0.5', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.5', changefreq: 'yearly' },
  { path: '/refund-policy', priority: '0.5', changefreq: 'yearly' },
  { path: '/delivery-policy', priority: '0.4', changefreq: 'yearly' },
  { path: '/data-deletion', priority: '0.4', changefreq: 'yearly' },
  { path: '/grievance', priority: '0.4', changefreq: 'yearly' },
];

const today = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((r) => `  <url>
    <loc>${SITE}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const robots = `# Pravesha — vehicle entry passes for Karnataka's hill destinations
User-agent: *
Allow: /

# Nothing here is private, but these are not pages.
Disallow: /public/
Disallow: /legal/

Sitemap: ${SITE}/sitemap.xml
`;

mkdirSync(join(ROOT, 'public'), { recursive: true });
writeFileSync(join(ROOT, 'public', 'sitemap.xml'), sitemap);
writeFileSync(join(ROOT, 'public', 'robots.txt'), robots);
console.log(`seo: wrote robots.txt and sitemap.xml (${ROUTES.length} urls) for ${SITE}`);
