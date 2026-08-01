'use client';

import { useState } from 'react';
import PixelDog from '@/components/PixelDog';

export default function StorePortalForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ store: '', name: '', email: '', city: '', message: '' });

  const inputClass =
    'w-full rounded-md border-2 border-ink bg-paper px-3 py-2.5 shadow-[2px_2px_0_rgba(26,20,9,0.85)] outline-none placeholder:text-ink-soft/60 focus:border-bark';

  return (
    <section id="portal" className="border-t-[3px] border-ink bg-ink text-paper">
      <div className="dots-light mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2">
        <div>
          <h2 className="font-display text-5xl uppercase leading-none text-doge">Join the Store Portal</h2>
          <p className="mt-4 max-w-md text-paper/85">
            The Store Portal is your hub for wholesale ordering, Bark Arena kit applications, event
            reporting, and promo allocation. Apply below and our retail team will get you certified.
          </p>
          <PixelDog
            palette={{ fur: '#e8a33d', furLight: '#f7e3bd', accent: '#cf3f2b', bg: 'transparent' }}
            className="mt-8 hidden h-40 w-40 md:block"
          />
        </div>
        {submitted ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-[3px] border-paper bg-paper/5 p-10 text-center">
            <PixelDog
              palette={{ fur: '#e8a33d', furLight: '#f7e3bd', accent: '#cf3f2b', bg: 'transparent' }}
              className="h-20 w-20 animate-float"
            />
            <p className="mt-4 font-display text-3xl uppercase text-doge">Application received!</p>
            <p className="mt-2 max-w-sm text-sm text-paper/80">
              Thanks, {form.name || 'friend'} — our retail team will reach out to{' '}
              <strong>{form.email}</strong> within three business days. Very portal. Wow.
            </p>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Store name"
                aria-label="Store name"
                className={inputClass + ' text-ink'}
                value={form.store}
                onChange={(e) => setForm({ ...form, store: e.target.value })}
              />
              <input
                required
                placeholder="Contact name"
                aria-label="Contact name"
                className={inputClass + ' text-ink'}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                type="email"
                placeholder="Email"
                aria-label="Email"
                className={inputClass + ' text-ink'}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                required
                placeholder="City, State"
                aria-label="City and state"
                className={inputClass + ' text-ink'}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <textarea
              rows={4}
              placeholder="Tell us about your store and community (optional)"
              aria-label="Message"
              className={inputClass + ' text-ink'}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button
              type="submit"
              className="rounded-md border-2 border-paper bg-doge px-8 py-3 font-display text-xl uppercase text-ink shadow-[4px_4px_0_rgba(255,252,242,0.35)] transition-transform hover:-translate-y-0.5"
            >
              Apply for Certification
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
