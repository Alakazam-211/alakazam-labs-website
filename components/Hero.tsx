'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Zap, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import StarRating from "@/components/testimonials/StarRating";
import OverlappedAvatars from "@/components/testimonials/OverlappedAvatars";

interface Testimonial {
  id: string;
  name: string;
  photo: string[];
  rating: number;
  text?: string;
  job?: string;
  company?: string;
  order?: number;
}

export default function Hero() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data.testimonials || []);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Calculate average rating
  const averageRating = testimonials.length > 0
    ? testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length
    : 0;

  return <section id="hero" className="relative z-10 min-h-screen flex items-center justify-center pt-[130px] md:pt-32 pb-8 md:pb-0">
      {/* Static background gradient - no animation */}
      <div className="absolute inset-0 aura-gradient z-0" />
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
            <Button 
              size="lg" 
              className="text-lg px-10 py-7 gold-shimmer-strong bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => router.push('/book')}
            >
              <Sparkles className="mr-2" />
              Book Your Magic Session
            </Button>
        </motion.div>

          {/* Ratings - Using ratings-package StarRating directly */}
          <motion.div className='flex flex-col items-center justify-center mt-6 md:mt-8 mb-2' initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.8
        }}>
            {loading ? (
              <>
                <div className="flex items-center gap-1 sm:gap-1.5 font-sans">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full glass-star glass-star-empty flex items-center justify-center p-0.5 overflow-hidden"
                    >
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-gray-100/60 to-gray-200/40 backdrop-blur-sm skeleton-shine"></div>
                    </div>
                  ))}
                  <div className="ml-1.5 sm:ml-2 w-12 h-7 sm:h-8 bg-gradient-to-r from-gray-100/50 to-gray-200/30 rounded-md backdrop-blur-sm skeleton-shine overflow-hidden"></div>
                </div>
                <div className="h-4 w-32 bg-gradient-to-r from-gray-100/50 to-gray-200/30 rounded-md backdrop-blur-sm skeleton-shine overflow-hidden mt-1"></div>
              </>
            ) : averageRating > 0 ? (
              <>
                <StarRating rating={averageRating} size="md" />
                <p className="text-sm sm:text-base text-white mt-1 font-sans">
                  Based on {testimonials.length} {testimonials.length === 1 ? 'review' : 'reviews'}
                </p>
              </>
            ) : null}
          </motion.div>

          {/* Testimonial Overlap - Direct from ratings-package */}
          <motion.div className="relative mb-0 h-24 -mx-4 md:mx-0" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.9
        }}>
            {loading ? (
              <div className="absolute top-0 left-0 right-0 flex justify-center">
                <div className="relative flex -space-x-1.5 sm:-space-x-2">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-avatar bg-gradient-to-br from-gray-100/50 to-gray-200/30 backdrop-blur-sm skeleton-shine skeleton-shine-avatar overflow-hidden"
                      style={{ zIndex: i + 1 }}
                    ></div>
                  ))}
                </div>
              </div>
            ) : testimonials.length > 0 ? (
              <div className="absolute top-0 left-0 right-0 flex justify-center">
                <OverlappedAvatars testimonials={testimonials} maxVisible={10} size="md" />
              </div>
            ) : null}
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
        }} className="mt-24 md:mt-8 grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
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

