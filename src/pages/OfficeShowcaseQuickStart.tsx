/**
 * QUICK START OFFICE SHOWCASE
 * 
 * This component uses your EXISTING images from the public folder
 * Copy this file and import it in your App.tsx routing
 * 
 * Usage:
 * import { OfficeShowcaseQuickStart } from './pages/OfficeShowcaseQuickStart';
 * <Route path="/facility" element={<OfficeShowcaseQuickStart />} />
 */

import React from 'react';
import { SimpleOfficeGallery } from '../components/office/SimpleOfficeGallery';

export const OfficeShowcaseQuickStart: React.FC = () => {
  // Using your existing images from public folder
  const facilityImages = [
    {
      src: '/home/home.png',
      title: 'PLUSTECH Facility Overview',
      description: 'Modern manufacturing and innovation center',
    },
    {
      src: '/home/home1.png',
      title: 'Production Excellence',
      description: 'State-of-the-art manufacturing floor',
    },
    {
      src: '/home/home2.png',
      title: 'Advanced Technology',
      description: 'Cutting-edge automation systems',
    },
    {
      src: '/home/home3.png',
      title: 'Innovation Hub',
      description: 'Where ideas become reality',
    },
    {
      src: '/robotic/2-wheeler-fueltanks_plaSTIC.png',
      title: 'Robotic Applications - 2 Wheeler',
      description: 'Automated fuel tank painting for 2-wheelers',
    },
    {
      src: '/robotic/indoor-painting_and_door_opening.png',
      title: 'Indoor Painting Automation',
      description: 'Precision robotic painting systems',
    },
    {
      src: '/robotic/scooter-metal_plastic-part.png',
      title: 'Scooter Parts Processing',
      description: 'Metal and plastic component handling',
    },
    {
      src: '/robotic/sealer_application.png',
      title: 'Sealer Application',
      description: 'Automated sealing solutions',
    },
    {
      src: '/robotic/underbody_application.png',
      title: 'Underbody Application',
      description: 'Robotic underbody coating systems',
    },
    {
      src: '/automated-customised-materialhandling/1.png',
      title: 'Material Handling System',
      description: 'Customized automated material handling',
    },
    {
      src: '/automated-customised-materialhandling/2.png',
      title: 'Conveyor Systems',
      description: 'Advanced material transport solutions',
    },
    {
      src: '/automated-customised-materialhandling/3.png',
      title: 'Warehouse Automation',
      description: 'Smart storage and retrieval systems',
    },
    {
      src: '/digitization-smartfactory/1.jpg',
      title: 'Smart Factory',
      description: 'Industry 4.0 digital transformation',
    },
    {
      src: '/digitization-smartfactory/2.jpg',
      title: 'Digital Operations',
      description: 'Connected and intelligent manufacturing',
    },
    {
      src: '/aboutus/2.png',
      title: 'Our Vision',
      description: 'Leading the future of automation',
    },
    {
      src: '/robot1.png',
      title: 'Robotic Solutions',
      description: 'Next-generation automation technology',
    },
  ];

  return (
    <SimpleOfficeGallery
      title="Our Facility"
      subtitle="Explore PLUSTECH's state-of-the-art manufacturing and automation center"
      images={facilityImages}
    />
  );
};

/**
 * ALTERNATIVE: Categorized version with all 3D features
 */
