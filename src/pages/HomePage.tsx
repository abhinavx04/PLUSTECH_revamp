import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-custom-dark text-white relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('/home/home.png')`,
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50
      " />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">PlusTech Systems & Solutions</h1>
        <p className="text-xl mb-8">Industrial Finishing Excellence</p>
      </div>
    </div>
  );
};

export default HomePage;