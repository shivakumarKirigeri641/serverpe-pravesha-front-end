import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo, { destinations as destinationsLd, faqPage, organisation, service, website } from '../lib/seo.jsx';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Landscape from '../components/Landscape.jsx';
import Photo from '../components/Photo.jsx';
import Reveal from '../components/Reveal.jsx';
import WaIcon from '../components/WaIcon.jsx';
import { useSite } from '../lib/useSite';
import { FALLBACK_WA } from '../lib/api';

/*
 * Copy about each place is written here; whether it is bookable, its name in
 * Kannada, its slots and its fees come from the back-end, so a destination only
 * reads "Book now" when the booking will actually accept it.
 */
const ABOUT = {
  MULLAYANAGIRI: {
    height: '1,930 m',
    blurb: 'Karnataka’s highest peak, on the Baba Budangiri range. A winding ghat road climbs through coffee estates and shola grassland to a small temple at the summit, often above the clouds.',
  },
  KUDREMUKHA: {
    height: '1,894 m',
    blurb: 'The “horse face” peak inside Kudremukh National Park — rolling grassland ridges, streams and some of the wettest forest in the Western Ghats.',
  },
  KODACHADRI: {
    height: '1,343 m',
    blurb: 'A forested hill in the Mookambika Wildlife Sanctuary, known for its sunset over the Arabian Sea side of the Ghats and the Sarvajna Peetha at the top.',
  },
  JOGFALLS: {
    height: '253 m drop',
    blurb: 'The Sharavathi river falls in four streams — Raja, Rani, Rover and Rocket — best seen in full flow just after the monsoon.',
  },
};

/* Which photograph belongs to which destination. A place with no photograph
   keeps the drawn landscape rather than borrowing somebody else's hill. */
const PHOTO = {
  MULLAYANAGIRI: { name: '2', position: 'center 60%' },
  KUDREMUKHA: { name: '3', position: 'center' },
  KODACHADRI: { name: '5', position: 'center 55%' },
};

