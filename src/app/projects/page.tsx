import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { projectsData } from "@/data/profile-data";
import { ProjectsListClient } from "./ProjectsListClient";
import { Layers, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Dự Án Kỹ Thuật & Sản Phẩm Thực Tế | Trần Mai Trường Thịnh",
  description:
    "Tổng hợp toàn bộ các dự án phần mềm, nền tảng thi trực tuyến, ứng dụng Generative AI và công cụ kỹ thuật hệ thống do Trần Mai Trường Thịnh phát triển.",
  openGraph: {
    title: "Dự Án Kỹ Thuật & Sản Phẩm Thực Tế | Trần Mai Trường Thịnh",
    description:
      "Tổng hợp các dự án phần mềm và công cụ thực tế đã triển khai và ứng dụng.",
    url: "https://tranmaitruongthinh.dev/projects",
    type: "website",
  },
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Fixed Header */}
      <Header />

      {/* Main Content Workspace */}
      <main className="flex-1 pt-24 pb-20">
        {/* Page Hero Header */}
        <div className="border-b border-zinc-800/60 bg-zinc-950/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="max-w-3xl space-y-4">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="text-xs text-zinc-500 hover:text-zinc-300 font-mono transition-colors"
                >
                  thinh.tran()
                </Link>
                <span className="text-zinc-600 text-xs">/</span>
                <span className="text-xs text-emerald-400 font-mono">projects</span>
              </div>

              {/* Title & Badge */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>// FULL ENGINEERING PORTFOLIO</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-100 font-sans">
                  Dự Án Sản Phẩm &amp; Công Cụ Kỹ Thuật
                </h1>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  Tập hợp các sản phẩm phần mềm Web hiện đại (Next.js, React 19, TypeScript), ứng dụng GenAI (Google Gemini) và công cụ tự động hóa hệ thống đã được triển khai, kiểm thử thực tế.
                </p>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono pt-2">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  {projectsData.length} dự án hoàn thiện
                </span>
                <span>• Đầy đủ Live Demo &amp; Mã nguồn GitHub</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Content Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ProjectsListClient projects={projectsData} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
