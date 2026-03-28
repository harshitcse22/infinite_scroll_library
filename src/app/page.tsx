"use client";

import React, { useState, useRef, useEffect, useMemo, Suspense } from "react";
import { Search, Loader2 } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useInfiniteBooks } from "./hooks/useInfiniteBooks";
import { BookCard } from "./components/BookCard";
import { BookGrid } from "./components/BookGrid";
import { BookCardSkeleton } from "./components/BookCardSkeleton";
import { useDebounce } from "./hooks/useDebounce";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ThemeToggle } from "./components/ThemeToggle";
import { BackToTop } from "./components/BackToTop";

const CHIPS = ["Science", "Math", "History", "Fiction", "Programming"];

function LibrarySearchInterface() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlQuery = searchParams.get("q") || "the lord of the rings";

  const [searchInput, setSearchInput] = useState(urlQuery);
  const [query, setQuery] = useState(urlQuery);
  
  const debouncedSearch = useDebounce(searchInput, 400);

  //  Sync url parameters with local search state dynamically
  useEffect(() => {
    if (debouncedSearch.trim() && debouncedSearch.trim() !== query) {
      const newQuery = debouncedSearch.trim();
      setQuery(newQuery);
      
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", newQuery);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [debouncedSearch, query, pathname, router, searchParams]);

  // Handle direct chip clicks to update URL immediately without debounce delay
  const handleStaticSearch = (newVal: string) => {
    setSearchInput(newVal);
    setQuery(newVal);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", newVal);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfiniteBooks(query);

  const flatData = useMemo(() => {
    return data?.pages.flatMap((page) => page.docs) || [];
  }, [data]);

  const [columnCount, setColumnCount] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      const w = window.innerWidth;
      if (w >= 1536) setColumnCount(5);
      else if (w >= 1280) setColumnCount(4);
      else if (w >= 1024) setColumnCount(3);
      else if (w >= 640) setColumnCount(2);
      else setColumnCount(1);
    };
    
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const rows = useMemo(() => {
    const chunked = [];
    for (let i = 0; i < flatData.length; i += columnCount) {
      chunked.push(flatData.slice(i, i + columnCount));
    }
    return chunked;
  }, [flatData, columnCount]);

  const rowVirtualizer = useWindowVirtualizer({
    count: Math.max(1, rows.length),
    estimateSize: () => 450,
    overscan: 4,
  });

  const observerTarget = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      // Prefetch next page by triggering intersection 600px before the sentinel comes into view
      { threshold: 0, rootMargin: "600px" }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearchForm = (e: React.FormEvent) => {
    e.preventDefault(); 
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-200">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center w-full">
            <h1 className="text-2xl flex items-center gap-3 font-bold tracking-tight text-slate-900 dark:text-slate-50 shrink-0">
              📚 Open Library
            </h1>
            <div className="flex items-center gap-3 w-full md:max-w-xl justify-end">
              <form onSubmit={handleSearchForm} className="relative w-full">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search for books... (Auto filtering)"
                    className="w-full rounded-full border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-indigo-500 transition-colors"
                  />
                </div>
              </form>
              
              {/*  Dark Mode toggle added alongside search box */}
              <div className="shrink-0">
                <ThemeToggle />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-slate-500 mr-2">Topics:</span>
            {CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleStaticSearch(chip)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  query.toLowerCase() === chip.toLowerCase()
                    ? "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:bg-slate-800"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-0 sm:px-2 py-8 w-full">
        {isLoading && flatData.length === 0 ? (
          <div className="px-4 sm:px-6 lg:px-8">
            <BookGrid>
              {Array.from({ length: 15 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </BookGrid>
          </div>
        ) : isError ? (
          <div className="flex h-[50vh] items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-red-500 font-semibold text-lg">Failed to fetch books.</p>
              <p className="text-slate-500 text-sm">Please try another search or check your connection.</p>
            </div>
          </div>
        ) : flatData.length === 0 ? (
          <div className="flex h-[50vh] items-center justify-center px-4">
            <div className="text-center space-y-2 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <p className="text-slate-700 dark:text-slate-300 text-lg font-medium">No books found for "{query}"</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Try using the topics above or adjusting your search.</p>
            </div>
          </div>
        ) : (
          <div className="w-full relative">
            <div
              className="relative w-full"
              style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                if (virtualRow.index >= rows.length) return null;
                
                const rowItems = rows[virtualRow.index];

                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    className="absolute top-0 left-0 w-full"
                    style={{
                      transform: `translateY(${virtualRow.start}px)`,
                      paddingBottom: '24px',
                    }}
                  >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 px-4 sm:px-6 lg:px-8">
                      {rowItems.map((book: any, index: number) => {
                        const uniqueKey = `${book.key}-${index}`;
                        return (
                          <div key={uniqueKey} className="h-full">
                            <BookCard
                              title={book.title}
                              author={book.author_name?.[0]}
                              year={book.first_publish_year}
                              coverId={book.cover_i}
                              subjects={book.subject}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div 
              ref={observerTarget}
              className="mt-8 mb-8 flex w-full items-center justify-center p-4"
            >
              {isFetchingNextPage ? (
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-6 py-3 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600 dark:text-indigo-400" />
                  <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">Loading more books...</span>
                </div>
              ) : hasNextPage ? (
                <p className="text-slate-500 font-medium text-sm">Scroll to load more</p>
              ) : (
                <div className="flex items-center gap-2 text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-6 py-2 rounded-full transition-colors">
                  <span className="font-medium text-sm text-slate-600 dark:text-slate-400">You've reached the end of the library</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <BackToTop />
    </div>
  );
}

// Wrap the entire component in a Suspense boundary as required by Next.js when using useSearchParams
export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    }>
      <LibrarySearchInterface />
    </Suspense>
  );
}
