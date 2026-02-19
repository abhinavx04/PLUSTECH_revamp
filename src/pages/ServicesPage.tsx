import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Footer from '../components/Footer';
import { SEO } from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';
import { PageLayout } from '../components/PageLayout';

const services = [
  {
    title: 'Technical Consultancy',
    description:
      'Blueprints for new projects and modernization, aligned to throughput, quality, and safety KPIs.',
    image: '/automated-customised-materialhandling/1.webp',
    bullets: [
      'Blueprinting new paint and automation projects',
      'Developing concepts and layouts tailored to each plant',
      'Paint training with safety-first drills',
      'Safety and energy audits to protect uptime',
    ],
    accent: 'Consult • Design • Validate',
  },
  {
    title: 'Maintenance Contract',
    description:
      'Proactive coverage that keeps paintshops stable — remote support, onsite specialists, and ready spares.',
    image: '/home/home2.png',
    bullets: [
      'Annual maintenance contracts with uptime SLAs',
      'Onsite plant maintenance by certified teams',
      'Remote service and diagnostics for rapid response',
      'Spare parts support aligned to criticality',
    ],
    accent: '24/7 • Reliable • Predictable',
  },
  {
    title: 'Productivity Improvement',
    description:
      'Delivering smarter throughput with automation, modernization, and process tuning without compromising quality.',
    image: '/digitization-smartfactory/Digitisation (IOT) -2.jpg',
    bullets: [
      'Process and capacity enhancement programs',
      'Modernisation with low-downtime execution',
      'Automation upgrades across robots and conveyors',
      'Introducing new concepts to unlock hidden capacity',
    ],
    accent: 'Optimize • Automate • Scale',
  },
];

const pillars3C = ['Customer-centricity', 'Cost Effectiveness', 'Competent Engineering'];
const pillars3P = ['Productivity', 'Performance', 'Quality'];

const scopeAreas = [
  {
    label: 'Robotics',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714a2.25 2.25 0 0 0 .659 1.591L19 14.5m-4.75-11.396c.251.023.501.05.75.082M5 14.5l-1.47 1.47a1.75 1.75 0 0 0 1.238 2.987h14.464a1.75 1.75 0 0 0 1.238-2.987L19 14.5" />
      </svg>
    ),
  },
  {
    label: 'Conveyors',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25M3.375 14.25h17.25M3.375 14.25V6.375c0-.621.504-1.125 1.125-1.125h3.026a2.999 2.999 0 0 1 2.078.84l.97.97" />
      </svg>
    ),
  },
  {
    label: 'Paint Process',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
      </svg>
    ),
  },
  {
    label: 'Controls & Electrical',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
];

const scopeItems = [
  'Concept-to-commissioning guidance with structured reviews',
  'Run-readiness audits covering safety, energy, and reliability',
  'Skill-building for operators and maintenance teams',
  'Remote diagnostics paired with onsite interventions',
];

const ServiceCard: React.FC<{
  service: (typeof services)[number];
  index: number;
}> = ({ service, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isReversed = index % 2 === 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center"
    >
      {/* Image */}
      <div className={`relative ${isReversed ? 'lg:order-2' : ''}`}>
        <div className="absolute -inset-3 bg-gradient-to-br from-[#00aeef]/8 via-transparent to-blue-200/15 rounded-3xl blur-2xl" />
        <div className="group relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(8,47,73,0.10)]">
          <OptimizedImage
            src={service.image}
            alt={service.title}
            className="w-full h-64 md:h-72 lg:h-80 transition-transform duration-700 group-hover:scale-105"
            objectFit="cover"
            height={320}
            width={600}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute bottom-5 left-5">
            <span className="px-3.5 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold backdrop-blur-sm border border-white/10">
              {service.accent}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`space-y-5 ${isReversed ? 'lg:order-1' : ''}`}>
        <motion.div
          initial={{ opacity: 0, x: isReversed ? 20 : -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-3"
        >
          <span className="h-px w-8 bg-[#00aeef]" />
          <span className="text-sm uppercase tracking-[0.14em] text-[#00aeef] font-semibold">
            Service {String(index + 1).padStart(2, '0')}
          </span>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0f172a] leading-tight"
        >
          {service.title}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-base md:text-lg text-slate-600 leading-relaxed"
        >
          {service.description}
        </motion.p>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-3 pt-1"
        >
          {service.bullets.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.35, delay: 0.55 + i * 0.08 }}
              className="flex items-start gap-3"
            >
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#00aeef] flex-shrink-0" />
              <span className="text-slate-700">{item}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
};

const ServicesPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-50px' });

  const scopeRef = useRef<HTMLDivElement>(null);
  const scopeInView = useInView(scopeRef, { once: true, margin: '-80px' });

  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: '-80px' });

  return (
    <>
      <SEO
        title="Services - Technical Consultancy, Maintenance & Productivity Solutions"
        description="PLUSTECH offers comprehensive services including technical consultancy, maintenance contracts, and productivity improvement solutions for surface finishing plants and automation systems."
        url="/services"
        keywords="surface finishing services, technical consultancy, maintenance contracts, productivity improvement, automation solutions"
      />
      <PageLayout className="bg-gradient-to-b from-white via-blue-50/30 to-white text-[#0f172a] pt-16">
        <main className="flex-1 w-full overflow-hidden">

          {/* ── Hero ── */}
          <section
            ref={heroRef}
            className="relative isolate overflow-hidden px-6 md:px-12 lg:px-16 pt-16 pb-12 md:pt-20 md:pb-16"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#00aeef]/12 blur-3xl rounded-full" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-900/8 blur-3xl rounded-full" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,174,239,0.06),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(8,47,73,0.06),transparent_40%)]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
              {/* Left — headline + CTAs */}
              <div className="space-y-5">
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-sm uppercase tracking-[0.22em] text-[#00aeef] font-semibold"
                >
                  Our Services
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight"
                >
                  Nurture. Nourish.{' '}
                  <br />
                  <span className="text-[#00aeef]">Sustain Performance.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-base md:text-lg text-slate-600 max-w-lg leading-relaxed"
                >
                  Long-term paintshop efficiency through high-quality, customer-friendly
                  service — delivered by specialists across mechanical, electrical, and
                  automation engineering.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="flex flex-wrap gap-3 pt-1"
                >
                  <a
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 rounded-xl bg-[#00aeef] text-black font-semibold shadow-lg shadow-[#00aeef]/25 hover:-translate-y-0.5 transition-transform"
                  >
                    Contact us
                  </a>
                  <a
                    href="#offerings"
                    className="inline-flex items-center px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold hover:border-[#00aeef]/60 hover:text-[#00aeef] transition-colors"
                  >
                    Explore offerings
                  </a>
                </motion.div>
              </div>

              {/* Right — 3C → 3P card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={heroInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="absolute -inset-3 bg-[#00aeef]/20 rounded-[30px] blur-2xl" />
                <div className="absolute -inset-1 bg-gradient-to-br from-[#00aeef]/40 via-[#00aeef]/20 to-blue-900/30 rounded-[26px] blur-sm" />
                <div className="relative rounded-[24px] overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1a2e] shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
                  {/* Ambient glow effects inside card */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-40 h-40 bg-[#00aeef]/15 blur-3xl rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,174,239,0.08),transparent_60%)]" />
                  </div>

                  <div className="relative p-7 md:p-9">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 rounded-full bg-[#00aeef]" />
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.2em] text-[#00aeef]/70 font-semibold">
                          Our Philosophy
                        </div>
                        <div className="text-xl md:text-2xl font-extrabold text-white leading-snug mt-0.5">
                          3C&apos;s to deliver 3P&apos;s
                        </div>
                      </div>
                    </div>

                    {/* 3C row */}
                    <div className="mb-5">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-semibold mb-3">
                        What drives us
                      </div>
                      <div className="space-y-2">
                        {pillars3C.map((c, i) => (
                          <motion.div
                            key={c}
                            initial={{ opacity: 0, x: -20 }}
                            animate={heroInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.4, delay: 0.45 + i * 0.1 }}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#00aeef]/15 flex items-center justify-center flex-shrink-0">
                              <span className="text-[#00aeef] font-bold text-sm">C{i + 1}</span>
                            </div>
                            <span className="text-sm font-semibold text-white/90">{c}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Animated flow divider */}
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00aeef]/40 to-transparent" />
                      <motion.div
                        animate={{ y: [0, 3, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00aeef] to-[#0088cc] flex items-center justify-center shadow-lg shadow-[#00aeef]/40 ring-2 ring-[#00aeef]/20 ring-offset-2 ring-offset-[#0f2137]"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                        </svg>
                      </motion.div>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00aeef]/40 to-transparent" />
                    </div>

                    {/* 3P row */}
                    <div className="mt-5">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-semibold mb-3">
                        What we deliver
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {pillars3P.map((p, i) => (
                          <motion.div
                            key={p}
                            initial={{ opacity: 0, y: 15 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.4, delay: 0.75 + i * 0.1 }}
                            className="relative group text-center px-3 py-4 rounded-xl bg-gradient-to-b from-[#00aeef]/20 to-[#00aeef]/5 border border-[#00aeef]/25 overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-b from-[#00aeef]/30 to-[#00aeef]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative">
                              <div className="text-2xl md:text-3xl font-extrabold text-[#00aeef] mb-1">
                                P{i + 1}
                              </div>
                              <div className="text-xs sm:text-sm font-bold text-white/90">{p}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── Service Offerings — alternating zigzag ── */}
          <section id="offerings" className="relative px-6 md:px-12 lg:px-16 py-8 md:py-12">
            <div className="max-w-6xl mx-auto space-y-20 md:space-y-28">
              {services.map((service, i) => (
                <ServiceCard key={service.title} service={service} index={i} />
              ))}
            </div>
          </section>

          {/* ── Scope & Coverage ── */}
          <section
            ref={scopeRef}
            className="relative px-6 md:px-12 lg:px-16 py-16 md:py-24"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-blue-50/30 to-transparent pointer-events-none" />
            <div className="max-w-5xl mx-auto relative z-10 space-y-12">
              <div className="text-center space-y-3">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={scopeInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-sm uppercase tracking-[0.18em] text-[#00aeef] font-semibold"
                >
                  What We Cover
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={scopeInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-3xl md:text-4xl font-extrabold text-[#0f172a]"
                >
                  End-to-End Service Scope
                </motion.h2>
              </div>

              {/* Icon cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {scopeAreas.map((area, i) => (
                  <motion.div
                    key={area.label}
                    initial={{ opacity: 0, y: 25 }}
                    animate={scopeInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                    className="group rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgba(8,47,73,0.05)] p-5 md:p-6 text-center space-y-3 hover:-translate-y-1 transition-transform duration-300"
                  >
                    <div className="mx-auto w-12 h-12 rounded-xl bg-[#00aeef]/10 text-[#00aeef] flex items-center justify-center group-hover:bg-[#00aeef] group-hover:text-white transition-colors duration-300">
                      {area.icon}
                    </div>
                    <div className="text-sm md:text-base font-semibold text-[#0f172a]">
                      {area.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Scope checklist */}
              <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {scopeItems.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -15 : 15 }}
                    animate={scopeInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.4 + i * 0.08 }}
                    className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-white border border-slate-100 shadow-sm"
                  >
                    <svg className="mt-0.5 w-5 h-5 text-[#00aeef] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-sm text-slate-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section
            ref={ctaRef}
            className="relative overflow-hidden px-6 md:px-12 lg:px-16 pb-20 pt-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="max-w-5xl mx-auto"
            >
              <div className="relative rounded-3xl border border-slate-100 bg-gradient-to-br from-[#00aeef]/8 via-white to-blue-100/25 p-10 md:p-14 shadow-[0_20px_60px_rgba(8,47,73,0.07)]">
                <div className="absolute -left-10 -top-10 w-44 h-44 bg-[#00aeef]/15 blur-3xl rounded-full" />
                <div className="absolute -right-16 bottom-0 w-56 h-56 bg-blue-900/8 blur-3xl rounded-full" />

                <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
                  <div className="space-y-3 flex-1">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a]">
                      Let&apos;s align on your targets.
                    </h2>
                    <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                      Share your current challenges — throughput, quality, safety, or
                      energy — and we&apos;ll respond with a focused plan.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 flex-shrink-0">
                    <a
                      href="/contact"
                      className="inline-flex items-center px-7 py-3.5 rounded-xl bg-[#00aeef] text-black font-semibold shadow-lg shadow-[#00aeef]/25 hover:-translate-y-0.5 transition-transform"
                    >
                      Contact services team
                    </a>
                    <a
                      href="mailto:info@plustech.com"
                      className="inline-flex items-center px-7 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold hover:border-[#00aeef]/60 hover:text-[#00aeef] transition-colors"
                    >
                      Email a brief
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

        </main>

        <Footer />
      </PageLayout>
    </>
  );
};

export default ServicesPage;
