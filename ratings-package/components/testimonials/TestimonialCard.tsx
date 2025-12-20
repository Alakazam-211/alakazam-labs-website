'use client';

import StarRating from './StarRating';

interface Testimonial {
  id: string;
  name: string;
  email: string;
  rating: number;
  text: string;
  photo: string[];
  job?: string;
  company?: string;
  website?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarUrl = getAvatarUrl(testimonial.photo);

  return (
    <div className="glass rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] font-sans">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={testimonial.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-br from-blue-400/80 to-purple-500/80 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-lg border-2 border-white/40 shadow-lg ${
              avatarUrl ? 'hidden' : ''
            }`}
          >
            {getInitials(testimonial.name)}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 font-sans">
                {testimonial.name}
              </h3>
              {(testimonial.job || testimonial.company) && (
                <p className="text-sm text-gray-600 font-sans">
                  {[testimonial.job, testimonial.company].filter(Boolean).join(' at ')}
                </p>
              )}
            </div>
          </div>
          
          <div className="mb-3">
            <StarRating rating={testimonial.rating} />
          </div>
          
          <p className="text-gray-700 leading-relaxed font-sans">{testimonial.text}</p>
          
          {testimonial.website && (
            <a
              href={testimonial.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block font-sans transition-colors"
            >
              Visit website →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}


