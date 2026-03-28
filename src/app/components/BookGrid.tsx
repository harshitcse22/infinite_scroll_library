import React from 'react';

export interface BookGridProps {
  children: React.ReactNode;
}

export function BookGrid({ children }: BookGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 p-4 sm:p-6 lg:p-8">
      {children}
    </div>
  );
}
