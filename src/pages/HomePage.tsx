import React from 'react';
import Navbar from '../components/Navbar';
import CompanyAnimation from '../components/ui/CompanyAnimation';
import VideoAboutSection from '../components/ui/VideoAboutSection';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-custom-dark text-white relative">
      {/* Navbar */}
      <Navbar />
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: `url('/home/home.png')`,
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50
      " />
      
      {/* Company Animation Component */}
      <div className="relative z-10 flex justify-end px-8" style={{ paddingTop: '5vh' }}>
        <div className="w-full max-w-md">
          <CompanyAnimation />
        </div>
      </div>

      {/* Video and About Section */}
      <VideoAboutSection />

    </div>
  );
};

export default HomePage;