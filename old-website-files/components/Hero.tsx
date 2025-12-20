import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Zap, TrendingUp, HeartHandshake } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Hero() {
  const navigate = useNavigate();
  return <section id="hero" className="relative z-50 min-h-screen flex items-center justify-center pt-32 md:pt-20 pb-8 md:pb-0">
      {/* Static background gradient - no animation */}
      <div className="absolute inset-0 aura-gradient" />
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full aura-gradient-blue blur-3xl opacity-30" />
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full aura-gradient blur-3xl opacity-20" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="text-center max-w-4xl mx-auto">
          <motion.h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }}>
            Results so <span className='gradient-text'>fast</span> they feel like <span className='gradient-text'>magic</span>.
          </motion.h1>

          <motion.p className='text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 md:mb-10 max-w-3xl mx-auto whitespace-pre-wrap' initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.4
        }}>{'We build production ready business apps with AI in hours.\nGet a working prototype during your first session.'}</motion.p>

          <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 0.6
        }} className="relative inline-block group z-0 mb-6">

  {/* Visible button stays lower */}
  





































  {/* Invisible overlay ABOVE iframe */}
  










        </motion.div>

          {/* Ratings */}
          <motion.div className='flex items-center justify-center space-x-2 mt-0 mb-2' initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.8
        }}>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-2 sm:py-3 border border-white/100 w-[200px] sm:w-[220px]">
              <iframe id="zite-star-iframe" className="zite-iframe" src="https://ratings.discover-nocode.com/embed/70605d7a-f6c5-46a9-8fb6-80ad3a3f92fd?method=star_meter&transparent=true" width="100%" height="50" scrolling="no" frameBorder="0" allowTransparency={true} style={{
              border: 'none',
              background: 'transparent'
            }} onLoad={() => {
              if (typeof (window as any).iframeLoaded === 'function') {
                (window as any).iframeLoaded('zite-star-iframe', 'zite-star-loading');
              }
            }} />

            </div>
          </motion.div>

          {/* Testimonial Overlap */}
          <motion.div className="relative z-25 mb-0 h-24 -mx-4 md:mx-0 pointer-events-none" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.9
        }}>

            <div className="absolute top-0 left-0 right-0">
              <iframe id="zite-overlap-iframe" className="zite-iframe" src="https://ratings.discover-nocode.com/embed/70605d7a-f6c5-46a9-8fb6-80ad3a3f92fd?method=overlap_avatars&transparent=true" width="100%" height="1200" frameBorder="0" allowTransparency={true} style={{
              border: 'none',
              background: 'transparent',
              pointerEvents: 'none'
            }} onLoad={() => {
              if (typeof (window as any).iframeLoaded === 'function') {
                (window as any).iframeLoaded('zite-overlap-iframe', 'zite-overlap-loading');
              }
            }} />

            </div>
          </motion.div>

          {/* Metrics strip */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.8
        }} className="mt-6 md:mt-8 grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-1 md:gap-2">
              <TrendingUp className="w-5 h-5 md:w-8 md:h-8 text-secondary" />
              <div className="text-xl md:text-3xl font-bold text-secondary">40+</div>
              <div className='text-xs md:text-sm text-muted-foreground text-center'>Prototypes Built</div>
            </div>
            <div className="flex flex-col items-center gap-1 md:gap-2">
              <Zap className="w-5 h-5 md:w-8 md:h-8 text-accent" />
              <div className='text-xl md:text-3xl font-bold text-accent'>2 hrs</div>
              <div className="text-xs md:text-sm text-muted-foreground text-center">1st Prototype</div>
            </div>
            <div className="flex flex-col items-center gap-1 md:gap-2">
              <Sparkles className='w-5 h-5 md:w-8 md:h-8 text-primary' />
              <div className="text-xl md:text-3xl font-bold text-primary">6-18 hrs</div>
              <div className="text-xs md:text-sm text-muted-foreground text-center">Avg. Build Time</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>;
}

