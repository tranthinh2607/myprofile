import React from "react";
import { BookOpen } from "lucide-react";

export default function BlogListLoading() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-4 max-w-2xl">
          <div className="h-6 w-36 bg-zinc-800/80 rounded-full" />
          <div className="h-10 bg-zinc-800 rounded-xl w-3/4" />
          <div className="h-5 bg-zinc-800/60 rounded w-full" />
        </div>

        {/* Search & Tags Bar Skeleton */}
        <div className="space-y-4">
          <div className="h-12 bg-zinc-900 border border-zinc-800 rounded-xl max-w-md" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-7 w-20 bg-zinc-800/60 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-zinc-900/40 border border-zinc-800 p-5 space-y-4"
            >
              <div className="h-44 bg-zinc-800/50 rounded-xl" />
              <div className="h-4 bg-zinc-800 rounded w-1/3" />
              <div className="h-6 bg-zinc-800 rounded w-3/4" />
              <div className="h-12 bg-zinc-800/60 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
