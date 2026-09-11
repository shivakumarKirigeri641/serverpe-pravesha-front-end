import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Policy from './pages/Policy.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

/*
 * Clean URLs for every policy, because they are pasted into Meta's app settings
 * (privacy, terms, data deletion) and Razorpay's website review (refund,
 * delivery, contact), and a reviewer should land on exactly the document named.
 * The slug is the policy's slug in the back-end, so the two cannot disagree.
 *
 * Deployment needs the usual single-page fallback (serve index.html for unknown
 * paths) so these URLs work when opened directly.
 */
export const POLICY_SLUGS = ['privacy', 'terms', 'data-deletion', 'refund-policy', 'delivery-policy', 'grievance'];

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          {POLICY_SLUGS.map((slug) => (
            <Route key={slug} path={`/${slug}`} element={<Policy slug={slug} />} />
          ))}
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
