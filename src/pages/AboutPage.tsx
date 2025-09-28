import React from 'react';
import Navbar from '../components/Navbar';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Main content with top padding to account for fixed navbar */}
      <div className="pt-20 px-6 sm:px-8 lg:px-12" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Us</h1>
          
          <div className="space-y-6 text-gray-300">
            <p className="text-lg leading-relaxed">
              Welcome to PlusTech Systems and Solutions - your trusted partner in industrial finishing solutions.
            </p>
            
            <p className="text-lg leading-relaxed">
              We specialize in building advanced, fully integrated paintshops for both the Automotive sector and a wide range of General Industry applications.
            </p>
            
            <p className="text-lg leading-relaxed">
              Our core strength lies in delivering customized, end-to-end solutions — from concept and detailed design to engineering, procurement, construction, and final commissioning.
            </p>
            
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#00ddff] rounded-full mr-3"></span>
                  Custom Paintshop Design
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#00ddff] rounded-full mr-3"></span>
                  Engineering & Procurement
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#00ddff] rounded-full mr-3"></span>
                  Construction & Installation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#00ddff] rounded-full mr-3"></span>
                  Commissioning & Support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
