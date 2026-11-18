import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { certificatesData } from "@/data/profile-data";
import { CertificatesListClient } from "./CertificatesListClient";
import { ShieldCheck, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Văn Bằng & Chứng Chỉ Công Nghệ Quốc Tế | Trần Mai Trường Thịnh",
  description:
    "Bộ sưu tập đầy đủ Văn bằng Kỹ sư tốt nghiệp HUTECH và các chứng chỉ chuyên môn quốc tế được cấp bởi IBM, Google, Cisco Networking Academy, University of Michigan và OpenEDG Python Institute.",
  openGraph: {
    title: "Văn Bằng & Chứng Chỉ Công Nghệ Quốc Tế | Trần Mai Trường Thịnh",
    description:
      "Tập hợp văn bằng Kỹ sư và các chứng chỉ chuyên môn quốc tế được cấp bởi HUTECH, IBM, Google, Cisco, University of Michigan.",
    url: "https://tranmaitruongthinh.dev/certificates",
    type: "website",
  },
};

export default function CertificatesPage() {
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
                <span className="text-xs text-emerald-400 font-mono">certificates</span>
              </div>

              {/* Title & Badge */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>// VERIFIED TECHNICAL CREDENTIALS</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-100 font-sans">
                  Chứng Chỉ Công Nghệ &amp; Khảo Thí Quốc Tế
                </h1>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  Tập hợp văn bằng Kỹ sư tốt nghiệp HUTECH cùng các chứng chỉ chuyên môn quốc tế được cấp bởi IBM, Google, Cisco Networking Academy, University of Michigan và OpenEDG. Bạn có thể bấm vào từng chứng chỉ để xem chi tiết, phóng to ảnh gốc độ nét cao hoặc tải file PDF.
                </p>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono pt-2">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  {certificatesData.length} văn bằng &amp; chứng chỉ đã xác thực
                </span>
                <span>• Hỗ trợ xem trực tuyến &amp; tải ảnh gốc HD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Content Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <CertificatesListClient certificates={certificatesData} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
