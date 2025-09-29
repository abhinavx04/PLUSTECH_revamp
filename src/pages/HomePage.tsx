import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CompanyAnimation from '../components/ui/CompanyAnimation';
import VideoAboutSection from '../components/ui/VideoAboutSection';
import HeroLayout from '../components/ui/HeroLayout';
import StatisticsSection from '../components/ui/StatisticsSection';
import RoboticApplications from '../components/ui/RoboticApplications';
import MaterialHandling from '../components/ui/MaterialHandling';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF9FB] text-[#252627] relative">
      {/* Navbar */}
      <Navbar />
      
      {/* Background image removed as requested */}
      
      {/* Subtle surface tint for lower sections */}
      <div 
        className="absolute bg-[#D3D4D9]/30"
        style={{
          top: '600px',
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      
      {/* Hero Layout with Process and Polish Animation */}
      <div style={{ width: '100%', height: '600px', position: 'relative' }}>
        <HeroLayout />
      </div>

      {/* Video and About Section - No gap */}
      <VideoAboutSection />

      {/* Company Animation Component */}
      <div className="relative z-10 flex justify-center px-8 py-4">
        <div className="w-full max-w-7xl">
          <CompanyAnimation />
        </div>
      </div>

      {/* Robotic Applications Section */}
      <RoboticApplications />

      {/* Material Handling Section */}
      <MaterialHandling />

      {/* Statistics Section */}
      <StatisticsSection />

      {/* Footer */}
      <div className="mt-[30rem]">
        <Footer />
      </div>

    </div>
  );
};

export default HomePage;