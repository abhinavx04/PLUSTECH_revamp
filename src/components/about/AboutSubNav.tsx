import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { title: 'Corporate Beliefs', path: '/about/corporate-beliefs' },
  { title: 'Industry Focus', path: '/about/industry-focus' },
  { title: 'Certifications', path: '/about/certifications' },
  { title: 'History & Milestones', path: '/about/history' },
  { title: 'Annual Returns', path: '/about/annual-returns' },
  { title: 'CSR Activities', path: '/about/csr-activities' },
];

const AboutSubNav: React.FC = () => {
  const location = useLocation();
  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <nav className="flex justify-center items-center gap-8 md:gap-10 overflow-x-auto py-3 md:py-4">
          {tabs.map((tab) => {
            const active = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`py-2 md:py-3 text-base md:text-lg font-semibold whitespace-nowrap transition-colors border-b-2 ${
                  active
                    ? 'border-[#00aeef] text-[#00aeef]'
                    : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AboutSubNav;


