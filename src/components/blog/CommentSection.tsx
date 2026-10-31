"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Comment, CommentWithReplies } from "@/types/supabase";
import {
  MessageSquare,
  Reply,
  Send,
  Loader2,
  Shield,
  ChevronDown,
} from "lucide-react";

// Utility: gravatar URL
function getGravatarUrl(email: string, size = 40): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${Array.from(new Uint8Array(data)).map(b => b.toString(16).padStart(2, '0')).join('')}?s=${size}&d=identicon`;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "vừa xong";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} ngày trước`;
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

// ============================================================
// COMMENT FORM
// ============================================================
interface CommentFormProps {
  postId: string;
  parentId?: string;
  replyTo?: string;
  onSuccess: (comment: Comment) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
}

function CommentForm({
  postId,
  parentId,
  replyTo,
  onSuccess,
  onCancel,
  autoFocus,
}: CommentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lastSubmit, setLastSubmit] = useState(0);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && contentRef.current) {
      contentRef.current.focus();
      if (replyTo) {
        setContent(`@${replyTo} `);
      }
    }
  }, [autoFocus, replyTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-spam: min 3 giây giữa 2 lần submit
    const now = Date.now();
    if (now - lastSubmit < 3000) {
      setError("Vui lòng chờ 3 giây trước khi gửi lại.");
      return;
    }

    if (!name.trim() || name.trim().length < 2) {
      setError("Tên phải có ít nhất 2 ký tự.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email không hợp lệ.");
      return;
    }
    if (!content.trim() || content.trim().length < 3) {
      setError("Bình luận phải có ít nhất 3 ký tự.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error: dbError } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          parent_id: parentId || null,
          author_name: name.trim(),
          author_email: email.trim().toLowerCase(),
          content: content.trim(),
          is_admin: false,
          status: "approved",
        })
        .select()
        .single();

      if (dbError) {
        setError("Gửi bình luận thất bại. Thử lại sau.");
        return;
      }

      setLastSubmit(now);
      onSuccess(data as Comment);
      setContent("");
      if (!parentId) {
        setName("");
        setEmail("");
      }
    } catch {
      setError("Lỗi kết nối. Kiểm tra lại mạng.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {replyTo && (
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <Reply className="w-3 h-3 text-emerald-400" />
          <span>
            Đang trả lời <span className="text-emerald-400 font-semibold">{replyTo}</span>
          </span>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-zinc-500 hover:text-zinc-300 transition-colors ml-1"
            >
              (Hủy)
            </button>
          )}
        </div>
      )}

      {!parentId && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên của bạn *"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60 transition-colors font-sans"
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (ẩn, dùng tạo avatar) *"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60 transition-colors font-sans"
            />
          </div>
        </div>
      )}

      <div className="relative">
        <textarea
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            parentId
              ? "Nhập câu trả lời của bạn..."
              : "Chia sẻ suy nghĩ của bạn về bài viết này..."
          }
          rows={parentId ? 3 : 4}
          required
          className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60 transition-colors font-sans leading-relaxed resize-none"
        />
        <span className="absolute bottom-3 right-3 text-[10px] text-zinc-600 font-mono">
          {content.length}
        </span>
      </div>

      {error && (
        <p className="text-xs text-red-400 font-mono">{error}</p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-[10px] text-zinc-600 font-mono">
          Email của bạn sẽ không được hiển thị công khai.
        </p>
        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs font-mono transition-colors"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-zinc-950 text-xs font-mono font-semibold transition-all shadow-md shadow-emerald-500/20"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            {submitting ? "Đang gửi..." : "Gửi bình luận"}
          </button>
        </div>
      </div>
    </form>
  );
}

// ============================================================
// SINGLE COMMENT
// ============================================================
interface SingleCommentProps {
  comment: Comment;
  postId: string;
  onReply: (comment: Comment) => void;
  onNewComment: (comment: Comment) => void;
  replyingTo: string | null;
  isReplyForm?: boolean;
}