export const OfficeShowcaseAdvanced: React.FC = () => {
  // This matches the Office3DGallery format
  const categorizedImages = [
    // Overview Section
    {
      id: '1',
      src: '/home/home.png',
      title: 'Main Facility',
      category: 'Overview',
      description: 'Modern manufacturing and innovation center',
      location: 'Main Building',
      time: 'Daytime',
      size: 'large' as const,
    },
    {
      id: '2',
      src: '/home/home1.png',
      title: 'Production Floor',
      category: 'Overview',
      description: 'State-of-the-art manufacturing',
      location: 'Building A',
      time: 'Active Hours',
      size: 'medium' as const,
    },

    // Robotic Applications
    {
      id: '3',
      src: '/robotic/2-wheeler-fueltanks_plaSTIC.png',
      title: '2-Wheeler Solutions',
      category: 'Robotics',
      description: 'Automated fuel tank painting',
      location: 'Robotics Lab',
      time: 'Production',
      size: 'medium' as const,
    },
    {
      id: '4',
      src: '/robotic/indoor-painting_and_door_opening.png',
      title: 'Indoor Painting',
      category: 'Robotics',
      description: 'Precision robotic systems',
      location: 'Paint Shop',
      time: 'Operation',
      size: 'small' as const,
    },
    {
      id: '5',
      src: '/robotic/sealer_application.png',
      title: 'Sealer Application',
      category: 'Robotics',
      description: 'Automated sealing solutions',
      location: 'Assembly Line',
      time: 'Process',
      size: 'small' as const,
    },

    // Material Handling
    {
      id: '6',
      src: '/automated-customised-materialhandling/1.png',
      title: 'Automated Handling',
      category: 'Material Handling',
      description: 'Customized automation',
      location: 'Warehouse',
      time: 'Operations',
      size: 'medium' as const,
    },
    {
      id: '7',
      src: '/automated-customised-materialhandling/2.png',
      title: 'Conveyor Systems',
      category: 'Material Handling',
      description: 'Advanced transport solutions',
      location: 'Production',
      time: 'Active',
      size: 'small' as const,
    },

    // Smart Factory
    {
      id: '8',
      src: '/digitization-smartfactory/1.jpg',
      title: 'Smart Factory',
      category: 'Digitization',
      description: 'Industry 4.0 transformation',
      location: 'Control Center',
      time: 'Real-time',
      size: 'large' as const,
    },
    {
      id: '9',
      src: '/digitization-smartfactory/2.jpg',
      title: 'Digital Operations',
      category: 'Digitization',
      description: 'Connected manufacturing',
      location: 'Operations',
      time: 'Monitoring',
      size: 'medium' as const,
    },
  ];

  // You can import and use Office3DGallery component here
  // or SimpleOfficeGallery - both work!
  
  return (
    <SimpleOfficeGallery
      title="PLUSTECH Facility"
      subtitle="Discover our advanced manufacturing capabilities"
      images={categorizedImages.map(img => ({
        src: img.src,
        title: img.title,
        description: img.description,
      }))}
    />
  );
};

/**
 * BONUS: Interactive Map Version
 * 
 * To use this, uncomment and adjust room positions
 */
/*
import { OfficeShowcase } from '../components/office/OfficeShowcase';

export const OfficeShowcaseInteractive: React.FC = () => {
  // Customize the officeData in OfficeShowcase.tsx with:
  const rooms = [
    {
      id: 'main',
      name: 'Main Facility',
      description: 'Our headquarters and main production area',
      images: ['/home/home.png', '/home/home1.png'],
      position: { x: 30, y: 40 },
      icon: '🏢',
    },
    {
      id: 'robotics',
      name: 'Robotics Center',
      description: 'Advanced robotic solutions lab',
      images: [
        '/robotic/indoor-painting_and_door_opening.png',
        '/robotic/sealer_application.png',
      ],
      position: { x: 60, y: 35 },
      icon: '🤖',
    },
    {
      id: 'warehouse',
      name: 'Automated Warehouse',
      description: 'Material handling and storage',
      images: [
        '/automated-customised-materialhandling/1.png',
        '/automated-customised-materialhandling/2.png',
      ],
      position: { x: 45, y: 65 },
      icon: '📦',
    },
    {
      id: 'control',
      name: 'Smart Factory Control',
      description: 'Digital operations center',
      images: [
        '/digitization-smartfactory/1.jpg',
        '/digitization-smartfactory/2.jpg',
      ],
      position: { x: 75, y: 60 },
      icon: '🖥️',
    },
  ];

  return <OfficeShowcase />;
};
*/

/**
 * ADD TO YOUR APP ROUTING:
 * 
 * In App.tsx:
 * 
 * import { OfficeShowcaseQuickStart } from './pages/OfficeShowcaseQuickStart';
 * 
 * Then add route:
 * <Route path="/facility" element={<OfficeShowcaseQuickStart />} />
 * 
 * Or for advanced version:
 * <Route path="/facility" element={<OfficeShowcaseAdvanced />} />
 * 
 * Or use the full selector:
 * import { OfficeTourPage } from './pages/OfficeTourPage';
 * <Route path="/office-tour" element={<OfficeTourPage />} />
 */

