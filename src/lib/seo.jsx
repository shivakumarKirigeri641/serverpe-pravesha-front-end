import { Helmet } from 'react-helmet-async';

/*
 * One place for everything a crawler, a share preview or an ad reads.
 *
 * WHY IT MATTERS HERE. Most people will meet Pravesha as a link — pasted into a
 * family WhatsApp group, or as an ad. What they see first is not the page but
 * the card: an image, a title and one line. That card is composed by the
 * back-end from the same photographs the site uses (/public/og.jpg), so it can
 * never be a stale screenshot of a page that has changed.
 *
 * ABSOLUTE URLS ONLY. Facebook, WhatsApp and X resolve og:image against nothing
 * — a relative path silently produces a card with no picture, which is the most
 * common way a good page shares badly.
 *
 * STRUCTURED DATA describes what this is in the vocabulary search engines index:
 * the organisation behind it, the service it offers, the destinations it covers
 * and the questions it answers. It is written from the same content the page
 * shows, never invented for the crawler — a rich result that promises something
 * the page does not say is how a site loses the privilege.
 */

const SITE = (import.meta.env.VITE_SITE_URL || 'https://pravesha.in').replace(/\/$/, '');
const API = (import.meta.env.VITE_API_BASE || SITE).replace(/\/$/, '');

export const canonical = (path = '/') => `${SITE}${path === '/' ? '/' : path.replace(/\/$/, '')}`;

/** A share card composed by the back-end, optionally with its own words. */
export const ogImage = ({ title, sub, photo } = {}) => {
  const q = new URLSearchParams();
  if (title) q.set('t', title);
  if (sub) q.set('s', sub);
  if (photo) q.set('p', String(photo));
  const query = q.toString();
  return `${API}/public/og.jpg${query ? `?${query}` : ''}`;
};

export default function Seo({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  noindex = false,
  jsonLd = null,
}) {
  const url = canonical(path);
  const img = image || ogImage();
  const blocks = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <>
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Pravesha" />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="kn_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={img} />

    </Helmet>
    {/* Structured data sits in the document rather than in <head>: Helmet drops
        script children rendered from an array, and search engines read
        application/ld+json wherever it appears. */}
    {blocks.map((block, i) => (
      <script key={i} type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(block).replace(/</g, '\u003c') }} />
    ))}
    </>
  );
}

/* ───────────────────────────────────────────────────── structured data ── */

export const organisation = (biz = {}) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE}/#organisation`,
  name: 'Pravesha',
  legalName: biz.legal_name || 'ServerPe App Solutions',
  url: SITE,
  logo: `${SITE}/icon-512.png`,
  image: ogImage(),
  description: 'Vehicle entry passes for Karnataka’s hill destinations, booked on WhatsApp.',
  email: biz.email || 'support@pravesha.in',
  ...(biz.address ? {
    address: { '@type': 'PostalAddress', streetAddress: biz.address, addressLocality: 'Bengaluru', addressRegion: 'Karnataka', addressCountry: 'IN' },
  } : {}),
  areaServed: { '@type': 'State', name: 'Karnataka' },
});

export const website = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: SITE,
  name: 'Pravesha',
  inLanguage: ['en-IN', 'kn-IN'],
  publisher: { '@id': `${SITE}/#organisation` },
});

/** What we actually sell, in the vocabulary a search engine understands. */
export const service = (wa) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Vehicle entry pass booking',
  serviceType: 'Online vehicle entry pass for hill destinations',
  provider: { '@id': `${SITE}/#organisation` },
  areaServed: { '@type': 'State', name: 'Karnataka' },
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: wa,
    name: 'WhatsApp',
    availableLanguage: ['English', 'Kannada'],
  },
});

/** Only the destinations the back-end says exist, with the copy the page shows. */
export const destinations = (places, about) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Destinations covered by Pravesha',
  itemListElement: (places || []).map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'TouristAttraction',
      name: p.name,
      alternateName: p.name_kn || undefined,
      description: about?.[p.code]?.blurb || undefined,
      address: { '@type': 'PostalAddress', addressLocality: p.district, addressRegion: 'Karnataka', addressCountry: 'IN' },
      isAccessibleForFree: false,
      publicAccess: Boolean(p.is_active),
    },
  })),
});

export const faqPage = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: (faqs || []).map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const breadcrumb = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((c, i) => ({
    '@type': 'ListItem', position: i + 1, name: c.name, item: canonical(c.path),
  })),
});
