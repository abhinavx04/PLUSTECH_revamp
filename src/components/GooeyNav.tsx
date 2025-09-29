import React, { useState } from 'react';

interface GooeyNavItem {
  label: string;
  href: string;
}

interface GooeyNavProps {
  items: GooeyNavItem[];
  initialActiveIndex?: number;
}

const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  initialActiveIndex = 0
}) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="relative">
      <nav className="flex items-center space-x-8">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
              activeIndex === index
                ? 'text-[#00aeef]'
                : 'text-gray-300 hover:text-white'
            }`}
            onClick={() => handleItemClick(index)}
            style={{ fontFamily: 'Roboto Flex, sans-serif' }}
          >
            {item.label}
            {activeIndex === index && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00aeef] animate-pulse"></div>
            )}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default GooeyNav;
