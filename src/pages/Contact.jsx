import { Link } from 'react-router-dom';
import Seo, { breadcrumb, ogImage } from '../lib/seo.jsx';
import ContactForm from '../components/ContactForm.jsx';
import Photo from '../components/Photo.jsx';
import WaIcon from '../components/WaIcon.jsx';
import { useLegalIndex, useSite } from '../lib/useSite';
import { FALLBACK_WA } from '../lib/api';

/*
 * A real, reachable contact page: a form that sends to the support mailbox, the
 * WhatsApp number the service actually runs on, the business details and the
 * grievance officer — all read from the back-end so they match the invoices and
 * the policies. The officer is published by designation rather than by a private
 * individual's name.
 */
export default function Contact() {
  const index = useLegalIndex();
  const site = useSite();
  const biz = index?.business || {};
  const officer = index?.grievance_officer;
  const wa = site?.whatsapp?.link || FALLBACK_WA;
  const number = site?.whatsapp?.number;
  const pretty = number ? `+${number.slice(0, 2)} ${number.slice(2, 7)} ${number.slice(7)}` : null;
  const email = biz.email || 'support@pravesha.in';

  return (
    <>
      <Seo
        title="Contact Pravesha — support for entry passes"
        description="Send us a message, reach us on WhatsApp, or write to support@pravesha.in. Registered address and grievance redressal details for Pravesha entry passes."
        path="/contact"
        image={ogImage({ title: 'Talk to us', sub: 'Support for bookings, payments and passes.', photo: 3 })}
        jsonLd={breadcrumb([{ name: 'Pravesha', path: '/' }, { name: 'Contact', path: '/contact' }])}
      />

      <header className="relative isolate overflow-hidden pb-14 pt-32 text-white">
        <Photo name="3" variant={2} sizes="100vw" position="center 60%" alt="" className="absolute inset-0 -z-20 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-forest-900/90 via-brand-deep/85 to-forest-800/80" />
        <div className="container-x">
          <Link to="/" className="text-[14px] font-medium text-white/70 transition hover:text-white">← Back to Pravesha</Link>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">Contact us</h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-white/80">
            Questions about a pass, a payment or your data. Write to us below, or reach us on the same WhatsApp chat
            you book in.
          </p>
        </div>
      </header>

      <div className="container-x grid items-start gap-10 py-16 lg:grid-cols-[1.05fr_.95fr]">
        <section>
          <h2 className="text-2xl font-extrabold text-ink">Send us a message</h2>
          <p className="mt-2 max-w-lg text-[16px] leading-relaxed text-muted">
            Anything that needs a written record — a payment, a pass that did not arrive, or a data request.
            It reaches <span className="font-medium text-ink">{email}</span> and we reply by email.
          </p>
          <div className="mt-6"><ContactForm /></div>
        </section>

        <aside className="space-y-6">
          <div className="card p-7">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#25d366]/15 text-brand"><WaIcon className="h-6 w-6" /></span>
            <h2 className="mt-5 text-xl font-bold text-ink">WhatsApp</h2>
            <p className="mt-2 text-[16px] leading-relaxed text-muted">
              Booking, your passes, and quick questions{pretty ? ` — ${pretty}` : ''}. Send &ldquo;hi&rdquo; to begin,
              or &ldquo;my passes&rdquo; to have your upcoming passes sent again.
            </p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-wa mt-6"><WaIcon /> Open WhatsApp</a>
          </div>

          <div className="card p-7">
            <h2 className="text-xl font-bold text-ink">Email us directly</h2>
            <p className="mt-2 text-[16px] leading-relaxed text-muted">
              Prefer your own mail client? Write to us and include your pass number or payment reference.
            </p>
            <a href={`mailto:${email}`} className="mt-4 inline-block font-semibold text-brand-light hover:underline">{email}</a>
          </div>

          <div className="card p-7">
            <h2 className="text-xl font-bold text-ink">Business details</h2>
            <dl className="mt-4 grid gap-x-6 gap-y-3 text-[15px] text-muted sm:grid-cols-[150px_1fr]">
              <dt className="font-semibold text-ink">Product</dt>
              <dd>{biz.product_name || 'Pravesha'}{biz.product_tagline ? ` — ${biz.product_tagline}` : ''}</dd>
              <dt className="font-semibold text-ink">Operated by</dt>
              <dd>{biz.legal_name || 'ServerPe App Solutions'}{biz.legal_form ? ` (${biz.legal_form})` : ''}</dd>
              {biz.address && (<><dt className="font-semibold text-ink">Registered address</dt><dd>{biz.address}</dd></>)}
              {biz.gstin && (<><dt className="font-semibold text-ink">GSTIN</dt><dd className="font-mono text-[14px]">{biz.gstin}</dd></>)}
              {biz.udyam && (<><dt className="font-semibold text-ink">Udyam</dt><dd className="font-mono text-[14px]">{biz.udyam}</dd></>)}
              {biz.website && (
                <>
                  <dt className="font-semibold text-ink">Website</dt>
                  <dd>
                    <a className="text-brand-light hover:underline" target="_blank" rel="noopener noreferrer"
                      href={`https://${String(biz.website).replace(/^https?:\/\//, '')}`}>{biz.website}</a>
                  </dd>
                </>
              )}
            </dl>
          </div>

          {officer && (
            <div className="card p-7">
              <h2 className="text-xl font-bold text-ink">Grievance redressal</h2>
              <p className="mt-2 text-[16px] leading-relaxed text-muted">
                If something went wrong and the answer you received did not settle it, write to {officer.name} at{' '}
                <a className="font-semibold text-brand-light hover:underline" href={`mailto:${officer.email}`}>{officer.email}</a>.
                We acknowledge within {officer.acknowledge_hours} hours and aim to resolve within {officer.resolve_days} days.
              </p>
              <Link to="/policy/grievance" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold text-brand-light hover:underline">
                Read the grievance redressal policy →
              </Link>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
