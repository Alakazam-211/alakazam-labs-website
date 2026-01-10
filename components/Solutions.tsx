'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Solutions() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);

  // #region agent log
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    const logEndpoint = 'http://127.0.0.1:7244/ingest/c818746c-bbef-418c-90d3-3e01ae399c6e';
    
    const sendLog = (data: any) => {
      fetch(logEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {
        console.log('[DEBUG Solutions]', data.message, data.data);
      });
    };

    const checkStyles = () => {
      const styles = window.getComputedStyle(section);
      const rect = section.getBoundingClientRect();
      
      sendLog({
        location: 'components/Solutions.tsx:useEffect',
        message: 'Solutions component styles check',
        data: {
          component: 'Solutions',
          isInViewport: rect.top < window.innerHeight && rect.bottom > 0,
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
          contentVisibility: styles.contentVisibility,
          contain: styles.contain,
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          transform: styles.transform,
          willChange: styles.willChange,
          isMobile
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'B'
      });
    };

    checkStyles();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        sendLog({
          location: 'components/Solutions.tsx:IntersectionObserver',
          message: 'Solutions intersection change',
          data: {
            component: 'Solutions',
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio,
            boundingClientRect: {
              top: Math.round(entry.boundingClientRect.top),
              bottom: Math.round(entry.boundingClientRect.bottom)
            },
            isMobile
          },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'D'
        });
      });
    }, { threshold: [0, 0.1, 0.5, 1] });

    observer.observe(section);
    
    let scrollTimeout: NodeJS.Timeout;
    const scrollHandler = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkStyles, 100);
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scrollHandler);
      clearTimeout(scrollTimeout);
    };
  }, []);
  // #endregion

  const paths = [
    {
      title: "Book Workshop",
      description: "Join us for a hands-on workshop session where we'll build a working prototype together. Perfect for those who want to see the magic happen in real-time.",
      features: [
        "Interactive workshop session",
        "Working prototype built live",
        "Learn as we build",
        "Immediate results"
      ],
      cta: "Book Workshop",
      highlight: true,
      action: () => router.push('/book'),
      icon: Sparkles
    },
    {
      title: "Start R&D",
      description: "Submit your idea and we'll make sure it's possible with AI before you build. Keep the research and use it with us to build or someone else.",
      features: [
        "Submit your idea via form",
        "Dedicated R&D process",
        "Clarity on feasibility and cost",
        "Proof of concept"
      ],
      cta: "Start R&D",
      highlight: false,
      action: () => router.push('/rnd'),
      icon: Rocket
    }
  ];

  return (
    <section ref={sectionRef} id="solutions" className="py-24 relative bg-gradient-to-b from-transparent via-muted/10 to-transparent">
      <div className="absolute inset-0 aura-gradient opacity-50" />
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Pick your <span className="gradient-text">Path</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {paths.map((path, i) => (
            <div key={i}>
              <Card className={`p-8 h-full flex flex-col ${
                path.highlight 
                  ? 'bg-card/80 backdrop-blur border-accent/50 gold-shimmer' 
                  : 'bg-card/50 backdrop-blur hover:border-accent/30'
              } transition-colors`}>
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{path.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {path.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {path.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ArrowRight className="w-5 h-5 text-accent mt-0 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  size="lg" 
                  onClick={path.action}
                  className={`w-full ${
                    path.highlight 
                      ? 'gold-shimmer-strong bg-accent text-accent-foreground hover:bg-accent border-2 border-accent focus-visible:ring-0' 
                      : 'border-2 border-accent/50 text-accent hover:bg-accent/10 hover:text-accent bg-transparent'
                  }`}
                >
                  {path.icon && <path.icon className="mr-2 w-4 h-4" />}
                  {path.cta}
                </Button>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
