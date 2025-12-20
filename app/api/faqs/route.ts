import { NextResponse } from 'next/server';

// Configure route caching - revalidate every 5 minutes
export const revalidate = 300;

// Try multiple API keys - use testimonials API key if available, fallback to main API key
const API_KEY = process.env.FILLOUT_TESTIMONIALS_API_KEY || process.env.FILLOUT_API_KEY || '';
const BASE_URL = process.env.FILLOUT_BASE_URL || process.env.FILLOUT_API_BASE_URL || 'https://tables.fillout.com/api/v1';
const DB_ID = process.env.FILLOUT_FAQS_DB_ID || '';
const TABLE_ID = process.env.FILLOUT_FAQS_TABLE_ID || '';

interface FAQ {
  id: string;
  question: string;
  answer: string;
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
        { error: 'Missing required environment variables (FILLOUT_API_KEY, FILLOUT_FAQS_DB_ID, FILLOUT_FAQS_TABLE_ID)' },
        { status: 500, headers }
      );
    }

    // Fetch FAQs from Fillout/Zite DB
    const response = await fetch(
      `${BASE_URL}/bases/${DB_ID}/tables/${TABLE_ID}/records/list`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit: 100, // Get up to 100 FAQs
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch FAQs:', response.status, errorText);
      
      // If 404, the database might not be accessible with this API key
      if (response.status === 404) {
        return NextResponse.json(
          { 
            error: 'Database not found or not accessible',
            details: 'The FAQ database is not accessible with the current API key. Please verify the database ID and API key permissions.',
            statusCode: 404
          },
          { status: 404, headers }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch FAQs', details: errorText, statusCode: response.status },
        { status: response.status, headers }
      );
    }

    const data = await response.json();
    const records = data.records || [];

    // Map records to FAQ format
    // The field names may vary - common names: Question/Answer, question/answer, etc.
    const faqs: FAQ[] = records
      .map((record: any) => {
        const fields = record.fields || record.data || {};
        
        // Try different possible field names
        const question = 
          fields.Question || 
          fields.question || 
          fields.Questions ||
          fields['Question'] ||
          '';
        
        const answer = 
          fields.Answer || 
          fields.answer || 
          fields.Answers ||
          fields['Answer'] ||
          '';

        // Only include FAQs that have both question and answer
        if (!question || !answer) {
          return null;
        }

        return {
          id: record.id,
          question: String(question),
          answer: String(answer),
        };
      })
      .filter((faq: FAQ | null): faq is FAQ => faq !== null);

    return NextResponse.json(
      { faqs },
      { headers }
    );
  } catch (error: any) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500, headers }
    );
  }
}

