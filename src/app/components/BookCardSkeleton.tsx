import React from 'react';

// Reusable native Tailwind Skeleton matching Shadcn UI
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 ${className || ''}`}
      {...props}
    />
  );
}

export function BookCardSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:bg-slate-950 dark:border-slate-800">
      {/* Image Skeleton */}
      <Skeleton className="relative aspect-[2/3] w-full rounded-none" />
      
      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="space-y-2.5">
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-6 w-3/5" />
          <Skeleton className="h-4 w-1/2 mt-3" />
        </div>
        
        {/* Footer info skeleton */}
        <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-y-3 gap-x-2">
          <div className="flex gap-1.5 flex-wrap">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
    </div>
  );
}
