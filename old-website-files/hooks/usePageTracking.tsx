import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

export const usePageTracking = () => {
  const location = useLocation();

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
          page: location.pathname,
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
  }, [location.pathname]);
};

