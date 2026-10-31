"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MessageSquare, Eye, Clock, Tag, BookOpen } from "lucide-react";
import type { Post } from "@/types/supabase";

interface BlogListClientProps {
  posts: Post[];
  allTags: string[];
}

function estimateReadTime(content: string): number {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function PostCard({ post }: { post: Post }) {
  const readTime = estimateReadTime(post.content);
  const date = post.published_at ? formatDate(post.published_at) : formatDate(post.created_at);

  return (
    <Link
      href={`/blog/${post.slug}`}
      prefetch={true}
      className="group flex flex-col rounded-2xl bg-zinc-900/50 border border-zinc-800/80 overflow-hidden hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 glass-panel-hover"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden bg-zinc-800/40 flex-shrink-0">
        {post.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-zinc-600" />
          </div>
        )}
        {/* Tags overlay */}
        {(post.tags || []).length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-zinc-950/80 backdrop-blur-sm text-emerald-400 text-[10px] font-mono border border-emerald-500/20"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="px-2 py-0.5 rounded-md bg-zinc-950/80 text-zinc-400 text-[10px] font-mono">
                +{post.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono">
          <span>{date}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readTime} phút đọc
          </span>
          {post.view_count > 0 && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {post.view_count.toLocaleString()}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h2 className="text-base font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors duration-200 leading-snug line-clamp-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
          <span className="text-xs text-emerald-400 font-mono font-medium group-hover:underline">
            Đọc thêm →
          </span>
        </div>
      </div>
    </Link>
  );
}

export function BlogListClient({ posts, allTags }: BlogListClientProps) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.excerpt || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchTag = !activeTag || (p.tags || []).includes(activeTag);
      return matchSearch && matchTag;
    });
  }, [posts, search, activeTag]);

  return (
    <div className="space-y-8">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
          />
        </div>
      </div>

      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              activeTag === null
                ? "bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20"
                : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}
          >
            <Tag className="w-3 h-3" />
            Tất cả
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activeTag === tag
                  ? "bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {(search || activeTag) && (
        <p className="text-xs text-zinc-500 font-mono">
          Tìm thấy{" "}
          <span className="text-emerald-400 font-semibold">{filtered.length}</span>{" "}
          bài viết
          {search && <> cho &quot;{search}&quot;</>}
          {activeTag && <> trong chủ đề #{activeTag}</>}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border border-zinc-800/60 bg-zinc-900/20 space-y-3">
          <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-300 font-sans">
            {posts.length === 0
              ? "Chưa có bài viết nào được xuất bản."
              : "Không tìm thấy bài viết phù hợp."}
          </h3>
          {posts.length === 0 && (
            <p className="text-xs text-zinc-500 font-mono">
              Hãy quay lại sau, tôi đang viết bài mới!
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
