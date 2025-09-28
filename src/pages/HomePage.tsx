import React from 'react';
import Navbar from '../components/Navbar';
import CompanyAnimation from '../components/ui/CompanyAnimation';
import VideoAboutSection from '../components/ui/VideoAboutSection';
import DarkVeil from '../components/ui/DarkVeil';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-custom-dark text-white relative">
      {/* Navbar */}
      <Navbar />
      
      {/* Background Image - Pushed down below DarkVeil */}
      <div 
        className="absolute bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: `url('/home/home.png')`,
          top: '600px',
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      
      {/* Dark overlay for better text readability - Only below DarkVeil */}
      <div 
        className="absolute bg-black bg-opacity-50"
        style={{
          top: '600px',
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      
      {/* DarkVeil Animation */}
      <div style={{ width: '100%', height: '600px', position: 'relative' }}>
        <DarkVeil 
          speed={2.5}
          hueShift={0}
        />
        
        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-wide">
              Developing Solutions
            </h1>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-white"></div>
              <span className="text-2xl md:text-3xl lg:text-4xl text-gray-300">•</span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-white"></div>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-wide">
              Delivering Quality
            </h2>
          </div>
        </div>
      </div>

      {/* Video and About Section */}
      <VideoAboutSection />

      {/* Company Animation Component */}
      <div className="relative z-10 flex justify-end px-8" style={{ paddingTop: '5vh' }}>
        <div className="w-full max-w-md">
          <CompanyAnimation />
        </div>
      </div>

    </div>
  );
};

export default HomePage;