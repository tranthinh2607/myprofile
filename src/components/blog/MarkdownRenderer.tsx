"use client";

import React, { useState } from "react";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { ImageIcon, Maximize2, X, Play } from "lucide-react";

// Import highlight.js theme cho dark mode
import "highlight.js/styles/github-dark.css";

interface MarkdownRendererProps {
  content: string;
}

// Trích xuất YouTube video ID từ các định dạng URL khác nhau
function extractYouTubeId(url: string): string | null {
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  } catch {
    return null;
  }
}

/**
 * Custom URL transformer để cho phép Data URL (base64) và Blob URL
 * Mặc định react-markdown chặn các URL protocol như data: và blob: vì lý do bảo mật,
 * khiến các hình ảnh paste từ clipboard (Data URLs) bị chuyển thành rỗng và không hiển thị trong Xem trước và Bài viết.
 */
const customUrlTransform = (url: string) => {
  if (!url) return "";
  if (url.startsWith("data:image/")) return url;
  if (url.startsWith("blob:")) return url;
  return defaultUrlTransform(url);
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [zoomImage, setZoomImage] = useState<{ src: string; alt?: string } | null>(null);

  return (
    <>
      <div
        className="markdown-body prose prose-invert prose-base max-w-none
        prose-headings:font-bold prose-headings:tracking-tight
        prose-h1:text-3xl prose-h1:text-zinc-50 prose-h1:mb-6 prose-h1:mt-10
        prose-h2:text-2xl prose-h2:text-zinc-100 prose-h2:mb-4 prose-h2:mt-8 prose-h2:border-b prose-h2:border-zinc-800 prose-h2:pb-2
        prose-h3:text-xl prose-h3:text-zinc-200 prose-h3:mb-3 prose-h3:mt-6
        prose-p:text-zinc-300 prose-p:leading-8 prose-p:my-4
        prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
        prose-strong:text-zinc-100 prose-strong:font-semibold
        prose-em:text-zinc-300
        prose-code:text-emerald-300 prose-code:bg-zinc-800/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-2xl prose-pre:shadow-xl
        prose-pre:my-6
        prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-500/5 prose-blockquote:pl-6 prose-blockquote:py-3 prose-blockquote:rounded-r-xl prose-blockquote:text-zinc-300 prose-blockquote:not-italic prose-blockquote:my-6
        prose-ul:text-zinc-300 prose-ul:my-4 prose-ul:space-y-1
        prose-ol:text-zinc-300 prose-ol:my-4 prose-ol:space-y-1
        prose-li:marker:text-emerald-500
        prose-table:border-collapse prose-table:w-full prose-table:my-6
        prose-th:bg-zinc-800 prose-th:text-zinc-200 prose-th:px-4 prose-th:py-3 prose-th:text-sm prose-th:font-semibold prose-th:border prose-th:border-zinc-700
        prose-td:text-zinc-300 prose-td:px-4 prose-td:py-2.5 prose-td:text-sm prose-td:border prose-td:border-zinc-800
        prose-hr:border-zinc-800 prose-hr:my-8
      "
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          urlTransform={customUrlTransform}
          components={{
            // ==========================================
            // THẺ ĐOẠN VĂN (P) - Tránh lỗi React validateDOMNesting khi p chứa figure
            // ==========================================
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            p: ({ node, children, ...props }: any) => {
              const hasBlockChild = node?.children?.some(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (c: any) =>
                  c?.type === "element" &&
                  (c?.tagName === "img" || c?.tagName === "figure" || c?.tagName === "div")
              );
              if (hasBlockChild) {
                return <div className="my-4">{children}</div>;
              }
              return <p {...props}>{children}</p>;
            },

            // ==========================================
            // HÌNH ẢNH (Image Component với zoom & caption)
            // ==========================================
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            img: ({ src, alt, ...props }: any) => {
              if (!src) return null;
              const align = props["data-align"] || "center";
              const size = props["data-size"] || "medium";

              const figureAlign =
                align === "left"
                  ? "mr-auto ml-0"
                  : align === "right"
                  ? "ml-auto mr-0"
                  : "mx-auto";

              const figureSize =
                size === "small"
                  ? "max-w-[320px]"
                  : size === "full"
                  ? "max-w-full w-full"
                  : "max-w-[620px]";

              return (
                <figure className={`my-8 group ${figureAlign} ${figureSize}`}>
                  <div
                    className="relative rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl transition-all duration-300 group-hover:border-emerald-500/40 cursor-zoom-in"
                    onClick={() => setZoomImage({ src, alt })}
                    title="Bấm để xem ảnh phóng to"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={alt || "Hình ảnh bài viết"}
                      loading="lazy"
                      className="w-full h-auto max-h-[520px] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
                      {...props}
                    />

                    {/* Zoom Icon Hint */}
                    <div className="absolute top-3 right-3 p-2 rounded-xl bg-zinc-950/80 border border-zinc-700/80 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-lg pointer-events-none">
                      <Maximize2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>

                  {/* Caption */}
                  {alt &&
                    alt !== "image.png" &&
                    alt !== "image.jpg" &&
                    alt !== "image.jpeg" &&
                    alt !== "image.webp" &&
                    alt !== "Ảnh bài viết" && (
                    <figcaption className="text-center text-xs text-zinc-400 font-mono mt-3 flex items-center justify-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-400/80" />
                      <span>{alt}</span>
                    </figcaption>
                  )}
                </figure>
              );
            },

            // ==========================================
            // VIDEO IFRAME (YouTube, Vimeo, etc.)
            // ==========================================
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            iframe: ({ src, title, ...props }: any) => {
              return (
                <div className="my-8 relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl">
                  <iframe
                    src={src}
                    title={title || "Video bài viết"}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    {...props}
                  />
                </div>
              );
            },

            // ==========================================
            // HTML5 VIDEO (<video controls ...>)
            // ==========================================
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            video: ({ src, ...props }: any) => {
              return (
                <div className="my-8 rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl">
                  <video
                    src={src}
                    controls
                    className="w-full h-auto max-h-[550px]"
                    {...props}
                  />
                </div>
              );
            },

            // ==========================================
            // LINK (Tự động nhận diện link YouTube trên 1 dòng)
            // ==========================================
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            a: ({ href, children, ...props }: any) => {
              if (href) {
                const ytId = extractYouTubeId(href);
                // Nếu nội dung link khớp với URL YouTube (người viết dán link trực tiếp)
                if (ytId && (typeof children === "string" && (children.includes("youtube.com") || children.includes("youtu.be")))) {
                  return (
                    <div className="my-8 relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${ytId}`}
                        title="YouTube Video Player"
                        className="absolute inset-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  );
                }
              }

              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline decoration-emerald-500/40 underline-offset-4 hover:decoration-emerald-400 transition-colors"
                  {...props}
                >
                  {children}
                </a>
              );
            },

            // ==========================================
            // CODE BLOCKS
            // ==========================================
            pre: ({ children, ...props }) => (
              <div className="relative group my-6">
                <pre {...props} className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-xl p-4">
                  {children}
                </pre>
              </div>
            ),

            // ==========================================
            // TABLES
            // ==========================================
            table: ({ children }) => (
              <div className="overflow-x-auto my-6 rounded-xl border border-zinc-800">
                <table className="w-full">{children}</table>
              </div>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* ========================================== */}
      {/* IMAGE ZOOM LIGHTBOX MODAL */}
      {/* ========================================== */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setZoomImage(null)}
        >
          <button
            onClick={() => setZoomImage(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900/80 border border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Đóng xem ảnh"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="max-w-5xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomImage.src}
              alt={zoomImage.alt || "Ảnh phóng to"}
              className="max-w-full max-h-[82vh] object-contain rounded-2xl border border-zinc-800 shadow-2xl"
            />
            {zoomImage.alt && (
              <p className="text-zinc-400 text-xs font-mono mt-3 text-center">
                {zoomImage.alt}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
