"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  Minimize2,
  Maximize2,
  Loader2,
  FileText,
  Briefcase,
  Award,
  Layers,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  {
    icon: Briefcase,
    label: "Kinh nghiệm Full-Stack",
    prompt: "Thịnh có kinh nghiệm gì về Next.js, React và Supabase? Đã làm những dự án nào?",
  },
  {
    icon: Award,
    label: "Giải thưởng & Bằng cấp",
    prompt: "Thịnh tốt nghiệp trường nào, xếp loại gì và có đạt giải thưởng học thuật nào nổi bật không?",
  },
  {
    icon: Layers,
    label: "Dự án thực tế nổi bật",
    prompt: "Hãy giới thiệu chi tiết về dự án thực tế tiêu biểu nhất mà Thịnh đã hoàn thành?",
  },
  {
    icon: FileText,
    label: "Kiểm tra độ phù hợp với JD",
    prompt: "Tôi là nhà tuyển dụng, tôi muốn kiểm tra xem Thịnh có phù hợp với vị trí này không: [Hãy dán JD vào đây]",
  },
];

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Khởi tạo lời chào ban đầu
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome-msg",
          role: "model",
          text: `Xin chào! 👋 Tôi là **Thịnh AI** — Trợ lý ảo đại diện cho **Trần Mai Trường Thịnh** (Software Engineer & Computer Engineer).

Tôi được huấn luyện trên toàn bộ hồ sơ năng lực, bằng cấp Kỹ sư HUTECH, giải Olympic Tin học và các dự án thực tế của Thịnh. Bạn có thể hỏi tôi bất kỳ điều gì hoặc **dán Mô tả công việc (JD)** vào đây để tôi phân tích độ phù hợp!`,
          timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [messages.length]);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input khi mở chat
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Chuẩn bị lịch sử hội thoại gửi lên server
      const history = messages
        .filter((m) => m.id !== "welcome-msg")
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể nhận phản hồi từ AI.");
      }

      const botMsg: Message = {
        id: `model-${Date.now()}`,
        role: "model",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: "model",
        text: `⚠ **Lỗi:** ${err instanceof Error ? err.message : "Đã xảy ra sự cố kết nối tới Gemini AI."} Vui lòng thử lại.`,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "model",
        text: `Đã làm mới cuộc hội thoại! Bạn có thể đặt câu hỏi mới về kinh nghiệm, kỹ năng, dự án hoặc đối soát JD tuyển dụng của bạn.`,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Button (FAB Launcher) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-zinc-950/90 border border-emerald-500/40 hover:border-emerald-500 text-zinc-100 shadow-2xl shadow-emerald-500/20 backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer"
          aria-label="Mở Trợ lý AI hỏi đáp về Thịnh"
        >
          {/* Animated glow circle */}
          <div className="relative flex items-center justify-center">
            <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping opacity-75" />
            <div className="relative w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-zinc-950 font-bold">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-zinc-100 flex items-center gap-1 font-sans">
              Hỏi AI về Thịnh
              <Sparkles className="w-3 h-3 text-amber-400" />
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Gemini 2.5 Flash</span>
          </div>
        </button>
      )}

      {/* Main Chat Dialog Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="ai-chat-header-title"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] md:w-[460px] h-[600px] max-h-[85vh] flex flex-col rounded-3xl bg-zinc-950 border border-emerald-500/30 shadow-2xl shadow-black/80 backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
                <Bot className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-zinc-950" />
              </div>
              <div>
                <h3 id="ai-chat-header-title" className="text-sm font-bold text-zinc-100 flex items-center gap-1.5 font-sans">
                  <span>Thịnh AI Assistant</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-mono border border-emerald-500/30">
                    Online
                  </span>
                </h3>
                <p className="text-[10px] font-mono text-zinc-400">
                  Google Gemini 2.5 • Phỏng vấn &amp; Hỏi đáp
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800/80 transition-colors cursor-pointer"
                title="Xóa lịch sử chat"
                aria-label="Xóa lịch sử chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
                title="Đóng cửa sổ"
                aria-label="Đóng cửa sổ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div
            data-lenis-prevent
            className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs font-sans overscroll-contain"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "model" && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`group relative max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                    m.role === "user"
                      ? "bg-emerald-500 text-zinc-950 font-medium rounded-tr-sm shadow-md"
                      : "bg-zinc-900/90 border border-zinc-800/80 text-zinc-200 rounded-tl-sm shadow-sm"
                  }`}
                >
                  {/* Markdown formatted text */}
                  <div className="whitespace-pre-wrap break-words prose prose-invert prose-xs max-w-none prose-p:my-1 prose-headings:text-zinc-100 prose-strong:text-emerald-400 prose-ul:my-1 prose-li:my-0.5">
                    {m.text}
                  </div>

                  {/* Message Meta & Copy button */}
                  <div
                    className={`flex items-center justify-between gap-3 mt-1.5 pt-1 text-[10px] font-mono ${
                      m.role === "user" ? "text-zinc-950/70 border-t border-zinc-950/10" : "text-zinc-400 border-t border-zinc-800/60"
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {m.role === "model" && (
                      <button
                        onClick={() => copyToClipboard(m.text, m.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                        title="Sao chép câu trả lời"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 text-zinc-400 text-xs flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span className="font-mono">Thịnh AI đang suy nghĩ...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar (Hiển thị khi ít tin nhắn) */}
          {messages.length <= 3 && !loading && (
            <div className="px-4 py-2 border-t border-zinc-850 bg-zinc-900/40">
              <span className="text-[10px] font-mono text-zinc-400 mb-1.5 block">
                Gợi ý câu hỏi nhanh:
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {QUICK_PROMPTS.map((qp, idx) => {
                  const Icon = qp.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(qp.prompt)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-[11px] font-mono text-zinc-300 hover:text-emerald-400 transition-colors whitespace-nowrap cursor-pointer shrink-0"
                    >
                      <Icon className="w-3 h-3 text-emerald-400" />
                      <span>{qp.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Box Footer */}
          <div className="p-3 border-t border-zinc-800 bg-zinc-950 shrink-0">
            <div className="relative rounded-2xl bg-zinc-900 border border-zinc-800 focus-within:border-emerald-500/60 transition-colors flex items-end p-2 gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi về kỹ năng, dự án, hoặc dán JD tuyển dụng..."
                rows={1}
                className="flex-1 bg-transparent border-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none resize-none max-h-24 p-1.5 font-sans leading-relaxed"
                style={{ minHeight: "36px" }}
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:cursor-not-allowed shrink-0"
                title="Gửi câu hỏi (Enter)"
                aria-label="Gửi câu hỏi"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-zinc-400 px-1">
              <span>Enter để gửi • Shift + Enter để xuống dòng</span>
              <span className="text-emerald-400/80">Gemini 2.5 Flash</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
