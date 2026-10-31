"use client";

import React, { useState } from "react";
import { Share2, Check, ExternalLink } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getPostUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/blog/${slug}`;
    }
    return `https://tranmaitruongthinh.dev/blog/${slug}`;
  };

  const handleCopy = async () => {
    try {
      const url = getPostUrl();
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const url = getPostUrl();

  return (
    <div className="flex flex-wrap gap-2">
      {/* Copy Link Button */}
      <button
        onClick={handleCopy}
        type="button"
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">Đã sao chép!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Sao chép link</span>
          </>
        )}
      </button>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-blue-950/40 border border-zinc-800 hover:border-blue-800/60 text-xs font-mono text-zinc-300 hover:text-blue-400 transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Facebook
      </a>

      {/* X / Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        X / Twitter
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-blue-950/30 border border-zinc-800 hover:border-blue-700/50 text-xs font-mono text-zinc-300 hover:text-blue-300 transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        LinkedIn
      </a>
    </div>
  );
}
