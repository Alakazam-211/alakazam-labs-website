'use client';

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Comparison from "@/components/Comparison";
import Solutions from "@/components/Solutions";
import Benefits from "@/components/Benefits";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
// import MagicRibbon from "@/components/MagicRibbon"; // Hidden - replaced with ColorBends
import dynamic from 'next/dynamic';
import LoadingScreen from "@/components/LoadingScreen";

// Dynamically import ColorBends with SSR disabled (DISABLED - saved for later use)
// const ColorBends = dynamic(() => import('@/components/ColorBends'), {
//   ssr: false,
//   loading: () => null, // No loading state needed for background
// });

// Dynamically import LightPillar with SSR disabled - full website background
const LightPillar = dynamic(() => import('@/components/LightPillar'), {
  ssr: false,
  loading: () => null, // No loading state needed for background
});

// LaserFlow moved to Hero component - no longer needed here

export default function Home() {
  // DISABLED: Loading screen hidden for now - page renders fast enough without overlay
  // const [isLoading, setIsLoading] = useState(true);
  const [isLoading] = useState(false); // Set to false to disable loading screen
  const [showContent, setShowContent] = useState(false);
  const [lightPillarHeight, setLightPillarHeight] = useState<string>('100vh');
  const [lightPillarTop, setLightPillarTop] = useState<string>('0px');
  const heroComparisonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show content immediately but keep loading screen visible
    setShowContent(true);

    // DISABLED: Loading screen timer - keeping code for future use
    // For Next.js, we'll use a simpler loading approach
    // The ratings components will handle their own loading states
    // const timer = setTimeout(() => {
    //   setIsLoading(false);
    // }, 2000); // 2 second initial load

    // return () => {
    //   clearTimeout(timer);
    // };
  }, []);

  // Handle hash navigation when coming from other pages
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        // Wait for content to be rendered
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 500);
      }
    };

    // Check hash on mount
    handleHashNavigation();

    // Also listen for hash changes
    window.addEventListener('hashchange', handleHashNavigation);
    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, []);

  // Calculate Light Pillar height to match Hero + Comparison sections + navbar area
  useEffect(() => {
    if (!showContent) return;
    
    const updateLightPillarHeight = () => {
      if (!heroComparisonRef.current) {
        return;
      }
      
      const heroSection = document.getElementById('hero');
      const comparisonSection = heroComparisonRef.current.querySelector('section');
      // Find the gradient line (orange/yellow/teal gradient) above "Pick your Path"
      const purpleLine = heroComparisonRef.current.querySelector('div[style*="linear-gradient"]') ||
                        Array.from(heroComparisonRef.current.querySelectorAll('div')).find(
                          (div: Element) => {
                            const style = (div as HTMLElement).style.background;
                            return style && style.includes('linear-gradient') && style.includes('#ff6200');
                          }
                        );
      
      // Get positions relative to viewport
      const containerRect = heroComparisonRef.current.getBoundingClientRect();
      
      if (!heroSection || !comparisonSection || !purpleLine) {
        return;
      }
      
      const purpleLineRect = (purpleLine as HTMLElement).getBoundingClientRect();
      
      // Get navbar height
      const navbar = document.querySelector('nav') || document.querySelector('header');
      const navbarRect = navbar ? navbar.getBoundingClientRect() : null;
      const navbarHeight = navbarRect ? navbarRect.height : 0;
      
      // Calculate positions relative to document (not viewport)
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const containerTopFromPageTop = containerRect.top + scrollY;
      // Use the TOP of the purple line, not the bottom, so it stops exactly at the line
      const purpleLineTopFromPageTop = purpleLineRect.top + scrollY;
      
      // Height should be from top of page (0) to top of purple line (not bottom)
      // This ensures it stops exactly at the divider line
      const totalHeight = Math.max(purpleLineTopFromPageTop, navbarHeight + 100);
      
      // Top offset: negative value to move up from container position to top of page
      // This positions the LightPillar to start at the very top of the page (including navbar area)
      const topOffset = -containerTopFromPageTop;
      
      setLightPillarHeight(`${totalHeight}px`);
      setLightPillarTop(`${topOffset}px`);
      
      // Store top offset for positioning (negative to move up to top of page)
      if (heroComparisonRef.current) {
        heroComparisonRef.current.style.setProperty('--light-pillar-top', `${topOffset}px`);
      }
    };
    
    // Initial calculation after content renders
    const timer = setTimeout(updateLightPillarHeight, 100);
    
    // Update on resize and scroll
    const handleResize = () => {
      requestAnimationFrame(updateLightPillarHeight);
    };
    const handleScroll = () => {
      requestAnimationFrame(updateLightPillarHeight);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Use ResizeObserver to watch for content changes
    let resizeObserver: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    
    if (heroComparisonRef.current) {
      resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(updateLightPillarHeight);
      });
      resizeObserver.observe(heroComparisonRef.current);
      
      // Use MutationObserver to detect when elements are added to DOM
      mutationObserver = new MutationObserver(() => {
        requestAnimationFrame(updateLightPillarHeight);
      });
      mutationObserver.observe(heroComparisonRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
      
      // Also observe the purple line for changes
      const findPurpleLine = () => {
        return heroComparisonRef.current?.querySelector('div[style*="linear-gradient"]') ||
               Array.from(heroComparisonRef.current?.querySelectorAll('div') || []).find(
                 (div: Element) => {
                   const style = (div as HTMLElement).style.background;
                   return style && style.includes('linear-gradient') && style.includes('#ff6200');
                 }
               );
      };
      
      // Check for purple line periodically
      const checkPurpleLine = () => {
        const purpleLine = findPurpleLine();
        if (purpleLine && resizeObserver) {
          resizeObserver.observe(purpleLine);
        }
      };
      
      setTimeout(checkPurpleLine, 200);
      setTimeout(checkPurpleLine, 500);
      setTimeout(checkPurpleLine, 1000);
    }
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
    };
  }, [showContent]);

  return (
    <>
      <AnimatePresence mode="wait">
        {/* DISABLED: Loading screen hidden for now - page renders fast enough without overlay */}
        {/* {isLoading && <LoadingScreen />} */}
      </AnimatePresence>
      
      {showContent && (
        <div className="min-h-screen bg-background/95 text-foreground flex flex-col relative overflow-visible">
          {/* LaserFlow moved to Hero component - removed from here */}
          {/* <MagicRibbon /> Hidden - replaced with ColorBends */}
          <Navbar />
          <div 
            className="relative flex-grow overflow-x-hidden overflow-y-visible pt-20 md:pt-24" 
            style={{ minHeight: 'auto', height: 'auto' }}
          >
            {/* Wrapper for Hero and Comparison with LightPillar background */}
            <div ref={heroComparisonRef} className="relative overflow-visible">
              {/* LightPillar - extends from top of page (navbar) to purple line (static height based on content) */}
              <div 
                className="absolute pointer-events-none z-0" 
                style={{ 
                  top: lightPillarTop || 'var(--light-pillar-top, 0)', 
                  left: 0, 
                  right: 0, 
                  height: lightPillarHeight
                }}
              >
                <LightPillar
                  topColor="#6B27FF"
                  bottomColor="#E89FFC"
                  intensity={1.0}
                  rotationSpeed={0.1}
                  glowAmount={0.001}
                  pillarWidth={3.0}
                  pillarHeight={0.4}
                  noiseIntensity={0.5}
                  pillarRotation={25}
                  interactive={false}
                  mixBlendMode="normal"
                />
              </div>
              <Hero />
              <div className="relative z-10">
                <Comparison />
                {/* Gradient line between Comparison and Solutions - above "Pick your Path", below "everything to gain" */}
                <div className="w-full h-[4px]" style={{ background: 'linear-gradient(135deg, #ff6200 0%, #ff9e62 10%, #ffd700 40%, #00d3ba 85%)' }}></div>
                <Solutions />
                <Process />
                <Benefits />
                <Testimonials />
                <CTA />
                <FAQ />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}

