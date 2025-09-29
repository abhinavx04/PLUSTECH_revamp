import { motion } from 'framer-motion';

// Material handling systems data
const handlingSystems = [
  {
    id: 1,
    title: "Conveyor Belt Systems",
    description: "Advanced conveyor solutions for seamless material flow and transportation",
    features: ["Variable Speed Control", "Load Sensors", "Automated Routing"],
    icon: "conveyor",
    efficiency: 95
  },
  {
    id: 2,
    title: "Robotic Pick & Place",
    description: "Precision robotic arms for automated component handling and placement",
    features: ["6-Axis Movement", "Vision Systems", "Adaptive Gripping"],
    icon: "robot",
    efficiency: 98
  },
  {
    id: 3,
    title: "Automated Storage",
    description: "Intelligent warehouse systems with automated retrieval and storage",
    features: ["RFID Tracking", "Inventory Management", "Space Optimization"],
    icon: "storage",
    efficiency: 92
  },
  {
    id: 4,
    title: "Sorting Systems",
    description: "High-speed automated sorting with quality control integration",
    features: ["Optical Recognition", "Multi-Lane Sorting", "Error Detection"],
    icon: "sorting",
    efficiency: 97
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    x: -50,
    rotateY: -15
  },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: {
      duration: 0.8
    }
  }
};

// Icon components
const getIcon = (iconType: string) => {
  const iconProps = { className: "w-8 h-8 text-[#252627]" };
  
  switch (iconType) {
    case 'conveyor':
      return (
        <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 'robot':
      return (
        <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      );
    case 'storage':
      return (
        <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      );
    case 'sorting':
      return (
        <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
  }
};

export default function MaterialHandling() {
  return (
    <section className="py-20 px-6 sm:px-8 lg:px-12 bg-[#FFF9FB] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#4B88A2]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4B88A2]/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-[#252627] mb-6"
            style={{ fontFamily: 'Roboto Flex, sans-serif' }}
          >
            Automated Material Handling
          </motion.h2>
          <motion.div 
            className="w-32 h-1 bg-gradient-to-r from-blue-400 to-cyan-500 mx-auto mb-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            viewport={{ once: true }}
          />
          <motion.p 
            className="text-xl text-[#252627]/70 max-w-4xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Roboto Flex, sans-serif' }}
          >
            Intelligent automation solutions for efficient material flow, handling, and processing 
            in modern manufacturing environments
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Left side - System Cards */}
          <motion.div className="space-y-6">
            {handlingSystems.map((system, index) => (
              <motion.div
                key={system.id}
                className="group relative"
                variants={cardVariants}
                whileHover={{ scale: 1.02, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-[#D3D4D9]/40 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300" style={{ borderColor: '#D3D4D9' }}>
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <motion.div 
                      className="flex-shrink-0 w-14 h-14 bg-[#4B88A2] rounded-xl flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {getIcon(system.icon)}
                    </motion.div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#252627] mb-2" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
                        {system.title}
                      </h3>
                      <p className="text-[#252627]/70 text-sm mb-4 leading-relaxed" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
                        {system.description}
                      </p>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {system.features.map((feature, idx) => (
                          <motion.span
                            key={idx}
                            className="px-3 py-1 bg-[#252627]/50 text-[#4B88A2] text-xs rounded-full border"
                            style={{ borderColor: '#4B88A2' }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * idx, duration: 0.3 }}
                            viewport={{ once: true }}
                          >
                            {feature}
                          </motion.span>
                        ))}
                      </div>
                      
                      {/* Efficiency Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-[#252627]/60">Efficiency</span>
                          <span className="text-xs text-[#4B88A2] font-semibold">{system.efficiency}%</span>
                        </div>
                        <div className="h-2 bg-[#D3D4D9] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-[#4B88A2] to-[#4B88A2] rounded-full"
                            initial={{ scaleX: 0, originX: 0 }}
                            whileInView={{ scaleX: system.efficiency / 100 }}
                            transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 bg-[#4B88A2]/10 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right side - Visual representation */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="relative h-[500px] bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl border border-gray-700/50 overflow-hidden backdrop-blur-sm">
              {/* Central hub */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30"
                animate={{
                  y: [-10, 10, -10],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </motion.div>

              {/* Orbiting elements */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 8 + i * 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    top: '50%',
                    left: '50%',
                    transformOrigin: `${60 + i * 40}px 0px`,
                    marginTop: '-12px',
                    marginLeft: '-12px'
                  }}
                />
              ))}

              {/* Flowing lines */}
              <svg className="absolute inset-0 w-full h-full">
                <motion.path
                  d="M100,250 Q250,150 400,250 T700,250"
                  stroke="url(#gradient1)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 2, delay: 1 }}
                  viewport={{ once: true }}
                />
                <motion.path
                  d="M100,150 Q250,250 400,150 T700,150"
                  stroke="url(#gradient2)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 2, delay: 1.5 }}
                  viewport={{ once: true }}
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00bcd4" stopOpacity="0" />
                    <stop offset="50%" stopColor="#00bcd4" stopOpacity="1" />
                    <stop offset="100%" stopColor="#2196f3" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2196f3" stopOpacity="0" />
                    <stop offset="50%" stopColor="#2196f3" stopOpacity="1" />
                    <stop offset="100%" stopColor="#00bcd4" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Corner decorative elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full" />
              <div className="absolute bottom-4 left-4 w-20 h-20 bg-gradient-to-tl from-blue-500/20 to-transparent rounded-full" />
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {[
            { value: "99.5%", label: "System Uptime", icon: "⚡" },
            { value: "40%", label: "Cost Reduction", icon: "💰" },
            { value: "60%", label: "Speed Increase", icon: "🚀" },
            { value: "24/7", label: "Operation", icon: "🔄" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-gray-900/50 rounded-xl border border-gray-700/30 backdrop-blur-sm"
              whileHover={{ scale: 1.05, borderColor: 'rgba(0, 221, 255, 0.3)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-400" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}