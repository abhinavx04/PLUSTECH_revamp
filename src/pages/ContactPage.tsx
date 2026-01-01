import React, { useState } from 'react';
import Footer from '../components/Footer';
import { db } from '../lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { SEO } from '../components/SEO';
import { PageLayout } from '../components/PageLayout';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: '',
};

const ContactPage: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    setError(null);

    try {
      // Basic client-side required checks
      if (!form.name || !form.email || !form.message) {
        throw new Error('Please fill in name, email, and message.');
      }

      // Write to Firestore if available
      if (db) {
        await addDoc(collection(db, 'contactMessages'), {
          ...form,
          createdAt: serverTimestamp(),
        });
      }

      // Optional mail webhook (env to be provided later)
      const webhook = import.meta.env.VITE_CONTACT_WEBHOOK_URL;
      if (webhook) {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }

      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      console.error('[Contact] submit failed', err);
      setError(err instanceof Error ? err.message : 'Unable to submit right now.');
      setStatus('error');
    }
  };

  return (
    <>
      <SEO
        title="Contact Us - PLUSTECH"
        description="Get in touch with PLUSTECH for surface finishing solutions, automation systems, and technical consultancy. Contact our team for inquiries and project discussions."
        url="/contact"
        keywords="contact PLUSTECH, surface finishing consultation, automation services, technical support"
      />
      <PageLayout className="bg-gradient-to-b from-white via-blue-50/30 to-white text-[#0f172a] pt-16">

      <main className="flex-1 w-full overflow-hidden">
        <section className="relative isolate overflow-hidden px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#00aeef]/15 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-900/10 blur-3xl rounded-full" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-start">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/70 border border-black/5 shadow-sm backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-[#00aeef]" />
                <span className="text-sm font-semibold text-[#0f172a]">Contact</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                Contact Us
              </h1>
              <p className="text-lg md:text-xl text-slate-700 max-w-3xl">
                Share your requirements or questions and our team will get back to you.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
                <div className="rounded-2xl border border-white/60 bg-white/80 shadow-md p-4">
                  <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Email</div>
                  <div className="text-base font-semibold text-[#0f172a]">info@plustech.co.in</div>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/80 shadow-md p-4">
                  <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Phone</div>
                  <div className="text-base font-semibold text-[#0f172a]">+91 20 26114961</div>
                  <div className="text-base font-semibold text-[#0f172a]">+91 20 26056366</div>
                  <div className="text-base font-semibold text-[#0f172a]">+91 87999 08452</div>
                  <div className="text-base font-semibold text-[#0f172a]">+91 87999 08453</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
                <div className="rounded-2xl border border-white/60 bg-white/80 shadow-md p-4">
                  <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Main Office</div>
                  <div className="text-sm text-[#0f172a] mt-2">
                    Office no. 412, Antariksh Towers, 9th Floor, Building B,
                    <br />
                    Station Rd, opp. Old Zilla Parishad, Mangalwar Peth,
                    <br />
                    Pune, Maharashtra 411011
                  </div>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/80 shadow-md p-4">
                  <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Sales Office</div>
                  <div className="text-sm text-[#0f172a] mt-2">
                    6.29, Level 6, Avanta Business Center, Park Centra, Block A,
                    <br />
                    Sector 30, National Highway 8, Gurugram-122003
                    <br />
                    <span className="font-semibold">+91 99 10115755</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-white/60 rounded-[28px] blur-xl border border-white/40" />
              <div className="relative rounded-[28px] border border-white/80 shadow-2xl shadow-blue-900/10 overflow-hidden bg-white">
                <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-2 text-sm font-semibold text-[#0f172a]">
                      Name*
                      <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        required
                        className="rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00aeef] bg-white"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-semibold text-[#0f172a]">
                      Email*
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        required
                        className="rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00aeef] bg-white"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-semibold text-[#0f172a]">
                      Phone
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        className="rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00aeef] bg-white"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-semibold text-[#0f172a]">
                      Company
                      <input
                        name="company"
                        value={form.company}
                        onChange={onChange}
                        className="rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00aeef] bg-white"
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-2 text-sm font-semibold text-[#0f172a]">
                    Subject
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={onChange}
                      className="rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00aeef] bg-white"
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-semibold text-[#0f172a]">
                    Message*
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={onChange}
                      required
                      rows={5}
                      className="rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00aeef] bg-white"
                    />
                  </label>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                      {error}
                    </div>
                  )}
                  {status === 'success' && (
                    <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                      Message received. We will get back to you.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#00aeef] text-black font-semibold shadow-lg shadow-[#00aeef]/30 hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? 'Sending…' : 'Send message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      </PageLayout>
    </>
  );
};

export default ContactPage;

