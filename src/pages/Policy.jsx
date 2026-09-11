import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Photo from '../components/Photo.jsx';
import WaIcon from '../components/WaIcon.jsx';
import { api, safe, FALLBACK_WA } from '../lib/api';
import { useLegalIndex, useSite } from '../lib/useSite';

/*
 * Every policy is rendered from the back-end, which is also the copy the
 * WhatsApp flow links to and the version the customer consented to. Nothing is
 * duplicated here, so a policy can never be updated in one place and stale in
 * the other.
 */

const DELETE_TEXT = 'DELETE MY DATA';

function Section({ s }) {
  const paras = String(s.description || '').split('\n').filter(Boolean);
  return (
    <section id={`s${s.section_no}`} className="scroll-mt-24">
      <h2 className="flex gap-3 text-[1.35rem] font-bold text-ink">
        <span className="text-brand-accent">{s.section_no}.</span>
        <span>{s.title}</span>
      </h2>
      {paras.map((p, i) => (
        <p key={i} className="mt-3 text-[16px] leading-[1.75] text-muted">{p}</p>
      ))}
    </section>
  );
}

export default function Policy({ slug }) {
  const [doc, setDoc] = useState(null);
  const [state, setState] = useState('loading');
  const index = useLegalIndex();
  const site = useSite();
  const wa = site?.whatsapp?.link || FALLBACK_WA;
  const waDelete = wa.split('?')[0] + `?text=${encodeURIComponent(DELETE_TEXT)}`;

  useEffect(() => {
    let alive = true;
    setState('loading');
    setDoc(null);
    safe(api.legalDoc(slug)).then((d) => {
      if (!alive) return;
      if (d?.document) { setDoc(d.document); setState('ready'); } else setState('error');
    });
    return () => { alive = false; };
  }, [slug]);

  const others = (index?.documents || []).filter((d) => d.slug !== slug);
  const biz = index?.business || {};
  const officer = index?.grievance_officer;

  return (
    <>
      <Helmet>
        <title>{`${doc?.title || 'Policy'} — Pravesha`}</title>
        {doc?.summary && <meta name="description" content={doc.summary} />}
        <link rel="canonical" href={`https://pravesha.in/${slug}`} />
      </Helmet>

      <header className="relative isolate overflow-hidden pb-14 pt-32 text-white">
        <Photo name="1" variant={1} sizes="100vw" position="center 45%" alt="" className="absolute inset-0 -z-20 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-forest-900/90 via-brand-deep/85 to-forest-800/80" />
        <div className="container-x">
          <Link to="/" className="text-[14px] font-medium text-white/70 transition hover:text-white">← Back to Pravesha</Link>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">{doc?.title || (state === 'error' ? 'Policy' : ' ')}</h1>
          {doc?.title_kn && <div className="mt-2 text-lg font-semibold text-sunrise-300">{doc.title_kn}</div>}
          {doc?.summary && <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-white/80">{doc.summary}</p>}
          {doc && (
            <p className="mt-5 text-[13px] text-white/60">
              Version {doc.version} · Effective from {doc.effective_from}
              {doc.modified_at ? ` · Last updated ${String(doc.modified_at).slice(0, 10)}` : ''}
            </p>
          )}
        </div>
      </header>

      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1fr_260px]">
        <article className="max-w-3xl space-y-10">
          {state === 'loading' && (
            <div className="space-y-6" aria-busy="true">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-5 w-1/3 animate-pulse rounded bg-mist-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-mist-100" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-mist-100" />
                </div>
              ))}
            </div>
          )}

          {state === 'error' && (
            <div className="card p-8">
              <h2 className="text-xl font-bold text-ink">This policy could not be loaded right now</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-muted">
                Please try again in a moment. If it keeps failing, write to{' '}
                <a className="font-semibold text-brand-light hover:underline" href={`mailto:${biz.email || 'support@pravesha.in'}`}>
                  {biz.email || 'support@pravesha.in'}
                </a>{' '}
                and we will send you the document.
              </p>
            </div>
          )}

          {state === 'ready' && doc.sections?.map((s) => <Section key={s.section_no} s={s} />)}

          {state === 'ready' && slug === 'data-deletion' && (
            <div className="rounded-2xl border border-brand-accent/30 bg-mist-50 p-7">
              <h2 className="text-xl font-bold text-ink">Request deletion now</h2>
              <p className="mt-2 text-[16px] leading-relaxed text-muted">
                Send us the message <b>{DELETE_TEXT}</b> from the WhatsApp number you booked with. We reply with a
                reference number for your request.
              </p>
              <a href={waDelete} target="_blank" rel="noopener noreferrer" className="btn-wa mt-5">
                <WaIcon /> Send &ldquo;{DELETE_TEXT}&rdquo;
              </a>
            </div>
          )}

          {state === 'ready' && officer && (slug === 'grievance' || slug === 'privacy') && (
            <div className="card p-7">
              <h2 className="text-xl font-bold text-ink">Grievance officer</h2>
              <dl className="mt-4 grid gap-2 text-[16px] text-muted sm:grid-cols-[140px_1fr]">
                <dt className="font-semibold text-ink">Contact</dt><dd>{officer.name}</dd>
                <dt className="font-semibold text-ink">Email</dt>
                <dd><a className="text-brand-light hover:underline" href={`mailto:${officer.email}`}>{officer.email}</a></dd>
                <dt className="font-semibold text-ink">Acknowledgement</dt><dd>Within {officer.acknowledge_hours} hours</dd>
                <dt className="font-semibold text-ink">Resolution</dt><dd>Within {officer.resolve_days} days</dd>
                {biz.address && (<><dt className="font-semibold text-ink">Address</dt><dd>{biz.address}</dd></>)}
              </dl>
            </div>
          )}

          {state === 'ready' && (
            <p className="border-t border-line pt-6 text-[14px] leading-relaxed text-muted">
              Pravesha is operated by {biz.legal_name || 'ServerPe App Solutions'}
              {biz.legal_form ? ` (${biz.legal_form})` : ''}
              {biz.gstin ? `, GSTIN ${biz.gstin}` : ''}
              {biz.address ? `, ${biz.address}` : ''}. Questions about this document:{' '}
              <a className="font-semibold text-brand-light hover:underline" href={`mailto:${biz.email || 'support@pravesha.in'}`}>
                {biz.email || 'support@pravesha.in'}
              </a>.
            </p>
          )}
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          {state === 'ready' && doc.sections?.length > 0 && (
            <nav className="card mb-6 p-5">
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">On this page</h2>
              <ol className="mt-3 space-y-2 text-[14px]">
                {doc.sections.map((s) => (
                  <li key={s.section_no}>
                    <a href={`#s${s.section_no}`} className="text-muted transition hover:text-brand-light">{s.section_no}. {s.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {others.length > 0 && (
            <nav className="card p-5">
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">Other policies</h2>
              <ul className="mt-3 space-y-2 text-[14px]">
                {others.map((d) => (
                  <li key={d.slug}>
                    <Link to={`/${d.slug}`} className="text-muted transition hover:text-brand-light">{d.title}</Link>
                  </li>
                ))}
                <li><Link to="/contact" className="text-muted transition hover:text-brand-light">Contact us</Link></li>
              </ul>
            </nav>
          )}
        </aside>
      </div>
    </>
  );
}
