import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { PageLayout } from '../components/PageLayout';
import { SEO } from '../components/SEO';
import { useCareersFirestore } from '../hooks/useCareersFirestore';

const CareersPage: React.FC = () => {
  const { publicJobs, loading, error } = useCareersFirestore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const jobs = useMemo(() => publicJobs.slice(0, 20), [publicJobs]);
  const hasOpenJobs = jobs.length > 0;

  const toggleJob = (jobId: string) => {
    setExpandedId((prev) => (prev === jobId ? null : jobId));
  };

  return (
    <>
      <SEO
        title="Careers - Build Impactful Industrial Automation Solutions | PLUSTECH"
        description="Explore open roles at PLUSTECH and apply for engineering, automation, and operations opportunities."
        url="/careers"
        keywords="plustech careers, engineering jobs, automation jobs, industrial careers"
      />
      <PageLayout className="bg-gradient-to-b from-white via-blue-50/30 to-white text-[#0f172a] pt-16">
        <main className="flex-1 w-full overflow-hidden">
          {/* Hero */}
          <section className="relative isolate px-6 md:px-12 lg:px-16 py-16 md:py-20">

            {hasOpenJobs && (
              <div className="absolute inset-x-0 top-4 md:top-6 flex justify-center z-20 px-4">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('open-positions');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="inline-flex items-center gap-4 rounded-full bg-gradient-to-r from-white via-[#e0f4ff] to-[#cfe7ff] text-[#0f172a] border border-white/80 px-6 py-3 text-sm md:text-base font-semibold shadow-[0_24px_60px_rgba(15,23,42,0.4)] backdrop-blur-md hover:from-[#e6f4ff] hover:via-[#d8ecff] hover:to-[#c3ddff] transition-colors"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00aeef] text-slate-900 text-sm font-extrabold shadow-lg shadow-[#00aeef]/50">
                    +
                  </span>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="uppercase tracking-[0.24em] text-sm md:text-base text-slate-800">
                      WE ARE HIRING
                    </span>
                    <span className="text-[0.8rem] md:text-sm text-slate-700 mt-0.5">
                      New roles open across projects, automation &amp; service →
                    </span>
                  </div>
                </button>
              </div>
            )}

            <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
              {/* Left: structured copy */}
              <div className="space-y-7">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/80 border border-black/5 shadow-sm backdrop-blur">
                  <span className="w-2 h-2 rounded-full bg-[#00aeef]" />
                  <span className="text-sm font-semibold text-[#0f172a]">Careers at PLUSTECH</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-slate-900">
                    Build real paintshops, real automation, and real careers.
                  </h1>
                  <p className="text-lg md:text-xl text-slate-700 max-w-2xl">
                    At PLUSTECH, you work on live customer plants—not mock projects. You see complete
                    paintshops, material handling, and automation systems move from concept on paper to
                    stable production on the shop floor.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-[0.14em]">
                      Your work
                    </div>
                    <p className="mt-1 text-sm text-slate-700">
                      Own clearly defined pieces of projects—from layouts and calculations to trials and
                      commissioning at customer sites.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-[0.14em]">
                      Your team
                    </div>
                    <p className="mt-1 text-sm text-slate-700">
                      Work with experienced mechanical, electrical, and automation engineers who review
                      designs with you and stay hands‑on with the work.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-[0.14em]">
                      Your growth
                    </div>
                    <p className="mt-1 text-sm text-slate-700">
                      Grow through real project cycles, customer exposure, and the chance to see how good
                      engineering decisions hold up in production.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="#open-positions"
                    className="inline-flex items-center px-6 py-3 rounded-xl bg-[#00aeef] text-black font-semibold shadow-lg shadow-[#00aeef]/30 hover:-translate-y-0.5 transition-transform"
                  >
                    View open positions
                  </a>
                  <a
                    href="/facility"
                    className="inline-flex items-center px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold hover:border-[#00aeef]/70 hover:text-[#00aeef] transition-colors"
                  >
                    View our facilities
                  </a>
                </div>
              </div>

              {/* Right: visual context card (match Projects/Contact gradient style) */}
              <div className="relative">
                <div className="absolute -inset-5 bg-white/60 rounded-3xl blur-xl" />
                <div className="relative rounded-[28px] border border-white/80 shadow-2xl shadow-blue-900/10 overflow-hidden bg-gradient-to-br from-white via-[#e0f4ff] to-[#cfe7ff] p-7 text-[#0f172a]">
                  <div className="relative space-y-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      What you work on here
                    </div>
                    <p className="text-sm text-slate-700">
                      Lines for automotive and industrial customers, conveyor systems, pretreatment and
                      paint processes, and upgrades that improve energy, safety, and uptime.
                    </p>
                    <p className="text-sm text-slate-700">
                      Roles span project engineering, controls and automation, on‑site execution, and
                      long‑term service. You are always close to real equipment and real decisions.
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-3 py-1 rounded-full bg-white/70 border border-slate-200 text-slate-800">
                        Project engineering
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/70 border border-slate-200 text-slate-800">
                        Controls & automation
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/70 border border-slate-200 text-slate-800">
                        Site execution
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/70 border border-slate-200 text-slate-800">
                        Service & audits
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="open-positions" className="px-6 md:px-12 lg:px-16 pb-14 md:pb-16">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a]">Open positions</h2>
                <p className="text-slate-700">Explore roles and apply in a few minutes.</p>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}
              {loading && jobs.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">Loading roles...</div>
              ) : null}
              {!loading && jobs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                  No open positions right now. Please check back soon.
                </div>
              ) : null}
              <div className="space-y-3">
                {jobs.map((job) => {
                  const isExpanded = expandedId === job.id;
                  return (
                    <article
                      key={job.id}
                      className="rounded-xl border border-slate-800/80 bg-slate-900/90 backdrop-blur-md overflow-hidden shadow-[0_18px_45px_rgba(15,23,42,0.65)]"
                    >
                      <div className="w-full px-4 py-4 md:px-5 md:py-4">
                        <div className="flex items-start justify-between gap-3">
                          <button
                            type="button"
                            className="text-left flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-md"
                            onClick={() => toggleJob(job.id)}
                            aria-expanded={isExpanded}
                            aria-controls={`job-panel-${job.id}`}
                          >
                            <div className="text-lg md:text-xl font-bold text-white">{job.title}</div>
                            <div className="mt-1 text-sm text-slate-100/90">
                              {job.employmentType} • {job.locationType} • {job.location}
                              {job.experienceRange ? ` • ${job.experienceRange}` : ''}
                            </div>
                          </button>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/careers/apply/${job.id}`}
                              className="inline-flex items-center px-4 py-2 rounded-lg bg-[#00aeef] text-black font-semibold text-sm hover:bg-[#0099d4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                            >
                              Apply Now
                            </Link>
                            <button
                              type="button"
                              onClick={() => toggleJob(job.id)}
                              aria-label={isExpanded ? 'Collapse job details' : 'Expand job details'}
                              className="p-2 rounded-md text-slate-100 hover:bg-slate-800/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                            >
                              <ChevronDown
                                className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      {isExpanded && (
                        <div
                          id={`job-panel-${job.id}`}
                          className="px-4 pb-4 md:px-5 md:pb-5 border-t border-sky-500/40 bg-slate-900"
                        >
                          <div className="pt-4 space-y-4 text-slate-100">
                            <p className="text-sm md:text-base text-slate-100/90">{job.overview}</p>
                            {job.jdFileUrl && (
                              <a
                                href={job.jdFileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex text-sm font-semibold text-sky-300 hover:text-sky-100"
                              >
                                View full job description (PDF)
                              </a>
                            )}
                            <div>
                              <h3 className="font-semibold text-white mb-2">Responsibilities</h3>
                              <ul className="space-y-1 text-sm md:text-base text-slate-100/90">
                                {job.responsibilities.slice(0, 6).map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                    <span className="mt-2 h-2 w-2 rounded-full bg-sky-400" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="grid md:grid-cols-2 gap-5">
                              <div>
                                <h3 className="font-semibold text-white mb-2">Must-have</h3>
                                <ul className="space-y-1 text-sm md:text-base text-slate-100/90">
                                  {job.mustHave.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                      <span className="mt-2 h-2 w-2 rounded-full bg-sky-400" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h3 className="font-semibold text-white mb-2">Nice-to-have</h3>
                                <ul className="space-y-1 text-sm md:text-base text-slate-100/90">
                                  {job.niceToHave.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                      <span className="mt-2 h-2 w-2 rounded-full bg-sky-400" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            {job.successMetrics.length > 0 && (
                              <div>
                                <h3 className="font-semibold text-white mb-2">What success looks like in 6-12 months</h3>
                                <ul className="space-y-1 text-sm md:text-base text-slate-100/90">
                                  {job.successMetrics.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                      <span className="mt-2 h-2 w-2 rounded-full bg-sky-400" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <Link
                              to={`/careers/apply/${job.id}`}
                              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#00aeef] text-black font-semibold hover:bg-[#0099d4] transition-colors"
                            >
                              Apply Now
                            </Link>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Facilities CTA */}
          <section className="px-6 md:px-12 lg:px-16 pb-16">
            <div className="max-w-6xl mx-auto">
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-[#00aeef]/10 via-white to-blue-100/40 p-8 md:p-10 shadow-[0_18px_55px_rgba(15,23,42,0.12)] flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f172a]">
                    See where you’ll be building.
                  </h2>
                  <p className="text-slate-700 max-w-xl">
                    Take a quick tour of our Pune facilities—engineering floors, project bays, and meeting spaces
                    where teams collaborate on live programs.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/facility"
                    className="inline-flex items-center px-6 py-3 rounded-xl bg-[#00aeef] text-black font-semibold shadow-md hover:-translate-y-0.5 transition-transform"
                  >
                    View our facilities
                  </a>
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

export default CareersPage;

