import React from 'react';
import CorporateBeliefsSection from '../../components/about/CorporateBeliefsSection';

const CorporateBeliefsPage: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0" style={{ backgroundImage: 'url(/aboutus/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }} />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
          <CorporateBeliefsSection />
        </div>
      </div>
    </div>
  );
};

export default CorporateBeliefsPage;


