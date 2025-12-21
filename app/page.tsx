'use client';

import { useState, useEffect } from "react";
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
import MagicRibbon from "@/components/MagicRibbon";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content immediately but keep loading screen visible
    setShowContent(true);

    // For Next.js, we'll use a simpler loading approach
    // The ratings components will handle their own loading states
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 second initial load

    return () => {
      clearTimeout(timer);
    };
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

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen />}
      </AnimatePresence>
      
      {showContent && (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative">
          <MagicRibbon />
          <Navbar />
          <div className="relative flex-grow overflow-x-hidden pt-20 md:pt-24" style={{ minHeight: 'auto', height: 'auto' }}>
            <div className="relative" style={{ minHeight: 'auto', height: 'auto' }}>
              <Hero />
              <div className="relative z-10" style={{ minHeight: 'auto', height: 'auto' }}>
                <Comparison />
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

