import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Landscape from '../components/Landscape.jsx';
import WaIcon from '../components/WaIcon.jsx';
import { useLegalIndex, useSite } from '../lib/useSite';
import { FALLBACK_WA } from '../lib/api';

/*
 * A real, reachable contact page: the business details, the WhatsApp number the
 * service actually runs on, and the grievance officer — all read from the
 * back-end so they match the invoices and the policies.
 */
export default function Contact() {
  const index = useLegalIndex();
  const site = useSite();
  const biz = index?.business || {};
  const officer = index?.grievance_officer;
  const wa = site?.whatsapp?.link || FALLBACK_WA;
  const number = site?.whatsapp?.number;
  const pretty = number ? `+${number.slice(0, 2)} ${number.slice(2, 7)} ${number.slice(7)}` : null;
  const email = biz.email || 'admin@serverpe.in';

  return (
    <>
      <Helmet>
        <title>Contact — Pravesha</title>
        <meta name="description" content="Reach the Pravesha team: WhatsApp, email, registered address and grievance officer." />
        <link rel="canonical" href="https://pravesha.in/contact" />
      </Helmet>

      <header className="relative isolate overflow-hidden pb-14 pt-32 text-white">
        <Landscape variant={2} className="absolute inset-0 -z-20 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-forest-900/90 via-brand-deep/85 to-forest-800/80" />
        <div className="container-x">
          <Link to="/" className="text-[14px] font-medium text-white/70 transition hover:text-white">← Back to Pravesha</Link>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">Contact us</h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-white/80">
            Questions about a pass, a payment or your data — the fastest way to reach us is the same WhatsApp chat you
            book in.
          </p>
        </div>
      </header>

      <div className="container-x grid gap-6 py-16 md:grid-cols-2">
        <div className="card flex flex-col p-7">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#25d366]/15 text-brand"><WaIcon className="h-6 w-6" /></span>
          <h2 className="mt-5 text-xl font-bold text-ink">WhatsApp</h2>
          <p className="mt-2 flex-1 text-[16px] leading-relaxed text-muted">
            Booking, your passes, and support{pretty ? ` — ${pretty}` : ''}. Send &ldquo;hi&rdquo; to begin, or
            &ldquo;my passes&rdquo; to have your upcoming passes sent again.
          </p>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-wa mt-6 self-start"><WaIcon /> Open WhatsApp</a>
        </div>

        <div className="card flex flex-col p-7">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-mist-100 text-2xl">✉️</span>
          <h2 className="mt-5 text-xl font-bold text-ink">Email</h2>
          <p className="mt-2 flex-1 text-[16px] leading-relaxed text-muted">
            For invoices, refunds, data requests or anything that needs a written record.
          </p>
          <a href={`mailto:${email}`} className="mt-6 self-start font-semibold text-brand-light hover:underline">{email}</a>
        </div>

        <div className="card p-7 md:col-span-2">
          <h2 className="text-xl font-bold text-ink">Business details</h2>
          <dl className="mt-4 grid gap-x-8 gap-y-3 text-[16px] text-muted sm:grid-cols-[180px_1fr]">
            <dt className="font-semibold text-ink">Product</dt>
            <dd>{biz.product_name || 'Pravesha'}{biz.product_tagline ? ` — ${biz.product_tagline}` : ''}</dd>
            <dt className="font-semibold text-ink">Operated by</dt>
            <dd>{biz.legal_name || 'ServerPe App Solutions'}{biz.legal_form ? ` (${biz.legal_form})` : ''}</dd>
            {biz.address && (<><dt className="font-semibold text-ink">Registered address</dt><dd>{biz.address}</dd></>)}
            {biz.gstin && (<><dt className="font-semibold text-ink">GSTIN</dt><dd className="font-mono">{biz.gstin}</dd></>)}
            {biz.udyam && (<><dt className="font-semibold text-ink">Udyam registration</dt><dd className="font-mono">{biz.udyam}</dd></>)}
            {biz.website && (
              <>
                <dt className="font-semibold text-ink">Website</dt>
                <dd><a className="text-brand-light hover:underline" href={`https://${String(biz.website).replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer">{biz.website}</a></dd>
              </>
            )}
          </dl>
        </div>

        {officer && (
          <div className="card p-7 md:col-span-2">
            <h2 className="text-xl font-bold text-ink">Grievance officer</h2>
            <p className="mt-2 text-[16px] leading-relaxed text-muted">
              If something went wrong and the answer you received did not settle it, write to our grievance officer. We
              acknowledge within {officer.acknowledge_hours} hours and aim to resolve within {officer.resolve_days} days.
            </p>
            <dl className="mt-4 grid gap-x-8 gap-y-3 text-[16px] text-muted sm:grid-cols-[180px_1fr]">
              <dt className="font-semibold text-ink">Name</dt><dd>{officer.name}</dd>
              <dt className="font-semibold text-ink">Email</dt>
              <dd><a className="text-brand-light hover:underline" href={`mailto:${officer.email}`}>{officer.email}</a></dd>
            </dl>
            <Link to="/grievance" className="mt-5 inline-block font-semibold text-brand-light hover:underline">Read the grievance redressal policy →</Link>
          </div>
        )}
      </div>
    </>
  );
}
