import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  category: 'founding' | 'expansion' | 'innovation' | 'achievement';
  icon: string;
  metrics: {
    label: string;
    value: string;
  }[];
}

// Combined timeline data sorted by year
const allMilestones: Milestone[] = [
  {
    id: 'company-founded',
    year: '2006',
    title: 'Company Founded',
    description: 'Plustech was established by a team of engineer-entrepreneurs with wide experience of more than 2 decades in the Surface Finishing industry.',
    category: 'founding',
    icon: '',
    metrics: [
      { label: 'Experience', value: '20+ Years' },
      { label: 'Founders', value: 'Engineers' },
      { label: 'Industry', value: 'Surface Finishing' }
    ]
  },
  {
    id: 'tata-motors-2007',
    year: '2007',
    title: 'Tata Motors Project',
    description: '1st PT CED for Passenger Car project at Tata Motors - 15 JPH / 56 K litres (CED Tank).',
    category: 'achievement',
    icon: '',
    metrics: [
      { label: 'Client', value: 'Tata Motors' },
      { label: 'Capacity', value: '15 JPH' },
      { label: 'Tank Size', value: '56K Litres' }
    ]
  },
  {
    id: 'pluscon-established',
    year: '2008',
    title: 'Pluscon Established',
    description: 'Established Pluscon for Electrical Engineering, Control panel manufacturing and Process automation.',
    category: 'expansion',
    icon: '',
    metrics: [
      { label: 'Division', value: 'Pluscon' },
      { label: 'Focus', value: 'Electrical' },
      { label: 'Automation', value: 'Process' }
    ]
  },
  {
    id: 'ashok-leyland-2008',
    year: '2008',
    title: 'Ashok Leyland FSM',
    description: 'Ashok Leyland for Pretreatment and Powder Coating Line for FSM - 600 Frames per day.',
    category: 'achievement',
    icon: '',
    metrics: [
      { label: 'Client', value: 'Ashok Leyland' },
      { label: 'Capacity', value: '600/Day' },
      { label: 'Process', value: 'PT & Powder' }
    ]
  },
  {
    id: 'leyland-john-deere-2009',
    year: '2009',
    title: 'Construction Equipment',
    description: '1st Paintshop for Construction Equipment Aggregates at Leyland-John Deere.',
    category: 'achievement',
    icon: '',
    metrics: [
      { label: 'Client', value: 'Leyland-John Deere' },
      { label: 'Equipment', value: 'Construction' },
      { label: 'First', value: 'Paintshop' }
    ]
  },
  {
    id: 'graco-partnership',
    year: '2010',
    title: 'Graco Partnership',
    description: 'Expanded its business portfolio in association with Graco USA for Fluid Management products and system integration.',
    category: 'expansion',
    icon: '',
    metrics: [
      { label: 'Partner', value: 'Graco USA' },
      { label: 'Products', value: 'Fluid Management' },
      { label: 'Integration', value: 'Systems' }
    ]
  },
  {
    id: 'chapekar-2010',
    year: '2010',
    title: 'Chapekar Engineering',
    description: 'PT CED Facility for Truck Load Body at Chapekar Engineering 12 JPH / 77 K litres (CED Tank).',
    category: 'achievement',
    icon: '',
    metrics: [
      { label: 'Client', value: 'Chapekar' },
      { label: 'Capacity', value: '12 JPH' },
      { label: 'Tank Size', value: '77K Litres' }
    ]
  },
  {
    id: 'mahindra-2011',
    year: '2011',
    title: 'Mahindra Commercial',
    description: '1st PT CED for Commercial Vehicles at Mahindra and Mahindra - 15 JPH / 175 K litres (CED Tank).',
    category: 'achievement',
    icon: '',
    metrics: [
      { label: 'Client', value: 'Mahindra' },
      { label: 'Capacity', value: '15 JPH' },
      { label: 'Tank Size', value: '175K Litres' }
    ]
  },
  {
    id: 'bajaj-auto-2012',
    year: '2012',
    title: 'Bajaj Auto Complete',
    description: 'Complete Paintshop for 4 Wheelers at Bajaj Auto for PT CED and Painting line.',
    category: 'achievement',
    icon: '',
    metrics: [
      { label: 'Client', value: 'Bajaj Auto' },
      { label: 'Vehicle', value: '4 Wheelers' },
      { label: 'Scope', value: 'Complete' }
    ]
  },
  {
    id: 'tier1-2014',
    year: '2014',
    title: 'Tier-I Success',
    description: 'Successful Commissioning of 5 large, conveyorized PT CED lines for Tier-I buyers.',
    category: 'achievement',
    icon: '',
    metrics: [
      { label: 'Lines', value: '5' },
      { label: 'Type', value: 'Conveyorized' },
      { label: 'Clients', value: 'Tier-I' }
    ]
  },
  {
    id: 'varroc-2015',
    year: '2015',
    title: 'Varroc Engineering',
    description: 'Varroc Engineering for PT and Painting line for Plastic Parts.',
    category: 'achievement',
    icon: '',
    metrics: [
      { label: 'Client', value: 'Varroc' },
      { label: 'Material', value: 'Plastic' },
      { label: 'Process', value: 'PT & Painting' }
    ]
  },
  {
    id: 'first-overseas-project',
    year: '2016',
    title: 'First Overseas Project',
    description: 'Plustech bagged its first overseas Paintshop project, marking international expansion.',
    category: 'achievement',
    icon: '',
    metrics: [
      { label: 'Market', value: 'International' },
      { label: 'Project Type', value: 'Paintshop' },
      { label: 'Milestone', value: 'Overseas' }
    ]
  },
  {
    id: 'uttara-bangladesh-2016',
    year: '2016',
    title: 'Uttara Bangladesh',
    description: 'PT CED and Painting facility for Uttara, Bangladesh for 2 Wheelers.',
    category: 'achievement',
    icon: '',
    metrics: [
      { label: 'Client', value: 'Uttara' },
      { label: 'Country', value: 'Bangladesh' },
      { label: 'Vehicle', value: '2 Wheelers' }
    ]
  },
  {
    id: 'mahindra-electric-2018',
    year: '2018',
    title: 'Electric MUVs',
    description: 'Mahindra and Mahindra for PT CED for (new) Electric MUVs – 13 JPH / 265 K litres (CED Tank).',
    category: 'innovation',
    icon: '',
    metrics: [
      { label: 'Client', value: 'Mahindra' },
      { label: 'Capacity', value: '13 JPH' },
      { label: 'Tank Size', value: '265K Litres' }
    ]
  },
  {
    id: 'robotic-painting-2019',
    year: '2019',
    title: 'Robotic Painting',
    description: 'Ashok Leyland for Robotic (12 Robots) for Top Coat Painting line for Commercial Vehicles - 40 JPH.',
    category: 'innovation',
    icon: '',
    metrics: [
      { label: 'Client', value: 'Ashok Leyland' },
      { label: 'Robots', value: '12' },
      { label: 'Capacity', value: '40 JPH' }
    ]
  },
  {
    id: 'industry-recognition',
    year: 'Present',
    title: 'Industry Leadership',
    description: 'Plustech has established solid standing in the industry and its clientele includes some of the largest and blue-chip companies across all major segments such as Bajaj Auto, Mahindra and Mahindra, Ashok Leyland, Tata Motors, John Deere, Daimler, Piaggio Vehicles, Renault Nissan and many more.',
    category: 'achievement',
    icon: '',
    metrics: [
      { label: 'Clients', value: '50+' },
      { label: 'Blue-chip', value: 'Major' },
      { label: 'Segments', value: 'Multiple' }
    ]
  }
];

