import { useState } from 'react';
import Landscape from './Landscape.jsx';

/*
 * A photograph from the back-end, with the drawn landscape underneath it.
 *
 * The SVG paints instantly and costs nothing, so the section never appears as a
 * grey box while a photograph loads over a hill-road connection; the photo fades
 * in on top when it arrives, and if it never does, what remains is a deliberate
 * illustration rather than a hole.
 *
 * The back-end resizes: `/public/img/4.webp?w=768` is about 50 KB where the
 * original is 1.5 MB, so the browser is offered a set of widths and picks.
 */

const BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
const WIDTHS = [480, 768, 1024, 1400, 1920];

export const photoSrc = (name, w = 1024) => `${BASE}/public/img/${name}.webp?w=${w}`;
export const photoSrcSet = (name) => WIDTHS.map((w) => `${photoSrc(name, w)} ${w}w`).join(', ');

export default function Photo({
  name,
  alt = '',
  variant = 0,
  sizes = '100vw',
  className = '',
  imgClassName = '',
  position = 'center',
  priority = false,
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Landscape variant={variant} className="absolute inset-0 h-full w-full" />
      <img
        src={photoSrc(name, 1024)}
        srcSet={photoSrcSet(name)}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : undefined}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
        style={{ objectPosition: position }}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </div>
  );
}
