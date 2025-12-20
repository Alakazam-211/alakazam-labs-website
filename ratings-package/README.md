# Testimonials & Ratings Package

A complete, reusable package for displaying testimonials with star ratings on your Next.js website. Includes beautiful glassmorphic components, API integration, and multiple display options.

## Features

- ⭐ Beautiful glassmorphic star rating component
- 💬 Multiple testimonial display components (Cards, Overlapped Avatars, Review Bubbles)
- 📊 Fetches testimonials with ratings from Fillout/Zite Tables API
- 🚀 Optimized with caching and hash-based change detection
- 📱 Fully responsive design with mobile optimizations
- 🎨 Customizable glassmorphic styling
- 🖱️ Interactive hover and click effects

## Installation

1. **Copy the files to your Next.js project:**

   - Copy `components/testimonials/` folder to your `components` directory
   - Copy `components/ui/avatar.tsx` to your `components/ui` directory
   - Copy `app/api/testimonials/route.ts` to your `app/api/testimonials` directory
   - Copy the CSS from `styles/testimonials.css` to your global CSS file (e.g., `app/globals.css`) - this includes all styles for stars, avatars, and review bubbles

2. **Install dependencies** (if not already installed):

   ```bash
   npm install next react react-dom
   ```

   The components use built-in Next.js and React features and don't require additional dependencies.

3. **Set up environment variables:**

   Copy `.env.example` to `.env.local` in your project root and fill in your Fillout/Zite API credentials:

   ```env
   FILLOUT_TESTIMONIALS_API_KEY=your_api_key_here
   FILLOUT_BASE_URL=https://tables.fillout.com/api/v1
   FILLOUT_TESTIMONIALS_DB_ID=your_database_id
   FILLOUT_COLLECTIONS_TABLE_ID=your_collections_table_id
   FILLOUT_COLLECTION_TESTIMONIALS_TABLE_ID=your_collection_testimonials_table_id
   FILLOUT_TESTIMONIALS_TABLE_ID=your_testimonials_table_id
   ```

   **For Vercel deployment:** Add these environment variables in your Vercel project settings under Environment Variables.

## Components Included

### 1. StarRating
Displays a beautiful star rating with optional numeric value.

### 2. TestimonialCard
A full testimonial card component showing avatar, name, rating, and review text.

### 3. OverlappedAvatars
Interactive overlapped avatar display that shows review bubbles on click/hover.

### 4. ReviewBubble
A popup bubble that displays full testimonial details when clicking avatars.

## Usage Examples

### Basic Star Rating Display

```tsx
import StarRating from '@/components/testimonials/StarRating';

export default function MyComponent() {
  const rating = 4.5;
  
  return (
    <div>
      <StarRating rating={rating} size="lg" />
    </div>
  );
}
```

### Complete Testimonials Section with Average Rating

```tsx
'use client';

import { useState, useEffect } from 'react';
import StarRating from '@/components/testimonials/StarRating';
import OverlappedAvatars from '@/components/testimonials/OverlappedAvatars';

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
  order?: number;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data.testimonials || []);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Calculate average rating
  const averageRating = testimonials.length > 0
    ? testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length
    : 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {isLoading ? (
        <p>Loading testimonials...</p>
      ) : testimonials.length > 0 ? (
        <>
          {/* Star Rating - Centered at top */}
          <div className="mb-8 flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <StarRating rating={averageRating} size="lg" />
              <p className="text-sm text-gray-600">
                Based on {testimonials.length} {testimonials.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>

          {/* Overlapped Avatars - Click to see reviews */}
          <div className="flex justify-center">
            <OverlappedAvatars testimonials={testimonials} maxVisible={10} size="md" />
          </div>
        </>
      ) : (
        <p>No testimonials available.</p>
      )}
    </div>
  );
}
```

### Display Testimonials as Cards

```tsx
'use client';

import { useState, useEffect } from 'react';
import TestimonialCard from '@/components/testimonials/TestimonialCard';

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

export default function TestimonialsGrid() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data.testimonials || []);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))
      )}
    </div>
  );
}
```

## Component Props

### StarRating

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rating` | `number` | Required | The rating value to display (0-5) |
| `maxRating` | `number` | `5` | Maximum rating value |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the stars |

### TestimonialCard

| Prop | Type | Description |
|------|------|-------------|
| `testimonial` | `Testimonial` | Required | Testimonial object with all fields |

### OverlappedAvatars

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `testimonials` | `Testimonial[]` | Required | Array of testimonials |
| `maxVisible` | `number` | `10` | Maximum number of avatars to show |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the avatars |

### ReviewBubble

This component is used internally by `OverlappedAvatars` and typically doesn't need to be used directly.

## API Endpoint

### GET `/api/testimonials`

Returns a JSON response with testimonials data:

```json
{
  "testimonials": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "rating": 5,
      "text": "string",
      "photo": ["url1", "url2"],
      "job": "string",
      "company": "string",
      "website": "string",
      "order": 0
    }
  ]
}
```

The API includes:
- **Caching**: Responses are cached for 5 minutes
- **Hash-based change detection**: Only fetches full data when testimonials change
- **Collection filtering**: Only returns testimonials from the "DNC Reviews Collection"
- **Automatic sorting**: Testimonials are sorted by the `order` field

## Styling

The components use Tailwind CSS classes and custom CSS classes. Make sure to include the CSS from `styles/testimonials.css` in your global stylesheet. This single CSS file contains all the styles needed for:
- Star ratings (`.glass-star`, `.glass-star-filled`, `.glass-star-empty`)
- Overlapped avatars (`.glass-avatar`, `.glass-avatar-fallback`)
- Review bubbles (`.review-bubble`)
- Glass base styles (`.glass`)
- Mobile optimizations

The components are designed to work with a glassmorphic design system featuring:
- Glass-like appearance with backdrop blur
- Smooth hover and click animations
- Responsive sizing for mobile and desktop
- Yellow stars for ratings
- Gradient fallbacks for avatars without photos

## Customization

You can customize the appearance by modifying:
- The CSS classes in `styles/testimonials.css`
- The color values in the components (currently uses `text-yellow-400` for filled stars)
- The size classes in the components
- The glass effect opacity and blur values in the CSS

## Mobile Optimizations

The package includes mobile-specific optimizations:
- Touch-friendly avatar interactions
- Reduced backdrop blur on mobile for better performance
- Responsive sizing for all components
- Mobile-optimized review bubble positioning

## Notes

- The API route expects a collection named "DNC Reviews Collection" in your Fillout/Zite database
- Testimonials are automatically sorted by the `order` field
- The components require Tailwind CSS to be configured in your project
- Make sure your Next.js project is using the App Router (not Pages Router)
- Avatar images fall back to gradient backgrounds with initials if photos fail to load

## Support

For issues or questions, refer to your Fillout/Zite API documentation or contact your development team.


