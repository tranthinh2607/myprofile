import React, { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/server";
import type { Post } from "@/types/supabase";
import { BlogListClient } from "./BlogListClient";
import { BookOpen, Rss } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog Kỹ Thuật | Trần Mai Trường Thịnh",
  description:
    "Chia sẻ kiến thức về Web Development, Next.js, AI, Supabase và các công nghệ hiện đại từ góc nhìn của một Software Engineer.",
  openGraph: {
    title: "Blog Kỹ Thuật | Trần Mai Trường Thịnh",
    description:
      "Chia sẻ kiến thức về Web Development, Next.js, AI, Supabase và các công nghệ hiện đại.",
    url: "https://tranmaitruongthinh.dev/blog",
    type: "website",
  },
};

async function getBlogPosts(): Promise<Post[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

function BlogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-zinc-900/50 border border-zinc-800/80 overflow-hidden animate-pulse"
        >
          <div className="h-48 bg-zinc-800/60" />
          <div className="p-5 space-y-3">
            <div className="h-3 bg-zinc-800 rounded w-1/3" />
            <div className="h-5 bg-zinc-800 rounded w-3/4" />
            <div className="h-5 bg-zinc-800 rounded w-1/2" />
            <div className="h-10 bg-zinc-800/60 rounded" />
            <div className="flex gap-2">
              <div className="h-4 bg-zinc-800 rounded w-16" />
              <div className="h-4 bg-zinc-800 rounded w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  // Lấy tất cả tags duy nhất
  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags || []))
  ).sort();

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800/60 bg-zinc-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="text-xs text-zinc-500 hover:text-zinc-300 font-mono transition-colors"
              >
                thinh.tran()
              </Link>
              <span className="text-zinc-600 text-xs">/</span>
              <span className="text-xs text-emerald-400 font-mono">blog</span>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mt-1">
                <BookOpen className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold gradient-text-emerald mb-2">
                  Blog Kỹ Thuật
                </h1>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  Chia sẻ kiến thức, kinh nghiệm thực chiến về Web Development,
                  AI và các công nghệ hiện đại. Viết từ góc nhìn của một
                  Software Engineer đang xây dựng sản phẩm thực tế.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono pt-2">
              <span className="flex items-center gap-1.5">
                <Rss className="w-3.5 h-3.5 text-emerald-400" />
                {posts.length} bài viết đã xuất bản
              </span>
              {allTags.length > 0 && (
                <span>• {allTags.length} chủ đề</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Suspense fallback={<BlogSkeleton />}>
          <BlogListClient posts={posts} allTags={allTags} />
        </Suspense>
      </div>
    </div>
  );
}
