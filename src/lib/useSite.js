import { useEffect, useState } from 'react';
import { api, safe } from './api';

/* One request for the whole page, shared by every section that needs it. */
let pending = null;

export function useSite() {
  const [site, setSite] = useState(null);
  useEffect(() => {
    if (!pending) pending = safe(api.site());
    let alive = true;
    pending.then((d) => { if (alive) setSite(d); });
    return () => { alive = false; };
  }, []);
  return site;
}

let legalPending = null;
export function useLegalIndex() {
  const [index, setIndex] = useState(null);
  useEffect(() => {
    if (!legalPending) legalPending = safe(api.legal());
    let alive = true;
    legalPending.then((d) => { if (alive) setIndex(d); });
    return () => { alive = false; };
  }, []);
  return index;
}
