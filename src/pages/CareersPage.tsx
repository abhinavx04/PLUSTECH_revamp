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
          <section className="relative isolate overflow-hidden px-6 md:px-12 lg:px-16 py-16 md:py-20">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#00aeef]/15 blur-3xl rounded-full" />
              <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-900/10 blur-3xl rounded-full" />
            </div>
            <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/70 border border-black/5 shadow-sm backdrop-blur">
                  <span className="w-2 h-2 rounded-full bg-[#00aeef]" />
                  <span className="text-sm font-semibold text-[#0f172a]">Careers at PLUSTECH</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                  Build systems that move real factories, not just dashboards.
                </h1>
                <ul className="space-y-3 text-slate-700 text-base md:text-lg">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#00aeef]" />
                    <span>Work with experienced mentors across mechanical, electrical, and automation teams.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#00aeef]" />
                    <span>Own outcomes that directly impact client productivity, quality, and plant uptime.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#00aeef]" />
                    <span>Learn continuously through hands-on projects, reviews, and cross-functional collaboration.</span>
                  </li>
                </ul>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="#open-positions"
                    className="inline-flex items-center px-6 py-3 rounded-xl bg-[#00aeef] text-black font-semibold shadow-lg shadow-[#00aeef]/30 hover:-translate-y-0.5 transition-transform"
                  >
                    View Open Positions
                  </a>
                  <a
                    href="#life-at-plustech"
                    className="inline-flex items-center px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold hover:border-[#00aeef]/70 hover:text-[#00aeef] transition-colors"
                  >
                    Life at PLUSTECH
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-5 bg-white/50 rounded-3xl blur-xl" />
                <div className="relative rounded-3xl border border-white/80 bg-gradient-to-br from-white to-blue-100/60 p-8 shadow-[0_25px_80px_rgba(8,47,73,0.08)]">
                  <h2 className="text-2xl font-bold text-[#0f172a] mb-3">Why teams stay here</h2>
                  <p className="text-slate-700">
                    Projects are complex, timelines are real, and decisions are collaborative. We keep
                    hierarchies light and accountability clear, so good ideas move quickly.
                  </p>
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

          <section id="life-at-plustech" className="px-6 md:px-12 lg:px-16 pb-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a]">Life at PLUSTECH</h2>
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                {[
                  'Hands-on ownership from design to commissioning.',
                  'Collaborative reviews with mentors who care about craft.',
                  'Practical growth across automation, controls, and process engineering.',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-sm">
                    <p className="text-slate-700">{item}</p>
                  </div>
                ))}
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

