import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Configure route caching - revalidate every 5 minutes
export const revalidate = 300;

const API_KEY = process.env.FILLOUT_TESTIMONIALS_API_KEY || '';
const BASE_URL = process.env.FILLOUT_BASE_URL || 'https://tables.fillout.com/api/v1';
const DB_ID = process.env.FILLOUT_TESTIMONIALS_DB_ID || '';
const COLLECTIONS_TABLE = process.env.FILLOUT_COLLECTIONS_TABLE_ID || '';
const COLLECTION_TESTIMONIALS_TABLE = process.env.FILLOUT_COLLECTION_TESTIMONIALS_TABLE_ID || '';
const TESTIMONIALS_TABLE = process.env.FILLOUT_TESTIMONIALS_TABLE_ID || '';

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

// Cache the collection ID to avoid repeated lookups
let cachedCollectionId: string | null = null;
let collectionIdCacheTime: number = 0;
const COLLECTION_CACHE_TTL = 3600000; // 1 hour

// Generate a hash from testimonial IDs and order for change detection
function generateDataHash(collectionTestimonials: any[]): string {
  const hashData = collectionTestimonials
    .map((ct: any) => {
      const testimonialId = Array.isArray(ct.fields?.Testimonial) 
        ? ct.fields.Testimonial[0] 
        : Array.isArray(ct.data?.Testimonial)
        ? ct.data.Testimonial[0]
        : ct.fields?.Testimonial || ct.data?.Testimonial;
      const order = ct.fields?.Order ?? ct.data?.Order ?? 0;
      return `${testimonialId}:${order}`;
    })
    .sort()
    .join('|');
  
  return crypto.createHash('md5').update(hashData).digest('hex');
}

