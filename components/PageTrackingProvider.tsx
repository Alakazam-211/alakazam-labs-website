'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/zite-endpoints-sdk';

// Generate or retrieve session ID
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  let sessionId = sessionStorage.getItem('session-id');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session-id', sessionId);
  }
  return sessionId;
};

export function PageTrackingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Check if user has accepted cookies
    const consent = localStorage.getItem('cookie-consent');
    
    if (consent !== 'accepted') {
      // Don't track if user hasn't accepted or has declined
      return;
    }

    // Track the page view
    const trackView = async () => {
      try {
        await trackPageView({
          page: pathname,
          referrer: document.referrer || 'direct',
          userAgent: navigator.userAgent,
          sessionId: getSessionId(),
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.error('Failed to track page view:', error);
      }
    };

    trackView();
  }, [pathname]);

  return <>{children}</>;
}

