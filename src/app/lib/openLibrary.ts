import axios from 'axios';

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
    const response = await axios.get('https://openlibrary.org/search.json', {
      params: {
        q: query,
        page: page,
        limit: limit,
      },
    });

    const { docs, numFound } = response.data;

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
