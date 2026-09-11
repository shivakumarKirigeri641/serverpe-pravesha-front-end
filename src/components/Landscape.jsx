/**
 * A Western Ghats morning, drawn rather than photographed: ridge after ridge
 * fading into mist, first light behind the peaks. Drawn so it needs no
 * licensed photographs, weighs a few kilobytes, stays sharp on any screen, and
 * can be recoloured per destination.
 *
 * `variant` shifts the palette and the ridge shapes so each destination card
 * gets its own hill without shipping an image per place.
 */

const PALETTES = [
  { sky: ['#fde7c3', '#f9c98a', '#9ed4c4'], sun: '#fff1cf', ridges: ['#a7cfc2', '#6fae9a', '#3f8a74', '#1f6552', '#0f3a2f'] },
  { sky: ['#e8f1ff', '#c7dcf5', '#a9d8c6'], sun: '#ffffff', ridges: ['#b5d3cf', '#7fb3a6', '#4c8f7e', '#2a6b5a', '#123f33'] },
  { sky: ['#ffe0d1', '#f7b89a', '#b9d9c9'], sun: '#fff0e0', ridges: ['#c1d8c8', '#8bb89d', '#5a9578', '#35705a', '#173f31'] },
  { sky: ['#e6f4ea', '#bfe3cf', '#8fcbb6'], sun: '#fbfff4', ridges: ['#a8d5c0', '#73b39a', '#44917a', '#226b58', '#0c3b31'] },
];

/* Ridge lines as smooth paths across a 1440-wide canvas. */
const RIDGES = [
  'M0 250 C 160 190 280 215 420 175 C 560 135 690 205 840 160 C 990 115 1120 185 1260 150 C 1350 128 1400 140 1440 150 L1440 600 L0 600 Z',
  'M0 320 C 140 270 300 300 450 250 C 600 200 720 270 880 235 C 1040 200 1180 275 1310 245 C 1380 230 1420 238 1440 242 L1440 600 L0 600 Z',
  'M0 390 C 180 340 320 370 480 330 C 640 290 790 355 950 320 C 1110 285 1250 350 1440 315 L1440 600 L0 600 Z',
  'M0 460 C 150 420 330 450 500 410 C 670 370 820 430 1000 400 C 1180 370 1300 425 1440 395 L1440 600 L0 600 Z',
  'M0 530 C 200 495 360 520 560 490 C 760 460 930 510 1120 485 C 1280 465 1380 480 1440 470 L1440 600 L0 600 Z',
];

export default function Landscape({ variant = 0, className = '', mist = true, sun = true }) {
  const p = PALETTES[variant % PALETTES.length];
  const id = `ls${variant}`;
  const shift = (variant % 4) * 60;
  return (
    <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="0.55" stopColor={p.sky[1]} />
          <stop offset="1" stopColor={p.sky[2]} />
        </linearGradient>
        <radialGradient id={`${id}sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={p.sun} stopOpacity="1" />
          <stop offset="0.45" stopColor={p.sun} stopOpacity="0.55" />
          <stop offset="1" stopColor={p.sun} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}mist`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="1440" height="600" fill={`url(#${id}sky)`} />
      {sun && <circle cx={980 - shift * 3} cy="190" r="230" fill={`url(#${id}sun)`} />}
      {sun && <circle cx={980 - shift * 3} cy="190" r="58" fill={p.sun} opacity="0.95" />}

      <g transform={`translate(${-shift} 0)`}>
        {RIDGES.map((d, i) => (
          <g key={i}>
            <path d={d} fill={p.ridges[i]} transform={i % 2 ? `scale(-1 1) translate(-1440 0)` : undefined} />
            {mist && i < 4 && (
              <rect x="-200" y={220 + i * 72} width="1840" height="46" fill={`url(#${id}mist)`}
                className={i % 2 ? 'animate-driftSlow' : 'animate-drift'} opacity={0.7 - i * 0.12} />
            )}
          </g>
        ))}
      </g>

      {/* A few birds over the ridges. */}
      <g fill="none" stroke={p.ridges[4]} strokeWidth="2.2" strokeLinecap="round" opacity="0.55">
        <path d={`M${300 + shift} 120 q 10 -10 20 0 q 10 -10 20 0`} />
        <path d={`M${350 + shift} 150 q 7 -7 14 0 q 7 -7 14 0`} />
        <path d={`M${260 + shift} 165 q 6 -6 12 0 q 6 -6 12 0`} />
      </g>
    </svg>
  );
}
