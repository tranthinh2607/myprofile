"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Mail,
  Shield,
  ArrowRight,
  Plus,
  Lock,
  LogOut,
  ExternalLink,
  BookOpen,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) {
      setPasscode(saved);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setAuthError("Vui lòng nhập mã bảo mật.");
      return;
    }

    setLoading(true);
    setAuthError("");

    try {
      // Test the passcode against the contact API
      const res = await fetch(`/api/contact?token=${encodeURIComponent(passcode)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_token", passcode);
      } else {
        setAuthError("Mã bảo mật không chính xác.");
      }
    } catch {
      setAuthError("Không thể xác thực. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    setPasscode("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-center mb-2 tracking-tight">Admin Portal</h1>
          <p className="text-zinc-400 text-xs text-center mb-6">
            Nhập mã bảo mật quản trị viên để tiếp tục
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Passcode quản trị..."
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none text-sm transition-colors font-mono"
              />
              {authError && <p className="text-red-400 text-xs mt-2">{authError}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Shield className="w-4 h-4" />
              {loading ? "Đang xác thực..." : "Đăng nhập Quản trị"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
            >
              ← Quay về Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase">
                Admin Control Center
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Bảng Điều Khiển Quản Trị</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Xem Blog
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 hover:border-red-900 text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Module 1: Quản lý Bài viết */}
          <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-200 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">
                  Supabase Powered
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold group-hover:text-emerald-400 transition-colors">
                  Quản Lý Bài Viết Blog
                </h2>
                <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                  Soạn thảo bài viết Markdown, tải lên ảnh bìa vào Storage, quản lý trạng thái Draft/Published và theo dõi thống kê lượt xem, bình luận.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Tạo bài mới
              </Link>

              <Link
                href="/admin/posts"
                className="inline-flex items-center gap-1 text-xs font-medium text-zinc-300 hover:text-emerald-400 transition-colors"
              >
                Xem tất cả
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Module 2: Hộp Thư Liên Hệ */}
          <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-200 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">
                  Inbox
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold group-hover:text-blue-400 transition-colors">
                  Hộp Thư Liên Hệ
                </h2>
                <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                  Xem và phản hồi các tin nhắn, yêu cầu công việc hoặc lời chào được gửi từ biểu mẫu liên hệ trên Portfolio.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-end">
              <Link
                href="/admin/messages"
                className="inline-flex items-center gap-1 text-xs font-medium text-zinc-300 hover:text-blue-400 transition-colors"
              >
                Mở hộp thư
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links Footer */}
        <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>Hệ thống quản trị cá nhân · Portfolio v1.0</span>
          <Link href="/" className="hover:text-zinc-300 transition-colors">
            ← Trang chủ Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
