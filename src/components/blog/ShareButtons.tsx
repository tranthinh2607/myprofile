"use client";

import React, { useState, useEffect } from "react";
import { Share2, Check, ExternalLink } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  // URL mặc định dùng chung giữa Server SSR và Client Hydration lần đầu để triệt tiêu lỗi Hydration Mismatch
  const defaultUrl = `https://tranmaitruongthinh.dev/blog/${slug}`;
  const [url, setUrl] = useState(defaultUrl);

  useEffect(() => {
    // Sau khi hydrate thành công trên trình duyệt, cập nhật origin thực tế (vd: localhost:3000 hoặc domain thật)
    if (typeof window !== "undefined") {
      setUrl(`${window.location.origin}/blog/${slug}`);
    }
  }, [slug]);

  const handleCopy = async () => {
    try {
      const currentUrl = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : url;
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

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
