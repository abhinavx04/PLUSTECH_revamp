import React from 'react';
import CSRActivitiesSection from '../../components/about/CSRActivitiesSection';

const CSRActivitiesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
        <CSRActivitiesSection />
      </div>
    </div>
  );
};

export default CSRActivitiesPage;


