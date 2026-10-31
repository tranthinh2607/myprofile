"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  Clock,
  Eye,
  Calendar,
  Sparkles,
  ExternalLink,
  Plus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatBlogDate, estimateReadingTime } from "@/lib/blog-utils";
import type { Post } from "@/types/supabase";

interface ArticlesProps {
  initialPosts?: Post[];
}

export function Articles({ initialPosts = [] }: ArticlesProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(initialPosts.length === 0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check admin status for quick edit shortcut
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("admin_token");
      if (token) setIsAdmin(true);
    }

    // If initialPosts was provided, we already have data
    if (initialPosts.length > 0) {
      setPosts(initialPosts);
      setLoading(false);
      return;
    }

    // Fetch latest published posts from Supabase
    async function fetchLatestPosts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(6);

        if (!error && data) {
          setPosts(data as Post[]);
        }
      } catch {
        // Fallback silently
      } finally {
        setLoading(false);
      }
    }

    fetchLatestPosts();
  }, [initialPosts]);

  return (
    <section id="blog" className="py-24 bg-[#09090b] border-t border-zinc-900/90 relative">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>// TECHNICAL BLOG & INSIGHTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 font-sans">
            Bài Viết & Chia Sẻ Chuyên Sâu
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Chia sẻ kiến thức thực tế về Next.js, Supabase, Kiến trúc hệ thống, Giải thuật và AI được cập nhật trực tiếp từ hệ thống quản trị.
          </p>

          {isAdmin && (
            <div className="pt-2">
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono hover:bg-emerald-500/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Viết bài mới (Admin)
              </Link>
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-zinc-900/40 border border-zinc-800 p-5 space-y-4 animate-pulse"
              >
                <div className="h-44 bg-zinc-800/50 rounded-xl" />
                <div className="h-4 bg-zinc-800 rounded w-1/3" />
                <div className="h-6 bg-zinc-800 rounded w-3/4" />
                <div className="h-12 bg-zinc-800/60 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Posts Grid */}
        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const readTime = estimateReadingTime(post.content || "");
              const date = post.published_at
                ? formatBlogDate(post.published_at)
                : formatBlogDate(post.created_at);

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  prefetch={true}
                  className="group rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-emerald-500/40 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1"
                >
                  {/* Cover Image or Gradient Placeholder */}
                  <div className="relative h-48 overflow-hidden bg-zinc-950 flex-shrink-0">
                    {post.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                        <div className="w-12 h-12 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                          <BookOpen className="w-6 h-6" />
                        </div>
                      </div>
                    )}

                    {/* Tags on top of image */}
                    {(post.tags || []).length > 0 && (
                      <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap z-10">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-zinc-950/80 backdrop-blur-sm text-emerald-400 text-[10px] font-mono border border-emerald-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      {/* Meta stats */}
                      <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-zinc-400" />
                          {date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          {readTime} phút đọc
                        </span>
                        {post.view_count > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-zinc-400" />
                              {post.view_count}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-emerald-400 group-hover:text-emerald-300">
                      <span>Đọc bài viết</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-16 px-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 mx-auto flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-zinc-200">
              Đang chuẩn bị nội dung bài viết
            </h3>
            <p className="text-xs text-zinc-400">
              Các bài viết chia sẻ về kỹ thuật và kiến trúc hệ thống sẽ sớm được xuất bản.
            </p>
            {isAdmin && (
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black font-semibold text-xs font-mono"
              >
                <Plus className="w-4 h-4" />
                Viết bài đầu tiên ngay
              </Link>
            )}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-14 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-sm font-mono text-zinc-200 hover:text-white transition-all shadow-lg hover:shadow-emerald-500/5 group"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Xem tất cả bài viết trên Blog</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
          </Link>
        </div>
      </div>
    </section>
  );
}
