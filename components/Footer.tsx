'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Rocket } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';

// Dynamically import LaserFlow with SSR disabled
const LaserFlow = dynamic(() => import('@/components/LaserFlow'), {
  ssr: false,
  loading: () => null,
});

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const newsletterRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);
  const [separator1Top, setSeparator1Top] = useState<number>(0);
  const [separator2Top, setSeparator2Top] = useState<number>(0);

  const footerLinks = [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const updateSeparatorPositions = () => {
      if (newsletterRef.current && copyrightRef.current) {
        const footer = newsletterRef.current.closest('footer');
        if (footer) {
          const footerTop = footer.getBoundingClientRect().top;
          const newsletterTop = newsletterRef.current.getBoundingClientRect().top;
          const copyrightTop = copyrightRef.current.getBoundingClientRect().top;
          
          // Position relative to footer (separators are siblings of laser container)
          setSeparator1Top(newsletterTop - footerTop);
          setSeparator2Top(copyrightTop - footerTop);
        }
      }
    };

    updateSeparatorPositions();
    window.addEventListener('resize', updateSeparatorPositions);
    
    // Also update after a short delay to account for any dynamic content loading
    const timeout = setTimeout(updateSeparatorPositions, 100);

    return () => {
      window.removeEventListener('resize', updateSeparatorPositions);
      clearTimeout(timeout);
    };
  }, [email, submitStatus]);



  return (
    <footer className="relative mt-8 sm:mt-12 md:mt-16 overflow-visible">
      {/* Separator lines - positioned below laser beam (z-[1]) */}
      {separator1Top > 0 && (
        <div 
          className="absolute left-0 right-0 z-[1] pointer-events-none hidden md:block" 
          style={{ top: `${separator1Top}px` }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-px bg-border"></div>
          </div>
        </div>
      )}
      {separator2Top > 0 && (
        <div 
          className="absolute left-0 right-0 z-[1] pointer-events-none hidden md:block" 
          style={{ top: `${separator2Top}px` }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-px bg-border"></div>
          </div>
        </div>
      )}
      
      {/* LaserFlow background - positioned at top of footer - extends upward to use all space above - hidden on mobile, visible on tablet and desktop */}
      <div 
        className="absolute pointer-events-none z-[2] hidden md:block" 
        style={{ 
          // Extend upward significantly - 3000px should cover most page heights
          top: '-3000px',
          left: 0, 
          right: 0,
          width: '100%',
          height: 'calc(100% + 3000px)'
        }}
      >
        <div className="absolute inset-0" style={{ width: '100%', height: '100%' }}>
          <LaserFlow
            horizontalBeamOffset={0}
            verticalBeamOffset={-0.5}
            color="#CF9EFF"
          />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 sm:pb-10 relative z-[3]">
        {/* Let's Work Together Section - Top, Full Width */}
        <div className="mb-12 sm:mb-16 md:mb-20 text-center">
          <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-foreground">
            Let's Work Together
          </h4>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/book" className="inline-block w-full sm:w-auto">
              <Button className="gold-shimmer-strong bg-accent text-accent-foreground hover:bg-accent border-2 border-accent focus-visible:ring-0 w-full sm:w-auto text-sm sm:text-base group flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Book Workshop
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href="/rnd" className="inline-block w-full sm:w-auto">
              <Button variant="outline" className="border-2 border-accent/50 text-accent hover:bg-accent/10 hover:text-accent bg-transparent w-full sm:w-auto text-sm sm:text-base group flex items-center justify-center gap-1.5">
                <Rocket className="w-3.5 h-3.5" />
                Start R&D
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
          <p className="text-sm mt-4 text-muted-foreground md:inline-block md:px-3 md:py-1.5 md:rounded-md md:backdrop-blur md:border md:border-border md:[background-color:hsl(var(--card)/0.45)]">
            <Link 
              href="/terms" 
              className="hover:underline transition-all"
            >
              30-day money back guarantee<sup className="text-accent">*</sup>
            </Link>
          </p>
        </div>

        {/* Alakazam and Quick Links - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10">
          {/* Logo & Description Section */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3 sm:mb-4">
              <img 
                src="https://images.fillout.com/orgid-432324/flowpublicid-g4lnna3r1f/widgetid-default/ccWejnUFvPJNvouSVsiL33/pasted-image-1759716559888.png" 
                alt="Alakazam Labs Logo" 
                className="h-8 w-auto" 
              />
            </Link>
            <p className="text-sm sm:text-base leading-relaxed max-w-md" style={{ color: 'rgba(255, 250, 240, 0.9)' }}>
              Professional AI solutions delivered in hours, not months. Transform your business with production-ready apps.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="md:text-right">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm sm:text-base transition-colors block hover:text-accent"
                    style={{ color: 'rgba(255, 250, 240, 0.9)' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section - Bottom, Full Width */}
        <div ref={newsletterRef} className="pt-6 sm:pt-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] md:grid-rows-[auto_auto] gap-4 mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground md:col-start-1 md:row-start-1">
              Join our newsletter
            </h3>
            <p className="text-sm sm:text-base leading-relaxed max-w-xl md:col-start-1 md:row-start-2" style={{ color: 'rgba(255, 250, 240, 0.9)' }}>
              Subscribe to the Discover NoCode newsletter for updates on AI solutions, new features, and business automation tips.
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email || isSubmitting) return;

                setIsSubmitting(true);
                setSubmitStatus(null);
                setErrorMessage("");

                try {
                  const response = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                  });

                  const data = await response.json();

                  if (!response.ok) {
                    throw new Error(data.error || 'Failed to subscribe');
                  }

                  setSubmitStatus("success");
                  setEmail("");
                  setTimeout(() => setSubmitStatus(null), 5000);
                } catch (error) {
                  console.error("Newsletter subscription error:", error);
                  const errMsg = error instanceof Error ? error.message : "Something went wrong. Please try again.";
                  setErrorMessage(errMsg);
                  setSubmitStatus("error");
                  setTimeout(() => {
                    setSubmitStatus(null);
                    setErrorMessage("");
                  }, 5000);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="bg-card/80 backdrop-blur rounded-xl p-3 sm:p-4 border border-border max-w-2xl w-full md:w-auto md:min-w-[500px] md:col-start-2 md:row-start-1 md:row-span-2 md:self-start"
            >
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm w-full bg-background/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  required
                />
                <Button
                  type="submit"
                  className="gold-shimmer-strong bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto text-sm whitespace-nowrap disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Subscribing..." : submitStatus === "success" ? "Subscribed!" : "Subscribe"}
                </Button>
              </div>
              {submitStatus === "success" && (
                <p className="text-xs text-green-400 mt-3 text-center sm:text-right">
                  Successfully subscribed! Check your email.
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-xs text-red-400 mt-3 text-center sm:text-right">
                  {errorMessage || "Something went wrong. Please try again."}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Copyright & Links */}
        <div ref={copyrightRef} className="mt-8 sm:mt-10 pt-6 sm:pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs sm:text-sm text-center sm:text-left" style={{ color: 'rgba(255, 250, 240, 0.9)' }}>
                © 2025 LZTEK, LLC dba Alakazam Labs.
              </p>
              <p className="text-xs text-center sm:text-left" style={{ color: 'rgba(255, 250, 240, 0.85)' }}>
                Software built with Alakazam is proudly hosted by LZTEK, LLC.
              </p>
            </div>
            <div className="flex gap-6 text-xs sm:text-sm" style={{ color: 'rgba(255, 250, 240, 0.9)' }}>
              <Link href="https://lztek.io" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                LZTEK
              </Link>
              <Link href="/terms" className="hover:text-accent transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-accent transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
