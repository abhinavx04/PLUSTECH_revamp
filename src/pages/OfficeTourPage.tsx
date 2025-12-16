import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Scroll, Grid3x3, ArrowRight, ArrowLeft } from 'lucide-react';
import { OfficeShowcase } from '../components/office/OfficeShowcase';
import { OfficeParallaxTour } from '../components/office/OfficeParallaxTour';
import { Office3DGallery } from '../components/office/Office3DGallery';

type ExperienceType = 'selector' | 'interactive-map' | 'parallax' | '3d-gallery';

export const OfficeTourPage: React.FC = () => {
  const [selectedExperience, setSelectedExperience] = useState<ExperienceType>('selector');

  const experiences = [
    {
      id: 'interactive-map' as ExperienceType,
      icon: Map,
      title: 'Interactive Floor Plan',
      description: 'Navigate through an animated floor plan with clickable rooms',
      color: 'from-blue-500 to-cyan-500',
      features: ['Click to explore', 'Smooth transitions', 'Room details'],
    },
    {
      id: 'parallax' as ExperienceType,
      icon: Scroll,
      title: 'Parallax Scroll Tour',
      description: 'Scroll through office sections with stunning depth effects',
      color: 'from-purple-500 to-pink-500',
      features: ['Immersive scrolling', 'Depth layers', 'Cinematic feel'],
    },
    {
      id: '3d-gallery' as ExperienceType,
      icon: Grid3x3,
      title: '3D Bento Gallery',
      description: 'Modern grid layout with 3D card animations',
      color: 'from-green-500 to-emerald-500',
      features: ['Filter categories', '3D effects', 'Lightbox view'],
    },
  ];

  // Back button component
  const BackButton = () => (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => setSelectedExperience('selector')}
      className="fixed top-8 left-8 z-50 px-4 py-2 bg-slate-900/80 backdrop-blur-xl rounded-full flex items-center gap-2 hover:bg-slate-800/80 transition-colors text-white border border-white/10 shadow-lg"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>Back to Menu</span>
    </motion.button>
  );

  if (selectedExperience === 'interactive-map') {
    return (
      <>
        <BackButton />
        <OfficeShowcase />
      </>
    );
  }

  if (selectedExperience === 'parallax') {
    return (
      <>
        <BackButton />
        <OfficeParallaxTour />
      </>
    );
  }

  if (selectedExperience === '3d-gallery') {
    return (
      <>
        <BackButton />
        <Office3DGallery />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 py-20 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-black text-white mb-6"
            animate={{
              backgroundImage: [
                'linear-gradient(to right, #3B82F6, #8B5CF6)',
                'linear-gradient(to right, #8B5CF6, #EC4899)',
                'linear-gradient(to right, #EC4899, #3B82F6)',
              ],
            }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Office Tour
          </motion.h1>
          <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto">
            Choose your preferred way to explore our facility
          </p>
        </motion.div>

        {/* Experience Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group cursor-pointer"
              onClick={() => setSelectedExperience(exp.id)}
            >
              <motion.div
                className="relative bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 overflow-hidden"
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                />

                {/* Icon */}
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${exp.color} flex items-center justify-center mb-6`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <exp.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3">
                  {exp.title}
                </h3>
                <p className="text-blue-200 mb-6">
                  {exp.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {exp.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      className="flex items-center gap-2 text-blue-300 text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${exp.color}`} />
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* Button */}
                <motion.button
                  className={`w-full py-3 rounded-xl bg-gradient-to-r ${exp.color} text-white font-semibold flex items-center justify-center gap-2 group/btn`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Start Experience</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>

                {/* Hover Glow Effect */}
                <motion.div
                  className={`absolute -inset-1 bg-gradient-to-r ${exp.color} opacity-0 group-hover:opacity-30 blur-2xl -z-10 transition-opacity duration-500`}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900/30 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Not sure which to choose?
          </h2>
          <p className="text-blue-200 text-lg mb-6">
            Each experience offers a unique way to explore our facility.
            Try them all to find your favorite!
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Quick & Interactive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Immersive Storytelling</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Gallery Browse</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

