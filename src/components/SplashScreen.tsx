import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AMOS_EMBLEM_URL } from '../data/mockData';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 22) + 10;
      });
    }, 280);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm w-full"
      >
        {/* Animated Rotating Emblem */}
        <div className="relative mb-8">
          {/* Subtle spinning outer orbit ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            className="absolute -inset-3 rounded-full border border-dashed border-amber-400/25 pointer-events-none"
          />

          {/* Logo Frame */}
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(212,175,55,0.15)", 
                "0 0 35px rgba(212,175,55,0.3)", 
                "0 0 20px rgba(212,175,55,0.15)"
              ] 
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 bg-gradient-to-b from-amber-400/30 via-slate-800 to-amber-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md"
          >
            <img
              src={AMOS_EMBLEM_URL}
              alt="Amos Store Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-[22px]"
            />
          </motion.div>
        </div>

        {/* System Title & Typographic Hierarchy */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5 font-['Plus_Jakarta_Sans']">
          AMOS STORE
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 tracking-wide mb-8 font-medium">
          Personal Information, Document & User Management System
        </p>

        {/* Loading Progress Indicator */}
        <div className="w-full max-w-[240px]">
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10 p-[1px] mb-3">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.2 }}
            />
          </div>
          
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono tabular-nums px-0.5">
            <span>Loading system...</span>
            <span className="text-amber-400/90 font-medium">{Math.min(progress, 100)}%</span>
          </div>
        </div>

        {/* Skip button for rapid user testing */}
        <button
          onClick={onComplete}
          className="mt-8 text-xs text-slate-400 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
        >
          Enter Amos Store
        </button>
      </motion.div>

      {/* Footer quiet tag */}
      <div className="absolute bottom-6 text-[11px] text-slate-400 font-medium tracking-wider">
        SECURE VAULT · ROLE-BASED ACCESS CONTROL
      </div>
    </div>
  );
};