// Two-tone aesthetic: PlusTech blue + neutral gray
const categoryConfig = {
  // Map founding and innovation to primary blue
  founding: {
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    accent: 'bg-gradient-to-r from-[#00aeef] to-gray-400',
    node: 'bg-[#00aeef]',
    shadow: 'shadow-blue-200'
  },
  // Map expansion and achievement to neutral gray
  expansion: {
    badge: 'bg-gray-100 text-gray-800 border-gray-200',
    accent: 'bg-gradient-to-r from-gray-500 to-gray-400',
    node: 'bg-gray-500',
    shadow: 'shadow-gray-200'
  },
  innovation: {
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    accent: 'bg-gradient-to-r from-[#00aeef] to-gray-400',
    node: 'bg-[#00aeef]',
    shadow: 'shadow-blue-200'
  },
  achievement: {
    badge: 'bg-gray-100 text-gray-800 border-gray-200',
    accent: 'bg-gradient-to-r from-gray-500 to-gray-400',
    node: 'bg-gray-500',
    shadow: 'shadow-gray-200'
  }
};

// Group milestones by year for proper layout with improved distribution
const groupMilestonesByYear = (milestones: Milestone[]) => {
  // Sort by year first (Present goes last)
  const sorted = milestones.sort((a, b) => {
    if (a.year === 'Present') return 1;
    if (b.year === 'Present') return -1;
    return parseInt(a.year) - parseInt(b.year);
  });

  // Group by year
  const grouped = sorted.reduce((acc, milestone) => {
    const year = milestone.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(milestone);
    return acc;
  }, {} as Record<string, Milestone[]>);

  // Return with improved distribution hints
  return Object.entries(grouped).map(([year, milestones]) => ({
    year,
    milestones,
    cardCount: milestones.length,
    spacing: milestones.length > 1 ? 'tight' : 'normal'
  }));
};

