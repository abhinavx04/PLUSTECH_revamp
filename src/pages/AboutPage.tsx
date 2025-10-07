import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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

const AboutPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const beliefsRef = useRef<HTMLDivElement>(null);
  const industryRef = useRef<HTMLDivElement>(null);
  const certificationsRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const returnsRef = useRef<HTMLDivElement>(null);
  const csrRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Services", link: "/services" },
    { name: "Contact", link: "/contact" },
  ];

  const sections = [
    { id: 'hero', label: 'Our Story', ref: heroRef },
    { id: 'beliefs', label: 'Corporate Beliefs', ref: beliefsRef },
    { id: 'industry', label: 'Industry Focus', ref: industryRef },
    { id: 'certifications', label: 'Certifications', ref: certificationsRef },
    { id: 'history', label: 'History & Milestones', ref: historyRef },
    { id: 'returns', label: 'Annual Returns', ref: returnsRef },
    { id: 'csr', label: 'CSR Activities', ref: csrRef },
  ];

  const beliefsInView = useInView(beliefsRef, { threshold: 0.5 });
  const industryInView = useInView(industryRef, { threshold: 0.5 });
  const certificationsInView = useInView(certificationsRef, { threshold: 0.5 });
  const historyInView = useInView(historyRef, { threshold: 0.5 });
  const returnsInView = useInView(returnsRef, { threshold: 0.5 });
  const csrInView = useInView(csrRef, { threshold: 0.5 });

  useEffect(() => {
    const inViews = [beliefsInView, industryInView, certificationsInView, historyInView, returnsInView, csrInView];
    const activeIndex = inViews.findIndex(inView => inView) + 1; // +1 because hero is index 0
    if (activeIndex > 0) {
      setActiveSection(activeIndex);
    } else {
      setActiveSection(0);
    }
  }, [beliefsInView, industryInView, certificationsInView, historyInView, returnsInView, csrInView]);

  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full text-black font-body overflow-x-hidden relative">
      {/* Resizable Navbar */}
      <div className="relative w-full z-50">
        <Navbar>
          <NavBody>
            <NavbarLogo />
            <div className="flex-1 flex justify-center">
              <NavItems items={navItems} />
            </div>
            <div className="w-24"></div>
          </NavBody>

          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </MobileNavHeader>

            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              <div className="space-y-4">
                {navItems.map((item, idx) => (
                  <a
                    key={`mobile-link-${idx}`}
                    href={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-white hover:text-[#00aeef] transition-colors py-4 px-4 rounded-lg hover:bg-white/10 font-semibold text-lg border-b border-white/10 last:border-b-0"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      </div>

      {/* Floating Navigation Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col space-y-4">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.ref)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === index
                  ? 'bg-[#00aeef] scale-125'
                  : 'bg-black/30 hover:bg-black/50'
              }`}
              aria-label={`Go to ${section.label}`}
            />
          ))}
        </div>
      </div>

      {/* Hero Section - Full Screen */}
      <section 
        ref={heroRef} 
        className="h-screen w-full relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url("/aboutus/Banner4-1536x1024.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Glassy Overlay */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 text-center px-4 md:px-6 lg:px-8 max-w-6xl">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-white text-4xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight font-heading mb-8"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
          >
            Our Story Through
            <br />
            <span className="text-[#00aeef]">Innovation</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-white/90 text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto font-body leading-relaxed mb-12"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
          >
            Discover the journey of PlusTech as we revolutionize manufacturing through 
            intelligent solutions, precision engineering, and unwavering commitment to excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <button
              onClick={() => scrollToSection(beliefsRef)}
              className="px-8 md:px-10 py-4 rounded-full bg-[#00aeef] text-white font-semibold shadow-[0_8px_24px_rgba(0,174,239,0.4)] hover:bg-[#0099d4] transition-all duration-300 text-lg transform hover:scale-105"
            >
              Explore Our Story
            </button>
            <button
              onClick={() => scrollToSection(csrRef)}
              className="px-8 md:px-10 py-4 rounded-full bg-white text-[#00aeef] font-semibold hover:bg-gray-50 transition-all duration-300 text-lg shadow-[0_8px_24px_rgba(0,0,0,0.1)] border border-[#00aeef]/20 transform hover:scale-105"
            >
              Our Impact
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-white/80 text-sm font-medium">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white/70 rounded-full mt-2"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Corporate Beliefs Section - Full Screen */}
      <section 
        ref={beliefsRef} 
        className="min-h-screen w-full relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url("/aboutus/13673863-removebg-preview.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Glassy Overlay */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-black text-4xl md:text-6xl font-bold font-heading mb-6">
              Corporate Beliefs
            </h2>
            <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
              The fundamental principles that guide our actions and define our commitment to excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation First",
                description: "We continuously push boundaries in manufacturing technology, embracing cutting-edge solutions to deliver superior results.",
                number: "01"
              },
              {
                title: "Quality Excellence",
                description: "Every project reflects our unwavering commitment to precision, reliability, and the highest standards of craftsmanship.",
                number: "02"
              },
              {
                title: "Customer Partnership",
                description: "We build lasting relationships through understanding, collaboration, and delivering solutions that exceed expectations.",
                number: "03"
              },
              {
                title: "Sustainable Growth",
                description: "Our approach balances business success with environmental responsibility and long-term value creation.",
                number: "04"
              },
              {
                title: "Integrity & Trust",
                description: "Transparency, honesty, and ethical practices form the foundation of all our business relationships.",
                number: "05"
              },
              {
                title: "Continuous Learning",
                description: "We embrace change, learn from challenges, and evolve to stay at the forefront of industry advancements.",
                number: "06"
              }
            ].map((belief, index) => (
              <motion.div
                key={belief.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-[0_12px_36px_rgba(0,0,0,0.15)] border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-black text-xl font-bold font-heading">{belief.title}</h3>
                  <span className="text-[#00aeef] text-2xl font-bold font-heading">{belief.number}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{belief.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Focus Section - Full Screen */}
      <section 
        ref={industryRef} 
        className="min-h-screen w-full relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url("/aboutus/13673863-removebg-preview.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Glassy Overlay */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-black text-4xl md:text-6xl font-bold font-heading mb-6">
              Industry Focus
            </h2>
            <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
              Specialized expertise across diverse manufacturing sectors
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                  {
                    industry: "Automotive Manufacturing",
                    description: "Complete paint shop solutions for automotive OEMs and tier suppliers, from design to commissioning.",
                    stats: "200+ Projects"
                  },
                  {
                    industry: "General Industry",
                    description: "Custom surface finishing systems for appliances, furniture, and industrial equipment manufacturers.",
                    stats: "150+ Projects"
                  },
                  {
                    industry: "Aerospace & Defense",
                    description: "Precision coating systems meeting stringent aerospace standards and military specifications.",
                    stats: "50+ Projects"
                  },
                  {
                    industry: "Electronics & Technology",
                    description: "Advanced coating solutions for electronic components and high-tech manufacturing processes.",
                    stats: "75+ Projects"
                  }
              ].map((industry, index) => (
                <motion.div
                  key={industry.industry}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-black text-xl font-bold font-heading">{industry.industry}</h3>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#00aeef] text-white">
                      {industry.stats}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{industry.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
                <h4 className="text-black text-2xl font-bold font-heading mb-6">Our Expertise</h4>
                <div className="space-y-4">
                  {[
                    { skill: "Design & Engineering", percentage: 95 },
                    { skill: "Automation & Control", percentage: 90 },
                    { skill: "Quality Assurance", percentage: 98 },
                    { skill: "Project Management", percentage: 92 },
                    { skill: "Commissioning", percentage: 96 }
                  ].map((skill, index) => (
                    <div key={skill.skill} className="space-y-2">
                      <div className="flex justify-between text-black">
                        <span className="font-medium">{skill.skill}</span>
                        <span className="text-[#00aeef] font-bold">{skill.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="bg-[#00aeef] h-2 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifications Section - Full Screen */}
      <section 
        ref={certificationsRef} 
        className="min-h-screen w-full relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url("/aboutus/13673863-removebg-preview.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Glassy Overlay */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-black text-4xl md:text-6xl font-bold font-heading mb-6">
              Our Certifications
            </h2>
            <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
              Recognized excellence through industry certifications and quality standards
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "ISO 9001:2015",
                description: "Quality Management System",
                category: "Quality",
                validity: "Valid until 2026"
              },
              {
                title: "ISO 14001:2015",
                description: "Environmental Management System",
                category: "Environment",
                validity: "Valid until 2026"
              },
              {
                title: "OHSAS 18001:2007",
                description: "Occupational Health & Safety",
                category: "Safety",
                validity: "Valid until 2025"
              },
              {
                title: "ASME Certification",
                description: "Pressure Vessel Code Compliance",
                category: "Engineering",
                validity: "Valid until 2027"
              },
              {
                title: "CE Marking",
                description: "European Conformity Standards",
                category: "Compliance",
                validity: "Valid until 2026"
              },
              {
                title: "IATF 16949:2016",
                description: "Automotive Quality Management",
                category: "Automotive",
                validity: "Valid until 2025"
              }
            ].map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-[0_12px_36px_rgba(0,0,0,0.15)] border border-gray-100 group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00aeef] to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-xl font-bold font-heading">{index + 1}</span>
                  </div>
                  <h3 className="text-black text-xl font-bold font-heading mb-2">{cert.title}</h3>
                  <p className="text-gray-700 mb-4">{cert.description}</p>
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 bg-[#00aeef]/20 text-[#00aeef] text-sm font-semibold rounded-full">
                      {cert.category}
                    </span>
                    <p className="text-gray-500 text-sm">{cert.validity}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg max-w-4xl mx-auto">
              <h4 className="text-black text-2xl font-bold font-heading mb-4">Certification Excellence</h4>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our comprehensive certification portfolio demonstrates our commitment to maintaining the highest 
                standards in quality, environmental responsibility, and workplace safety across all our operations.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* History & Milestones Section - Full Screen */}
      <section 
        ref={historyRef} 
        className="min-h-screen w-full relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url("/aboutus/13673863-removebg-preview.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Glassy Overlay */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-black text-4xl md:text-6xl font-bold font-heading mb-6">
              History & Milestones
            </h2>
            <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
              A journey of innovation, growth, and industry leadership
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#00aeef] transform md:-translate-x-0.5"></div>

            {[
              {
                year: "2024",
                title: "Global Expansion",
                description: "Established international partnerships and expanded operations to serve global markets with cutting-edge paint shop solutions.",
                achievement: "500+ Projects Completed"
              },
              {
                year: "2022",
                title: "Digital Transformation",
                description: "Launched advanced IoT-enabled paint shop systems with real-time monitoring and predictive maintenance capabilities.",
                achievement: "Industry Innovation Award"
              },
              {
                year: "2020",
                title: "Sustainability Focus",
                description: "Introduced eco-friendly paint shop technologies reducing environmental impact by 40% while maintaining quality standards.",
                achievement: "Green Technology Certification"
              },
              {
                year: "2018",
                title: "Automation Revolution",
                description: "Pioneered fully automated paint shop systems for automotive industry, setting new benchmarks in efficiency and precision.",
                achievement: "Patent for Automation Technology"
              },
              {
                year: "2015",
                title: "Quality Excellence",
                description: "Achieved ISO 9001 certification and implemented comprehensive quality management systems across all operations.",
                achievement: "ISO 9001:2015 Certified"
              },
              {
                year: "2012",
                title: "Company Foundation",
                description: "Founded PlusTech with a vision to revolutionize manufacturing through intelligent paint shop solutions.",
                achievement: "First Major Project"
              }
            ].map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-16 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-[#00aeef] rounded-full transform -translate-x-2 md:-translate-x-2 z-10 border-4 border-white shadow-lg"></div>

                {/* Content */}
                <div className={`ml-16 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                  <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[#00aeef] text-2xl font-bold font-heading">{milestone.year}</span>
                      <span className="px-3 py-1 bg-[#00aeef]/20 text-[#00aeef] text-sm font-semibold rounded-full">
                        {milestone.achievement}
                      </span>
                    </div>
                    <h3 className="text-black text-xl font-bold font-heading mb-3">{milestone.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual Returns Section - Full Screen */}
      <section 
        ref={returnsRef} 
        className="min-h-screen w-full relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url("/aboutus/13673863-removebg-preview.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Glassy Overlay */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-black text-4xl md:text-6xl font-bold font-heading mb-6">
              Annual Returns
            </h2>
            <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
              Sustainable growth and financial excellence over the years
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {[
                {
                  year: "2023-2024",
                  revenue: "₹45.2 Cr",
                  growth: "+18%",
                  projects: "45",
                  color: "bg-[#00aeef]"
                },
                {
                  year: "2022-2023",
                  revenue: "₹38.3 Cr",
                  growth: "+15%",
                  projects: "38",
                  color: "bg-[#00aeef]"
                },
                {
                  year: "2021-2022",
                  revenue: "₹33.3 Cr",
                  growth: "+22%",
                  projects: "32",
                  color: "bg-[#00aeef]"
                },
                {
                  year: "2020-2021",
                  revenue: "₹27.3 Cr",
                  growth: "+12%",
                  projects: "28",
                  color: "bg-[#00aeef]"
                }
              ].map((year, index) => (
                <motion.div
                  key={year.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-black text-xl font-bold font-heading">{year.year}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${year.color} text-white`}>
                      {year.growth}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Revenue</p>
                      <p className="text-black text-2xl font-bold">{year.revenue}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Projects</p>
                      <p className="text-black text-2xl font-bold">{year.projects}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg"
            >
              <h4 className="text-black text-2xl font-bold font-heading mb-6">Key Performance Indicators</h4>
             <div className="space-y-6">
                {[
                  { metric: "Customer Satisfaction", value: "98%", color: "from-green-400 to-emerald-400" },
                  { metric: "On-Time Delivery", value: "95%", color: "from-blue-400 to-cyan-400" },
                  { metric: "Quality Standards", value: "99.5%", color: "from-purple-400 to-indigo-400" },
                  { metric: "Safety Record", value: "Zero Accidents", color: "from-orange-400 to-red-400" }
                ].map((kpi, index) => (
                  <div key={kpi.metric} className="space-y-2">
                    <div className="flex justify-between text-black">
                      <span className="font-medium">{kpi.metric}</span>
                      <span className="font-bold text-[#00aeef]">{kpi.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: kpi.value.includes('%') ? kpi.value : '100%' }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-[#00aeef] h-2 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CSR Activities Section - Full Screen */}
      <section 
        ref={csrRef} 
        className="min-h-screen w-full relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url("/aboutus/13673863-removebg-preview.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Glassy Overlay */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-black text-4xl md:text-6xl font-bold font-heading mb-6">
              CSR Activities
            </h2>
            <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
              Making a positive impact on communities and the environment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Education Support",
                description: "Providing scholarships and educational resources to underprivileged students in manufacturing and engineering fields.",
                impact: "500+ Students Benefited",
                number: "01"
              },
              {
                title: "Environmental Conservation",
                description: "Implementing green manufacturing practices and supporting environmental restoration projects in local communities.",
                impact: "40% Carbon Footprint Reduction",
                number: "02"
              },
              {
                title: "Community Development",
                description: "Building infrastructure and supporting local communities through skill development programs and healthcare initiatives.",
                impact: "25+ Communities Supported",
                number: "03"
              },
              {
                title: "Women Empowerment",
                description: "Promoting gender equality in manufacturing through training programs and leadership development initiatives.",
                impact: "200+ Women Trained",
                number: "04"
              },
              {
                title: "Healthcare Initiatives",
                description: "Supporting healthcare facilities and providing medical assistance to underserved communities.",
                impact: "10,000+ Lives Impacted",
                number: "05"
              },
              {
                title: "Skill Development",
                description: "Training programs for youth in advanced manufacturing technologies and vocational skills.",
                impact: "1,000+ Youth Trained",
                number: "06"
              }
            ].map((activity, index) => (
              <motion.div
                key={activity.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-[0_12px_36px_rgba(0,0,0,0.15)] border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-black text-xl font-bold font-heading">{activity.title}</h3>
                  <span className="text-[#00aeef] text-2xl font-bold font-heading">{activity.number}</span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{activity.description}</p>
                <span className="inline-block px-4 py-2 bg-[#00aeef]/20 text-[#00aeef] text-sm font-semibold rounded-full">
                  {activity.impact}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg max-w-4xl mx-auto">
              <h4 className="text-black text-2xl font-bold font-heading mb-4">Our Commitment to Society</h4>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                At PlusTech, we believe in giving back to society and creating sustainable value for all stakeholders. 
                Our CSR initiatives reflect our commitment to responsible business practices and positive social impact.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-black text-3xl font-bold font-heading mb-2">₹2.5 Cr</div>
                  <div className="text-gray-500 text-sm">CSR Investment</div>
                </div>
                <div className="text-center">
                  <div className="text-black text-3xl font-bold font-heading mb-2">15+</div>
                  <div className="text-gray-500 text-sm">Active Programs</div>
                </div>
                <div className="text-center">
                  <div className="text-black text-3xl font-bold font-heading mb-2">50+</div>
                  <div className="text-gray-500 text-sm">Partner Organizations</div>
                </div>
                <div className="text-center">
                  <div className="text-black text-3xl font-bold font-heading mb-2">12K+</div>
                  <div className="text-gray-500 text-sm">Lives Impacted</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
