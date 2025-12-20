import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_BEEHIIV_API_KEY || process.env.BEEHIIV_API_KEY;
    
    if (!apiKey) {
      console.error('Beehiiv API key not found');
      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 500 }
      );
    }

    // Beehiiv API endpoint for subscribing
    // Use publication-specific endpoint if publication ID is provided
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
    const beehiivUrl = publicationId 
      ? `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`
      : 'https://api.beehiiv.com/v2/subscriptions';

    const requestBody = {
      email: email,
      reactivate_existing: false,
      send_welcome_email: true,
    };

    const response = await fetch(beehiivUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Beehiiv API error:', response.status, errorData);
      
      // If subscription already exists, treat as success
      if (response.status === 409) {
        return NextResponse.json(
          { message: 'You are already subscribed!' },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again later.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

