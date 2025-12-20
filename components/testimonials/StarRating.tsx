'use client';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ rating, maxRating = 5, size = 'md' }: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 sm:w-5 sm:h-5',
    md: 'w-5 h-5 sm:w-6 sm:h-6',
    lg: 'w-6 h-6 sm:w-7 sm:h-7',
  };

  const textSizeClasses = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  };

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 font-sans">
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
        <div
          key={star}
          className={`${sizeClasses[size]} rounded-full glass-star flex items-center justify-center p-0.5 ${
            star <= rating ? 'glass-star-filled' : 'glass-star-empty'
          }`}
        >
          <svg
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300/60'
            } fill-current`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        </div>
      ))}
      {rating > 0 && (
        <span className={`ml-1.5 sm:ml-2 font-bold text-foreground font-sans ${textSizeClasses[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

