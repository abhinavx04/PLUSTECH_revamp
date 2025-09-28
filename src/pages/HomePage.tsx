import React from 'react';
import HomepageAnimation from '../components/ui/HomepageAnimation';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-custom-dark text-white relative">
      {/* Animation Background */}
      <HomepageAnimation />
      
      {/* Your homepage content will go here */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <h1 className="text-4xl font-bold mb-6">PlusTech Systems & Solutions</h1>
        <p className="text-xl mb-8">Industrial Finishing Excellence</p>
      </div>
    </div>
  );
};

export default HomePage;