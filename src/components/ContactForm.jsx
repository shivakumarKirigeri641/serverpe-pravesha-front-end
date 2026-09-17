import { useState } from 'react';
import { api } from '../lib/api';

/*
 * The contact form. It posts to the back-end, which stores the message and
 * emails the support mailbox, so nothing is lost if mail is briefly unavailable.
 *
 * WHAT IT ASKS FOR is the least that lets us answer: a name, an address to reply
 * to, and what happened. The mobile number is optional and explained — it is
 * what finds their booking, since a pass belongs to a WhatsApp number.
 *
 * THE HIDDEN FIELD is a honeypot: people never see it, bots fill it in, and the
 * back-end quietly drops anything that has it filled.
 *
 * ONE SUBMISSION AT A TIME, and the button says what is happening. On success
 * the form is replaced by the reference number rather than cleared, so nobody
 * wonders whether it went.
 */

const SUBJECTS = [
  'I did not receive my pass',
  'Payment',
  'Change or cancel a booking',
  'Checkpost or entry problem',
  'Data or privacy request',
  'Something else',
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', subject: SUBJECTS[0], message: '', company: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const out = await api.contact(form);
      setDone(out.reference || true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="card p-7 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-accent/15 text-2xl text-brand">✓</div>
        <h3 className="mt-4 text-xl font-bold text-ink">Message received</h3>
        <p className="mx-auto mt-2 max-w-md text-[16px] leading-relaxed text-muted">
          Thank you — we have it, and we will reply to <b className="text-ink">{form.email}</b>. Most messages are
          answered within a working day.
        </p>
        {typeof done === 'string' && (
          <p className="mt-4 text-[14px] text-muted">
            Your reference: <span className="font-mono font-semibold text-ink">{done}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <form className="card space-y-5 p-7" onSubmit={submit} noValidate>
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[15px] font-medium text-red-700">{error}</p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" required>
          <input className="input" value={form.name} onChange={set('name')} autoComplete="name" required maxLength={120} />
        </Field>
        <Field label="Email" required hint="We reply here.">
          <input className="input" type="email" value={form.email} onChange={set('email')} autoComplete="email" required maxLength={180} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="WhatsApp number" hint="Optional — it is how we find your booking.">
          <input className="input" inputMode="numeric" value={form.mobile} onChange={set('mobile')} autoComplete="tel" maxLength={20} />
        </Field>
        <Field label="What is it about?">
          <select className="input" value={form.subject} onChange={set('subject')}>
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Your message" required hint="Include your pass number or payment reference if you have one.">
        <textarea className="input min-h-[140px] resize-y" value={form.message} onChange={set('message')} required maxLength={4000} />
      </Field>

      {/* Hidden from people, irresistible to bots. */}
      <div className="hidden" aria-hidden="true">
        <label>Company<input tabIndex={-1} autoComplete="off" value={form.company} onChange={set('company')} /></label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-wa !bg-brand !text-white" disabled={busy}>
          {busy ? 'Sending…' : 'Send message'}
        </button>
        <p className="text-[13px] text-muted">
          We use what you send only to answer you. See our{' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-light underline-offset-4 hover:underline">privacy policy</a>.
        </p>
      </div>
    </form>
  );
}

function Field({ label, hint, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold uppercase tracking-wide text-muted">
        {label}{required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[13px] text-muted">{hint}</span>}
    </label>
  );
}
