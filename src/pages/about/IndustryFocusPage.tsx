import React from 'react';
import IndustryFocusSection from '../../components/about/IndustryFocusSection';

const IndustryFocusPage: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0" style={{ backgroundImage: 'url(/aboutus/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }} />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
          <IndustryFocusSection />
        </div>
      </div>
    </div>
  );
};

export default IndustryFocusPage;


