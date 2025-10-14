import React from 'react';
import HistoryMilestonesSection from '../../components/about/HistoryMilestonesSection';

const HistoryPage: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0" style={{ backgroundImage: 'url(/aboutus/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }} />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
          <HistoryMilestonesSection />
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;


