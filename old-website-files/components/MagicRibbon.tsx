import { motion } from "framer-motion";

export default function MagicRibbon() {
  return (
    <div className="absolute left-1/2 top-0 pointer-events-none z-0 -translate-x-1/2 w-full max-w-4xl" style={{ height: '100%' }}>
      <svg
        className="w-full h-full"
        viewBox="0 0 400 2000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "rgb(168, 85, 247)", stopOpacity: 0.4 }} />
            <stop offset="33%" style={{ stopColor: "rgb(0, 191, 255)", stopOpacity: 0.5 }} />
            <stop offset="66%" style={{ stopColor: "rgb(255, 215, 0)", stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: "rgb(168, 85, 247)", stopOpacity: 0.3 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Main flowing ribbon path */}
        <motion.path
          d="M200,0 C220,100 230,150 210,250 C190,350 180,400 200,500 C220,600 230,650 210,750 C190,850 180,900 200,1000 C220,1100 230,1150 210,1250 C190,1350 180,1400 200,1500 C220,1600 230,1700 210,1800 C195,1900 200,1950 200,2000"
          stroke="url(#ribbonGradient)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Animated floating particles */}
      <motion.div
        className="absolute top-[15%] left-1/2 w-3 h-3 rounded-full bg-primary -translate-x-1/2"
        style={{ boxShadow: "0 0 15px rgba(168, 85, 247, 0.9)" }}
        animate={{
          y: [-15, 15, -15],
          x: [-30, 30, -30],
          opacity: [0.4, 1, 0.4],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[35%] left-1/2 w-2.5 h-2.5 rounded-full bg-secondary -translate-x-1/2"
        style={{ boxShadow: "0 0 12px rgba(0, 191, 255, 0.9)" }}
        animate={{
          y: [15, -15, 15],
          x: [30, -30, 30],
          opacity: [0.4, 1, 0.4],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />
      <motion.div
        className="absolute top-[55%] left-1/2 w-3 h-3 rounded-full bg-accent -translate-x-1/2"
        style={{ boxShadow: "0 0 15px rgba(255, 215, 0, 0.9)" }}
        animate={{
          y: [-15, 15, -15],
          x: [-25, 25, -25],
          opacity: [0.4, 1, 0.4],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      <motion.div
        className="absolute top-[75%] left-1/2 w-2 h-2 rounded-full bg-primary -translate-x-1/2"
        style={{ boxShadow: "0 0 10px rgba(168, 85, 247, 0.8)" }}
        animate={{
          y: [10, -10, 10],
          x: [20, -20, 20],
          opacity: [0.3, 0.9, 0.3],
          scale: [0.7, 1.1, 0.7]
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}

