import React from 'react';
import Navbar from '../components/Navbar';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF9FB] text-[#252627]">
      <Navbar />
      
      {/* Main content with top padding to account for fixed navbar */}
      <div className="pt-20 px-6 sm:px-8 lg:px-12" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 text-center" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>About Us</h1>
          
          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left column - Company overview */}
          <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-[#252627] mb-4" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Who We Are</h2>
              <p className="text-lg leading-relaxed" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
              Welcome to PlusTech Systems and Solutions - your trusted partner in industrial finishing solutions.
            </p>
            
              <p className="text-lg leading-relaxed" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
              We specialize in building advanced, fully integrated paintshops for both the Automotive sector and a wide range of General Industry applications.
            </p>
            
              <p className="text-lg leading-relaxed" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
              Our core strength lies in delivering customized, end-to-end solutions — from concept and detailed design to engineering, procurement, construction, and final commissioning.
            </p>
            </div>

            {/* Right column - Services */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-[#252627] mb-4" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Our Services</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-[#D3D4D9]/40 rounded-lg border" style={{ borderColor: '#D3D4D9' }}>
                  <span className="w-3 h-3 bg-[#4B88A2] rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <h3 className="font-semibold text-[#252627] mb-1" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Custom Paintshop Design</h3>
                    <p className="text-[#252627]/70 text-sm" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Tailored solutions designed to meet your specific requirements and industry standards.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-[#D3D4D9]/40 rounded-lg border" style={{ borderColor: '#D3D4D9' }}>
                  <span className="w-3 h-3 bg-[#4B88A2] rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <h3 className="font-semibold text-[#252627] mb-1" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Engineering & Procurement</h3>
                    <p className="text-[#252627]/70 text-sm" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Comprehensive engineering services with strategic procurement of quality components.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-[#D3D4D9]/40 rounded-lg border" style={{ borderColor: '#D3D4D9' }}>
                  <span className="w-3 h-3 bg-[#4B88A2] rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <h3 className="font-semibold text-[#252627] mb-1" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Construction & Installation</h3>
                    <p className="text-[#252627]/70 text-sm" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Professional installation and construction services with minimal downtime.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-[#D3D4D9]/40 rounded-lg border" style={{ borderColor: '#D3D4D9' }}>
                  <span className="w-3 h-3 bg-[#4B88A2] rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <h3 className="font-semibold text-[#252627] mb-1" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Commissioning & Support</h3>
                    <p className="text-[#252627]/70 text-sm" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Complete commissioning and ongoing support to ensure optimal performance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section - Values and Mission */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-[#D3D4D9]/30 rounded-lg border" style={{ borderColor: '#D3D4D9' }}>
              <div className="w-16 h-16 bg-[#4B88A2]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">◉</span>
              </div>
              <h3 className="text-xl font-semibold text-[#252627] mb-3" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Our Mission</h3>
              <p className="text-[#252627]/70" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Delivering innovative industrial finishing solutions that exceed expectations and drive success.</p>
            </div>
            <div className="text-center p-6 bg-[#D3D4D9]/30 rounded-lg border" style={{ borderColor: '#D3D4D9' }}>
              <div className="w-16 h-16 bg-[#4B88A2]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">◯</span>
              </div>
              <h3 className="text-xl font-semibold text-[#252627] mb-3" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Quality Focus</h3>
              <p className="text-[#252627]/70" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Committed to the highest standards of quality in every project we undertake.</p>
            </div>
            <div className="text-center p-6 bg-[#D3D4D9]/30 rounded-lg border" style={{ borderColor: '#D3D4D9' }}>
              <div className="w-16 h-16 bg-[#4B88A2]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">◐</span>
              </div>
              <h3 className="text-xl font-semibold text-[#252627] mb-3" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Partnership</h3>
              <p className="text-[#252627]/70" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Building lasting relationships through trust, reliability, and exceptional service.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
