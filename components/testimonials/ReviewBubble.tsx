'use client';

import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Testimonial {
  id: string;
  name: string;
  job?: string;
  company?: string;
  text?: string;
  rating?: number;
  photo?: string[];
}

interface ReviewBubbleProps {
  testimonial: Testimonial;
  position: { x: number; y: number };
  onClose: () => void;
  isMobile?: boolean;
}

export default function ReviewBubble({ testimonial, position, onClose, isMobile = false }: ReviewBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [stablePosition, setStablePosition] = useState(position);
  const [isMounted, setIsMounted] = useState(false);

  // Lock position once set - don't update on scroll or position changes
  useLayoutEffect(() => {
    // Set position immediately on mount, don't wait
    if (position.x !== 0 || position.y !== 0) {
      setStablePosition(position);
      setIsMounted(true);
    }
  }, [position]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose]);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPhotoUrl = (photo?: string[]) => {
    if (!photo || photo.length === 0) return undefined;
    const firstPhoto = photo[0];
    if (typeof firstPhoto === 'string') {
      return firstPhoto;
    }
    if (typeof firstPhoto === 'object' && firstPhoto !== null && 'url' in firstPhoto) {
      return (firstPhoto as any).url;
    }
    return undefined;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  // Don't render until position is stable and valid
  if (!isMounted || (stablePosition.x === 0 && stablePosition.y === 0)) {
    return null;
  }

  // Calculate responsive width and positioning
  // On mobile and desktop, use absolute positioning relative to container (scrolls with page)
  const bubbleStyle = isMobile ? {
    position: 'absolute' as const,
    width: '85vw',
    maxWidth: '85vw',
    maxHeight: 'calc(100vh - 8rem)',
    overflowY: 'auto' as const,
    // Position relative to container (like desktop)
    left: `${stablePosition.x}px`,
    top: `${stablePosition.y + 8}px`,
    transform: 'translateX(-50%)',
    opacity: 1,
    zIndex: 9999
  } : {
    position: 'absolute' as const,
    width: '300px',
    left: `${stablePosition.x}px`,
    top: `${stablePosition.y + 12}px`,
    transform: 'translateX(-50%)',
    animation: 'fadeInZoom 0.2s ease-out',
    opacity: 1
  };

  const bubbleContent = (
    <div
      ref={bubbleRef}
      className="review-bubble rounded-3xl p-3 sm:p-4 font-sans relative"
      style={bubbleStyle}
    >
      {/* Diamond pointer - only show on desktop */}
      {!isMobile && (
        <div className="review-bubble-diamond absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
          <div className="review-bubble-diamond-inner"></div>
        </div>
      )}
      
      {/* Close button for mobile - enhanced styling */}
      {isMobile && (
        <button
          onClick={onClose}
          className="review-bubble-close absolute top-2 right-2 z-20"
          aria-label="Close review"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2 sm:gap-3 pr-6 sm:pr-0">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-white/40 shadow-lg flex-shrink-0">
            <AvatarImage src={getPhotoUrl(testimonial.photo)} />
            <AvatarFallback className="bg-gradient-to-br from-blue-400/80 to-purple-500/80 backdrop-blur-sm text-white">
              {getInitials(testimonial.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-foreground font-sans truncate text-left">{testimonial.name || 'Anonymous'}</h3>
            {testimonial.job && testimonial.company && (
              <p className="text-xs sm:text-sm text-muted-foreground font-sans truncate text-left">
                {testimonial.job} at {testimonial.company}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0">
          {renderStars(testimonial.rating || 0)}
        </div>
        
        <blockquote className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans text-left">
          "{testimonial.text || 'No review text available'}"
        </blockquote>
      </div>
    </div>
  );

  // Render normally - absolute positioning relative to parent container (scrolls with page)
  return bubbleContent;
}

