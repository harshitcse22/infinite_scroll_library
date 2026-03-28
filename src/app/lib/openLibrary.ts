export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
}

export interface FetchBooksResponse {
  docs: Book[];
  nextPage: number | null;
}

export const fetchBooks = async (
  query: string,
  page: number = 1,
  limit: number = 20
): Promise<FetchBooksResponse> => {
  try {
    const urlStr = `/api/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;

    // Firing request to our secure Next.js backend proxy instead of raw external API
    const response = await fetch(urlStr);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { docs = [], numFound = 0 } = data;

    // Determine if there is a next page
    const hasNextPage = page * limit < numFound;

    return {
      docs: docs as Book[],
      nextPage: hasNextPage ? page + 1 : null,
    };
  } catch (error) {
    console.error('Error fetching books from Open Library:', error);
    throw new Error('Failed to fetch books');
  }
};
