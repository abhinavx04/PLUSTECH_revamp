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
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedIndustry, setSelectedIndustry] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [certificationFilter, setCertificationFilter] = useState('all');

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

  const sectionLinks = [
    { name: "Corporate Beliefs", ref: beliefsRef },
    { name: "Industry Focus", ref: industryRef },
    { name: "Certifications", ref: certificationsRef },
    { name: "History & Milestones", ref: historyRef },
    { name: "Annual Returns", ref: returnsRef },
    { name: "CSR", ref: csrRef },
  ];

  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const industries = [
    {
      name: "Automotive Manufacturing",
      description: "Complete paint shop solutions for automotive OEMs and tier suppliers, from design to commissioning.",
      image: "/aboutus/automotive.jpg",
      stats: "200+ Projects",
      features: ["Design & Engineering", "Automation", "Quality Control", "Commissioning"]
    },
    {
      name: "General Industry",
      description: "Custom surface finishing systems for appliances, furniture, and industrial equipment manufacturers.",
      image: "/aboutus/general.jpg",
      stats: "150+ Projects",
      features: ["Surface Treatment", "Coating Systems", "Process Optimization", "Maintenance"]
    },
    {
      name: "Aerospace & Defense",
      description: "Precision coating systems meeting stringent aerospace standards and military specifications.",
      image: "/aboutus/aerospace.jpg",
      stats: "50+ Projects",
      features: ["Precision Coating", "Compliance", "Advanced Materials", "Testing"]
    },
    {
      name: "Electronics & Technology",
      description: "Advanced coating solutions for electronic components and high-tech manufacturing processes.",
      image: "/aboutus/electronics.jpg",
      stats: "75+ Projects",
      features: ["Component Coating", "Clean Room Systems", "Precision Application", "Quality Assurance"]
    }
  ];

  const certifications = [
    {
      title: "ISO 9001:2015",
      description: "Quality Management System",
      category: "Quality",
      authority: "Bureau Veritas",
      year: "2024",
      validity: "Valid until 2026",
      relevance: "Core business operations"
    },
    {
      title: "ISO 14001:2015",
      description: "Environmental Management System",
      category: "Environment",
      authority: "SGS",
      year: "2024",
      validity: "Valid until 2026",
      relevance: "Environmental compliance"
    },
    {
      title: "OHSAS 18001:2007",
      description: "Occupational Health & Safety",
      category: "Safety",
      authority: "DNV",
      year: "2023",
      validity: "Valid until 2025",
      relevance: "Workplace safety"
    },
    {
      title: "ASME Certification",
      description: "Pressure Vessel Code Compliance",
      category: "Engineering",
      authority: "ASME",
      year: "2023",
      validity: "Valid until 2027",
      relevance: "Engineering standards"
    },
    {
      title: "CE Marking",
      description: "European Conformity Standards",
      category: "Compliance",
      authority: "TÜV",
      year: "2024",
      validity: "Valid until 2026",
      relevance: "European market access"
    },
    {
      title: "IATF 16949:2016",
      description: "Automotive Quality Management",
      category: "Automotive",
      authority: "BSI",
      year: "2023",
      validity: "Valid until 2025",
      relevance: "Automotive industry"
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "Global Expansion",
      description: "Established international partnerships and expanded operations to serve global markets with cutting-edge paint shop solutions.",
      achievement: "500+ Projects Completed",
      icon: "🌍"
    },
    {
      year: "2022",
      title: "Digital Transformation",
      description: "Launched advanced IoT-enabled paint shop systems with real-time monitoring and predictive maintenance capabilities.",
      achievement: "Industry Innovation Award",
      icon: "💻"
    },
    {
      year: "2020",
      title: "Sustainability Focus",
      description: "Introduced eco-friendly paint shop technologies reducing environmental impact by 40% while maintaining quality standards.",
      achievement: "Green Technology Certification",
      icon: "🌱"
    },
    {
      year: "2018",
      title: "Automation Revolution",
      description: "Pioneered fully automated paint shop systems for automotive industry, setting new benchmarks in efficiency and precision.",
      achievement: "Patent for Automation Technology",
      icon: "🤖"
    },
    {
      year: "2015",
      title: "Quality Excellence",
      description: "Achieved ISO 9001 certification and implemented comprehensive quality management systems across all operations.",
      achievement: "ISO 9001:2015 Certified",
      icon: "⭐"
    },
    {
      year: "2012",
      title: "Company Foundation",
      description: "Founded PlusTech with a vision to revolutionize manufacturing through intelligent paint shop solutions.",
      achievement: "First Major Project",
      icon: "🚀"
    }
  ];

  const financialYears = [
    {
      year: "2023-2024",
      revenue: "₹45.2 Cr",
      growth: "+18%",
      projects: "45",
      profit: "₹8.1 Cr",
      employees: "120"
    },
    {
      year: "2022-2023",
      revenue: "₹38.3 Cr",
      growth: "+15%",
      projects: "38",
      profit: "₹6.8 Cr",
      employees: "110"
    },
    {
      year: "2021-2022",
      revenue: "₹33.3 Cr",
      growth: "+22%",
      projects: "32",
      profit: "₹5.9 Cr",
      employees: "95"
    },
    {
      year: "2020-2021",
      revenue: "₹27.3 Cr",
      growth: "+12%",
      projects: "28",
      profit: "₹4.2 Cr",
      employees: "85"
    }
  ];

  const csrActivities = [
    {
      title: "Education Support",
      description: "Providing scholarships and educational resources to underprivileged students in manufacturing and engineering fields.",
      impact: "500+ Students Benefited",
      image: "/aboutus/education.jpg",
      category: "Education"
    },
    {
      title: "Environmental Conservation",
      description: "Implementing green manufacturing practices and supporting environmental restoration projects in local communities.",
      impact: "40% Carbon Footprint Reduction",
      image: "/aboutus/environment.jpg",
      category: "Environment"
    },
    {
      title: "Community Development",
      description: "Building infrastructure and supporting local communities through skill development programs and healthcare initiatives.",
      impact: "25+ Communities Supported",
      image: "/aboutus/community.jpg",
      category: "Community"
    },
    {
      title: "Women Empowerment",
      description: "Promoting gender equality in manufacturing through training programs and leadership development initiatives.",
      impact: "200+ Women Trained",
      image: "/aboutus/women.jpg",
      category: "Empowerment"
    },
    {
      title: "Healthcare Initiatives",
      description: "Supporting healthcare facilities and providing medical assistance to underserved communities.",
      impact: "10,000+ Lives Impacted",
      image: "/aboutus/healthcare.jpg",
      category: "Healthcare"
    },
    {
      title: "Skill Development",
      description: "Training programs for youth in advanced manufacturing technologies and vocational skills.",
      impact: "1,000+ Youth Trained",
      image: "/aboutus/skills.jpg",
      category: "Skills"
    }
  ];

  const filteredCertifications = certificationFilter === 'all' 
    ? certifications 
    : certifications.filter(cert => cert.category.toLowerCase() === certificationFilter.toLowerCase());

  return (
    <div className="min-h-screen w-full text-black font-body overflow-x-hidden relative bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Enhanced Navbar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-200/20">
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

      {/* Section Navigation */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-wrap justify-center gap-6">
            {sectionLinks.map((link, index) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.ref)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSection === link.name.toLowerCase().replace(/\s+/g, '')
                    ? 'bg-[#00aeef] text-white shadow-lg'
                    : 'text-gray-600 hover:text-[#00aeef] hover:bg-blue-50'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900/20 to-gray-900/20"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative z-10 text-center px-4 md:px-6 lg:px-8 max-w-6xl">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-black text-4xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight font-heading mb-8"
          >
            Our Journey Through
            <br />
            <span className="text-[#00aeef]">Innovation</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-gray-700 text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto font-body leading-relaxed mb-12"
          >
            Discover the story of PlusTech as we revolutionize manufacturing through 
            intelligent solutions, precision engineering, and unwavering commitment to excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
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
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-gray-600 text-sm font-medium">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-[#00aeef]/50 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-[#00aeef]/70 rounded-full mt-2"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Corporate Beliefs Section */}
      <section 
        ref={beliefsRef} 
        className="min-h-screen w-full relative flex items-center justify-center py-20 bg-gradient-to-r from-white to-blue-50/30"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Innovation First",
                description: "We continuously push boundaries in manufacturing technology, embracing cutting-edge solutions to deliver superior results.",
                icon: "💡"
              },
              {
                title: "Quality Excellence",
                description: "Every project reflects our unwavering commitment to precision, reliability, and the highest standards of craftsmanship.",
                icon: "⭐"
              },
              {
                title: "Customer Partnership",
                description: "We build lasting relationships through understanding, collaboration, and delivering solutions that exceed expectations.",
                icon: "🤝"
              },
              {
                title: "Sustainable Growth",
                description: "Our approach balances business success with environmental responsibility and long-term value creation.",
                icon: "🌱"
              }
            ].map((belief, index) => (
              <motion.div
                key={belief.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-[0_12px_36px_rgba(0,174,239,0.15)] border border-blue-200/30 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {belief.icon}
                </div>
                <h3 className="text-black text-xl font-bold font-heading mb-4">{belief.title}</h3>
                <p className="text-gray-700 leading-relaxed">{belief.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Focus Section */}
      <section 
        ref={industryRef} 
        className="min-h-screen w-full relative flex items-center justify-center py-20 bg-gradient-to-r from-blue-50/30 to-white"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
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

          {/* Industry Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {industries.map((industry, index) => (
              <button
                key={industry.name}
                onClick={() => setSelectedIndustry(index)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedIndustry === index
                    ? 'bg-[#00aeef] text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:text-[#00aeef] hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {industry.name}
              </button>
            ))}
          </div>

          {/* Industry Content */}
          <motion.div
            key={selectedIndustry}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-200/30"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-black text-3xl font-bold font-heading">{industries[selectedIndustry].name}</h3>
                  <span className="px-4 py-2 bg-[#00aeef] text-white text-sm font-semibold rounded-full">
                    {industries[selectedIndustry].stats}
                  </span>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  {industries[selectedIndustry].description}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {industries[selectedIndustry].features.map((feature, index) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#00aeef] rounded-full"></div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#00aeef]/10 to-blue-400/10 rounded-2xl p-8 h-80 flex items-center justify-center">
                <div className="text-6xl opacity-50">
                  {selectedIndustry === 0 && "🚗"}
                  {selectedIndustry === 1 && "🏭"}
                  {selectedIndustry === 2 && "✈️"}
                  {selectedIndustry === 3 && "📱"}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Certifications Section */}
      <section 
        ref={certificationsRef} 
        className="min-h-screen w-full relative flex items-center justify-center py-20 bg-gradient-to-r from-white to-blue-50/30"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
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

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['all', 'quality', 'environment', 'safety', 'engineering', 'compliance', 'automotive'].map((filter) => (
              <button
                key={filter}
                onClick={() => setCertificationFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  certificationFilter === filter
                    ? 'bg-[#00aeef] text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:text-[#00aeef] hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCertifications.map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-[0_12px_36px_rgba(0,174,239,0.15)] border border-blue-200/30 group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00aeef] to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-xl font-bold font-heading">{index + 1}</span>
                  </div>
                  <h3 className="text-black text-xl font-bold font-heading mb-2">{cert.title}</h3>
                  <p className="text-gray-700 mb-4">{cert.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Authority:</span>
                      <span className="font-medium">{cert.authority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Year:</span>
                      <span className="font-medium">{cert.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Validity:</span>
                      <span className="font-medium text-green-600">{cert.validity}</span>
                    </div>
                    <div className="mt-4">
                      <span className="inline-block px-3 py-1 bg-[#00aeef]/20 text-[#00aeef] text-xs font-semibold rounded-full">
                        {cert.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History & Milestones Section */}
      <section 
        ref={historyRef} 
        className="min-h-screen w-full relative flex items-center justify-center py-20 bg-gradient-to-r from-blue-50/30 to-white"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
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
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00aeef] to-blue-400 transform md:-translate-x-0.5"></div>

            {milestones.map((milestone, index) => (
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
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-blue-200/30 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{milestone.icon}</span>
                        <span className="text-[#00aeef] text-2xl font-bold font-heading">{milestone.year}</span>
                      </div>
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

      {/* Annual Returns Section */}
      <section 
        ref={returnsRef} 
        className="min-h-screen w-full relative flex items-center justify-center py-20 bg-gradient-to-r from-white to-blue-50/30"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
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

          {/* Year Selection */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {financialYears.map((year, index) => (
              <button
                key={year.year}
                onClick={() => setSelectedYear(index)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedYear === index
                    ? 'bg-[#00aeef] text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:text-[#00aeef] hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {year.year}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Financial Chart */}
            <motion.div
              key={selectedYear}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-200/30"
            >
              <h3 className="text-black text-2xl font-bold font-heading mb-6">
                {financialYears[selectedYear].year} Performance
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Revenue</span>
                    <span className="font-bold text-[#00aeef]">{financialYears[selectedYear].revenue}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="bg-gradient-to-r from-[#00aeef] to-blue-400 h-3 rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Profit</span>
                    <span className="font-bold text-green-600">{financialYears[selectedYear].profit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="bg-gradient-to-r from-green-400 to-emerald-400 h-3 rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Projects</span>
                    <span className="font-bold text-[#00aeef]">{financialYears[selectedYear].projects}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "90%" }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="bg-gradient-to-r from-purple-400 to-indigo-400 h-3 rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Growth</span>
                    <span className="font-bold text-green-600">{financialYears[selectedYear].growth}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="bg-gradient-to-r from-orange-400 to-red-400 h-3 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-200/30"
            >
              <h4 className="text-black text-2xl font-bold font-heading mb-6">Key Performance Indicators</h4>
              <div className="space-y-6">
                {[
                  { metric: "Customer Satisfaction", value: "98%", color: "from-green-400 to-emerald-400" },
                  { metric: "On-Time Delivery", value: "95%", color: "from-blue-400 to-cyan-400" },
                  { metric: "Quality Standards", value: "99.5%", color: "from-purple-400 to-indigo-400" },
                  { metric: "Employee Growth", value: `${financialYears[selectedYear].employees}`, color: "from-orange-400 to-red-400" }
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

      {/* CSR Activities Section */}
      <section 
        ref={csrRef} 
        className="min-h-screen w-full relative flex items-center justify-center py-20 bg-gradient-to-r from-blue-50/30 to-white"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
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

          {/* Masonry Layout */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {csrActivities.map((activity, index) => (
              <motion.div
                key={activity.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="break-inside-avoid bg-white/90 backdrop-blur-sm rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-[0_12px_36px_rgba(0,174,239,0.15)] border border-blue-200/30 group"
              >
                <div className="bg-gradient-to-br from-[#00aeef]/10 to-blue-400/10 rounded-xl p-6 mb-4 h-32 flex items-center justify-center">
                  <div className="text-4xl opacity-60">
                    {activity.category === 'Education' && '🎓'}
                    {activity.category === 'Environment' && '🌱'}
                    {activity.category === 'Community' && '🏘️'}
                    {activity.category === 'Empowerment' && '👩‍💼'}
                    {activity.category === 'Healthcare' && '🏥'}
                    {activity.category === 'Skills' && '🔧'}
                  </div>
                </div>
                <h3 className="text-black text-xl font-bold font-heading mb-3">{activity.title}</h3>
                <p className="text-gray-700 mb-4 leading-relaxed text-sm">{activity.description}</p>
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-[#00aeef]/20 text-[#00aeef] text-xs font-semibold rounded-full">
                    {activity.impact}
                  </span>
                  <div className="text-xs text-gray-500">{activity.category}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CSR Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-blue-200/30 shadow-lg max-w-4xl mx-auto">
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
