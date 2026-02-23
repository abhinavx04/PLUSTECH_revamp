import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { MapPin } from 'lucide-react';
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

      // EmailJS configuration from env (must be provided in .env)
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('Email service is not configured. Please try again later.');
      }

      // Send via EmailJS
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          subject: form.subject || 'Contact Form Submission',
          message: form.message,
        },
        { publicKey }
      );

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
        <section className="relative isolate px-6 md:px-12 lg:px-20 py-16 md:py-20">
          <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2 items-stretch">
            {/* LEFT: Gradient info panel (matches Projects page card styling) */}
            <div className="relative">
              <div
                className="relative h-full w-full rounded-[28px] border border-white/80 shadow-2xl shadow-blue-900/10 overflow-hidden bg-gradient-to-br from-white via-[#e0f4ff] to-[#cfe7ff] p-8 md:p-10 text-[#0f172a] flex flex-col justify-between"
              >
                <div className="space-y-8">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-1">
                      Get in touch
                    </h1>
                    <p className="text-sm md:text-base text-slate-700 max-w-md">
                      Reach out to us for any project, sales or technical enquiry. Our
                      team will be happy to assist you.
                    </p>
                  </div>

                  {/* Email – clearly global */}
                  <div className="space-y-1 text-sm md:text-base">
                    <div className="font-semibold">Email us</div>
                    <p className="text-slate-700">
                      <span className="font-semibold text-[#00aeef]">
                        info@plustech.co.in
                      </span>
                    </p>
                  </div>

                  {/* Visit us – head office */}
                  <div className="space-y-1 text-sm md:text-base">
                    <div className="font-semibold">Visit us</div>
                    <p className="text-slate-700">
                      Office no. 412, Antariksh Towers, 9th Floor, Building B,
                      <br />
                      Station Rd, opp. Old Zilla Parishad, Mangalwar Peth,
                      <br />
                      Pune, Maharashtra 411011
                    </p>
                    <a
                      href="https://www.google.com/maps?sca_esv=566ee744d85630e4&sxsrf=ANbL-n5v2B2rD5iTayTMMEpBsoGHG0CpMg:1771839664654&uact=5&gs_lp=Egxnd3Mtd2l6LXNlcnAiJXBsdXN0ZWNoIHN5c3RlbXMgJiBzb2x1dGlvbnMgbG9jYXRpb24yBRAhGKABMgUQIRigATIFECEYkgMyBRAhGJIDMgUQIRiSAzIFECEYkgMyBRAhGJIDSKgkUIwSWNkgcAF4AJABAJgBxwGgAaEMqgEEMC4xMLgBA8gBAPgBAZgCCqACvAvCAgoQABiwAxjWBBhHwgIWEC4YgAQYsAMYQxjHARiKBRiOBRivAcICExAuGIAEGEMYxwEYyQMYigUYrwHCAgoQABiABBgUGIcCwgIFEAAYgATCAgYQABgWGB7CAgIQJsICCxAAGIAEGIYDGIoFwgIIEAAYgAQYogTCAiIQLhiABBhDGMcBGMkDGIoFGK8BGJcFGNwEGN4EGOAE2AEBwgIJEAAYFhjJAxgemAMAiAYBkAYJugYGCAEQARgUkgcFMS44LjGgB-89sgcFMC44LjG4B7YLwgcFMC44LjLIBxSACAA&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KUV0F18VwcI7MU7OXtoiXPBN&daddr=Office+no.+412,+Antariksh+Towers,+9th+Floor,+Building+B,+Station+Rd,+opp.+Old+Zilla+Parishad,+Mangalwar+Peth,+Pune,+Maharashtra+411001"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[#00aeef] font-semibold hover:underline underline-offset-4"
                      aria-label="Click here to get location"
                    >
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      Click here to get location
                    </a>
                  </div>

                  {/* Call us – Head Office numbers */}
                  <div className="space-y-1 text-sm md:text-base">
                    <div className="font-semibold">Call us (Head Office – Pune)</div>
                    <p className="text-slate-700">
                      Mon–Fri, business hours
                      <br />
                      <span className="font-semibold text-[#0f172a] block">
                        +91 20 26114961
                      </span>
                      <span className="font-semibold text-[#0f172a] block">
                        +91 20 26056366
                      </span>
                      <span className="font-semibold text-[#0f172a] block">
                        +91 87999 08452
                      </span>
                      <span className="font-semibold text-[#0f172a] block">
                        +91 87999 08453
                      </span>
                    </p>
                  </div>

                  {/* Sales office – clearly separate */}
                  <div className="space-y-1 text-sm md:text-base">
                    <div className="font-semibold">Sales office (Gurugram)</div>
                    <p className="text-slate-700">
                      6.29, Level 6, Avanta Business Center, Park Centra, Block A,
                      <br />
                      Sector 30, National Highway 8, Gurugram-122003
                      <br />
                      <span className="mt-1 inline-block text-xs uppercase tracking-[0.16em] text-slate-500">
                        Direct sales line
                      </span>
                      <br />
                      <span className="font-semibold text-[#0f172a]">
                        +91 99 10115755
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Form panel */}
            <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">
                Send us a message
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Tell us a bit about what you&apos;re looking for and we&apos;ll get
                back to you shortly.
              </p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1 text-sm font-medium text-slate-800">
                    Name*
                    <input
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      required
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-slate-800">
                    Company
                    <input
                      name="company"
                      value={form.company}
                      onChange={onChange}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-1 text-sm font-medium text-slate-800">
                  Email*
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium text-slate-800">
                  Phone Number
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium text-slate-800">
                  Subject
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={onChange}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium text-slate-800">
                  Message*
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    required
                    rows={5}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent"
                    placeholder="Tell us what we can help you with"
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
                  className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#00aeef] text-white font-semibold shadow-md hover:shadow-lg hover:bg-[#0099d4] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'Sending…' : 'Send message'}
                </button>
              </form>
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

