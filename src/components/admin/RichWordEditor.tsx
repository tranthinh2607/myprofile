"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import YoutubeExtension from "@tiptap/extension-youtube";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { uploadPostImage } from "@/app/admin/posts/actions";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  Link as LinkIcon,
  Unlink,
  ImageIcon,
  Video,
  Table as TableIcon,
  Undo,
  Redo,
  RemoveFormatting,
  Maximize2,
  Minimize2,
  FileText,
  Upload,
  Palette,
  Sparkles,
  Loader2,
  Trash2,
} from "lucide-react";

interface RichWordEditorProps {
  value: string;
  onChange: (value: string) => void;
  token?: string;
}

/**
 * Danh sách ký tự đặc biệt phong phú theo chuẩn Microsoft Word (Insert Symbol)
 */
const SPECIAL_SYMBOLS = [
  {
    category: "Toán học",
    items: [
      "±", "×", "÷", "≠", "≈", "≤", "≥", "∞", "√", "∑",
      "∏", "∫", "π", "µ", "α", "β", "γ", "θ", "λ", "σ",
      "ω", "Δ", "Ω", "½", "¼", "¾", "²", "³", "‰", "℃", "℉"
    ],
  },
  {
    category: "Tiền tệ",
    items: ["₫", "$", "€", "£", "¥", "₩", "₹", "₽", "₿", "¢"],
  },
  {
    category: "Mũi tên",
    items: [
      "→", "←", "↑", "↓", "↔", "↕", "⇒", "⇐", "⇑", "⇓",
      "⇔", "➔", "➜", "➤", "▲", "▼", "◄", "►"
    ],
  },
  {
    category: "Ký hiệu",
    items: [
      "©", "®", "™", "°", "•", "‣", "—", "–", "§", "¶",
      "†", "‡", "✓", "✔", "✕", "✗", "★", "☆", "♥", "♦",
      "♠", "♣", "«", "»", "“", "”", "‘", "’", "…", "·"
    ],
  },
  {
    category: "Biểu tượng",
    items: [
      "💡", "⚡", "🔥", "🎯", "✨", "🚀", "⭐", "📌", "🏷️", "✅",
      "❌", "⚠️", "❓", "💬", "💻", "📱", "☕", "🎉", "🏆", "🔍",
      "🔒", "🔑", "📊", "📈"
    ],
  },
];

/**
 * Custom Tiptap Image Node hỗ trợ căn lề (Trái / Giữa / Phải) và kích thước (Nhỏ / Vừa / Toàn khổ)
 */
const CustomImage = ImageExtension.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alignment: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align") || "center",
        renderHTML: (attributes) => ({
          "data-align": attributes.alignment || "center",
        }),
      },
      size: {
        default: "medium",
        parseHTML: (element) => element.getAttribute("data-size") || "medium",
        renderHTML: (attributes) => ({
          "data-size": attributes.size || "medium",
        }),
      },
    };
  },
});

/**
 * Tự động tối ưu hóa kích thước ảnh và chuyển thành DataURL base64
 * Giúp ảnh paste vào hiển thị ngay lập tức, không làm gián đoạn việc gõ chữ
 */
