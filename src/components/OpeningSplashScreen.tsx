import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Waves, ShieldCheck, ArrowRight } from 'lucide-react';

interface OpeningSplashScreenProps {
  onComplete: () => void;
}

export const OpeningSplashScreen: React.FC<OpeningSplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Initializing Resort Experience...');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(45);
      setStatusText('Connecting to Live Resort Database...');
    }, 400);

    const t2 = setTimeout(() => {
      setProgress(80);
      setStatusText('Checking Villa & Cottage Availability...');
    }, 900);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Welcome to Grand Horizon Resort');
    }, 1400);

    const t4 = setTimeout(() => {
      onComplete();
    }, 1900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950 text-white select-none overflow-hidden"
    >
      {/* Background ambient glowing gradient spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Top spacing */}
      <div className="w-full pt-8 px-6 flex justify-between items-center text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] tracking-wider text-slate-300">LIVE SYSTEM</span>
        </div>
        <span className="text-[11px] tracking-widest uppercase font-medium text-cyan-400/80">Guest Portal</span>
      </div>

      {/* Center Hero Branding */}
      <div className="flex flex-col items-center text-center px-6 -mt-8 relative z-10">
        {/* Animated Brand Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mb-6"
        >
          {/* Subtle spinning glow ring */}
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-500 via-sky-500 to-amber-400 opacity-30 blur-md animate-pulse" />
          
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-700 via-sky-800 to-slate-900 p-2 shadow-2xl border border-cyan-400/40 flex items-center justify-center relative overflow-hidden">
            <img 
              src="/icon.svg" 
              alt="Grand Horizon Resort Emblem" 
              className="w-full h-full object-contain drop-shadow-md"
            />
            {/* Shimmer light bar across icon */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear', delay: 0.4 }}
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-semibold tracking-wider uppercase mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Luxury Beachfront Sanctuary</span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
            Grand Horizon
          </h1>
          <p className="text-xs text-cyan-300 font-medium tracking-widest uppercase mt-1">
            Resort & Beach Spa
          </p>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-2 leading-relaxed">
            Exclusive Oceanfront Villas, Airconditioned Cottages, Videoke Suites & Day Passes
          </p>
        </motion.div>
      </div>

      {/* Bottom Progress & Enter Button */}
      <div className="w-full pb-10 px-8 flex flex-col items-center space-y-4 max-w-sm">
        {/* Progress bar container */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              {statusText}
            </span>
            <span className="font-mono text-cyan-400 font-bold">{progress}%</span>
          </div>

          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 rounded-full shadow-sm"
              initial={{ width: '10%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Skip / Enter Now Button */}
        <button
          onClick={onComplete}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-full hover:bg-slate-800/60 transition"
        >
          <span>Skip to App</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/70" />
          <span>Connected to Official Resort Booking Gateway</span>
        </div>
      </div>
    </motion.div>
  );
};
