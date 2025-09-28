import React from 'react';
import Navbar from '../components/Navbar';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Main content with top padding to account for fixed navbar */}
      <div className="pt-20 px-6 sm:px-8 lg:px-12" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 text-center">About Us</h1>
          
          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left column - Company overview */}
            <div className="space-y-6 text-gray-300">
              <h2 className="text-2xl font-semibold text-white mb-4">Who We Are</h2>
              <p className="text-lg leading-relaxed">
                Welcome to PlusTech Systems and Solutions - your trusted partner in industrial finishing solutions.
              </p>
              
              <p className="text-lg leading-relaxed">
                We specialize in building advanced, fully integrated paintshops for both the Automotive sector and a wide range of General Industry applications.
              </p>
              
              <p className="text-lg leading-relaxed">
                Our core strength lies in delivering customized, end-to-end solutions — from concept and detailed design to engineering, procurement, construction, and final commissioning.
              </p>
            </div>

            {/* Right column - Services */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Our Services</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg">
                  <span className="w-3 h-3 bg-[#00ddff] rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Custom Paintshop Design</h3>
                    <p className="text-gray-400 text-sm">Tailored solutions designed to meet your specific requirements and industry standards.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg">
                  <span className="w-3 h-3 bg-[#00ddff] rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Engineering & Procurement</h3>
                    <p className="text-gray-400 text-sm">Comprehensive engineering services with strategic procurement of quality components.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg">
                  <span className="w-3 h-3 bg-[#00ddff] rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Construction & Installation</h3>
                    <p className="text-gray-400 text-sm">Professional installation and construction services with minimal downtime.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg">
                  <span className="w-3 h-3 bg-[#00ddff] rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Commissioning & Support</h3>
                    <p className="text-gray-400 text-sm">Complete commissioning and ongoing support to ensure optimal performance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section - Values and Mission */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-900/30 rounded-lg">
              <div className="w-16 h-16 bg-[#00ddff]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">◉</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Our Mission</h3>
              <p className="text-gray-400">Delivering innovative industrial finishing solutions that exceed expectations and drive success.</p>
            </div>
            <div className="text-center p-6 bg-gray-900/30 rounded-lg">
              <div className="w-16 h-16 bg-[#00ddff]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">◯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Quality Focus</h3>
              <p className="text-gray-400">Committed to the highest standards of quality in every project we undertake.</p>
            </div>
            <div className="text-center p-6 bg-gray-900/30 rounded-lg">
              <div className="w-16 h-16 bg-[#00ddff]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">◐</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Partnership</h3>
              <p className="text-gray-400">Building lasting relationships through trust, reliability, and exceptional service.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
