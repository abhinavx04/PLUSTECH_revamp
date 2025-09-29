import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="text-center">
            <h1 
              className="text-4xl md:text-6xl font-bold mb-8"
              style={{ 
                fontFamily: 'Orbitron, Arial, sans-serif',
                fontWeight: '800',
                letterSpacing: '0.05em',
                color: '#00aeef'
              }}
            >
              About Us
            </h1>
            
            <p 
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: 'Roboto Flex, sans-serif' }}
            >
              This page is under construction. More content will be added soon.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
