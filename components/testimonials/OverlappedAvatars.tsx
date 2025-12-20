'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ReviewBubble from './ReviewBubble';

interface Testimonial {
  id: string;
  name: string;
  photo: string[];
  rating: number;
  text?: string;
  job?: string;
  company?: string;
  order?: number;
}

interface OverlappedAvatarsProps {
  testimonials: Testimonial[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function OverlappedAvatars({ 
  testimonials, 
  maxVisible = 10,
  size = 'md' 
}: OverlappedAvatarsProps) {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [bubblePosition, setBubblePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const avatarRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                             (typeof window !== 'undefined' && window.innerWidth < 768);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Ensure testimonials are sorted by order field from database
  const sortedTestimonials = [...testimonials].sort((a, b) => (a.order || 0) - (b.order || 0));
  const visible = sortedTestimonials.slice(0, maxVisible);
  const remaining = sortedTestimonials.length - maxVisible;

  const sizeClasses = {
    sm: 'w-6 h-6 sm:w-8 sm:h-8',
    md: 'w-10 h-10 sm:w-12 sm:h-12',
    lg: 'w-12 h-12 sm:w-16 sm:h-16',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarUrl = (photo: string[]) => {
    if (!photo || photo.length === 0) return null;
    const firstPhoto = photo[0];
    if (typeof firstPhoto === 'string') {
      return firstPhoto;
    }
    if (typeof firstPhoto === 'object' && firstPhoto !== null && 'url' in firstPhoto) {
      return (firstPhoto as any).url;
    }
    return null;
  };

  const handleAvatarClick = useCallback((testimonial: Testimonial, index: number, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Remove hover state immediately to prevent scale changes
    setHoveredIndex(null);
    setClickedIndex(index);
    
    // Get the avatar element
    const avatarElement = avatarRefs.current.get(testimonial.id) || (event.currentTarget as HTMLElement);
    const outerContainer = outerContainerRef.current;
    const avatarContainer = avatarContainerRef.current;
    
    if (!outerContainer || !avatarContainer) return;
    
    // Temporarily disable transitions to get accurate position
    const originalTransition = avatarElement.style.transition;
    avatarElement.style.transition = 'none';
    avatarElement.style.transform = 'scale(1)';
    
    // Force a reflow to ensure the element is at scale(1)
    void avatarElement.offsetHeight;
    
    // Calculate position relative to the outer container (where the bubble will be positioned)
    const containerRect = outerContainer.getBoundingClientRect();
    
    let bubblePos: { x: number; y: number };
    
    if (isMobile) {
      // On mobile: center the bubble beneath all avatars
      const avatarContainerRect = avatarContainer.getBoundingClientRect();
      const centerX = (avatarContainerRect.left - containerRect.left) + avatarContainerRect.width / 2;
      const bottomY = (avatarContainerRect.bottom - containerRect.top) + 8; // 8px below avatars
      bubblePos = { x: centerX, y: bottomY };
    } else {
      // On desktop: position beneath the clicked avatar
      const avatarRect = avatarElement.getBoundingClientRect();
      const centerX = (avatarRect.left - containerRect.left) + avatarRect.width / 2;
      const topY = (avatarRect.top - containerRect.top) + avatarRect.height;
      bubblePos = { x: centerX, y: topY };
    }
    
    // Restore transition
    avatarElement.style.transition = originalTransition;
    avatarElement.style.transform = '';
    
    // Set position and show bubble synchronously to prevent hopping
    setBubblePosition(bubblePos);
    setSelectedTestimonial(testimonial);
  }, [isMobile]);

  const handleTouchStart = useCallback((testimonial: Testimonial, index: number, event: React.TouchEvent) => {
    handleAvatarClick(testimonial, index, event);
  }, [handleAvatarClick]);
  
  const handleClose = useCallback(() => {
    setSelectedTestimonial(null);
    setClickedIndex(null);
    setHoveredIndex(null);
  }, []);

  return (
    <div ref={outerContainerRef} className="bg-transparent pb-0 relative">
      <div className="flex justify-center px-2 sm:px-0">
        <div ref={avatarContainerRef} className="relative flex -space-x-1.5 sm:-space-x-2">
          {visible.map((testimonial, index) => {
            const avatarUrl = getAvatarUrl(testimonial.photo);
            const isSelected = selectedTestimonial?.id === testimonial.id;
            const isHovered = hoveredIndex === index && !isSelected && !isMobile;
            const isClicked = clickedIndex === index;
            
            return (
              <Avatar
                key={testimonial.id}
                ref={(el) => {
                  if (el) {
                    avatarRefs.current.set(testimonial.id, el);
                  } else {
                    avatarRefs.current.delete(testimonial.id);
                  }
                }}
                className={`${sizeClasses[size]} glass-avatar cursor-pointer touch-manipulation ${
                  isSelected ? 'selected' : ''
                }`}
                onClick={(e) => handleAvatarClick(testimonial, index, e)}
                onTouchStart={(e) => handleTouchStart(testimonial, index, e)}
                onMouseEnter={() => {
                  if (!isSelected && !isMobile) {
                    setHoveredIndex(index);
                  }
                }}
                onMouseLeave={() => {
                  if (!isSelected && !isMobile) {
                    setHoveredIndex(null);
                  }
                }}
                style={{ 
                  zIndex: isSelected || isHovered ? 50 : index + 1,
                  transform: isClicked || isSelected ? 'scale(1)' : undefined,
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <AvatarImage 
                  src={avatarUrl || undefined} 
                  alt={testimonial.name}
                  className="opacity-90"
                />
                <AvatarFallback className="glass-avatar-fallback font-semibold font-sans">
                  {getInitials(testimonial.name)}
                </AvatarFallback>
              </Avatar>
            );
          })}
          {remaining > 0 && (
            <div className={`${sizeClasses[size]} rounded-full glass-avatar flex items-center justify-center text-xs sm:text-sm font-medium text-gray-600 font-sans`}>
              +{remaining}
            </div>
          )}
        </div>
      </div>
      
      {selectedTestimonial && (
        <ReviewBubble
          testimonial={selectedTestimonial}
          position={bubblePosition}
          onClose={handleClose}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}

