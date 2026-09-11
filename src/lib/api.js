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

async function post(path, payload) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => null);

  /* A form is the one place a failure must be spoken plainly: the visitor has
     typed something they do not want to lose, so say what went wrong and leave
     their words on the screen. */
  if (!res) throw new Error('We could not reach the server. Please check your connection and try again.');
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.message || 'Something went wrong. Please try again, or email support@pravesha.in.');
  }
  return data;
}

export const api = {
  site: () => call('/public/site'),
  contact: (payload) => post('/public/contact', payload),
  legal: () => call('/legal'),
  legalDoc: (slug) => call(`/legal/${encodeURIComponent(slug)}`),
};

export const safe = (p, fallback = null) => p.then((d) => d).catch(() => fallback);

/** The WhatsApp link to start booking, even before the API has answered. */
export const FALLBACK_WA = 'https://wa.me/916363271302?text=hi';
