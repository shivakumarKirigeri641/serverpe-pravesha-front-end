import { Link } from 'react-router-dom';
import Seo from '../lib/seo.jsx';
import Photo from '../components/Photo.jsx';
import WaIcon from '../components/WaIcon.jsx';
import { useSite } from '../lib/useSite';
import { FALLBACK_WA } from '../lib/api';

export default function NotFound() {
  const site = useSite();
  const wa = site?.whatsapp?.link || FALLBACK_WA;
  return (
    <>
      <Seo title="Page not found — Pravesha" description="This page does not exist." path="/404" noindex />
      <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden pt-24 text-white">
        <Photo name="5" variant={3} sizes="100vw" position="center" alt="" className="absolute inset-0 -z-20 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-forest-900/90 via-brand-deep/80 to-forest-800/70" />
        <div className="container-x text-center">
          <div className="text-[5rem] font-extrabold leading-none text-sunrise-300 sm:text-[7rem]">404</div>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">This road leads into the mist</h1>
          <p className="mx-auto mt-4 max-w-lg text-[17px] leading-relaxed text-white/80">
            The page you were looking for is not here. Head back to the start, or book your pass on WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-ghost">Back to home</Link>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-wa"><WaIcon /> Book on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