// Individual milestone component with scroll-triggered animations
const TimelineMilestone: React.FC<{
  milestone: Milestone;
  isLeftSide: boolean;
  categoryConfig: typeof categoryConfig;
}> = ({ milestone, isLeftSide, categoryConfig }) => {
  const milestoneRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(milestoneRef, { once: true, margin: "-100px" });
  const config = categoryConfig[milestone.category];

  return (
    <motion.div
      ref={milestoneRef}
      className={`relative w-full flex items-start ${
        isLeftSide ? 'lg:flex-row' : 'lg:flex-row-reverse'
      } flex-col lg:items-center lg:space-x-12 space-y-6 lg:space-y-0 pl-16 lg:pl-0`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.2
      }}
    >
      {/* Timeline Node */}
      <motion.div
        className={`z-10 flex-shrink-0 ${
          isLeftSide ? 'lg:order-1 lg:-translate-x-10' : 'lg:order-2 lg:translate-x-10'
        } absolute left-8 top-1 lg:static`}
        initial={{ opacity: 0, scale: 0, rotate: -90 }}
        animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -90 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: 0.4
        }}
        whileHover={{ 
          scale: 1.2,
          transition: { duration: 0.3 }
        }}
      >
        {/* Circular Node */}
        <motion.div 
          className={`w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 ${config.node} rounded-full flex items-center justify-center shadow-lg ${config.shadow} border-2 md:border-3 lg:border-4 border-white mx-auto lg:mx-0`}
          whileHover={{ 
            scale: 1.1,
            transition: { duration: 0.2 }
          }}
        >
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-white rounded-full"></div>
        </motion.div>
      </motion.div>

      {/* Milestone Card */}
      <motion.div
        className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-5 md:p-6 w-full lg:max-w-md ml-4 lg:ml-0 mx-auto lg:mx-0 ${
          isLeftSide 
            ? 'lg:order-2 lg:mr-56'  // even wider gutter from center line on left side
            : 'lg:order-1 lg:ml-56'  // even wider gutter from center line on right side
        }`}
        initial={{ opacity: 0, x: isLeftSide ? -100 : 100, scale: 0.9 }}
        animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: isLeftSide ? -100 : 100, scale: 0.9 }}
        transition={{ 
          type: "spring",
          stiffness: 120,
          damping: 25,
          delay: 0.6
        }}
        whileHover={{ 
          y: -10,
          scale: 1.02,
          transition: { duration: 0.3 }
        }}
      >
        {/* Category Badge */}
        <motion.div 
          className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold border mb-4 tracking-wide uppercase ${config.badge}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.8 }}
        >
          {milestone.category}
        </motion.div>

        {/* Title */}
        <motion.h4 
          className="text-[20px] md:text-[22px] font-bold text-gray-900 tracking-tight mb-2"
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1.0 }}
        >
          {milestone.title}
        </motion.h4>

        {/* Subtle Divider */}
        <div className="h-px bg-gradient-to-r from-gray-100 to-transparent mb-4" />

        {/* Description */}
        <motion.p 
          className="text-[15px] md:text-[16px] text-gray-700 leading-relaxed mb-5"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1.15 }}
        >
          {milestone.description}
        </motion.p>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {milestone.metrics.map((metric, metricIndex) => (
            <motion.div
              key={metricIndex}
              className="p-3 rounded-lg border border-gray-100 bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)]"
              initial={{ opacity: 0, scale: 0.95, y: 14 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 14 }}
              transition={{ type: "spring", stiffness: 280, damping: 20, delay: 1.3 + (metricIndex * 0.08) }}
              whileHover={{ scale: 1.03, transition: { duration: 0.18 } }}
            >
              <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                {metric.label}
              </div>
              <div className="text-[15px] md:text-[16px] font-bold text-[#00aeef]">
                {metric.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gradient Accent Bar */}
        <motion.div 
          className={`h-1 w-full rounded-full mt-5 ${config.accent}`}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1.6 }}
          style={{ originX: 0 }}
        />
      </motion.div>
    </motion.div>
  );
};

// Year group component
const TimelineYearGroup: React.FC<{
  yearGroup: { year: string; milestones: Milestone[]; cardCount: number; spacing: string };
  isEvenYear: boolean;
  hasMultipleMilestones: boolean;
  categoryConfig: typeof categoryConfig;
}> = ({ yearGroup, isEvenYear, hasMultipleMilestones, categoryConfig }) => {
  const yearRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(yearRef, { once: true, margin: "-100px" });

  return (
    <div ref={yearRef} className="relative">
      {/* Year Badge */}
      <motion.div 
        className={`bg-[#00aeef] text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg mb-8 w-fit ${
          isEvenYear ? 'mx-auto lg:mx-0 lg:ml-0' : 'mx-auto lg:mx-0 lg:mr-0 lg:ml-auto'
        }`}
        initial={{ opacity: 0, y: -30, scale: 0.8 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -30, scale: 0.8 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: 0.2
        }}
      >
        {yearGroup.year}
      </motion.div>

      {/* Milestones for this year */}
      <div className={`space-y-8 ${yearGroup.spacing === 'tight' ? 'lg:space-y-8' : 'lg:space-y-12'}`}>
        {yearGroup.milestones.map((milestone, milestoneIndex) => {
          const isEvenMilestone = milestoneIndex % 2 === 0;
          const isLeftSide = hasMultipleMilestones ? isEvenMilestone : isEvenYear;
          
          return (
            <TimelineMilestone
              key={milestone.id}
              milestone={milestone}
              isLeftSide={isLeftSide}
              categoryConfig={categoryConfig}
            />
          );
        })}
      </div>
    </div>
  );
};

const HistoryMilestonesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" });
  
  // Scroll-based animations for timeline
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });
  
  // Transform scroll progress to timeline line height
  const timelineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  const groupedMilestones = groupMilestonesByYear(allMilestones);


  return (
    <div ref={sectionRef} className="max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div 
        className="text-center mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-bold font-heading text-black mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          History & Milestones
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Our journey spans over two decades of innovation, growth, and excellence in 
          delivering cutting-edge manufacturing solutions.
        </motion.p>
      </motion.div>

      {/* Unified Timeline */}
      <motion.div 
        ref={timelineRef}
        className="mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <motion.h3 
          className="text-3xl font-bold font-heading text-black mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Company Journey & Milestones
        </motion.h3>
        
        <div className="relative">
          {/* Central Timeline Line - Desktop */}
          <motion.div 
            className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#00aeef] to-gray-300 rounded-full"
            style={{ 
              scaleY: timelineHeight,
              originY: 0
            }}
          />
          
          {/* Central Timeline Line - Mobile */}
              <motion.div
            className="lg:hidden absolute left-6 w-1 h-full bg-gradient-to-b from-[#00aeef] to-gray-300 rounded-full"
            style={{ 
              scaleY: timelineHeight,
              originY: 0
            }}
          />

          {/* Timeline Items */}
          <div className="space-y-12 lg:space-y-24">
            {groupedMilestones.map((yearGroup, yearIndex) => {
              const isEvenYear = yearIndex % 2 === 0;
              const hasMultipleMilestones = yearGroup.milestones.length > 1;
              const isLastYear = yearIndex === groupedMilestones.length - 1;
              
              return (
                <div 
                  key={yearGroup.year}
                  className={isLastYear ? 'mt-8' : ''}
                >
                  <TimelineYearGroup 
                    yearGroup={yearGroup}
                    isEvenYear={isEvenYear}
                    hasMultipleMilestones={hasMultipleMilestones}
                    categoryConfig={categoryConfig}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Achievement Statistics */}
      <motion.div 
        className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        {[
          { 
            label: 'Years of Excellence', 
            value: '18+', 
            gradient: 'from-blue-500 to-blue-600'
          },
          { 
            label: 'Major Projects', 
            value: '11+', 
            gradient: 'from-green-500 to-green-600'
          },
          { 
            label: 'Blue-chip Clients', 
            value: '10+', 
            gradient: 'from-purple-500 to-purple-600'
          },
          { 
            label: 'Countries Served', 
            value: '2+', 
            gradient: 'from-orange-500 to-orange-600'
          }
        ].map((stat, index) => (
          <motion.div 
            key={index}
            className="relative overflow-hidden bg-white rounded-2xl shadow-lg p-8 text-center group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: 1.8 + (index * 0.1) 
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="text-3xl font-bold text-[#00aeef] mb-2">
                {stat.value}
            </div>
            <div className="text-lg font-semibold text-gray-700">
              {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Future Vision */}
      <motion.div 
        className="mt-20 relative overflow-hidden bg-gradient-to-r from-[#00aeef]/10 via-blue-50 to-purple-50 rounded-2xl p-12 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 2.0 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#00aeef] to-purple-600"></div>
        </div>
        
        <div className="relative z-10">
        <motion.h3 
            className="text-3xl md:text-4xl font-bold font-heading text-black mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 2.2 }}
        >
          Looking Forward
        </motion.h3>
        <motion.p 
          className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 2.4 }}
        >
          As we continue our journey, we remain committed to pushing the boundaries of innovation, 
          embracing emerging technologies, and delivering solutions that shape the future of manufacturing.
        </motion.p>
          
        </div>
      </motion.div>
    </div>
  );
};

export default HistoryMilestonesSection;

