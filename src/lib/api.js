/**
 * Everything the site shows about destinations, fees, rules and policies comes
 * from the Pravesha back-end — the same tables the booking uses — so the website
 * can never advertise a fee, a destination or a rule the booking would not
 * honour.
 *
 * Empty base in development, where Vite proxies /public and /legal to the local
 * back-end. In production set VITE_API_BASE to the API's origin at build time.
 *
 * Failures resolve to null rather than throwing: the site must still render if
 * the API is briefly unreachable, falling back to the copy written here.
 */

const BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

async function call(path) {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json' } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  site: () => call('/public/site'),
  legal: () => call('/legal'),
  legalDoc: (slug) => call(`/legal/${encodeURIComponent(slug)}`),
};

export const safe = (p, fallback = null) => p.then((d) => d).catch(() => fallback);

/** The WhatsApp link to start booking, even before the API has answered. */
export const FALLBACK_WA = 'https://wa.me/916363271302?text=hi';
