'use client';

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function MagicRibbon() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <div className="absolute left-1/2 top-0 pointer-events-none z-0 -translate-x-1/2 w-full max-w-4xl" style={{ height: '100%', minHeight: '100vh' }}>
      <svg
        className="w-full h-full"
        viewBox="-80 0 560 2000"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "rgb(168, 85, 247)", stopOpacity: 0.4 }} />
            <stop offset="33%" style={{ stopColor: "rgb(0, 191, 255)", stopOpacity: 0.5 }} />
            <stop offset="66%" style={{ stopColor: "rgb(255, 215, 0)", stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: "rgb(168, 85, 247)", stopOpacity: 0.3 }} />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Main flowing ribbon path - one-time animation */}
        <motion.path
          d="M200,0 C220,100 230,150 210,250 C190,350 180,400 200,500 C220,600 230,650 210,750 C190,850 180,900 200,1000 C220,1100 230,1150 210,1250 C190,1350 180,1400 200,1500 C220,1600 230,1700 210,1800 C195,1900 200,1950 200,2000"
          transform="translate(0, 0)"
          stroke="url(#ribbonGradient)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 3, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Reduced particle count - using CSS animations instead of JS for better performance */}
      {!reduceMotion && (
        <>
          <div className="ribbon-particle ribbon-particle-1" />
          <div className="ribbon-particle ribbon-particle-2" />
          <div className="ribbon-particle ribbon-particle-3" />
        </>
      )}
    </div>
  );
}

