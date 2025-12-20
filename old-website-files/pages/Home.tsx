import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Comparison from "../components/Comparison";
import Solutions from "../components/Solutions";
import Benefits from "../components/Benefits";
import Process from "../components/Process";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import MagicRibbon from "../components/MagicRibbon";
import LoadingScreen from "../components/LoadingScreen";
import SEOHead from "../components/SEOHead";
import CookieConsent from "../components/CookieConsent";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content immediately but keep loading screen visible
    setShowContent(true);

    let starIframeLoaded = false;
    let overlapIframeLoaded = false;

    // Function to check if both iframes are loaded
    const checkIframesLoaded = () => {
      if (starIframeLoaded && overlapIframeLoaded) {
        // Wait 1 additional second after iframes load
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    // Listen for iframe load events
    const handleStarIframeLoad = () => {
      starIframeLoaded = true;
      checkIframesLoaded();
    };

    const handleOverlapIframeLoad = () => {
      overlapIframeLoaded = true;
      checkIframesLoaded();
    };

    // Set up global iframe loaded callback
    (window as any).iframeLoaded = (iframeId: string) => {
      if (iframeId === 'zite-star-iframe') {
        handleStarIframeLoad();
      } else if (iframeId === 'zite-overlap-iframe') {
        handleOverlapIframeLoad();
      }
    };

    // Fallback timeout in case iframes fail to load
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      clearTimeout(fallbackTimer);
      delete (window as any).iframeLoaded;
    };
  }, []);

  return (
    <>
      <SEOHead />
      <CookieConsent />
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen />}
      </AnimatePresence>
      
      {showContent && (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
          <Navbar />
          <div className="relative">
            <MagicRibbon />
            <div className="relative">
              <Hero />
              <div className="relative z-10">
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

