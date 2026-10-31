import React, { Suspense, cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/server";
import { CommentSection } from "@/components/blog/CommentSection";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { ShareButtons } from "@/components/blog/ShareButtons";
import type { Post } from "@/types/supabase";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Clock,
  Tag,
} from "lucide-react";
import { personalInfo } from "@/data/profile-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ISR: Cache trang tối đa 60 giây để tăng tốc độ tải trang tức thì
export const revalidate = 60;

// Pre-render các slug bài viết đã xuất bản
export async function generateStaticParams() {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("posts")
      .select("slug")
      .eq("status", "published");

    const posts = (data || []) as Array<{ slug: string }>;
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

// React cache() để tránh query Supabase trùng lặp giữa generateMetadata & BlogPostPage
const getPost = cache(async (slug: string): Promise<Post | null> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
});

const getCommentCount = cache(async (postId: string): Promise<number> => {
  try {
    const supabase = createPublicClient();
    const { count } = await supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("post_id", postId)
      .eq("status", "approved");
    return count || 0;
  } catch {
    return 0;
  }
});

// Tăng view count chạy ngầm (fire-and-forget, không block việc render HTML)
function incrementViewCount(slug: string) {
  try {
    const supabase = createPublicClient();
    // RPC increment_post_view là SECURITY DEFINER và cho phép anon thực thi
    supabase.rpc("increment_post_view", { post_slug: slug } as never).then(() => {});
  } catch {
    // Ignore
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Bài viết không tìm thấy" };
  }

  return {
    title: `${post.title} | Blog - Trần Mai Trường Thịnh`,
    description: post.excerpt || post.content.slice(0, 160),
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      url: `https://tranmaitruongthinh.dev/blog/${post.slug}`,
      type: "article",
      publishedTime: post.published_at || post.created_at,
      tags: post.tags,
      ...(post.cover_image && {
        images: [{ url: post.cover_image, width: 1200, height: 630, alt: post.title }],
      }),
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function estimateReadTime(content: string): number {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // Tăng lượt xem ngầm, không bắt user chờ
  incrementViewCount(slug);

  // Lấy song song thông tin
  const commentCount = await getCommentCount(post.id);
  const readTime = estimateReadTime(post.content);
  const date = post.published_at ? formatDate(post.published_at) : formatDate(post.created_at);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* Article Header */}
      <div className="border-b border-zinc-800/60 bg-zinc-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link
              href="/blog"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 font-mono transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Bài Viết
            </Link>
            <span className="text-zinc-600 text-xs">/</span>
            <span className="text-xs text-zinc-400 font-mono truncate max-w-[200px]">
              {post.title}
            </span>
          </div>

          {/* Tags */}
          {(post.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono hover:bg-emerald-500/20 transition-colors"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 gradient-text-emerald">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-600" />
              {date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-600" />
              {readTime} phút đọc
            </span>
            {post.view_count > 0 && (
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-zinc-600" />
                {post.view_count.toLocaleString()} lượt xem
              </span>
            )}
            {commentCount > 0 && (
              <span className="text-emerald-400">
                {commentCount} bình luận
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mb-8 relative z-10">
          <div className="mt-8 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-zinc-800/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-64 sm:h-80 object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Body */}
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 ${post.cover_image ? "pt-16" : "pt-8"} pb-16`}>
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <article className="flex-1 min-w-0">
            <Suspense fallback={<div className="animate-pulse space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`h-4 bg-zinc-800 rounded ${i % 3 === 0 ? "w-3/4" : "w-full"}`} />
              ))}
            </div>}>
              <MarkdownRenderer content={post.content} />
            </Suspense>

            {/* Share Buttons */}
            <div className="mt-12 pt-8 border-t border-zinc-800/60">
              <p className="text-xs text-zinc-500 font-mono mb-3">Chia sẻ bài viết:</p>
              <ShareButtons title={post.title} slug={post.slug} />
            </div>

            {/* Author Box */}
            <div className="mt-10 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex gap-4 items-start">
              <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-zinc-800 border border-zinc-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/about/thinh-portrait.jpg"
                  alt="Trần Mai Trường Thịnh"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">
                    Trần Mai Trường Thịnh
                  </p>
                  <p className="text-xs text-zinc-500 font-mono">
                    Software Engineer & Computer Engineer
                  </p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Kỹ sư phần mềm đam mê xây dựng sản phẩm thực tế với Next.js, Supabase, TypeScript và AI.
                  Giải Nhì Olympic Tin học Sinh viên.
                </p>
                <div className="flex gap-2 pt-1">
                  <a
                    href={personalInfo?.github || "https://github.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-mono"
                  >
                    GitHub →
                  </a>
                  <a
                    href={personalInfo?.facebook || "https://facebook.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-mono"
                  >
                    Facebook →
                  </a>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-16 pt-10 border-t border-zinc-800/60">
              <CommentSection postId={post.id} />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
