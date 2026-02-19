import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, faUsers, faGlasses, faBullseye, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { far, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import '../../styles/animatedBorder.css';

// Add icons to library
library.add(fas, far);

// Icon mapping
const iconMap: Record<string, any> = {
  'users': faUsers,
  'glasses': faGlasses,
  'bullseye': faBullseye,
  'circle-check': faCircleCheck,
  'chart-line': faChartLine,
};

interface BeliefCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  stats: string[];
}

const beliefsData: BeliefCard[] = [
  {
    id: 'customer-satisfaction',
    title: 'Customer Satisfaction',
    description: 'Since inception, Plustech has made "customer satisfaction" and "relationships" as the foundation of our business principle. We derive immense satisfaction when customers recall our brand and entrust us with successive projects.',
    icon: 'users',
    color: 'from-[#00aeef] to-[#0077a3]',
    stats: ['Foundation Principle', 'Brand Recognition', 'Successive Projects']
  },
  {
    id: 'vision',
    title: 'Our Vision',
    description: 'To become a dominant and internationally acknowledged player in surface finishing plant and equipment by adopting greener technologies and best business practices.',
    icon: 'glasses',
    color: 'from-[#00aeef] to-[#005a7a]',
    stats: ['International Recognition', 'Green Technologies', 'Best Practices']
  },
  {
    id: 'mission',
    title: 'Our Mission',
    description: 'To be the most preferred supplier for surface finishing plant by offering customized solutions in setting up energy efficient plants with consistently good quality. We believe in not just meeting customer expectations but exceeding them.',
    icon: 'bullseye',
    color: 'from-[#0099d4] to-[#00aeef]',
    stats: ['Preferred Supplier', 'Energy Efficient', 'Exceed Expectations']
  },
  {
    id: 'quality-policy',
    title: 'Quality Policy',
    description: 'To provide professional & efficient service to customers by delivering high quality surface finishing process plants on time and at optimum price. We are committed to continual improvement and ISO 9001:2015 standards.',
    icon: 'circle-check',
    color: 'from-[#0077a3] to-[#00aeef]',
    stats: ['Professional Service', 'ISO 9001:2015', 'Continual Improvement']
  },
  {
    id: 'peace-usp',
    title: 'PEACE USP',
    description: 'Our USP outlined under the acronym PEACE (Productivity, Efficiency, Affordability, Cost and Environment) focuses on delivering best value proposition to customers for long lasting relationships.',
    icon: 'chart-line',
    color: 'from-[#00aeef] to-[#0099d4]',
    stats: ['Productivity', 'Cost', 'Efficiency', 'Environment', 'Affordability']
  },
  {
    id: 'future-plans',
    title: 'Future Plans',
    description: 'Plustech is steering geographical expansion drive to serve the industry with greener technologies and best engineering practices. We are coming up with a Technical Center and elegant office in a new business district.',
    icon: 'long-term',
    color: 'from-[#005a7a] to-[#00aeef]',
    stats: ['Global Expansion', 'Technical Center', 'Green Technologies']
  }
];

const CorporateBeliefsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  return (
    <div ref={sectionRef} className="max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div 
        className="text-center mb-16"
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
          Corporate Beliefs
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed text-justify"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Since inception, Plustech Systems and Solutions has made "customer satisfaction" and "relationships" 
          as the foundation of business principle.
        </motion.p>
      </motion.div>

      {/* Our Values — full-width dark environment zone */}
      <div className="-mx-6 md:-mx-8 mb-20">
        <div className="relative overflow-hidden">
          {/* Dark environment background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628]" />

          {/* Subtle decorative glow effects */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-[#00aeef]/8 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-[#00aeef]/6 rounded-full blur-[100px] pointer-events-none" />

          {/* Top edge gradient (light → dark) */}
          <div className="h-16 bg-gradient-to-b from-transparent to-[#0a1628] relative z-10" style={{ marginTop: '-1px' }} />

          {/* Content */}
          <motion.div
            className="relative z-10 px-6 md:px-8 py-8 md:py-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="max-w-4xl mx-auto">
              <img
                src="/corporate/corporate-believes.png"
                alt="Our Values — Customer-Centric, Integrity, Accountability, Innovation, Collaboration, Transparency, Gratitude"
                className="w-full h-auto block rounded-xl"
                loading="eager"
              />
            </div>

            <p className="text-center text-white/50 text-sm tracking-widest uppercase mt-8 font-medium">
              The principles that guide everything we do
            </p>
          </motion.div>

          {/* Bottom edge gradient (dark → light) */}
          <div className="h-16 bg-gradient-to-t from-transparent to-[#0a1628] relative z-10" style={{ marginBottom: '-1px' }} />
        </div>
      </div>

      {/* Beliefs Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        style={{ gridAutoRows: 'minmax(340px, auto)' }}
      >
        {beliefsData.map((belief, index) => {
          return (
            <div
              key={belief.id}
              className="group h-full relative z-10"
            >
               <div className="rounded-2xl h-full w-full overflow-hidden">
                 <div 
                   className="relative rounded-2xl border border-gray-200 bg-white flex flex-col h-full min-h-[340px] w-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,174,239,0.05)]"
                 >
                {/* Subtle geometric pattern background */}
                <div className="absolute inset-0 opacity-[0.03] rounded-2xl" 
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #00aeef 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                  }}
                />
                
                 {/* Corner accent decoration */}
                 <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${belief.color} opacity-5 rounded-bl-full`} />
                 
                 {/* Left border accent */}
                 <div 
                   className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${belief.color} rounded-l-2xl opacity-70`}
                 />
                 
                 {/* Number badge */}
                 <div className={`absolute top-4 right-4 w-8 h-8 rounded-lg bg-gradient-to-br ${belief.color} flex items-center justify-center text-white font-bold text-sm shadow-md z-10`}>
                   {index + 1}
                 </div>
                
                 {/* Header with icon and gradient */}
                 <div className="relative p-6">
                   <div className="flex items-start gap-4">
                     {/* Icon badge */}
                     <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center">
                       {belief.icon === 'long-term' ? (
                         <img 
                           src="/long-term.png" 
                           alt="Long-term" 
                           className="w-10 h-10 object-contain"
                         />
                       ) : (
                         <FontAwesomeIcon 
                           icon={iconMap[belief.icon]} 
                           className="text-3xl text-gray-700"
                         />
                       )}
                     </div>
                     
                     {/* Title section */}
                     <div className="flex-1 min-w-0">
                       <h3 
                         className="text-2xl font-bold font-heading text-black text-left"
                       >
                         {belief.title}
                       </h3>
                       <div 
                         className={`h-1 mt-2 w-16 bg-gradient-to-r ${belief.color} rounded-full`}
                       />
                     </div>
                   </div>
                 </div>
                
                 {/* Content */}
                 <div className="flex-1 relative z-10 p-6">
                   <p 
                     className="text-gray-900 mb-6 text-justify text-lg leading-relaxed"
                   >
                     {belief.description}
                   </p>
                   
                   {/* Key Points */}
                   <div className="space-y-3">
                     {belief.stats.map((stat, statIndex) => (
                       <div
                         key={statIndex}
                         className="flex items-center space-x-3"
                       >
                         <div 
                           className={`w-3 h-3 rounded-full bg-gradient-to-r ${belief.color} shadow-sm flex items-center justify-center`}
                         >
                           <div className="w-1.5 h-1.5 rounded-full bg-white" />
                         </div>
                         <span 
                           className="text-gray-900 font-medium text-base"
                         >
                           {stat}
                         </span>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
           </div>
           );
         })}
       </div>

      {/* Summary Quote */}
      <motion.div 
        className="mt-16 text-center bg-gradient-to-r from-[#00aeef]/10 via-white to-[#00aeef]/10 rounded-2xl p-6 sm:p-8 md:p-12 border border-[#00aeef]/20 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        whileHover={{
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          transition: { duration: 0.3 }
        }}
      >
        <h3 
          className="text-3xl font-bold font-heading text-black mb-6"
        >
          Our Commitment
        </h3>
        <blockquote 
          className="text-lg sm:text-xl md:text-2xl text-gray-900 max-w-4xl mx-auto leading-relaxed italic text-center"
        >
          "Our customers/associates take pride and comfort in their engagement with Plustech. 
          We believe in not just meeting customer expectations but exceeding them."
        </blockquote>
      </motion.div>
    </div>
  );
};

export default CorporateBeliefsSection;

