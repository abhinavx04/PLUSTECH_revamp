import React from 'react';
import HomepageAnimation from '../components/ui/HomepageAnimation';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-custom-dark text-white p-8">
      <h1 className="text-4xl font-bold mb-4">PlusTech Systems & Solutions</h1>
      <p className="text-xl mb-8">Industrial Finishing Excellence</p>

      {/* This is your sized container for the animation */}
      <div className="w-full h-[450px] rounded-lg border border-neutral-700 mb-8">
        <HomepageAnimation />
      </div>

      <p className="text-lg">Here is some more content below the animation.</p>
    </div>
  );
};

export default HomePage;