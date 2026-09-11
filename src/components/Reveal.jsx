import { motion, useReducedMotion } from 'framer-motion';

/** Rise into place when scrolled to — once, and not at all for reduced motion. */
export default function Reveal({ children, delay = 0, className = '', as = 'div' }) {
  const calm = useReducedMotion();
  const M = motion[as] || motion.div;
  if (calm) return <M className={className}>{children}</M>;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}
