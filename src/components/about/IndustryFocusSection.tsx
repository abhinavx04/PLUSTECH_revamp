import React from 'react';

const items = [
  'Automotive / Commercial Vehicles',
  '2-Wheelers & 3-Wheeler Plant Chassis and Parts',
  'Automotive Plastics',
  'Farm and Construction Machinery',
  'Consumer Durables',
  'General Industry',
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

      <div className="rounded-2xl bg-white shadow-lg border border-gray-100 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 transition-shadow hover:shadow-md"
            >
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#00aeef]" />
              <span className="text-lg text-gray-900 leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndustryFocusSection;

