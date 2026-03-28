import React from 'react';

export interface BookCardProps {
  title: string;
  author?: string;
  year?: number;
  coverId?: number;
  subjects?: string[];
}

export function BookCard({ 
  title, 
  author, 
  year, 
  coverId, 
  subjects = [] 
}: BookCardProps) {
  const coverUrl = coverId 
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : `https://placehold.co/400x600/e2e8f0/64748b?text=No+Cover`;

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-50">
      <div className="relative aspect-[2/3] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {/* Using standard img to avoid Next.js image domain configuration requirements for now */}
        <img
          src={coverUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="space-y-1.5">
          <h3 
            className="font-semibold leading-tight line-clamp-2 text-lg" 
            title={title}
          >
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
            {author || 'Unknown Author'}
          </p>
        </div>
        
        <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-y-3 gap-x-2">
          <div className="flex flex-wrap gap-1.5 items-center">
            {subjects.length > 0 ? (
              subjects.slice(0, 2).map((subject, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                >
                  {subject}
                </span>
              ))
            ) : (
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                General
              </span>
            )}
            
            {subjects.length > 2 && (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                +{subjects.length - 2}
              </span>
            )}
          </div>
          
          {year && (
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0">
              {year}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
