import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchBooks } from "../lib/openLibrary";

export const useInfiniteBooks = (query: string, limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: ["books", query],
    queryFn: ({ pageParam }) => fetchBooks(query, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!query, // Only run the query when there is a search term
  });
};
