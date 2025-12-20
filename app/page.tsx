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

  // #region agent log
  // Fix: Force all sections to maintain layout contribution (PREVENT PAGE HEIGHT COLLAPSE)
  useEffect(() => {
    if (!showContent) return;
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    const logEndpoint = 'http://127.0.0.1:7244/ingest/c818746c-bbef-418c-90d3-3e01ae399c6e';
    
    const sendLog = (data: any) => {
      fetch(logEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {
        console.log('[DEBUG]', data.message, JSON.stringify(data.data));
      });
    };
    
    // Force all sections to maintain their height in layout
    const forceSectionLayout = () => {
      const sections = document.querySelectorAll('section');
      let basePageHeight = 0;
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const styles = window.getComputedStyle(section);
        
        // Force content-visibility and contain
        (section as HTMLElement).style.setProperty('content-visibility', 'visible', 'important');
        (section as HTMLElement).style.setProperty('contain', 'none', 'important');
        (section as HTMLElement).style.setProperty('min-height', 'auto', 'important');
        
        // If section has content but zero height, force a minimum height
        if (section.children.length > 0 && rect.height === 0) {
          const computedHeight = Array.from(section.children).reduce((sum, child) => {
            const childRect = (child as HTMLElement).getBoundingClientRect();
            return sum + childRect.height;
          }, 0);
          
          if (computedHeight > 0) {
            (section as HTMLElement).style.setProperty('min-height', `${computedHeight}px`, 'important');
            sendLog({
              location: 'app/page.tsx:forceSectionLayout',
              message: 'Forced min-height on collapsed section',
              data: {
                sectionId: section.id || 'unknown',
                forcedHeight: computedHeight,
                childrenCount: section.children.length
              },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'post-fix',
              hypothesisId: 'I'
            });
          }
        }
        
        basePageHeight += rect.height || 0;
      });
      
      return basePageHeight;
    };
    
    // Monitor page height and force layout if it shrinks
    let lastPageHeight = 0;
    let lastScrollY = 0;
    let scrollCount = 0;
    let maxPageHeight = 0;
    
    const checkPageHeight = () => {
      const currentPageHeight = document.documentElement.scrollHeight;
      const currentScrollY = window.scrollY;
      const bodyHeight = document.body.scrollHeight;
      const maxScrollY = currentPageHeight - window.innerHeight;
      const sections = document.querySelectorAll('section');
      
      // Track maximum page height we've seen
      if (currentPageHeight > maxPageHeight) {
        maxPageHeight = currentPageHeight;
      }
      
      // CRITICAL FIX: Prevent scrolling beyond page bounds (mobile overscroll)
      if (currentScrollY > maxScrollY + 10) {
        sendLog({
          location: 'app/page.tsx:useEffect',
          message: 'SCROLL EXCEEDED PAGE HEIGHT - CLAMPING',
          data: {
            scrollY: currentScrollY,
            maxScrollY,
            pageHeight: currentPageHeight,
            viewportHeight: window.innerHeight,
            isMobile
          },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'post-fix',
          hypothesisId: 'J'
        });
        
        // Clamp scroll position to valid range
        window.scrollTo({
          top: Math.max(0, Math.min(maxScrollY, currentScrollY)),
          behavior: 'auto'
        });
      }
      
      // Track page height changes (CRITICAL)
      if (lastPageHeight > 0 && currentPageHeight < lastPageHeight - 50) {
        sendLog({
          location: 'app/page.tsx:useEffect',
          message: 'PAGE HEIGHT SHRUNK - FORCING LAYOUT',
          data: {
            previousHeight: lastPageHeight,
            currentHeight: currentPageHeight,
            maxPageHeight,
            heightDifference: currentPageHeight - lastPageHeight,
            scrollY: currentScrollY,
            isMobile
          },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'post-fix',
          hypothesisId: 'F'
        });
        
        // Force layout recalculation
        forceSectionLayout();
        // Force reflow
        document.body.offsetHeight;
        
        // If page height shrunk, restore it by forcing all sections to render
        const newPageHeight = document.documentElement.scrollHeight;
        if (newPageHeight < maxPageHeight - 100) {
          // Force all sections to be visible and contribute to height
          sections.forEach((section) => {
            (section as HTMLElement).style.setProperty('display', 'block', 'important');
            (section as HTMLElement).style.setProperty('visibility', 'visible', 'important');
            (section as HTMLElement).style.setProperty('height', 'auto', 'important');
            (section as HTMLElement).style.setProperty('min-height', 'auto', 'important');
          });
          
          // Force a reflow to recalculate height
          document.body.offsetHeight;
          document.documentElement.offsetHeight;
        }
      }
      
      lastPageHeight = currentPageHeight;
      lastScrollY = currentScrollY;
      scrollCount++;
    };

    // Initial setup
    setTimeout(() => {
      forceSectionLayout();
      lastPageHeight = document.documentElement.scrollHeight;
      maxPageHeight = lastPageHeight;
      checkPageHeight();
    }, 1000);
    
    // Prevent overscroll on mobile (rubber band effect)
    const preventOverscroll = (e: Event) => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;
      const maxScroll = scrollHeight - clientHeight;
      
      // Prevent scrolling beyond bounds
      if (scrollTop < 0) {
        window.scrollTo({ top: 0, behavior: 'auto' });
        e.preventDefault();
      } else if (scrollTop > maxScroll) {
        window.scrollTo({ top: maxScroll, behavior: 'auto' });
        e.preventDefault();
      }
    };
    
    // Use touchmove for mobile to prevent overscroll
    if (isMobile) {
      document.addEventListener('touchmove', preventOverscroll, { passive: false });
      window.addEventListener('scroll', preventOverscroll, { passive: false });
    }
    
    // Monitor continuously
    let checkInterval = setInterval(() => {
      checkPageHeight();
      // Re-apply fixes every 500ms
      if (scrollCount % 3 === 0) {
        forceSectionLayout();
      }
    }, 200);
    
    // Also check on scroll
    let scrollTimeout: NodeJS.Timeout;
    const scrollHandler = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        checkPageHeight();
        forceSectionLayout();
      }, 50);
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    return () => {
      clearInterval(checkInterval);
      window.removeEventListener('scroll', scrollHandler);
      if (isMobile) {
        document.removeEventListener('touchmove', preventOverscroll);
        window.removeEventListener('scroll', preventOverscroll);
      }
      clearTimeout(scrollTimeout);
    };
  }, [showContent]);
  // #endregion

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen />}
      </AnimatePresence>
      
      {showContent && (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative">
          {/* #region agent log */}
          {(() => {
            fetch('http://127.0.0.1:7244/ingest/c818746c-bbef-418c-90d3-3e01ae399c6e', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                location: 'app/page.tsx:render',
                message: 'Content rendered',
                data: { showContent, isLoading },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'E'
              })
            }).catch(() => {});
            return null;
          })()}
          {/* #endregion */}
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

