import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import WaIcon from './WaIcon.jsx';
import { useSite } from '../lib/useSite';
import { FALLBACK_WA } from '../lib/api';

const NAV = [
  { href: '/#how', label: 'How it works' },
  { href: '/#destinations', label: 'Destinations' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const site = useSite();
  const { pathname } = useLocation();
  const [solid, setSolid] = useState(pathname !== '/');
  const [open, setOpen] = useState(false);
  const wa = site?.whatsapp?.link || FALLBACK_WA;

  /* Transparent over the hero, solid once scrolled or on any other page. */
  useEffect(() => {
    const onScroll = () => setSolid(pathname !== '/' || window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);
  useEffect(() => setOpen(false), [pathname]);

  const tone = solid ? 'text-ink' : 'text-white';
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${solid ? 'bg-white/90 shadow-soft backdrop-blur' : 'bg-transparent'}`}>
      <div className={`container-x flex items-center justify-between transition-[height] duration-300 ${solid ? 'h-14' : 'h-16'}`}>
        <Link to="/" className={`flex items-center gap-2.5 ${tone}`} aria-label="Pravesha home">
          <img src="/icon-192.png" alt="" className="h-9 w-9 rounded-xl shadow-soft" />
          <span className="font-display text-xl font-extrabold tracking-tight">Pravesha</span>
          <span className={`hidden font-sans text-sm font-semibold sm:inline ${solid ? 'text-brand-accent' : 'text-white/80'}`}>ಪ್ರವೇಶ</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={`underline-grow text-[15px] font-medium opacity-90 transition hover:opacity-100 ${tone}`}>{n.label}</a>
          ))}
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-wa !px-5 !py-2.5 text-[15px]">
            <WaIcon className="h-4 w-4" /> Book on WhatsApp
          </a>
        </nav>

        <button type="button" onClick={() => setOpen((o) => !o)} className={`md:hidden ${tone}`} aria-label="Menu" aria-expanded={open}>
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-5 pb-5 pt-2 shadow-soft md:hidden">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block py-3 text-[16px] font-medium text-ink">{n.label}</a>
          ))}
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-wa mt-2 w-full">
            <WaIcon /> Book on WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
