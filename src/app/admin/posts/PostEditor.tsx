"use client";

import React, { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Globe,
  Eye,
  Code2,
  Upload,
  X,
  Plus,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { createPost, updatePost, uploadCoverImage } from "./actions";
import { generateSlug } from "@/lib/blog-utils";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { RichWordEditor } from "@/components/admin/RichWordEditor";
import type { Post } from "@/types/supabase";

interface PostEditorProps {
  mode: "new" | "edit";
  initialPost?: Partial<Post>;
  token: string;
  onSave?: (post: Post) => void;
}

export function PostEditor({ mode, initialPost, token, onSave }: PostEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [coverImage, setCoverImage] = useState(initialPost?.cover_image || "");
  const [status, setStatus] = useState<"draft" | "published">(
    initialPost?.status || "draft"
  );
  const [tags, setTags] = useState<string[]>(initialPost?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugEdited) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setSlugEdited(true);
  };

  // Tag management
  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  // Upload cover image
  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadCoverImage(token, formData);
      if (result.success && result.url) {
        setCoverImage(result.url);
      } else {
        setError(result.error || "Upload thất bại");
      }
    } catch {
      setError("Lỗi upload ảnh");
    } finally {
      setUploading(false);
    }
  };

  // Save post
  const handleSave = async (saveStatus: "draft" | "published") => {
    if (!title.trim()) {
      setError("Tiêu đề không được để trống");
      return;
    }
    if (!content.trim()) {
      setError("Nội dung không được để trống");
      return;
    }

    setSaving(true);
    setError("");
    try {
      let result;
      if (mode === "edit" && initialPost?.id) {
        result = await updatePost(token, initialPost.id, {
          title,
          slug,
          excerpt,
          content,
          cover_image: coverImage || null,
          status: saveStatus,
          tags,
        });
      } else {
        result = await createPost(token, {
          title,
          slug,
          excerpt,
          content,
          cover_image: coverImage || undefined,
          status: saveStatus,
          tags,
        });
      }

      if (result.success && result.post) {
        onSave?.(result.post as Post);
        router.push("/admin/posts");
        router.refresh();
      } else {
        setError(result.error || "Lưu thất bại");
      }
    } catch {
      setError("Lỗi kết nối server");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/posts"
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-sm font-semibold font-sans">
                {mode === "new" ? "Tạo bài viết mới" : "Chỉnh sửa bài viết"}
              </h1>
              {slug && (
                <p className="text-[10px] text-zinc-500 font-mono">/blog/{slug}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {error && (
              <span className="text-xs text-red-400 font-mono hidden sm:block">
                {error}
              </span>
            )}
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs font-mono transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Lưu nháp
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-mono font-semibold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
              Xuất bản
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400">Tiêu đề bài viết *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Nhập tiêu đề bài viết..."
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-lg font-semibold placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400">Slug (URL)</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-mono whitespace-nowrap">/blog/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="tieu-de-bai-viet"
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400">
              Tóm tắt{" "}
              <span className="text-zinc-600">
                ({excerpt.length}/250 ký tự)
              </span>
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value.slice(0, 250))}
              placeholder="Nhập đoạn tóm tắt ngắn cho bài viết..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-colors resize-none"
            />
          </div>

          {/* Content Editor: Microsoft Word-Style Rich Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-zinc-200 font-sans">
                  Nội dung bài viết *
                </label>
                <p className="text-xs text-zinc-500 font-mono">
                  Soạn thảo trực quan chuẩn Word · Hỗ trợ in đậm, tiêu đề, màu sắc, chèn ảnh, bảng &amp; video YouTube
                </p>
              </div>
              <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                    activeTab === "edit"
                      ? "bg-zinc-800 text-zinc-100 font-medium shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Soạn thảo Word
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                    activeTab === "preview"
                      ? "bg-zinc-800 text-zinc-100 font-medium shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Xem trước độc giả
                </button>
              </div>
            </div>

            {activeTab === "edit" ? (
              <RichWordEditor
                value={content}
                onChange={setContent}
                token={token}
              />
            ) : (
              <div className="min-h-[500px] p-6 sm:p-10 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-2xl overflow-auto">
                {content ? (
                  <MarkdownRenderer content={content} />
                ) : (
                  <p className="text-zinc-600 italic">Chưa có nội dung để xem trước...</p>
                )}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 font-mono bg-red-950/20 border border-red-900/30 px-4 py-2.5 rounded-xl">
              ⚠ {error}
            </p>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Publish Status */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h3 className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider">
              Trạng thái
            </h3>
            <div className="flex gap-2">
              {(["draft", "published"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-2 rounded-xl text-xs font-mono font-semibold transition-all border ${
                    status === s
                      ? s === "published"
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                        : "bg-amber-500/15 border-amber-500/40 text-amber-400"
                      : "bg-zinc-800/50 border-zinc-700 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {s === "draft" ? "Nháp" : "Xuất bản"}
                </button>
              ))}
            </div>
          </div>

          {/* Cover Image */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h3 className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider">
              Ảnh bìa
            </h3>

            {coverImage ? (
              <div className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="w-full h-40 object-cover rounded-xl border border-zinc-700"
                />
                <button
                  onClick={() => setCoverImage("")}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700 text-zinc-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full h-32 rounded-xl border-2 border-dashed border-zinc-700 hover:border-emerald-500/50 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-zinc-300 transition-all group"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                    <span className="text-xs font-mono">Đang tải lên...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-6 h-6 group-hover:text-emerald-400 transition-colors" />
                    <span className="text-xs font-mono">Bấm để tải ảnh lên</span>
                    <span className="text-[10px] text-zinc-600">PNG, JPG, WebP (tối đa 5MB)</span>
                  </>
                )}
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadCover}
            />

            <div className="flex gap-2">
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="Hoặc dán URL ảnh..."
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono"
              />
              {!coverImage && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h3 className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider">
              Tags
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Nhập tag + Enter..."
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono"
              />
              <button
                onClick={() => addTag(tagInput)}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400 border border-zinc-700 hover:border-emerald-500/40 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1">
              {["Next.js", "React", "TypeScript", "Supabase", "AI", "Database", "DevOps"].map(
                (suggestion) =>
                  !tags.includes(suggestion) ? (
                    <button
                      key={suggestion}
                      onClick={() => addTag(suggestion)}
                      className="px-2 py-0.5 rounded-md bg-zinc-800/60 text-zinc-500 hover:text-emerald-400 text-[10px] font-mono transition-colors border border-zinc-700/50 hover:border-emerald-500/30"
                    >
                      + {suggestion}
                    </button>
                  ) : null
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <h3 className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider">
              Thống kê
            </h3>
            <div className="space-y-1.5 text-xs font-mono text-zinc-400">
              <div className="flex justify-between">
                <span>Từ:</span>
                <span className="text-zinc-200">
                  {content.trim().split(/\s+/).filter(Boolean).length.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Ký tự:</span>
                <span className="text-zinc-200">{content.length.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Thời gian đọc:</span>
                <span className="text-emerald-400">
                  ~{Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))} phút
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