const FALLBACK_PLACES = [
  { code: 'MULLAYANAGIRI', name: 'Mullayanagiri', name_kn: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ', district: 'Chikkamagaluru', is_active: true },
  { code: 'KUDREMUKHA', name: 'Kudremukha Trek', name_kn: 'ಕುದುರೆಮುಖ ಚಾರಣ', district: 'Chikkamagaluru', is_active: false },
  { code: 'KODACHADRI', name: 'Kodachadri Trek', name_kn: 'ಕೊಡಚಾದ್ರಿ ಚಾರಣ', district: 'Shivamogga', is_active: false },
  { code: 'JOGFALLS', name: 'Jog Falls', name_kn: 'ಜೋಗ ಜಲಪಾತ', district: 'Shivamogga', is_active: false },
];

const faqList = ({ days, release, lastEntryMin }) => [
    { q: 'Do I need to install an app?', a: 'No. Pravesha works entirely inside WhatsApp. Message the Pravesha number with “hi” and follow the buttons.' },
    { q: 'Do I need to print the pass?', a: 'No. Staff at the checkpost record your vehicle’s entry digitally against your pass. Keep the WhatsApp message or PDF handy in case you are asked for it.' },
    { q: 'When can I book?', a: `Up to ${days} days in advance. A new date opens every day at ${release}. You can also book for today, as long as the slot has more than ${lastEntryMin} minutes left.` },
    { q: 'Can I use my pass for a different vehicle?', a: 'No. A pass is issued for one registration number, one place, one date and one slot. Book a separate pass for each vehicle.' },
    { q: 'How do I see the passes I have booked?', a: 'Tap “My passes” in the chat, or type “my passes”. Every upcoming pass booked from your number is sent to you again, with its PDF. You are not asked to type anything else.' },
    { q: 'What if the money is deducted but no pass arrives?', a: 'Your slot is held while you pay, and payments are reconciled automatically. If a payment succeeded, the pass is issued; if it could not be, the amount is refunded. See the Refund & Cancellation Policy.' },
    { q: 'Can I cancel a pass?', a: 'No. Every pass is final and is not refunded — see our Refund & Cancellation Policy. Moving a pass to another date is coming soon, once approved.' },
    { q: 'How do I delete my data?', a: 'Send “DELETE MY DATA” to the Pravesha WhatsApp number from the number you booked with. The Data Deletion page explains what is removed and what tax law requires us to keep.' },
];

const STEPS = [
  { t: 'Say hi on WhatsApp', d: 'Message the Pravesha number. Accept the terms and choose English or ಕನ್ನಡ.' },
  { t: 'Pick place, date and slot', d: 'A secure form opens inside WhatsApp. See live availability for your vehicle type.' },
  { t: 'Enter your vehicle number', d: 'We fetch the registration details and confirm the vehicle is permitted.' },
  { t: 'Pay and receive your pass', d: 'Pay by UPI or card. Your pass arrives in the same chat as a message and a PDF.' },
];

const fmtHour = (h) => {
  const n = Number(h);
  if (!Number.isFinite(n)) return '6 PM';
  return `${n % 12 || 12} ${n >= 12 ? 'PM' : 'AM'}`;
};

const hhmm = (t) => {
  const [h, m] = String(t || '').split(':').map(Number);
  if (!Number.isFinite(h)) return '';
  return `${h % 12 || 12}:${String(m || 0).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

export default function Home() {
  const site = useSite();
  const wa = site?.whatsapp?.link || FALLBACK_WA;
  const places = site?.places?.length ? site.places : FALLBACK_PLACES;
  const rules = site?.rules || {};
  const days = rules.booking_days_ahead ?? 14;
  const release = fmtHour(rules.release_hour ?? 18);
  const lastEntryMin = rules.last_entry_minutes_before_end ?? 60;
  const slots = places.find((p) => p.is_active)?.slots || places[0]?.slots || [];
  /* One list, read by the page and by the structured data, so a rich result can
     never promise an answer the page does not give. */
  const faqs = faqList({ days, release, lastEntryMin });

  return (
    <>
      <Seo
        title="Pravesha — Entry passes for Karnataka's destinations, on WhatsApp"
        description="Book an entry pass for your vehicle or your group to Mullayanagiri and Karnataka's destinations on WhatsApp in about a minute. Choose a date and time slot, pay online, and go — no app, no queue, no printout."
        path="/"
        jsonLd={[organisation(), website(), service(wa), destinationsLd(places, ABOUT), faqPage(faqs)]}
      />
      <Hero wa={wa} tagline={site?.product?.tagline} taglineKn={site?.product?.tagline_kn} />
      <HowItWorks wa={wa} />
      <Destinations places={places} wa={wa} />
      <GoodToKnow days={days} release={release} lastEntryMin={lastEntryMin} slots={slots} notPermitted={rules.not_permitted} />
      <Responsible />
      <Faq faqs={faqs} />
      <FinalCta wa={wa} />
    </>
  );
}

function Hero({ wa, tagline, taglineKn }) {
  const calm = useReducedMotion();
  return (
    <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden pb-16 pt-28 sm:items-center sm:pb-24">
      <Photo name="4" priority variant={0} sizes="100vw" position="center 55%"
        alt="Grassland ridges of the Western Ghats under monsoon cloud"
        className="absolute inset-0 -z-20 h-full w-full" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900/90 via-forest-900/50 to-forest-900/25" />

      <div className="container-x grid w-full items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
        <motion.div
          initial={calm ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-white"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-semibold backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-sunrise-300" /> Karnataka Tourism approval awaited
          </span>
          <h1 className="mt-5 text-[2.6rem] font-extrabold leading-[1.05] sm:text-6xl lg:text-[4.2rem]">
            The hills are calling.<br />
            <span className="text-sunrise-300">Your pass is a message away.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
            Book your entry pass for Karnataka&rsquo;s destinations on WhatsApp — for your vehicle or for your group.
            Pick a place, a date and a time slot, pay online, and go. No app, no queue, no printout.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-wa text-[17px]">
              <WaIcon /> Book on WhatsApp
            </a>
            <a href="#how" className="btn-ghost">How it works</a>
          </div>
          <p className="mt-6 text-[15px] font-medium text-white/70">
            {tagline || 'Entry made simple & secured.'} <span className="mx-1.5 opacity-50">·</span> {taglineKn || 'ಪ್ರವೇಶ ಈಗ ಸರಳ ಮತ್ತು ಸುರಕ್ಷಿತ.'}
          </p>
        </motion.div>

        <motion.div
          initial={calm ? false : { opacity: 0, y: 40, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="hidden justify-center lg:flex"
        >
          <ChatMock />
        </motion.div>
      </div>
    </section>
  );
}

/* A glimpse of the conversation, so visitors know what to expect before they tap. */
function ChatMock() {
  const bubble = 'max-w-[82%] rounded-2xl px-3.5 py-2 text-[14px] leading-snug shadow-sm';
  return (
    <div className="w-[330px] animate-float rounded-[2.2rem] border-[7px] border-forest-900/80 bg-[#efeae2] shadow-2xl">
      <div className="flex items-center gap-2.5 rounded-t-[1.7rem] bg-brand px-4 py-3 text-white">
        <img src="/icon-192.png" alt="" className="h-8 w-8 rounded-full bg-white" />
        <div>
          <div className="text-[15px] font-semibold leading-tight">Pravesha</div>
          <div className="text-[11px] text-white/70">Business account</div>
        </div>
      </div>
      <div className="space-y-2 px-3 py-4">
        <div className={`${bubble} ml-auto bg-[#d9fdd3] text-ink`}>hi</div>
        <div className={`${bubble} bg-white text-ink`}>Welcome to <b>Pravesha</b> 🙏 Book your entry pass in about a minute.</div>
        <div className="flex gap-1.5">
          <span className="rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-brand-light shadow-sm">Book pass</span>
          <span className="rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-brand-light shadow-sm">My passes</span>
        </div>
        <div className={`${bubble} bg-white text-ink`}>
          <div className="text-[12px] font-semibold text-brand-light">✅ Entry pass confirmed</div>
          <div className="mt-1 font-semibold">Mullayanagiri</div>
          <div className="text-[13px] text-muted">Morning 6:00 AM – 12:00 PM</div>
          <div className="mt-1 font-mono text-[13px] tracking-wide">KA01AB1234</div>
        </div>
        <div className={`${bubble} flex items-center gap-2.5 bg-white text-ink`}>
          <span className="grid h-9 w-8 place-items-center rounded bg-red-500 text-[10px] font-bold text-white">PDF</span>
          <span className="text-[13px]">Pravesha-Pass.pdf</span>
        </div>
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title, children, center = false }) {
  return (
    <Reveal className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-[2.6rem] sm:leading-[1.1]">{title}</h2>
      {children && <p className="mt-4 text-lg leading-relaxed text-muted">{children}</p>}
    </Reveal>
  );
}

function HowItWorks({ wa }) {
  return (
    <section id="how" className="scroll-mt-20 py-24">
      <div className="container-x">
        <SectionHead eyebrow="How it works" title="From “hi” to your pass in about a minute" center>
          Everything happens in the WhatsApp chat you already use. Nothing to install, nothing to print.
        </SectionHead>
        <ol className="relative mt-14 grid gap-6 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-7 hidden h-0.5 bg-gradient-to-r from-mist-200 via-brand-accent/40 to-mist-200 md:block" />
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.t} delay={i * 0.08} className="relative">
              <div className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-brand text-xl font-extrabold text-white shadow-lift">
                {i + 1}
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{s.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.d}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-14 flex flex-col items-center gap-4 rounded-3xl bg-mist-50 p-7 text-center sm:flex-row sm:text-left">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-accent/15 text-2xl">🛂</span>
          <p className="flex-1 text-[16px] leading-relaxed text-ink">
            <b>At the checkpost, just drive up.</b> Staff record your vehicle&rsquo;s entry digitally against your pass —
            no printout needed. You get a WhatsApp confirmation the moment your entry is recorded.
          </p>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-wa shrink-0 !py-3"><WaIcon className="h-4 w-4" /> Start now</a>
        </Reveal>
      </div>
    </section>
  );
}

