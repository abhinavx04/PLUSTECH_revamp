import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CompanyAnimation from '../components/ui/CompanyAnimation';
import VideoAboutSection from '../components/ui/VideoAboutSection';
import HeroLayout from '../components/ui/HeroLayout';
import StatisticsSection from '../components/ui/StatisticsSection';
import InnovativeEngineering from '../components/ui/InnovativeEngineering';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Navbar */}
      <Navbar />
      
      {/* Background Image - Covers CompanyAnimation and Footer */}
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
      
      {/* Dark overlay for better text readability - Covers CompanyAnimation and Footer */}
      <div 
        className="absolute bg-black bg-opacity-50"
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

      {/* Innovative Engineering Section */}
      <InnovativeEngineering />

      {/* Company Animation Component */}
      <div className="relative z-10 flex justify-center px-8 py-4">
        <div className="w-full max-w-7xl">
          <CompanyAnimation />
        </div>
      </div>

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