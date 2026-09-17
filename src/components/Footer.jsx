import { Link } from 'react-router-dom';
import Landscape from './Landscape.jsx';
import { useLegalIndex, useSite } from '../lib/useSite';
import { FALLBACK_WA } from '../lib/api';

/* Said wherever the service is described, until the approval is granted (user, 2026-09-17). */
export const APPROVAL_NOTE = 'Approval from the Department of Tourism, Government of Karnataka, is awaited.';

export default function Footer() {
  const index = useLegalIndex();
  const site = useSite();
  const biz = index?.business || {};
  const docs = index?.documents || [];
  const wa = site?.whatsapp?.link || FALLBACK_WA;

  return (
    <footer className="relative mt-24 overflow-hidden bg-forest-900 text-white/80">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-24 opacity-30">
        <Landscape variant={3} sun={false} mist={false} className="h-full w-full" />
      </div>
      <div className="container-x relative grid gap-10 pb-10 pt-28 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 text-white">
            <img src="/icon-192.png" alt="" className="h-10 w-10 rounded-xl" />
            <span className="font-display text-2xl font-extrabold">Pravesha</span>
            <span className="text-sm font-semibold text-brand-accent">ಪ್ರವೇಶ</span>
          </div>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed">
            Entry passes for Karnataka&rsquo;s destinations — for your vehicle or for your group — booked on
            WhatsApp. Pick a place, a date and a time slot, pay online, and go.
          </p>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-wa mt-6">Book on WhatsApp</a>
        </div>

        <div>
          <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-white">Policies</h3>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {(docs.length ? docs : [
              { slug: 'privacy', title: 'Privacy Policy' }, { slug: 'terms', title: 'Terms & Conditions' },
              { slug: 'data-deletion', title: 'Data Deletion' }, { slug: 'refund-policy', title: 'Refund & Cancellation Policy' },
              { slug: 'delivery-policy', title: 'Pass Delivery Policy' }, { slug: 'grievance', title: 'Grievance Redressal' },
            ]).map((d) => (
              <li key={d.slug}>
                {/* Opens in its own tab (user, 2026-09-17): reading a policy should not take the visitor off the page they were on. */}
                <Link to={`/${d.slug}`} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">{d.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-white">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li><Link to="/contact" className="transition hover:text-white">Contact us</Link></li>
            {biz.email && <li><a href={`mailto:${biz.email}`} className="transition hover:text-white">{biz.email}</a></li>}
            <li><a href={wa} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">WhatsApp</a></li>
          </ul>
        </div>
      </div>

      <div className="container-x relative flex flex-col gap-2 border-t border-white/10 py-6 text-[13px] text-white/60 sm:flex-row sm:items-center sm:justify-between">
        {/* Trademark, and no copyright line (user, 2026-09-17). */}
        <p>Pravesha™ is a trademark of {biz.legal_name || 'ServerPe App Solutions'}™. {biz.gstin ? `GSTIN ${biz.gstin}.` : ''}</p>
        <p>{APPROVAL_NOTE}</p>
      </div>
    </footer>
  );
}
