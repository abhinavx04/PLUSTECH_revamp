import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
import CorporateBeliefsSection from '../components/about/CorporateBeliefsSection';
import IndustryFocusSection from '../components/about/IndustryFocusSection';
import CertificationsSection from '../components/about/CertificationsSection';
import HistoryMilestonesSection from '../components/about/HistoryMilestonesSection';
import AnnualReturnsSection from '../components/about/AnnualReturnsSection';
import CSRActivitiesSection from '../components/about/CSRActivitiesSection';

const AboutUsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Services", link: "/services" },
    { name: "Contact", link: "/contact" },
  ];

  const dashboardTabs = [
    { id: 'beliefs', label: 'Corporate Beliefs', icon: 'Values' },
    { id: 'industry', label: 'Industry Focus', icon: 'Sectors' },
    { id: 'certifications', label: 'Certifications', icon: 'Quality' },
    { id: 'history', label: 'History & Milestones', icon: 'Timeline' },
    { id: 'returns', label: 'Annual Returns', icon: 'Finance' },
    { id: 'csr', label: 'CSR Activities', icon: 'Impact' }
  ];

  const getActiveSection = () => {
    switch (activeTab) {
      case 0: return <CorporateBeliefsSection />;
      case 1: return <IndustryFocusSection />;
      case 2: return <CertificationsSection />;
      case 3: return <HistoryMilestonesSection />;
      case 4: return <AnnualReturnsSection />;
      case 5: return <CSRActivitiesSection />;
      default: return <CorporateBeliefsSection />;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col text-black font-body overflow-x-hidden bg-white">
      {/* Enhanced Navbar */}
      <div className="relative w-full">
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

      {/* Hero Section with Dashboard Overview */}
      <motion.section 
        ref={heroRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        style={{ y: backgroundY }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/aboutus/Banner4-1536x1024.jpg)' }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Dashboard Hero Content */}
        <motion.div 
          className="relative z-10 text-center px-6 md:px-8 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.h1 
            className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight font-heading mb-6"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          >
            About PlusTech
            <span className="block text-[#00aeef] mt-2">Dashboard</span>
          </motion.h1>
          
          <motion.p 
            className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Explore our comprehensive dashboard showcasing our corporate values, 
            industry expertise, certifications, and commitment to excellence.
          </motion.p>

          {/* Key Metrics Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            {[
              { label: 'Years of Excellence', value: '25+' },
              { label: 'Projects Completed', value: '200+' },
              { label: 'Global Clients', value: '50+' }
            ].map((metric, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <div className="text-3xl md:text-4xl font-bold text-[#00aeef] mb-2">
                  {metric.value}
                </div>
                <div className="text-white/80 text-sm md:text-base">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Dashboard Navigation Tabs */}
      <motion.div 
        className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-wrap justify-center gap-2 py-4">
            {dashboardTabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === index
                    ? 'bg-[#00aeef] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Dashboard Content Area */}
      <motion.div 
        className="relative py-20 px-6 md:px-12 lg:px-16"
        style={{ backgroundImage: 'url(/aboutus/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
      >
        <div className="absolute inset-0 bg-white/95" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {getActiveSection()}
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUsPage;