function SingleComment({
  comment,
  postId,
  onReply,
  onNewComment,
  replyingTo,
}: SingleCommentProps) {
  const isShowingReplyForm = replyingTo === comment.id;

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(comment.author_name)}&backgroundColor=10b981,0891b2,6366f1,f59e0b&fontFamily=Helvetica`}
          alt={comment.author_name}
          className="w-9 h-9 rounded-full border border-zinc-700 bg-zinc-800"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-zinc-200 font-sans">
            {comment.author_name}
          </span>
          {comment.is_admin && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold">
              <Shield className="w-2.5 h-2.5" />
              TÁC GIẢ
            </span>
          )}
          <span className="text-xs text-zinc-500 font-mono">
            {timeAgo(comment.created_at)}
          </span>
        </div>

        {/* Content */}
        <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </div>

        {/* Reply button */}
        <button
          onClick={() => onReply(comment)}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-emerald-400 font-mono transition-colors"
        >
          <Reply className="w-3 h-3" />
          Trả lời
        </button>

        {/* Inline reply form */}
        {isShowingReplyForm && (
          <div className="mt-3 pl-4 border-l-2 border-emerald-500/30">
            <CommentForm
              postId={postId}
              parentId={comment.id}
              replyTo={comment.author_name}
              onSuccess={onNewComment}
              onCancel={() => onReply({ ...comment, id: "" })}
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// COMMENT SECTION (Main)
// ============================================================
interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .eq("status", "approved")
        .order("created_at", { ascending: true });

      if (!error && data) {
        setComments(data as Comment[]);
      }
    } catch {
      // Silent
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // Fetch initial comments
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Supabase Realtime subscription
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        (payload: { new: Record<string, unknown> }) => {
          const newComment = payload.new as Comment;
          if (newComment.status === "approved") {
            setComments((prev) => {
              // Tránh duplicate
              if (prev.find((c) => c.id === newComment.id)) return prev;
              return [...prev, newComment];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const handleNewComment = useCallback((comment: Comment) => {
    setComments((prev) => {
      if (prev.find((c) => c.id === comment.id)) return prev;
      return [...prev, comment];
    });
    setReplyingTo(null);
  }, []);

  const handleReply = useCallback((comment: Comment) => {
    setReplyingTo((prev) => (prev === comment.id ? null : comment.id));
  }, []);

  // Build tree: root comments + their replies
  const rootComments = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent_id === parentId);

  const totalCount = comments.length;

  return (
    <div className="space-y-8" id="comments">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-100">
            Thảo luận{" "}
            {totalCount > 0 && (
              <span className="text-emerald-400">({totalCount})</span>
            )}
          </h2>
          <p className="text-xs text-zinc-500 font-mono">
            Bình luận mới xuất hiện ngay lập tức (Realtime)
          </p>
        </div>
      </div>

      {/* New Comment Form */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-200">Để lại bình luận</h3>
        <CommentForm
          postId={postId}
          onSuccess={handleNewComment}
        />
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-zinc-800 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-zinc-800 rounded w-32" />
                <div className="h-4 bg-zinc-800 rounded w-full" />
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : rootComments.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-zinc-800/60 bg-zinc-900/20">
          <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-sm text-zinc-400 font-sans">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {rootComments.map((comment) => {
            const replies = getReplies(comment.id);
            return (
              <div
                key={comment.id}
                className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/70 space-y-4"
              >
                <SingleComment
                  comment={comment}
                  postId={postId}
                  onReply={handleReply}
                  onNewComment={handleNewComment}
                  replyingTo={replyingTo}
                />

                {/* Replies */}
                {replies.length > 0 && (
                  <div className="ml-12 space-y-4 border-l-2 border-zinc-800/60 pl-4">
                    {replies.map((reply) => (
                      <SingleComment
                        key={reply.id}
                        comment={reply}
                        postId={postId}
                        onReply={handleReply}
                        onNewComment={handleNewComment}
                        replyingTo={replyingTo}
                      />
                    ))}
                  </div>
                )}

                {/* Inline reply form for root comment */}
                {replyingTo === comment.id && (
                  <div className="ml-12 pl-4 border-l-2 border-emerald-500/30">
                    <CommentForm
                      postId={postId}
                      parentId={comment.id}
                      replyTo={comment.author_name}
                      onSuccess={handleNewComment}
                      onCancel={() => setReplyingTo(null)}
                      autoFocus
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
