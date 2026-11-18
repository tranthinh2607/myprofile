"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, Clock, Tag, ChevronUp, RefreshCw } from "lucide-react";

interface AISummarizerProps {
  title: string;
  content: string;
}

interface SummaryData {
  tldr: string[];
  keyTakeaways: string[];
  estimatedReadTime: number;
  highlightTag: string;
}

export function AISummarizer({ title, content }: AISummarizerProps) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    if (summary) {
      setIsExpanded(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể tạo tóm tắt vào lúc này.");
      }

      setSummary(data.summary);
      setIsExpanded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra sự cố kết nối AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-zinc-900/60 to-zinc-950/80 backdrop-blur-md shadow-xl transition-all duration-300">
      {/* Top Banner Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-zinc-100 font-sans tracking-tight">
                Tóm Tắt Nhanh Bằng Gemini 2.5 AI
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-medium border border-emerald-500/30">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Rút trích các ý chính và bài học cốt lõi chỉ trong vài giây.
            </p>
          </div>
        </div>

        {/* Action Button */}
        {!isExpanded ? (
          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs font-mono transition-all shadow-md shadow-emerald-500/20 disabled:opacity-70 cursor-pointer shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                <span>AI đang đọc bài viết...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{summary ? "Xem lại tóm tắt" : "Tạo tóm tắt ngay"}</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>Thu gọn</span>
            <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="px-5 pb-5 text-xs text-red-400 font-mono flex items-center justify-between">
          <span>⚠ {error}</span>
          <button
            onClick={handleGenerateSummary}
            className="text-emerald-400 hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Thử lại
          </button>
        </div>
      )}

      {/* Expanded Content View */}
      {isExpanded && summary && (
        <div className="px-5 pb-6 pt-2 border-t border-emerald-500/20 space-y-5 animate-in fade-in duration-300">
          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-400 pt-1">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-950/80 border border-zinc-800 text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Đọc tóm tắt: ~1 phút (Bài gốc: ~{summary.estimatedReadTime} phút)
            </span>
            {summary.highlightTag && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-950/80 border border-zinc-800 text-emerald-400">
                <Tag className="w-3.5 h-3.5" />
                {summary.highlightTag}
              </span>
            )}
          </div>

          {/* TL;DR Points */}
          <div className="space-y-2">
            <h5 className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span>// CÁC ĐIỂM CHÍNH TRONG BÀI (TL;DR):</span>
            </h5>
            <ul className="space-y-2">
              {summary.tldr.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-200 font-sans leading-relaxed bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800/80"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Takeaways */}
          {summary.keyTakeaways && summary.keyTakeaways.length > 0 && (
            <div className="space-y-2 pt-1">
              <h5 className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <span>// BÀI HỌC KỸ THUẬT RÚT RA:</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {summary.keyTakeaways.map((takeaway, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-zinc-300 leading-relaxed font-sans"
                  >
                    💡 {takeaway}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
