"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  Eye,
  FileText,
  Globe,
  Clock,
  Shield,
  MessageSquare,
  TrendingUp,
  Tag,
} from "lucide-react";
import { getAllPostsAdmin, deletePost } from "./actions";

interface PostItem {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  tags: string[];
  view_count: number;
  created_at: string;
  published_at: string | null;
  excerpt: string | null;
  cover_image: string | null;
  comment_count: number;
}

export default function AdminPostsPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) {
      setPasscode(saved);
      fetchPosts(saved);
    }
  }, []);

  const fetchPosts = useCallback(async (token: string) => {
    setLoading(true);
    setAuthError("");
    try {
      const result = await getAllPostsAdmin(token);
      if (result.success) {
        setPosts(result.posts as PostItem[]);
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_token", token);
      } else {
        setIsAuthenticated(false);
        setAuthError("Mã truy cập không chính xác.");
      }
    } catch {
      setAuthError("Lỗi kết nối. Kiểm tra Supabase configuration.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setAuthError("Vui lòng nhập mã bảo mật.");
      return;
    }
    fetchPosts(passcode.trim());
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const result = await deletePost(passcode, id);
      if (result.success) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
      setDeleteConfirm(null);
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6 shadow-2xl backdrop-blur-md">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold">Quản Lý Bài Viết Blog</h1>
            <p className="text-xs text-zinc-400 font-mono">
              Nhập mã bảo mật để quản lý bài viết
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300 block">
                Mã bảo mật (Passcode)
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Nhập mã truy cập admin"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/70 transition-colors"
                autoFocus
              />
            </div>
            {authError && (
              <p className="text-xs text-red-400 font-mono text-center">{authError}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-zinc-950 font-mono font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20"
            >
              {loading ? "Đang xác thực..." : "Truy cập Bảng điều khiển"}
            </button>
          </form>

          <div className="text-center pt-2 flex flex-col gap-2">
            <Link
              href="/admin/messages"
              className="text-xs text-zinc-400 hover:text-zinc-200 inline-flex items-center justify-center gap-1.5 transition-colors font-mono"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Quản lý Tin nhắn</span>
            </Link>
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-zinc-300 inline-flex items-center justify-center gap-1.5 transition-colors font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Về Trang Chủ</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold font-sans">Quản Lý Bài Viết Blog</h1>
                <p className="text-xs text-zinc-400 font-mono">
                  Tổng{" "}
                  <span className="text-emerald-400 font-semibold">{posts.length}</span>{" "}
                  bài | Đã xuất bản:{" "}
                  <span className="text-emerald-400 font-semibold">{publishedCount}</span> |
                  Nháp:{" "}
                  <span className="text-amber-400 font-semibold">{draftCount}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/messages"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Tin nhắn</span>
            </Link>
            <button
              onClick={() => fetchPosts(passcode)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Làm mới</span>
            </button>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-mono font-semibold transition-all shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tạo bài mới</span>
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem("admin_token");
                setIsAuthenticated(false);
              }}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 hover:border-red-800 text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Tổng bài viết", value: posts.length, icon: FileText, color: "text-zinc-300" },
            { label: "Đã xuất bản", value: publishedCount, icon: Globe, color: "text-emerald-400" },
            { label: "Bản nháp", value: draftCount, icon: Clock, color: "text-amber-400" },
            {
              label: "Tổng lượt xem",
              value: posts.reduce((a, p) => a + (p.view_count || 0), 0),
              icon: TrendingUp,
              color: "text-sky-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-zinc-800/60">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-lg font-bold font-mono">{stat.value.toLocaleString()}</p>
                <p className="text-[10px] text-zinc-400 font-mono">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex gap-2">
            {(["all", "published", "draft"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  statusFilter === f
                    ? "bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20"
                    : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                }`}
              >
                {f === "all" ? "Tất cả" : f === "published" ? "Đã xuất bản" : "Bản nháp"}
              </button>
            ))}
          </div>
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tiêu đề, slug, tag..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/70 transition-colors"
            />
          </div>
        </div>

        {/* Posts Table */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-zinc-900/20 border border-zinc-800/80 space-y-3">
            <FileText className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-semibold text-zinc-300 font-sans">
              {posts.length === 0 ? "Chưa có bài viết nào." : "Không tìm thấy bài viết phù hợp."}
            </h3>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-mono font-semibold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Tạo bài viết đầu tiên
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`p-5 rounded-2xl border transition-all ${
                  post.status === "published"
                    ? "bg-zinc-900/50 border-zinc-800/80 hover:border-emerald-500/30"
                    : "bg-zinc-900/30 border-zinc-800/50 hover:border-amber-500/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${
                          post.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {post.status === "published" ? "PUBLISHED" : "DRAFT"}
                      </span>
                      <h3 className="font-semibold text-sm text-zinc-100 truncate">
                        {post.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono flex-wrap">
                      <span className="text-zinc-500">/{post.slug}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.view_count.toLocaleString()} lượt xem
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {post.comment_count} bình luận
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(post.created_at).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    {(post.tags || []).length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Tag className="w-3 h-3 text-zinc-500" />
                        {post.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-400 text-[10px] font-mono border border-zinc-700/50"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 4 && (
                          <span className="text-[10px] text-zinc-500 font-mono">
                            +{post.tags.length - 4} nữa
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {post.status === "published" && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                        title="Xem bài viết"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Sửa
                    </Link>
                    {deleteConfirm === post.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deleting === post.id}
                          className="px-2.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-xs font-mono transition-colors"
                        >
                          {deleting === post.id ? "Đang xóa..." : "Xác nhận xóa"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2.5 py-1.5 rounded-xl bg-zinc-800 text-zinc-400 text-xs font-mono transition-colors"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 transition-colors"
                        title="Xóa bài viết"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
