"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
  Copy,
  Check,
  Shield,
  Send,
  MessageSquare,
  Eye,
} from "lucide-react";
import type { ContactMessage } from "@/lib/db";

export default function AdminMessagesPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "replied">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Kiểm tra passcode đã lưu trong sessionStorage
  useEffect(() => {
    const savedToken = sessionStorage.getItem("admin_token");
    if (savedToken) {
      setPasscode(savedToken);
      fetchMessages(savedToken);
    }
  }, []);

  const fetchMessages = useCallback(async (token: string) => {
    setLoading(true);
    setAuthError("");
    try {
      const res = await fetch(`/api/contact?token=${encodeURIComponent(token)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(data.data || []);
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_token", token);
      } else {
        setIsAuthenticated(false);
        setAuthError(data.error || "Mã truy cập không chính xác.");
      }
    } catch {
      setAuthError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setAuthError("Vui lòng nhập mã bảo mật truy cập.");
      return;
    }
    fetchMessages(passcode.trim());
  };

  const updateStatus = async (id: string, newStatus: "unread" | "read" | "replied") => {
    try {
      const res = await fetch(`/api/contact?token=${encodeURIComponent(passcode)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
      }
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa vĩnh viễn tin nhắn này?")) return;
    try {
      const res = await fetch(`/api/contact?token=${encodeURIComponent(passcode)}&id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error("Lỗi xóa tin nhắn:", err);
    }
  };

  const copyEmail = async (email: string, id: string) => {
    await navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Lọc và tìm kiếm
  const filteredMessages = messages.filter((m) => {
    const matchesFilter = filter === "all" || m.status === filter;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6 shadow-2xl backdrop-blur-md">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-sans">Hộp Thư Kỹ Sư (Admin Inbox)</h1>
            <p className="text-xs text-zinc-400 font-mono">
              Nhập mã bảo mật để xem các tin nhắn và yêu cầu hợp tác kỹ thuật
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300 block">Mã bảo mật (Passcode)</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Nhập mã truy cập (Mặc định: thinh2026)"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/70"
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
              {loading ? "Đang xác thực..." : "Mở Hộp Thư"}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1.5 transition-colors font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Trang Chủ Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Về Trang Chủ"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl font-bold font-sans">Quản Lý Yêu Cầu Hợp Tác Kỹ Thuật</h1>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Tổng số: <span className="text-emerald-400 font-semibold">{messages.length}</span> tin nhắn | Chưa đọc:{" "}
              <span className="text-amber-400 font-semibold">{unreadCount}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchMessages(passcode)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Làm mới</span>
            </button>
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

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "all", label: `Tất cả (${messages.length})` },
                { id: "unread", label: `Chưa đọc (${unreadCount})` },
                {
                  id: "read",
                  label: `Đã xem (${messages.filter((m) => m.status === "read").length})`,
                },
                {
                  id: "replied",
                  label: `Đã phản hồi (${messages.filter((m) => m.status === "replied").length})`,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  filter === tab.id
                    ? "bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20"
                    : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, email, nội dung..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/70"
            />
          </div>
        </div>

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-zinc-900/20 border border-zinc-800/80 space-y-3">
            <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-semibold text-zinc-300 font-sans">
              {messages.length === 0
                ? "Chưa có tin nhắn liên hệ nào trong hệ thống."
                : "Không tìm thấy tin nhắn phù hợp với bộ lọc."}
            </h3>
            <p className="text-xs text-zinc-500 font-mono">
              Khi khách truy cập gửi form trên trang chủ, dữ liệu sẽ ngay lập tức xuất hiện tại đây.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-6 rounded-2xl border transition-all space-y-4 ${
                  msg.status === "unread"
                    ? "bg-zinc-900/80 border-amber-500/40 shadow-lg shadow-amber-500/5"
                    : "bg-zinc-900/40 border-zinc-800/80"
                }`}
              >
                {/* Message Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-sm text-zinc-100 font-sans">{msg.name}</span>
                      {msg.status === "unread" && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-semibold">
                          CHƯA ĐỌC
                        </span>
                      )}
                      {msg.status === "read" && (
                        <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-mono">
                          ĐÃ XEM
                        </span>
                      )}
                      {msg.status === "replied" && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-semibold">
                          ĐÃ PHẢN HỒI
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                      <button
                        onClick={() => copyEmail(msg.email, msg.id)}
                        className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                        title="Bấm để sao chép email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{msg.email}</span>
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-zinc-500 hover:text-zinc-300" />
                        )}
                      </button>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-zinc-500">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(msg.createdAt).toLocaleString("vi-VN")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${msg.email}?subject=Phản hồi từ Kỹ sư Trần Mai Trường Thịnh&body=Chào ${encodeURIComponent(
                        msg.name
                      )},%0D%0A%0D%0ACảm ơn bạn đã liên hệ qua Portfolio.%0D%0A%0D%0A`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => updateStatus(msg.id, "replied")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-mono transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi phản hồi Email</span>
                    </a>

                    {msg.status === "unread" ? (
                      <button
                        onClick={() => updateStatus(msg.id, "read")}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                        title="Đánh dấu đã đọc"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatus(msg.id, "unread")}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                        title="Đánh dấu chưa đọc"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 transition-colors"
                      title="Xóa tin nhắn"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Message Content */}
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-xs text-zinc-200 font-sans leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