function Destinations({ places, wa }) {
  return (
    <section id="destinations" className="scroll-mt-20 bg-mist-50 py-24">
      <div className="container-x">
        <SectionHead eyebrow="Destinations" title="Where Pravesha takes you">
          We are starting with Mullayanagiri. More of Karnataka&rsquo;s hills and falls are on the way.
        </SectionHead>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {places.map((p, i) => {
            const about = ABOUT[p.code] || {};
            return (
              <Reveal key={p.code} delay={i * 0.06}>
                <article className={`card group h-full overflow-hidden transition duration-300 ${p.is_active ? 'hover:-translate-y-1 hover:shadow-lift' : ''}`}>
                  <div className="relative h-48 overflow-hidden">
                    {PHOTO[p.code] ? (
                      <Photo name={PHOTO[p.code].name} variant={i} position={PHOTO[p.code].position}
                        sizes="(min-width: 640px) 45vw, 100vw" alt={`${p.name}, ${p.district}`}
                        className={`h-full w-full transition duration-700 group-hover:scale-105 ${p.is_active ? '' : 'grayscale-[30%]'}`} />
                    ) : (
                      <Landscape variant={i} mist={p.is_active} className={`h-full w-full transition duration-700 group-hover:scale-105 ${p.is_active ? '' : 'grayscale-[35%]'}`} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 to-transparent" />
                    <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[12px] font-bold ${p.is_active ? 'bg-[#25d366] text-[#063b2a]' : 'bg-white/90 text-muted'}`}>
                      {p.is_active ? 'Booking open' : 'Coming soon'}
                    </span>
                    {about.height && (
                      <span className="absolute right-4 top-4 rounded-full bg-forest-900/60 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur">{about.height}</span>
                    )}
                    <div className="absolute bottom-3 left-4 text-white">
                      <h3 className="text-2xl font-extrabold">{p.name}</h3>
                      <div className="text-[14px] text-white/85">{p.name_kn} · {p.district}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 p-6">
                    <p className="text-[15px] leading-relaxed text-muted">{about.blurb || `A hill destination in ${p.district} district.`}</p>
                    {p.is_active ? (
                      <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-brand-light hover:text-brand">
                        Book a pass for {p.name} <span aria-hidden>→</span>
                      </a>
                    ) : (
                      <span className="text-[14px] font-medium text-muted">Online passes for this destination are not available yet.</span>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GoodToKnow({ days, release, lastEntryMin, slots, notPermitted }) {
  const lastEntry = lastEntryMin >= 60 && lastEntryMin % 60 === 0
    ? `${lastEntryMin / 60} hour${lastEntryMin === 60 ? '' : 's'}`
    : `${lastEntryMin} minutes`;
  const banned = notPermitted?.length
    ? notPermitted
    : ['Autorickshaws', 'Buses and minibuses', 'Trucks and goods vehicles', 'Tractors and trailers'];
  const cards = [
    {
      icon: '🗓️',
      title: `Book up to ${days} days ahead`,
      body: `Every day at ${release}, the date ${days} days away opens for booking. Same-day passes work too, as long as the slot still has time left for entry.`,
    },
    {
      icon: '⏰',
      title: 'Two slots a day',
      body: slots.length
        ? `${slots.map((s) => `${hhmm(s.starts_at)} – ${hhmm(s.ends_at)}`).join(' and ')}. Last entry is ${lastEntry} before a slot ends.`
        : `A morning and an afternoon slot. Last entry is ${lastEntry} before a slot ends.`,
    },
    {
      icon: '🚘',
      title: 'One pass per vehicle per day',
      body: 'A pass belongs to the registration number it was booked for. It cannot be moved to another vehicle at the checkpost.',
    },
    {
      icon: '🚫',
      title: 'Not permitted',
      body: `${banned.join(', ')}. Every vehicle must carry a valid, readable number plate.`,
    },
  ];
  return (
    <section className="relative overflow-hidden bg-forest-800 py-24 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <Photo name="1" variant={1} sizes="100vw" position="center 40%" className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-forest-800/80" />
      <div className="container-x relative">
        <Reveal className="max-w-2xl">
          <span className="eyebrow !text-sunrise-300">Good to know</span>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-[2.6rem] sm:leading-[1.1]">Before you set out</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
              <div className="text-3xl" aria-hidden>{c.icon}</div>
              <h3 className="mt-4 text-lg font-bold">{c.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/75">{c.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 rounded-2xl border border-sunrise-400/30 bg-sunrise-400/10 p-5 text-[15px] leading-relaxed text-sunrise-300">
          ⚖️ Editing, copying or reselling a pass is illegal, and action will be taken against the vehicle and its owner.
        </Reveal>
      </div>
    </section>
  );
}

function Responsible() {
  const items = [
    { icon: '🌿', t: 'Keep the hills clean', kn: 'ಪರಿಸರವನ್ನು ಸ್ವಚ್ಛವಾಗಿಡಿ', d: 'Carry back every wrapper and bottle. Single-use plastic has no place on these slopes.' },
    { icon: '🔇', t: 'Let the forest be quiet', kn: 'ಶಾಂತತೆ ಕಾಪಾಡಿ', d: 'No loud music, no needless horns. These roads pass through wildlife habitat.' },
    { icon: '🌫️', t: 'Drive slow in the mist', kn: 'ನಿಧಾನವಾಗಿ ಚಲಿಸಿ', d: 'Ghat roads are narrow and visibility drops fast. Use low beams and give way to vehicles climbing up.' },
  ];
  return (
    <section className="py-24">
      <div className="container-x">
        <SectionHead eyebrow="Travel responsibly" title="Leave only footprints" center>
          Limited slots keep these places from being overrun. Help keep them beautiful for whoever comes next.
        </SectionHead>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.08} className="card p-7 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mist-100 text-3xl">{it.icon}</div>
              <h3 className="mt-5 text-xl font-bold text-ink">{it.t}</h3>
              <div className="mt-1 text-[14px] font-semibold text-brand-accent">{it.kn}</div>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{it.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ faqs }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="scroll-mt-20 bg-mist-50 py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <SectionHead eyebrow="FAQ" title="Questions, answered">
          Still stuck? Write to us from the{' '}
          <Link to="/contact" className="font-semibold text-brand-light underline-offset-4 hover:underline">contact page</Link>.
        </SectionHead>
        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-[16px] font-semibold text-ink">{f.q}</span>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mist-100 text-brand transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-6 pb-5 text-[15px] leading-relaxed text-muted">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCta({ wa }) {
  return (
    <section className="pb-4 pt-24">
      <div className="container-x">
        <Reveal className="relative isolate overflow-hidden rounded-[2rem] px-7 py-16 text-center text-white sm:px-16">
          <Photo name="5" variant={2} sizes="(min-width: 1024px) 1000px, 100vw" position="center 45%"
            alt="A misty peak above the forest" className="absolute inset-0 -z-20 h-full w-full" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-deep/85 via-brand/70 to-forest-900/70" />
          <h2 className="text-3xl font-extrabold sm:text-5xl">Your morning in the clouds starts with “hi”.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">Slots are limited to protect the hills — book early for weekends and holidays.</p>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-wa mt-8 text-[17px]"><WaIcon /> Book on WhatsApp</a>
        </Reveal>
      </div>
    </section>
  );
}
