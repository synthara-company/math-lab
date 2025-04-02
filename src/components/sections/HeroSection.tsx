import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

interface HeroSectionProps {
  setShowDemo: (show: boolean) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ setShowDemo }) => {
  const [bio, setBio] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [activeTab, setActiveTab] = useState<'student' | 'teacher' | 'enthusiast'>('student');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const controls = useAnimation();
  
  // Load bio from cache on component mount
  useEffect(() => {
    const cachedBio = localStorage.getItem('userBio');
    if (cachedBio) {
      setBio(cachedBio);
      setSubmitted(true);
    }
    
    // Start animations
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    });
  }, [controls]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userBio', bio);
    setSubmitted(true);
  };
  
  const focusTextarea = () => {
    setSubmitted(false);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  // Floating shapes data
  const shapes = [
    { id: 1, type: 'circle', size: 'w-16 h-16', position: 'top-20 left-10', color: 'bg-teal-400/20', animation: 'animate-float-1' },
    { id: 2, type: 'triangle', size: 'w-20 h-20', position: 'top-1/3 right-20', color: 'bg-emerald-400/15', animation: 'animate-float-2' },
    { id: 3, type: 'square', size: 'w-12 h-12', position: 'bottom-40 left-1/4', color: 'bg-white/10', animation: 'animate-float-3' },
    { id: 4, type: 'circle', size: 'w-24 h-24', position: 'bottom-20 right-32', color: 'bg-teal-300/10', animation: 'animate-float-4' },
  ];

  const handleDemoClick = () => {
    setShowDemo(true);
    // Scroll to the demo section
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-indigo-50 via-sky-50 to-emerald-50">
      {/* Floating background shapes */}
      {shapes.map(shape => (
        <motion.div
          key={shape.id}
          className={`absolute ${shape.size} ${shape.position} ${shape.color} ${shape.animation} rounded-full`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: shape.id * 0.3 }}
        />
      ))}
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Animated gradient blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-gradient-to-r from-indigo-200 to-sky-200 rounded-full filter blur-[100px] opacity-30 animate-move-1"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-r from-sky-200 to-emerald-200 rounded-full filter blur-[120px] opacity-30 animate-move-2"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        className="container mx-auto px-4 py-20 text-center relative z-10"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="inline-block mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-sky-200 inline-flex items-center gap-2">
              <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-sky-900">Interactive Learning Platform</span>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 font-serif"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-indigo-900 via-sky-800 to-emerald-800 bg-clip-text text-transparent">
              Visual Calculus Explorer
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Transform abstract concepts into intuitive visual experiences with our interactive learning tools
          </motion.p>
          
          {/* User type selector */}
          <motion.div 
            className="max-w-md mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white/70 backdrop-blur-sm p-1 rounded-xl inline-flex shadow-lg">
              {['student', 'teacher', 'enthusiast'].map((role) => (
                <button
                  key={role}
                  className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                    activeTab === role 
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab(role as any)}
                >
                  {role}
                </button>
              ))}
            </div>
          </motion.div>
          
          {/* Bio section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="max-w-md mx-auto mb-12"
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <div className="flex flex-col gap-4">
                    <div className="relative group">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-200 to-emerald-200 opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300"></div>
                      <textarea
                        ref={textareaRef}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder={`What brings you here as a ${activeTab}?`}
                        className="w-full p-4 rounded-xl bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 resize-none border border-sky-100 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30 transition-all"
                        rows={4}
                        required
                      />
                    </div>
                    
                    <motion.button
                      type="submit"
                      className="relative overflow-hidden group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-sky-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative bg-white/70 group-hover:bg-transparent px-8 py-3 rounded-full font-medium text-gray-900 group-hover:text-white transition-all">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Save Profile
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </span>
                      </div>
                    </motion.button>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  key="bio-display"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative group"
                >
                  <div className="max-w-md mx-auto bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-sky-100 shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-3 h-3 bg-sky-400 rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <p className="text-gray-700 mb-4">{bio}</p>
                        <button
                          onClick={focusTextarea}
                          className="text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
                        >
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* CTA Button */}
          <motion.div 
            className="flex gap-4 justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.button
              onClick={handleDemoClick}
              className="relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"></div>
              <div className="relative px-8 py-4 rounded-full font-semibold text-white transition-all duration-300">
                <span className="relative z-10 flex items-center gap-3">
                  <span>Launch Interactive Demo</span>
                  <motion.span
                    animate={{
                      x: isHovering ? 5 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.span>
                </span>
              </div>
            </motion.button>
          </motion.div>
          
          {/* Features preview */}
          <motion.div 
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {/* Features array removed */}
          </motion.div>
        </div>
      </motion.div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-sky-400 rounded-full"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: 0
            }}
            animate={{
              x: [null, Math.random() * 100],
              y: [null, Math.random() * 100],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
