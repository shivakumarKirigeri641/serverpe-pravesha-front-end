import { useEffect, useState } from 'react';

/*
 * What scrolling looks like (user, 2026-09-19).
 *
 * A thread across the top that fills as the page is read — on a long policy it
 * answers "how much more of this is there?" without a scrollbar — and a button
 * back to the top that appears only once there is a way back. Both are quiet:
 * no numbers, no percentages, nothing that moves while the page is still.
 *
 * The bar is driven by scroll position through a CSS variable and a transform,
 * so the browser can keep it on the compositor; nothing re-renders as you
 * scroll except the arrow's appearance, which changes at one threshold rather
 * than on every pixel.
 */
export default function ScrollUI() {
  const [up, setUp] = useState(false);

  useEffect(() => {
    const bar = document.getElementById('pv-progress');
    let ticking = false;
    const paint = () => {
      ticking = false;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      if (bar) bar.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h) : 0})`;
      setUp(y > 700);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]">
        <div id="pv-progress" className="h-full origin-left bg-gradient-to-r from-brand-accent to-sunrise-300"
          style={{ transform: 'scaleX(0)' }} />
      </div>
      <button type="button" aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center rounded-full bg-brand text-white shadow-lift transition-all duration-300 hover:bg-brand-light ${
          up ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </>
  );
}
