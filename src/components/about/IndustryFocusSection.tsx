import React from 'react';

const industries = [
  { label: 'Automotive / Commercial Vehicles', image: '/industry focus/Automotive_Commercial.png' },
  { label: '2-Wheelers & 3-Wheeler Plant Chassis and Parts', image: '/industry focus/2-3_wheeler.png' },
  { label: 'Automotive Plastics', image: '/industry focus/Automotive_parts.png' },
  { label: 'Farm and Construction Machinery', image: '/industry focus/Farm_construction.png' },
  { label: 'Consumer Durables', image: '/industry focus/consumer_durables.png' },
  { label: 'General Industry', image: '/industry focus/General_industry.png' },
];

const IndustryFocusSection: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-14 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-black">Industry Focus</h1>
        <p className="text-gray-600 text-lg">
          Core segments we serve across engineering and manufacturing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {industries.map((industry) => (
          <div
            key={industry.label}
            className="group relative h-[220px] md:h-[250px] rounded-2xl overflow-hidden shadow-lg cursor-pointer"
          >
            <img
              src={industry.image}
              alt={industry.label}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-[#00aeef]/65 transition-all duration-300 group-hover:bg-[#00aeef]/40" />

            <div className="relative z-10 flex items-center justify-center h-full px-6">
              <h3 className="text-white text-xl md:text-2xl font-bold text-center leading-snug drop-shadow-md">
                {industry.label}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndustryFocusSection;

