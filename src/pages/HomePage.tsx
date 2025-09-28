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
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-2xl" style={{ color: '#00a99d' }}>
            Developing Solutions
          </h2>
          <h2 className="text-5xl md:text-6xl font-bold text-white drop-shadow-2xl">
            Delivering Quality
          </h2>
        </div>
      </div>

    </div>
  );
};

export default HomePage;