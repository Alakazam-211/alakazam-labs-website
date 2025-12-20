import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] bg-background flex items-center justify-center"
      style={{ willChange: 'opacity' }}
    >
      {/* Simple static gradient - no animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <img
          src="https://images.fillout.com/orgid-432324/flowpublicid-g4lnna3r1f/widgetid-default/ccWejnUFvPJNvouSVsiL33/pasted-image-1759716559888.png"
          alt="Alakazam AI Logo"
          className="h-16 md:h-20 w-auto"
        />
        
        {/* Simple pulsing dot instead of bouncing dots */}
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      </motion.div>
    </motion.div>
  );
}

