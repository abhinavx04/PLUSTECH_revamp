import React, { useState } from 'react';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '../components/ui/resizable-navbar';
import Footer from '../components/Footer';

const services = [
  {
    title: 'Technical Consultancy',
    description:
      'Blueprints for new projects and modernization, aligned to throughput, quality, and safety KPIs.',
    image: '/automated-customised-materialhandling/1.png',
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
      'Proactive coverage that keeps paintshops stable—remote support, onsite specialists, and ready spares.',
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
    image: '/digitization-smartfactory/2.jpg',
    bullets: [
      'Process and capacity enhancement programs',
      'Modernisation with low-downtime execution',
      'Automation upgrades across robots and conveyors',
      'Introducing new concepts to unlock hidden capacity',
    ],
    accent: 'Optimize • Automate • Scale',
  },
];

const ServicesPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  const cn = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
  };

  const navItems = [
    { name: 'Home', link: '/' },
    { 
      name: 'About', 
      link: '/about',
      submenu: [
        { title: 'About Us', path: '/about' },
        { title: 'Corporate Beliefs', path: '/about/corporate-beliefs' },
        { title: 'Industry Focus', path: '/about/industry-focus' },
        { title: 'Certifications', path: '/about/certifications' },
        { title: 'History & Milestones', path: '/about/history' },
        { title: 'Annual Returns', path: '/about/annual-returns' },
        { title: 'CSR Activities', path: '/about/csr-activities' },
      ]
    },
    { name: 'Projects', link: '/projects' },
    { name: 'Services', link: '/services' },
    { name: 'Contact', link: '/contact' },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-white via-blue-50/30 to-white text-[#0f172a] pt-16">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <div className="flex-1 flex justify-center">
            <NavItems items={navItems} />
          </div>
          <div className="w-24" />
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            {!isMobileMenuOpen && (
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            )}
          </MobileNavHeader>
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            <div className="space-y-2">
              {navItems.map((item, idx) => {
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const isOpen = openMobileDropdown === item.name;
                
                return (
                  <div key={`mobile-link-${idx}`}>
                    <div
                      className="flex items-center justify-between text-[#222222] hover:text-[#333333] transition-colors py-4 px-4 rounded-lg hover:bg-black/5 font-semibold text-lg border-b cursor-pointer"
                  style={{ borderBottomColor: 'rgba(0,0,0,0.08)' }}
                      onClick={() => {
                        if (hasSubmenu) {
                          setOpenMobileDropdown(isOpen ? null : item.name);
                        } else {
                          setIsMobileMenuOpen(false);
                          window.location.href = item.link;
                        }
                      }}
                    >
                      <span>{item.name}</span>
                      {hasSubmenu && (
                        <svg 
                          className={cn(
                            "w-5 h-5 transition-transform duration-200",
                            isOpen && "rotate-180"
                          )} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                    {hasSubmenu && isOpen && (
                      <div className="pl-6 pr-4 pb-2 space-y-1">
                        {item.submenu.map((subItem, subIdx) => (
                          <a
                            key={`mobile-submenu-${idx}-${subIdx}`}
                            href={subItem.path}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setOpenMobileDropdown(null);
                            }}
                            className="block text-[#666666] hover:text-[#00aeef] transition-colors py-2 px-4 rounded-lg hover:bg-black/5 text-base"
                          >
                            {subItem.title}
                </a>
              ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <main className="flex-1 w-full overflow-hidden">
        {/* Hero */}
        <section className="relative isolate overflow-hidden px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#00aeef]/15 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-900/10 blur-3xl rounded-full" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,174,239,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(8,47,73,0.1),transparent_35%)]" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/70 border border-black/5 shadow-sm backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-[#00aeef]" />
                <span className="text-sm font-semibold text-[#0f172a]">Services</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                Services
              </h1>
              <p className="text-lg md:text-xl text-slate-700 max-w-3xl">
                “Nurture and nourish” exemplify our Services’ imperatives. 3C’s—Customer-centricity,
                Cost Effectiveness, and Competent Engineering solutions—are central to our service
                contracts to deliver 3P’s: Productivity, Performance, and Product quality for our
                customers.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-[#00aeef] text-black font-semibold shadow-lg shadow-[#00aeef]/30 hover:-translate-y-0.5 transition-transform"
                >
                  Contact us
                </a>
                <a
                  href="#offerings"
                  className="inline-flex items-center px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold hover:border-[#00aeef]/70 hover:text-[#00aeef] transition-colors"
                >
                  Explore offerings
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 bg-white/60 rounded-[28px] blur-xl border border-white/40" />
              <div className="relative rounded-[28px] border border-white/80 shadow-2xl shadow-blue-900/10 overflow-hidden bg-gradient-to-br from-white via-[#e0f4ff] to-[#cfe7ff]">
                <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_20%_20%,rgba(0,174,239,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(8,47,73,0.25),transparent_35%)]" />
                <div className="relative p-8 space-y-4 text-[#0f172a]">
                  <div className="text-2xl md:text-3xl font-extrabold">
                    Long term paintshop efficiency
                  </div>
                  <p className="text-slate-700">
                    High quality, customer-friendly service delivered by specialists across mechanical
                    engineering, electrical engineering, and plant automation. Sustained efficiency is
                    achieved through personnel training, safety, and energy audits.
                  </p>
                  <p className="text-slate-700">
                    Services include relocation support, recommissioning of complete plants across regions,
                    and improvements through innovative solutions aligned to customer strategies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="relative z-10 px-6 md:px-12 lg:px-16 pb-12">
          <div className="max-w-6xl mx-auto rounded-3xl border border-slate-100 bg-white shadow-[0_20px_70px_rgba(8,47,73,0.06)] p-8 space-y-3">
            <div className="text-sm font-semibold text-[#00aeef] uppercase tracking-[0.08em]">
              3C&apos;s to deliver 3P&apos;s
            </div>
            <div className="text-lg font-bold text-[#0f172a]">
              Customer-centricity, Cost Effectiveness, and Competent Engineering solutions to deliver
              Productivity, Performance, and Product quality.
            </div>
          </div>
        </section>

        {/* Service philosophy */}
        <section className="relative px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
            <div className="space-y-5">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a]">
                “Nurture and nourish” exemplify our Services’ imperatives.
              </h2>
              <p className="text-lg text-slate-700">
                3C’s—Customer-centricity, Cost Effectiveness, and Competent Engineering
                solutions—are central to our service contracts to deliver 3P’s: Productivity,
                Performance, and Product quality for our customers.
              </p>
              <p className="text-base text-slate-600">
                Long-term paintshop efficiency is realised through high-quality, customer-friendly
                service. With specialists across mechanical engineering, electrical engineering, and
                plant automation, we help you achieve sustained efficiency through personnel
                training, safety programs, and energy audits.
              </p>
              <p className="text-base text-slate-600">
                Our service portfolio thrives on continuous relationships. We support relocations,
                recommissioning complete plants across regions, and boosting paintshop output with
                innovative solutions that align with your business strategies.
              </p>
              <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl border border-[#00aeef]/30 bg-[#00aeef]/10 text-[#0f172a] font-semibold">
                <span className="h-2 w-2 rounded-full bg-[#00aeef]" />
                Service support for sustained operations.
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#00aeef]/10 via-white to-blue-200/20 rounded-3xl blur-xl" />
              <div className="relative rounded-3xl bg-white border border-slate-100 shadow-[0_20px_70px_rgba(8,47,73,0.08)] p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm uppercase tracking-[0.12em] text-slate-500">
                      Scope
                    </div>
                    <div className="text-2xl font-bold text-[#0f172a]">What we cover</div>
                  </div>
                </div>
                <ul className="space-y-4 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#00aeef]" />
                    <span>Concept-to-commissioning guidance with structured reviews.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#00aeef]" />
                    <span>Run-readiness audits covering safety, energy, and reliability.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#00aeef]" />
                    <span>Skill-building for operators and maintenance teams.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#00aeef]" />
                    <span>Remote diagnostics paired with onsite interventions.</span>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                    Robotics
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                    Conveyors
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                    Paint process
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                    Controls & electrical
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Offerings */}
        <section id="offerings" className="relative px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-[#0f172a]">
                Offerings that keep plants moving
              </h3>
              <p className="mt-2 text-lg text-slate-700 max-w-2xl">
                Support for new projects, modernisation, and sustained operations.
              </p>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center px-5 py-3 rounded-xl border border-[#00aeef]/50 bg-white text-[#00aeef] font-semibold shadow-md hover:bg-[#00aeef]/10 transition-colors"
            >
              Share your requirements
            </a>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_25px_80px_rgba(8,47,73,0.08)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <div>
                      <div className="text-xs uppercase tracking-[0.16em] text-white/70">Focus</div>
                      <div className="text-xl font-bold">{service.title}</div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/20 text-sm font-semibold backdrop-blur">
                      {service.accent}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-base text-slate-700">{service.description}</p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {service.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#00aeef]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden px-6 md:px-12 lg:px-16 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-3xl border border-slate-100 bg-gradient-to-r from-[#00aeef]/10 via-white to-blue-100/30 p-10 md:p-14 shadow-[0_25px_80px_rgba(8,47,73,0.08)]">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#00aeef]/20 blur-3xl rounded-full" />
              <div className="absolute -right-16 bottom-0 w-52 h-52 bg-blue-900/10 blur-3xl rounded-full" />
              <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
                <div className="space-y-3">
                  <div className="text-sm uppercase tracking-[0.14em] text-slate-600">
                    Next step
                  </div>
                  <div className="text-3xl md:text-4xl font-extrabold text-[#0f172a]">
                    Let’s align on your targets.
                  </div>
                  <p className="text-lg text-slate-700 max-w-2xl">
                    Share your current challenges—throughput, quality, safety, or energy—and we will
                    respond with a focused plan.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 rounded-xl bg-[#00aeef] text-black font-semibold shadow-lg shadow-[#00aeef]/30 hover:-translate-y-0.5 transition-transform"
                  >
                    Contact services team
                  </a>
                  <a
                    href="mailto:info@plustech.com"
                    className="inline-flex items-center px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold hover:border-[#00aeef]/70 hover:text-[#00aeef] transition-colors"
                  >
                    Email a brief
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;

