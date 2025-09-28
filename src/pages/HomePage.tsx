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
      
      {/* Floating Text */}
      <div className="relative z-10 flex items-center justify-start min-h-screen px-8" style={{ paddingTop: '25vh' }}>
        <div className="text-left max-w-5xl">
          <div className="flex flex-row space-x-8">
            <h2 className="text-4xl md:text-5xl font-bold drop-shadow-2xl" style={{ color: '#00a99d' }}>
              Developing Solutions
            </h2>
            <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl">
              Delivering Quality
            </h2>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;