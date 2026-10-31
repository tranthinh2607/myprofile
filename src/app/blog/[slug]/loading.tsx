import React from "react";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-zinc-800/60 bg-zinc-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
              <ArrowLeft className="w-3.5 h-3.5 text-zinc-600" />
              <span>Bài Viết</span>
            </div>
            <span className="text-zinc-600 text-xs">/</span>
            <div className="h-4 w-32 bg-zinc-800 rounded" />
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-5">
            <div className="h-6 w-20 bg-zinc-800/80 rounded-full" />
            <div className="h-6 w-24 bg-zinc-800/80 rounded-full" />
          </div>

          {/* Title */}
          <div className="space-y-3 mb-6">
            <div className="h-10 sm:h-12 bg-zinc-800 rounded-xl w-3/4" />
            <div className="h-10 sm:h-12 bg-zinc-800 rounded-xl w-1/2" />
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4">
            <div className="h-4 w-28 bg-zinc-800/60 rounded" />
            <div className="h-4 w-24 bg-zinc-800/60 rounded" />
            <div className="h-4 w-20 bg-zinc-800/60 rounded" />
          </div>
        </div>
      </div>

      {/* Cover Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mb-8 relative z-10">
        <div className="mt-8 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/60 h-64 sm:h-80 flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-zinc-800 animate-bounce" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-16 space-y-6">
        <div className="space-y-3">
          <div className="h-4 bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-zinc-800 rounded w-11/12" />
          <div className="h-4 bg-zinc-800 rounded w-4/5" />
        </div>

        <div className="h-8 bg-zinc-800/70 rounded w-1/3 my-6" />

        <div className="space-y-3">
          <div className="h-4 bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-zinc-800 rounded w-10/12" />
          <div className="h-4 bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-zinc-800 rounded w-3/4" />
        </div>

        {/* Code block skeleton */}
        <div className="h-32 bg-zinc-900 border border-zinc-800 rounded-2xl my-6" />

        <div className="space-y-3">
          <div className="h-4 bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-zinc-800 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}
