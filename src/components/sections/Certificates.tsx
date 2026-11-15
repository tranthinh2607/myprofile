"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { certificatesData } from "@/data/profile-data";
import { CertificateItem } from "@/types/profile";
import {
  ExternalLink,
  X,
  CheckCircle,
  Download,
  ShieldCheck,
  Maximize2,
  Layers,
} from "lucide-react";

export function Certificates() {
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [modalImageError, setModalImageError] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | "all">("all");

  // Hiển thị 6 chứng chỉ tiêu biểu trên trang chủ, bấm xem tất cả để mở trang riêng
  const featuredCertificates = certificatesData.slice(0, 6);

  // Reset modal image error & selected image index when selecting a new certificate
  useEffect(() => {
    setModalImageError(false);
    setSelectedImageIndex("all");
  }, [selectedCert]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCert(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section id="certificates" className="py-24 bg-zinc-950/80 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-mono">
            <span>// VERIFIED TECHNICAL CREDENTIALS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 font-sans">
            Chứng Chỉ Công Nghệ & Khảo Thí Quốc Tế
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Tập hợp văn bằng Kỹ sư tốt nghiệp HUTECH cùng các chứng chỉ chuyên môn quốc tế được cấp bởi IBM, Google, Cisco Networking Academy, University of Michigan và OpenEDG. Bấm vào từng chứng chỉ để phóng to xem ảnh sắc nét hoặc mở file PDF gốc.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCertificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className="group cursor-pointer rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-emerald-500/50 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/60"
            >
              <div className="space-y-4">
                {/* Top Issuer & Year */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-zinc-950 border border-zinc-800 text-emerald-400">
                    {cert.issuerLogoText}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">{cert.issueDate}</span>
                </div>

                {/* Certificate Image Frame */}
                {cert.imageUrl ? (
                  <div className="relative w-full aspect-[16/11] rounded-xl bg-zinc-950 overflow-hidden border border-zinc-800/90 shadow-inner group-hover:border-zinc-700 transition-colors">
                    <Image
                      src={cert.imageUrl}
                      alt={cert.title}
                      fill
                      unoptimized
                      className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                    />
                    {/* Badge indicating multiple images (ví dụ: văn bằng có 2 ảnh) */}
                    {cert.images && cert.images.length > 1 && (
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-zinc-950/90 border border-zinc-700/80 text-[11px] font-mono font-medium text-emerald-400 flex items-center gap-1.5 backdrop-blur-sm shadow-md">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{cert.images.length} ảnh</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700 text-xs font-mono text-white flex items-center gap-1.5 backdrop-blur-sm shadow-lg">
                        <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                        {cert.images && cert.images.length > 1 ? "Xem chi tiết cả 2 ảnh" : "Phóng to chứng chỉ"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-[16/11] rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 text-xs font-mono">
                    Chứng chỉ PDF
                  </div>
                )}

                {/* Certificate Title & Issuer */}
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-zinc-100 font-sans group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans">{cert.issuer}</p>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cert.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800/60 text-zinc-400"
                    >
                      {skill}
                    </span>
                  ))}
                  {cert.skills.length > 3 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 text-zinc-400">
                      +{cert.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-4 mt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-emerald-400 group-hover:text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5" />
                  Xem bản chứng chỉ
                </span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Nút Xem Tất Cả Chứng Chỉ Sang Trang Riêng (giống nút xem Blog) */}
        <div className="mt-14 text-center">
          <Link
            href="/certificates"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-sm font-mono text-zinc-200 hover:text-white transition-all shadow-lg hover:shadow-emerald-500/5 group cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Xem tất cả văn bằng &amp; chứng chỉ quốc tế</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Certificate Modal Dialog */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedCert(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-title"
        >
          <div
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors z-10"
              aria-label="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1.5 pr-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                  {selectedCert.issuer}
                </span>
                <span className="text-xs font-mono text-zinc-400">Năm cấp: {selectedCert.issueDate}</span>
              </div>
              <h3
                id="cert-modal-title"
                className="text-lg sm:text-xl font-bold text-zinc-100 font-sans"
              >
                {selectedCert.title}
              </h3>
              {selectedCert.credentialId && (
                <p className="text-xs font-mono text-zinc-400">
                  Mã xác thực: <span className="text-zinc-200">{selectedCert.credentialId}</span>
                </p>
              )}
            </div>

            {/* Certificate Preview Image(s) */}
            {selectedCert.images && selectedCert.images.length > 1 ? (
              <div className="space-y-4">
                {/* Switcher bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-zinc-900/90 border border-zinc-800">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 px-1">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Hồ sơ gồm {selectedCert.images.length} ảnh (Mặt trước &amp; Mặt sau / Bảng điểm):</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedImageIndex("all")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                        selectedImageIndex === "all"
                          ? "bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                      }`}
                    >
                      Xem cả 2 ảnh
                    </button>
                    {selectedCert.images.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                          selectedImageIndex === idx
                            ? "bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                        }`}
                      >
                        Ảnh {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display All or Selected */}
                {selectedImageIndex === "all" ? (
                  <div className="space-y-6">
                    {selectedCert.images.map((img, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between px-1 text-xs font-mono">
                          <span className="text-emerald-400 font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            Ảnh {idx + 1}: {idx === 0 ? "Mặt chính văn bằng / Trang 1" : "Mặt bìa ngoài / Trang 2"}
                          </span>
                          <a
                            href={img}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1 text-[11px] underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Mở ảnh gốc HD
                          </a>
                        </div>
                        <div className="relative w-full aspect-[16/11] max-h-[460px] rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl flex items-center justify-center">
                          <Image
                            src={img}
                            alt={`${selectedCert.title} - Ảnh ${idx + 1}`}
                            fill
                            unoptimized
                            className="object-contain p-2 hover:scale-[1.01] transition-transform duration-300"
                            sizes="(max-width: 1024px) 100vw, 768px"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1 text-xs font-mono">
                      <span className="text-emerald-400 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Ảnh {selectedImageIndex + 1}: {selectedImageIndex === 0 ? "Mặt chính văn bằng / Trang 1" : "Mặt bìa ngoài / Trang 2"}
                      </span>
                      <a
                        href={selectedCert.images[selectedImageIndex]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1 text-[11px] underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Mở ảnh gốc HD
                      </a>
                    </div>
                    <div className="relative w-full aspect-[16/11] max-h-[500px] rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl flex items-center justify-center">
                      <Image
                        src={selectedCert.images[selectedImageIndex]}
                        alt={`${selectedCert.title} - Ảnh ${selectedImageIndex + 1}`}
                        fill
                        priority
                        unoptimized
                        className="object-contain p-2"
                        sizes="(max-width: 1024px) 100vw, 768px"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : selectedCert.imageUrl ? (
              <div className="relative w-full aspect-[16/11] max-h-[460px] rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl flex items-center justify-center">
                {modalImageError ? (
                  <div className="text-center p-8 space-y-2">
                    <ShieldCheck className="w-10 h-10 text-emerald-400/60 mx-auto" />
                    <p className="text-sm font-mono text-zinc-300 font-semibold">{selectedCert.title}</p>
                    <p className="text-xs text-zinc-400">
                      Bản xem trước hình ảnh không khả dụng. Bạn có thể mở trực tiếp file PDF gốc qua nút bên dưới.
                    </p>
                  </div>
                ) : (
                  <Image
                    src={selectedCert.imageUrl}
                    alt={selectedCert.title}
                    fill
                    priority
                    unoptimized
                    onError={() => setModalImageError(true)}
                    className="object-contain p-2"
                    sizes="(max-width: 1024px) 100vw, 768px"
                  />
                )}
              </div>
            ) : null}

            {/* Validated Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Kỹ Năng & Kiến Thức Được Xác Thực:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCert.skills.map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-200"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons: View, Download & Verify */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-zinc-800">
              {selectedCert.images && selectedCert.images.length > 1 && (
                <>
                  {selectedCert.images.map((img, idx) => (
                    <a
                      key={`dl-${idx}`}
                      href={img}
                      download
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-mono font-bold transition-all shadow-md shadow-emerald-500/20"
                    >
                      <Download className="w-4 h-4" />
                      <span>Tải Ảnh {idx + 1} (Gốc HD)</span>
                    </a>
                  ))}
                  {selectedCert.images.map((img, idx) => (
                    <a
                      key={`open-${idx}`}
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white text-xs font-mono font-medium transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                      <span>Mở Ảnh {idx + 1} Tab Mới</span>
                    </a>
                  ))}
                </>
              )}

              {selectedCert.pdfUrl && (
                <a
                  href={selectedCert.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-mono font-bold transition-all shadow-md shadow-emerald-500/20"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Xem File PDF Gốc</span>
                </a>
              )}
              {selectedCert.pdfUrl && (
                <a
                  href={selectedCert.pdfUrl}
                  download
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white text-xs font-mono font-medium transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Tải Về PDF</span>
                </a>
              )}
              {selectedCert.verifyUrl && (
                <a
                  href={selectedCert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white text-xs font-mono font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                  <span>Xác Thực Trực Tuyến</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
