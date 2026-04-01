import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="h-[100svh] bg-natty-teal flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12, duration: 0.8 }}
        className="w-32 h-32 bg-natty-lime rounded-3xl flex items-center justify-center text-natty-teal font-black text-6xl shadow-2xl mb-8"
      >
        N
      </motion.div>
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-white text-4xl font-black tracking-tighter"
      >
        NATTY
      </motion.h1>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-natty-lime font-bold mt-2 tracking-[0.2em] text-xs uppercase"
      >
        Performance & Nutrition
      </motion.p>
    </motion.div>
  );
};

export default SplashScreen;
