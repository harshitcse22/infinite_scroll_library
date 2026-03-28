import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic'; // Prevent Next.js from caching error responses

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '20';

  try {
    // Utilize Axios tightly coupled to the Node environment, completely dodging 
    // Next.js buggy native fetch patches and aggressive edge-caching mechanisms.
    const response = await axios.get('https://openlibrary.org/search.json', {
      params: { q, page, limit },
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Compatible; InfiniteScrollLibraryApp/1.0)',
      },
      timeout: 15000 // Ensure we don't hang if OpenLibrary responds slowly
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('API Proxy Error:', error.message);
    
    // Check if OpenLibrary explicitly sent back an error body
    if (error.response) {
      console.error('OpenLibrary Error Body:', error.response.data);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch from OpenLibrary natively', details: error.message },
      { status: 500 }
    );
  }
}
