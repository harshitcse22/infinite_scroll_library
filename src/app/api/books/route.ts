import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '20';

  try {
    const url = new URL('https://openlibrary.org/search.json');
    url.searchParams.append('q', q);
    url.searchParams.append('page', page);
    url.searchParams.append('limit', limit);

    // Fetching from Next.js backend bypasses any Browser CORS, AdBlock, or strict VPN restrictions natively.
    // 'no-store' forcibly tells Next.js NOT to cache 500 responses from OpenLibrary permanently
    const response = await fetch(url.toString(), {
      cache: 'no-store',
      headers: {
        'User-Agent': 'InfiniteScrollLibraryApp/1.0',
      }
    });

    if (!response.ok) {
      throw new Error(`OpenLibrary API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from OpenLibrary', details: error.message },
      { status: 500 }
    );
  }
}
