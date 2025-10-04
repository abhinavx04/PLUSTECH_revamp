import React from 'react';
import PillNav from '../components/PillNav';
import Footer from '../components/Footer';
import Threads from '../components/Threads';
import SimpleNewsSection from '../components/SimpleNewsSection';

const SimpleHomePage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col text-black font-body overflow-x-hidden">
      {/* Header */}
      <header className="w-full px-6 md:px-12 lg:px-16 py-4 md:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/newlogo.png"
              alt="PlusTech Logo"
              className="h-10 md:h-12 w-auto brightness-110 contrast-110"
            />
            <span
              className="font-bold text-lg md:text-xl text-[#00aeef]"
              style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
            >
              PLUSTECH
            </span>
          </div>
          <PillNav 
            logo="/newlogo.png"
            logoAlt="PlusTech Logo"
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '#about' },
              { label: 'Services', href: '#services' },
              { label: 'Contact', href: '#contact' },
              { label: 'Admin', href: '/admin/login' }
            ]}
            activeHref="/"
            showLogo={false}
            position="static"
          />
        </div>
      </header>

      {/* Threads Hero Section */}
      <div className="w-full flex items-center justify-center">
        <div className="w-full h-[50vh] md:h-[60vh] relative">
          <div className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none">
            <div className="text-center px-4 md:px-6 lg:px-8 max-w-5xl">
              <h1 className="text-black/60 text-3xl md:text-6xl font-extrabold tracking-tight leading-tight font-heading" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                Building Intelligent Solutions for Modern Manufacturing
              </h1>
              <p className="mt-4 text-black/50 text-base md:text-lg max-w-3xl mx-auto font-body" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
                At PlusTech, we design, engineer, and deliver precision systems that connect
                people, processes, and products—so your operations run smarter, faster, and safer.
              </p>
            </div>
          </div>
          <Threads color={[0, 0.8, 1]} amplitude={2.4} enableMouseInteraction={true} />
        </div>
      </div>

      {/* CTAs */}
      <div className="w-full flex items-center justify-center mt-8 md:mt-12">
        <div className="flex items-center justify-center gap-6">
          <a href="#contact" className="px-8 md:px-10 py-4 rounded-full bg-white text-black font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:bg-white/90 transition-colors text-lg">
            Get Started
          </a>
          <a href="#about" className="px-8 md:px-10 py-4 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors text-lg shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
            Learn More
          </a>
        </div>
      </div>

      {/* Simple Welcome Section */}
      <section className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-black mb-4">
              Welcome to PlusTech
            </h2>
            <p className="text-lg md:text-xl text-gray-700 font-body">
              We're transforming manufacturing through intelligent automation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00aeef] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Automation</h3>
              <p className="text-gray-600">Advanced robotic solutions for modern manufacturing</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00aeef] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Efficiency</h3>
              <p className="text-gray-600">Optimized processes that maximize productivity</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00aeef] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Innovation</h3>
              <p className="text-gray-600">Cutting-edge technology for tomorrow's challenges</p>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <SimpleNewsSection />

      <Footer />
    </div>
  );
};

export default SimpleHomePage;