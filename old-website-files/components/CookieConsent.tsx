import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackPageView } from 'zite-endpoints-sdk';

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('session-id');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session-id', sessionId);
  }
  return sessionId;
};

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    
    // Track current page immediately in the background
    trackPageView({
      page: window.location.pathname,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      sessionId: getSessionId(),
    }).catch(error => {
      console.error('Failed to track page view:', error);
    });
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[10000] p-4 md:p-6"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">We Value Your Privacy</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We use cookies and analytics to improve your experience and understand how you use our site. 
                    By clicking "Accept", you consent to our use of cookies. Read our{' '}
                    <a href="/privacy" className="text-accent hover:underline">
                      Privacy Policy
                    </a>{' '}
                    to learn more.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleAccept}
                      className="gold-shimmer-strong bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={handleDecline}
                      variant="outline"
                      className="border-border hover:bg-muted hover:text-foreground"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
                <button
                  onClick={handleDecline}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

