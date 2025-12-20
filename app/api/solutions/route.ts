import { NextResponse } from 'next/server';

// Configure route caching - revalidate every 5 minutes
export const revalidate = 300;

// Use testimonials API key (has access to the database)
const API_KEY = process.env.FILLOUT_TESTIMONIALS_API_KEY || process.env.FILLOUT_API_KEY || '';
const BASE_URL = process.env.FILLOUT_BASE_URL || process.env.FILLOUT_API_BASE_URL || 'https://tables.fillout.com/api/v1';
const DB_ID = process.env.FILLOUT_SOLUTIONS_DB_ID || '';
const TABLE_ID = process.env.FILLOUT_SOLUTIONS_TABLE_ID || '';

interface Solution {
  id: string;
  solutionTitle: string;
  description: string;
  url?: string;
  thumbnail?: Array<{ url: string }>;
  order?: number;
}

// Helper function to format URL (add https:// if missing)
function formatUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const urlStr = String(url).trim();
  if (!urlStr) return undefined;
  // If it already starts with http:// or https://, return as is
  if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) {
    return urlStr;
  }
  // Otherwise, add https://
  return `https://${urlStr}`;
}

export async function GET() {
  // Enable caching for this route (revalidate every 5 minutes)
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  };

  try {
    // Validate environment variables
    if (!API_KEY || !DB_ID || !TABLE_ID) {
      return NextResponse.json(
        { error: 'Missing required environment variables (FILLOUT_API_KEY, FILLOUT_SOLUTIONS_DB_ID, FILLOUT_SOLUTIONS_TABLE_ID)' },
        { status: 500, headers }
      );
    }

    // Fetch Solutions from Fillout/Zite DB
    const response = await fetch(
      `${BASE_URL}/bases/${DB_ID}/tables/${TABLE_ID}/records/list`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit: 100, // Get up to 100 solutions
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch solutions:', response.status, errorText);
      
      // If 404, the database might not be accessible with this API key
      if (response.status === 404) {
        return NextResponse.json(
          { 
            error: 'Database not found or not accessible',
            details: 'The Solutions database is not accessible with the current API key. Please verify the database ID and API key permissions.',
            statusCode: 404
          },
          { status: 404, headers }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch solutions', details: errorText, statusCode: response.status },
        { status: response.status, headers }
      );
    }

    const data = await response.json();
    const records = data.records || [];

    // Map records to Solution format
    const solutions: Solution[] = records
      .map((record: any) => {
        const fields = record.fields || record.data || {};
        
        // Extract fields - try different possible field names
        const solutionTitle = 
          fields['Solution Title'] || 
          fields.solutionTitle || 
          fields.Solution ||
          fields.title ||
          '';
        
        const description = 
          fields.Description || 
          fields.description || 
          fields.desc ||
          '';

        const url = formatUrl(
          fields.URL || 
          fields.url || 
          fields.website ||
          fields.link
        );

        // Handle thumbnail - it's an array of objects with url property
        let thumbnail: Array<{ url: string }> | undefined;
        const thumbnailField = fields.Thumbnail || fields.thumbnail || fields.image;
        if (thumbnailField && Array.isArray(thumbnailField) && thumbnailField.length > 0) {
          thumbnail = thumbnailField.map((item: any) => ({
            url: typeof item === 'string' ? item : (item?.url || item?.href || '')
          })).filter((item: { url: string }) => item.url);
        }

        // Only include solutions that have at least a title
        if (!solutionTitle) {
          return null;
        }

        // Extract order field - try different possible field names
        const orderField = 
          fields['Order'] || 
          fields.order || 
          fields.ORDER || 
          fields.sort_order || 
          fields['Sort Order'] ||
          null;
        
        // Convert to number, default to 9999 if missing (sorts last)
        let order: number = 9999;
        if (orderField !== null && orderField !== undefined) {
          const orderNum = Number(orderField);
          if (!isNaN(orderNum)) {
            order = orderNum;
          }
        }

        return {
          id: record.id,
          solutionTitle: String(solutionTitle),
          description: String(description),
          url,
          thumbnail: thumbnail && thumbnail.length > 0 ? thumbnail : undefined,
          order,
        };
      })
      .filter((solution: Solution | null): solution is Solution => solution !== null);

    // Sort solutions by order field (ascending), then by title for same order
    solutions.sort((a, b) => {
      const orderA = a.order ?? 9999;
      const orderB = b.order ?? 9999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      // If order is the same, sort alphabetically by title
      return a.solutionTitle.localeCompare(b.solutionTitle);
    });

    return NextResponse.json(
      { solutions },
      { headers }
    );
  } catch (error: any) {
    console.error('Error fetching solutions:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500, headers }
    );
  }
}