function compressImageFile(file: File, maxWidth = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === "image/svg+xml" || file.type === "image/gif") {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
        const dataUrl = canvas.toDataURL(outputType, quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function RichWordEditor({ value, onChange, token }: RichWordEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showSymbolModal, setShowSymbolModal] = useState(false);
  const [symbolCategory, setSymbolCategory] = useState("Toán học");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [sourceMode, setSourceMode] = useState(false);
  const [rawSource, setRawSource] = useState(value);

  const fileInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  // Xử lý nạp ảnh (từ Clipboard Paste, Drag & Drop hoặc File Picker)
  const handleImageFile = useCallback(
    async (file: File) => {
      setIsUploadingImage(true);
      try {
        const dataUrl = await compressImageFile(file);
        const ed = editorRef.current;
        if (ed) {
          ed.chain().focus().setImage({ src: dataUrl, alt: file.name || "Ảnh bài viết" }).run();
        }

        // Tải ngầm lên Supabase Storage nếu có token hợp lệ
        if (token) {
          try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await uploadPostImage(token, formData);
            if (res.success && res.url && ed) {
              const currentHTML = ed.getHTML();
              if (currentHTML.includes(dataUrl)) {
                const updatedHTML = currentHTML.replace(dataUrl, res.url);
                ed.commands.setContent(updatedHTML, { emitUpdate: true });
                onChange(updatedHTML);
              }
            }
          } catch (uploadErr) {
            console.warn("Upload ảnh lên Supabase Storage không khả dụng, giữ bản base64 an toàn:", uploadErr);
          }
        }
      } catch (err) {
        console.error("Lỗi đọc file ảnh:", err);
      } finally {
        setIsUploadingImage(false);
        setShowImageMenu(false);
      }
    },
    [token, onChange]
  );

  const handleImageFileRef = useRef(handleImageFile);
  useEffect(() => {
    handleImageFileRef.current = handleImageFile;
  }, [handleImageFile]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: {
          HTMLAttributes: {
            class: "rounded-xl bg-zinc-950 p-4 font-mono text-sm border border-zinc-800 my-4 text-emerald-300",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-emerald-500 bg-emerald-500/5 pl-4 py-2 my-4 rounded-r-lg italic text-zinc-300",
          },
        },
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-emerald-400 underline underline-offset-4 hover:text-emerald-300",
        },
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-2xl border border-zinc-800 shadow-2xl transition-all",
        },
      }),
      YoutubeExtension.configure({
        width: 840,
        height: 470,
        HTMLAttributes: {
          class: "rounded-2xl border border-zinc-800 shadow-2xl my-6 w-full aspect-video",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-zinc-800 my-6 w-full rounded-xl overflow-hidden",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border-b border-zinc-800",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-zinc-800 bg-zinc-800/80 p-3 text-left font-semibold text-zinc-200 text-sm",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-zinc-800 p-3 text-zinc-300 text-sm",
        },
      }),
      Placeholder.configure({
        placeholder: "Nhập nội dung bài viết như soạn thảo Microsoft Word...",
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-base max-w-none focus:outline-none min-h-[500px] p-6 sm:p-10 text-zinc-200 font-sans leading-relaxed selection:bg-emerald-500 selection:text-black",
      },
      // XỬ LÝ DÁN ẢNH TRỰC TIẾP (PASTE IMAGE FROM CLIPBOARD / SCREENSHOT)
      handlePaste: (_view, event) => {
        const files = event.clipboardData?.files;
        const items = event.clipboardData?.items;
        let imageFile: File | null = null;

        if (files && files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            if (files[i].type.startsWith("image/")) {
              imageFile = files[i];
              break;
            }
          }
        }

        if (!imageFile && items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith("image/")) {
              const f = items[i].getAsFile();
              if (f) {
                imageFile = f;
                break;
              }
            }
          }
        }

        if (imageFile) {
          event.preventDefault();
          handleImageFileRef.current(imageFile);
          return true;
        }

        // Tự động nhận diện nếu dán URL ảnh trực tiếp
        const text = event.clipboardData?.getData("text/plain")?.trim();
        if (text && /^https?:\/\/.+\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i.test(text)) {
          event.preventDefault();
          editorRef.current?.chain().focus().setImage({ src: text, alt: "Ảnh chèn từ liên kết" }).run();
          return true;
        }

        return false;
      },
      // XỬ LÝ KÉO THẢ ẢNH (DRAG & DROP IMAGE)
      handleDrop: (_view, event, _slice, moved) => {
        if (moved) return false;
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            if (files[i].type.startsWith("image/")) {
              event.preventDefault();
              handleImageFileRef.current(files[i]);
              return true;
            }
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      onChange(html);
      setRawSource(html);
    },
  });

  // Keep editorRef updated
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Sync external value changes when not focused
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value);
      setRawSource(value);
    }
  }, [value, editor]);

  // Insert Image via URL prompt
  const handleInsertImageUrl = useCallback(() => {
    if (!editor) return;
    const url = prompt(
      "Nhập URL hình ảnh (vd: https://images.unsplash.com/... hoặc /images/...):"
    );
    if (url) {
      const alt = prompt("Nhập chú thích / mô tả ảnh (tùy chọn):", "") || "";
      editor.chain().focus().setImage({ src: url, alt }).run();
    }
  }, [editor]);

  // Insert YouTube Video
  const handleInsertYoutube = useCallback(() => {
    if (!editor) return;
    const url = prompt(
      "Dán liên kết YouTube (vd: https://www.youtube.com/watch?v=... hoặc https://youtu.be/...):"
    );
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);

  // Insert Link
  const handleInsertLink = useCallback(() => {
    if (!editor) return;
    const prevUrl = editor.getAttributes("link").href;
    const url = prompt("Nhập địa chỉ liên kết (URL):", prevUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  // Insert Table
  const handleInsertTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    setShowTableMenu(false);
  }, [editor]);

  // Text Colors palette
  const colors = [
    { label: "Mặc định (Trắng)", value: "#f4f4f5" },
    { label: "Xanh Emerald", value: "#34d399" },
    { label: "Xanh Cyan", value: "#38bdf8" },
    { label: "Vàng Hổ Phách", value: "#fbbf24" },
    { label: "Đỏ Hồng", value: "#fb7185" },
    { label: "Tím Mộng Mơ", value: "#c084fc" },
    { label: "Xám Bạc", value: "#9ca3af" },
  ];

  // Word & Character count calculation
  const textContent = editor?.getText() || "";
  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
  const charCount = textContent.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  if (!editor) {
    return (
      <div className="h-[550px] rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center animate-pulse text-zinc-500 font-mono text-sm">
        Đang khởi động trình soạn thảo Word...
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none bg-zinc-950 border-none p-4"
          : "relative"
      }`}
    >
      {/* ============================================================ */}
      {/* MICROSOFT WORD STYLE TOP RIBBON TOOLBAR                      */}
      {/* ============================================================ */}
      <div className="border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-md sticky top-0 z-20 select-none">
        {/* Ribbon Top Brand Bar */}
        <div className="px-4 py-2 border-b border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
              W
            </div>
            <span className="font-semibold text-zinc-200 font-sans">
              Soạn Thảo Văn Bản (Word Rich Editor)
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-[11px] text-emerald-400 font-mono">
              WYSIWYG Tự Động Định Dạng
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Source Code / Word Mode */}
            <button
              type="button"
              onClick={() => {
                if (sourceMode && editor) {
                  editor.commands.setContent(rawSource);
                  onChange(rawSource);
                }
                setSourceMode(!sourceMode);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-colors border ${
                sourceMode
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                  : "bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:text-white"
              }`}
              title="Chuyển đổi giữa giao diện Word và Mã nguồn HTML/Markdown"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{sourceMode ? "Quay lại Word" : "Xem mã HTML"}</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              title={isFullscreen ? "Thu nhỏ màn hình" : "Toàn màn hình soạn thảo"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Ribbon Tools Panel */}
        {!sourceMode && (
          <div className="p-2.5 flex flex-wrap items-center gap-1.5 text-zinc-300">
            {/* Nhóm 1: Undo / Redo */}
            <div className="flex items-center gap-0.5 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800/80">
              <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-zinc-300 hover:text-white"
                title="Hoàn tác (Undo - Ctrl+Z)"
              >
                <Undo className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-zinc-300 hover:text-white"
                title="Làm lại (Redo - Ctrl+Y)"
              >
                <Redo className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-px h-5 bg-zinc-800 mx-0.5" />

            {/* Nhóm 2: Style & Headings Dropdown */}
            <div className="flex items-center gap-0.5 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800/80">
              <button
                type="button"
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  editor.isActive("paragraph")
                    ? "bg-emerald-500/20 text-emerald-400 font-semibold"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Đoạn văn thường (Normal text)"
              >
                <span className="flex items-center gap-1">
                  <Pilcrow className="w-3 h-3" />
                  Văn bản
                </span>
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  editor.isActive("heading", { level: 1 })
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Tiêu đề 1 (Heading 1 - H1)"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  editor.isActive("heading", { level: 2 })
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Tiêu đề 2 (Heading 2 - H2)"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  editor.isActive("heading", { level: 3 })
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Tiêu đề 3 (Heading 3 - H3)"
              >
                <Heading3 className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-5 bg-zinc-800 mx-0.5" />

            {/* Nhóm 3: Font Styles (Bold, Italic, Underline, Strike, Code) */}
            <div className="flex items-center gap-0.5 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800/80">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive("bold")
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Chữ Đậm (Ctrl+B)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive("italic")
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Chữ Nghiêng (Ctrl+I)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive("underline")
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Gạch Chân (Ctrl+U)"
              >
                <UnderlineIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive("strike")
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Gạch Ngang Chữ"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive("code")
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Mã nội dòng (Inline code)"
              >
                <Code className="w-3.5 h-3.5" />
              </button>

              {/* Color Picker Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 transition-colors"
                  title="Màu chữ"
                >
                  <Palette className="w-3.5 h-3.5" />
                </button>
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-2 p-2 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-30 flex flex-col gap-1 w-44">
                    <span className="text-[10px] font-mono text-zinc-500 px-2 py-1">
                      CHỌN MÀU CHỮ:
                    </span>
                    {colors.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => {
                          editor.chain().focus().setColor(c.value).run();
                          setShowColorPicker(false);
                        }}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-800 text-xs text-left transition-colors"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-zinc-700"
                          style={{ backgroundColor: c.value }}
                        />
                        <span className="text-zinc-200">{c.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="w-px h-5 bg-zinc-800 mx-0.5" />

            {/* Nhóm 4: Căn lề đoạn văn (Alignments) */}
            <div className="flex items-center gap-0.5 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800/80">
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive({ textAlign: "left" })
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Căn lề trái"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive({ textAlign: "center" })
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Căn giữa"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive({ textAlign: "right" })
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Căn lề phải"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive({ textAlign: "justify" })
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Căn đều hai bên"
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-px h-5 bg-zinc-800 mx-0.5" />

            {/* Nhóm 5: Danh sách & Khối (Lists & Blocks) */}
            <div className="flex items-center gap-0.5 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800/80">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive("bulletList")
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Danh sách dấu chấm (Bullet List)"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive("orderedList")
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Danh sách đánh số (Numbered List)"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive("blockquote")
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Trích dẫn đoạn (Blockquote)"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive("codeBlock")
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Khối mã code lập trình"
              >
                <Code2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                title="Đường phân cách ngang (Divider)"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-px h-5 bg-zinc-800 mx-0.5" />

            {/* Nhóm 6: Chèn Đa Phương Tiện (Images, YouTube, Links, Tables) */}
            <div className="flex items-center gap-1 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800/80">
              {/* Insert Image Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowImageMenu(!showImageMenu)}
                  disabled={isUploadingImage}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 transition-colors disabled:opacity-50"
                  title="Chèn ảnh (Ctrl+V để dán ảnh trực tiếp từ clipboard)"
                >
                  {isUploadingImage ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  ) : (
                    <ImageIcon className="w-3.5 h-3.5" />
                  )}
                  <span>Chèn Ảnh</span>
                </button>

                {showImageMenu && (
                  <div className="absolute top-full left-0 mt-2 p-2 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-30 flex flex-col gap-1 w-64 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        fileInputRef.current?.click();
                        setShowImageMenu(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800 text-left text-zinc-200 hover:text-emerald-400 transition-colors"
                    >
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Tải ảnh từ máy tính</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowImageMenu(false);
                        handleInsertImageUrl();
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800 text-left text-zinc-200 hover:text-emerald-400 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4 text-cyan-400" />
                      <span>Nhập link ảnh (URL)</span>
                    </button>
                    <div className="border-t border-zinc-800 my-1 pt-1.5 px-3 py-1.5 text-[11px] text-zinc-400 leading-relaxed font-sans bg-zinc-900/50 rounded-lg">
                      💡 <strong>Dán ảnh tức thì:</strong> Nhấn <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-emerald-400 font-mono text-[10px] border border-zinc-700">Ctrl + V</kbd> bất kỳ lúc nào để dán ảnh chụp màn hình trực tiếp!
                    </div>
                  </div>
                )}
              </div>

              {/* Hidden file input for image upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    handleImageFile(f);
                    e.target.value = "";
                  }
                }}
              />

              {/* Insert YouTube Video */}
              <button
                type="button"
                onClick={handleInsertYoutube}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-red-400 border border-red-500/30 hover:border-red-500/60 transition-colors"
                title="Chèn video YouTube trực tiếp"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video YouTube</span>
              </button>

              {/* Insert Link */}
              <button
                type="button"
                onClick={handleInsertLink}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive("link")
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
                title="Chèn liên kết web (Link)"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
              {editor.isActive("link") && (
                <button
                  type="button"
                  onClick={() => editor.chain().focus().unsetLink().run()}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-red-400 transition-colors"
                  title="Gỡ bỏ liên kết"
                >
                  <Unlink className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Insert Table */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTableMenu(!showTableMenu)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    editor.isActive("table")
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "hover:bg-zinc-800 text-zinc-300"
                  }`}
                  title="Chèn và quản lý bảng"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                </button>

                {showTableMenu && (
                  <div className="absolute top-full right-0 mt-2 p-2 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-30 flex flex-col gap-1 w-48 text-xs font-mono">
                    <button
                      type="button"
                      onClick={handleInsertTable}
                      className="px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 text-left text-emerald-400 transition-colors"
                    >
                      + Tạo bảng mới (3x3)
                    </button>
                    {editor.isActive("table") && (
                      <>
                        <button
                          type="button"
                          onClick={() => editor.chain().focus().addColumnAfter().run()}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 text-left text-zinc-300 transition-colors"
                        >
                          + Thêm cột phía sau
                        </button>
                        <button
                          type="button"
                          onClick={() => editor.chain().focus().addRowAfter().run()}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 text-left text-zinc-300 transition-colors"
                        >
                          + Thêm dòng phía dưới
                        </button>
                        <button
                          type="button"
                          onClick={() => editor.chain().focus().deleteRow().run()}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 text-left text-amber-400 transition-colors"
                        >
                          - Xóa dòng hiện tại
                        </button>
                        <button
                          type="button"
                          onClick={() => editor.chain().focus().deleteColumn().run()}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 text-left text-amber-400 transition-colors"
                        >
                          - Xóa cột hiện tại
                        </button>
                        <button
                          type="button"
                          onClick={() => editor.chain().focus().deleteTable().run()}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-red-950/40 text-left text-red-400 transition-colors"
                        >
                          ✕ Xóa toàn bộ bảng
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Insert Symbol (Ký tự đặc biệt - Ω) */}
              <button
                type="button"
                onClick={() => setShowSymbolModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 transition-colors"
                title="Chèn ký tự đặc biệt (Symbol - Ω)"
              >
                <span className="font-bold text-sm">Ω</span>
                <span>Ký tự</span>
              </button>

              {/* Clear Formatting */}
              <button
                type="button"
                onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Xóa định dạng đã chọn"
              >
                <RemoveFormatting className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* DYNAMIC IMAGE FORMAT BAR (Hiện khi người dùng click vào ảnh)  */}
        {/* ============================================================ */}
        {editor.isActive("image") && !sourceMode && (
          <div className="px-4 py-2 bg-emerald-950/40 border-t border-emerald-500/30 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5 mr-1">
              <ImageIcon className="w-3.5 h-3.5" />
              Định dạng ảnh:
            </span>

            {/* Căn lề ảnh */}
            <div className="flex items-center gap-0.5 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => editor.chain().focus().updateAttributes("image", { alignment: "left" }).run()}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  editor.getAttributes("image")?.alignment === "left"
                    ? "bg-emerald-500/25 text-emerald-400 font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="Căn lề trái"
              >
                Căn Trái
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().updateAttributes("image", { alignment: "center" }).run()}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  !editor.getAttributes("image")?.alignment || editor.getAttributes("image")?.alignment === "center"
                    ? "bg-emerald-500/25 text-emerald-400 font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="Căn giữa"
              >
                Căn Giữa
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().updateAttributes("image", { alignment: "right" }).run()}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  editor.getAttributes("image")?.alignment === "right"
                    ? "bg-emerald-500/25 text-emerald-400 font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="Căn lề phải"
              >
                Căn Phải
              </button>
            </div>

            {/* Kích thước ảnh */}
            <div className="flex items-center gap-0.5 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => editor.chain().focus().updateAttributes("image", { size: "small" }).run()}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  editor.getAttributes("image")?.size === "small"
                    ? "bg-emerald-500/25 text-emerald-400 font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="Kích thước nhỏ (320px)"
              >
                Nhỏ (320px)
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().updateAttributes("image", { size: "medium" }).run()}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  !editor.getAttributes("image")?.size || editor.getAttributes("image")?.size === "medium"
                    ? "bg-emerald-500/25 text-emerald-400 font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="Kích thước vừa (580px)"
              >
                Vừa (580px)
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().updateAttributes("image", { size: "full" }).run()}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  editor.getAttributes("image")?.size === "full"
                    ? "bg-emerald-500/25 text-emerald-400 font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="Kích thước đầy đủ (100%)"
              >
                Toàn khổ (100%)
              </button>
            </div>

            {/* Sửa chú thích ảnh */}
            <button
              type="button"
              onClick={() => {
                const currentAlt = editor.getAttributes("image")?.alt || "";
                const newAlt = prompt("Nhập chú thích / mô tả cho ảnh này:", currentAlt);
                if (newAlt !== null) {
                  editor.chain().focus().updateAttributes("image", { alt: newAlt }).run();
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            >
              Chú thích ảnh
            </button>

            {/* Xóa ảnh */}
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteSelection().run()}
              className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 ml-auto"
            >
              <Trash2 className="w-3 h-3" />
              <span>Xóa ảnh</span>
            </button>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* DOCUMENT WRITING CANVAS ("TỜ GIẤY TÀI LIỆU SOẠN THẢO WORD")   */}
      {/* ============================================================ */}
      <div
        onPaste={(e) => {
          const files = e.clipboardData?.files;
          const items = e.clipboardData?.items;
          let imageFile: File | null = null;
          if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
              if (files[i].type.startsWith("image/")) {
                imageFile = files[i];
                break;
              }
            }
          }
          if (!imageFile && items) {
            for (let i = 0; i < items.length; i++) {
              if (items[i].type.startsWith("image/")) {
                const f = items[i].getAsFile();
                if (f) {
                  imageFile = f;
                  break;
                }
              }
            }
          }
          if (imageFile) {
            e.preventDefault();
            handleImageFile(imageFile);
          }
        }}
        className="flex-1 bg-zinc-950/80 p-4 sm:p-8 overflow-y-auto max-h-[720px] block"
      >
        {sourceMode ? (
          <div className="max-w-4xl mx-auto space-y-2">
            <span className="text-xs font-mono text-zinc-500">
              // Chế độ chỉnh sửa trực tiếp mã nguồn HTML / Markdown:
            </span>
            <textarea
              value={rawSource}
              onChange={(e) => {
                setRawSource(e.target.value);
                onChange(e.target.value);
              }}
              rows={22}
              className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs leading-relaxed focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        ) : (
          <div
            onClick={() => editor.chain().focus().run()}
            className="max-w-4xl mx-auto bg-zinc-900/60 border border-zinc-800/80 rounded-2xl shadow-2xl focus-within:border-emerald-500/40 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all cursor-text min-h-[600px] overflow-hidden"
          >
            <EditorContent editor={editor} />
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* WORD STATUS BAR (Thanh trạng thái đếm từ & ký tự)           */}
      {/* ============================================================ */}
      <div className="px-5 py-2.5 bg-zinc-900 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-zinc-500" />
            Số từ: <strong className="text-zinc-200">{wordCount}</strong>
          </span>
          <span>•</span>
          <span>
            Ký tự: <strong className="text-zinc-200">{charCount}</strong>
          </span>
          <span>•</span>
          <span>
            Ước tính: <strong className="text-emerald-400">{readTime} phút đọc</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-zinc-500">
          {isUploadingImage && (
            <span className="flex items-center gap-1.5 text-emerald-400 animate-pulse font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Đang xử lý &amp; dán ảnh...
            </span>
          )}
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sẵn sàng xuất bản lên Blog</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SYMBOL PICKER MODAL (KÝ TỰ ĐẶC BIỆT CHUẨN MICROSOFT WORD)    */}
      {/* ============================================================ */}
      {showSymbolModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-base">
                  Ω
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 font-sans">
                    Chèn Ký Tự Đặc Biệt (Word Symbols)
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    Nhấp vào bất kỳ ký hiệu nào để chèn vào văn bản
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSymbolModal(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1 border-b border-zinc-800 pb-2">
              {SPECIAL_SYMBOLS.map((cat) => (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setSymbolCategory(cat.category)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    symbolCategory === cat.category
                      ? "bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            {/* Symbols Grid */}
            <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 max-h-56 overflow-y-auto p-1.5 bg-zinc-950/60 rounded-xl border border-zinc-800/60">
              {SPECIAL_SYMBOLS.find((c) => c.category === symbolCategory)?.items.map((sym, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().insertContent(sym).run();
                    setShowSymbolModal(false);
                  }}
                  className="h-10 rounded-lg hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-transparent text-lg text-zinc-200 hover:text-emerald-400 flex items-center justify-center transition-all cursor-pointer select-none active:scale-95"
                  title={sym}
                >
                  {sym}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowSymbolModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