export async function GET() {
  // Enable caching for this route (revalidate every 5 minutes)
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  };
  try {
    // Validate environment variables
    if (!API_KEY || !DB_ID || !COLLECTIONS_TABLE || !COLLECTION_TESTIMONIALS_TABLE || !TESTIMONIALS_TABLE) {
      return NextResponse.json(
        { error: 'Missing required environment variables' },
        { status: 500 }
      );
    }

    // Step 1: Find "DNC Reviews Collection" - use cache if available
    let collectionId: string;
    const now = Date.now();
    
    if (cachedCollectionId && (now - collectionIdCacheTime) < COLLECTION_CACHE_TTL) {
      collectionId = cachedCollectionId;
    } else {
      const collectionsResponse = await fetch(
        `${BASE_URL}/bases/${DB_ID}/tables/${COLLECTIONS_TABLE}/records/list`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filters: {
              name: {
                contains: 'DNC Reviews'
              }
            },
            limit: 10
          }),
        }
      );

      if (!collectionsResponse.ok) {
        const errorText = await collectionsResponse.text();
        return NextResponse.json(
          { error: 'Failed to fetch collections', details: errorText },
          { status: collectionsResponse.status }
        );
      }

      const collectionsData = await collectionsResponse.json();
      const collections = collectionsData.records || [];
      
      // Find the DNC Reviews Collection
      const dncCollection = collections.find((c: any) => 
        c.fields?.name?.includes('DNC Reviews') || c.fields?.name === 'DNC Reviews Collection'
      );

      if (!dncCollection) {
        return NextResponse.json(
          { error: 'DNC Reviews Collection not found', availableCollections: collections.map((c: any) => c.fields?.name) },
          { status: 404 }
        );
      }

      collectionId = dncCollection.id;
      cachedCollectionId = collectionId;
      collectionIdCacheTime = now;
    }

    // Step 2: First, fetch only collection testimonials to check for changes (lightweight)
    // This is much faster than fetching all testimonials
    const collectionTestimonialsResponse = await fetch(
      `${BASE_URL}/bases/${DB_ID}/tables/${COLLECTION_TESTIMONIALS_TABLE}/records/list`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filters: {
            Collection: {
              in: [collectionId]
            }
          },
          limit: 100
        }),
      }
    );

    if (!collectionTestimonialsResponse.ok) {
      const errorText = await collectionTestimonialsResponse.text();
      return NextResponse.json(
        { error: 'Failed to fetch collection testimonials', details: errorText },
        { status: collectionTestimonialsResponse.status, headers }
      );
    }

    const collectionTestimonialsData = await collectionTestimonialsResponse.json();
    const collectionTestimonials = collectionTestimonialsData.records || [];

    if (collectionTestimonials.length === 0) {
      return NextResponse.json({ testimonials: [] }, { headers });
    }

    // Step 3: Generate hash from current data to detect changes
    const currentHash = generateDataHash(collectionTestimonials);
    
    // Check if we have cached data with this hash
    let cachedHash: string | null = null;
    
    try {
      // Use a simple in-memory cache for hash comparison
      // In production, you might want to use Redis or similar for multi-instance deployments
      const cacheKey = `testimonials-${collectionId}`;
      const cacheEntry = (globalThis as any).__testimonialsCache?.[cacheKey];
      
      if (cacheEntry && cacheEntry.hash === currentHash) {
        // Hash matches - data hasn't changed, return cached result
        return NextResponse.json(
          { testimonials: cacheEntry.data },
          { 
            headers: {
              ...headers,
              'X-Cache': 'HIT',
              'X-Data-Hash': currentHash
            }
          }
        );
      }
      
      // Store hash for next comparison
      cachedHash = cacheEntry?.hash || null;
    } catch (e) {
      // Cache check failed, proceed with fresh fetch
    }

    // Step 4: Hash differs or no cache - fetch full testimonials data
    const testimonialsResponse = await fetch(
      `${BASE_URL}/bases/${DB_ID}/tables/${TESTIMONIALS_TABLE}/records/list`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit: 200 // Get more to ensure we have all testimonials
        }),
      }
    );

    if (!testimonialsResponse.ok) {
      const errorText = await testimonialsResponse.text();
      return NextResponse.json(
        { error: 'Failed to fetch testimonials', details: errorText },
        { status: testimonialsResponse.status, headers }
      );
    }

    const testimonialsData = await testimonialsResponse.json();
    const allTestimonials = testimonialsData.records || [];

    // Extract testimonial IDs from collection testimonials
    const testimonialIds: string[] = [];
    collectionTestimonials.forEach((ct: any) => {
      const testimonialField = ct.fields?.Testimonial || ct.data?.Testimonial;
      if (testimonialField && Array.isArray(testimonialField)) {
        testimonialIds.push(...testimonialField);
      } else if (testimonialField) {
        testimonialIds.push(testimonialField);
      }
    });

    if (testimonialIds.length === 0) {
      return NextResponse.json({ testimonials: [] }, { headers });
    }

    // Filter to only the testimonials we need
    const testimonials = allTestimonials.filter((t: any) => testimonialIds.includes(t.id));

    // Step 5: Create a map for quick lookup
    const testimonialMap = new Map();
    testimonials.forEach((t: any) => {
      testimonialMap.set(t.id, t);
    });

    // Step 6: Map and combine data with order
    const mappedTestimonials = collectionTestimonials
      .map((ct: any) => {
        const testimonialId = Array.isArray(ct.fields?.Testimonial) 
          ? ct.fields.Testimonial[0] 
          : Array.isArray(ct.data?.Testimonial)
          ? ct.data.Testimonial[0]
          : ct.fields?.Testimonial || ct.data?.Testimonial;
        
        const testimonial = testimonialMap.get(testimonialId);
        if (!testimonial) return null;

        const fields = testimonial.fields || {};
        const data = testimonial.data || {};
        
        // Handle photo field - attachments are arrays
        let photo: string[] = [];
        const photoField = fields.photo || data.photo;
        if (photoField) {
          if (Array.isArray(photoField)) {
            // If it's an array of objects with url property, extract URLs
            photo = photoField.map((p: any) => typeof p === 'string' ? p : p?.url || p?.href || '').filter(Boolean);
          } else {
            photo = [photoField];
          }
        }

        return {
          id: testimonial.id,
          name: fields.name || data.name || '',
          email: fields.email || data.email || '',
          rating: fields.rating || data.rating || 0,
          text: fields.text || data.text || '',
          photo: photo,
          job: fields.job || data.job,
          company: fields.company || data.company,
          website: fields.website || data.website,
          order: ct.fields?.Order ?? ct.data?.Order ?? 0,
        };
      })
      .filter((t: any): t is Testimonial => t !== null);
    
    const result = mappedTestimonials.sort((a: Testimonial, b: Testimonial) => (a.order || 0) - (b.order || 0));

    // Step 5: Cache the result with the current hash
    try {
      if (!(globalThis as any).__testimonialsCache) {
        (globalThis as any).__testimonialsCache = {};
      }
      const cacheKey = `testimonials-${collectionId}`;
      (globalThis as any).__testimonialsCache[cacheKey] = {
        hash: currentHash,
        data: result,
        timestamp: Date.now()
      };
    } catch (e) {
      // Cache write failed, but continue with response
    }

    return NextResponse.json(
      { testimonials: result },
      { 
        headers: {
          ...headers,
          'X-Cache': cachedHash === currentHash ? 'HIT' : 'MISS',
          'X-Data-Hash': currentHash
        }
      }
    );
  } catch (error: any) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500, headers }
    );
  }
}


