"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  X,
  CheckCircle,
  Download,
  ShieldCheck,
  Maximize2,
  Layers,
  ArrowLeft,
  Award,
} from "lucide-react";
import { CertificateItem } from "@/types/profile";

interface CertificatesListClientProps {
  certificates: CertificateItem[];
}

export function CertificatesListClient({ certificates }: CertificatesListClientProps) {
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [modalImageError, setModalImageError] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedIssuer, setSelectedIssuer] = useState("all");

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

  // Danh sách các tổ chức cấp chứng chỉ
  const issuers = useMemo(() => {
    const set = new Set<string>();
    certificates.forEach((c) => set.add(c.issuerLogoText || c.issuer));
    return Array.from(set);
  }, [certificates]);

  // Lọc chứng chỉ
  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const matchSearch =
        search.trim() === "" ||
        cert.title.toLowerCase().includes(search.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(search.toLowerCase()) ||
        (cert.credentialId && cert.credentialId.toLowerCase().includes(search.toLowerCase())) ||
        cert.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

      const matchIssuer =
        selectedIssuer === "all" ||
        (cert.issuerLogoText || cert.issuer) === selectedIssuer;

      return matchSearch && matchIssuer;
    });
  }, [certificates, search, selectedIssuer]);

  const hasActiveFilter = search.trim() !== "" || selectedIssuer !== "all";

  const clearFilters = () => {
    setSearch("");
    setSelectedIssuer("all");
  };

  return (
    <div className="space-y-10">
      {/* Search & Filter Controls */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-5 backdrop-blur-sm">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm chứng chỉ theo tên, đơn vị cấp (HUTECH, Cisco, IBM, Google...), kỹ năng..."
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60 transition-colors font-sans"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300"
              title="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Issuer Filter Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Lọc theo tổ chức cấp chứng chỉ:</span>
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Xóa bộ lọc
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedIssuer("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedIssuer === "all"
                  ? "bg-emerald-500 text-black font-semibold shadow-md shadow-emerald-500/20"
                  : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              Tất cả ({certificates.length})
            </button>
            {issuers.map((issuer) => {
              const count = certificates.filter(
                (c) => (c.issuerLogoText || c.issuer) === issuer
              ).length;
              return (
                <button
                  key={issuer}
                  onClick={() => setSelectedIssuer(selectedIssuer === issuer ? "all" : issuer)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                    selectedIssuer === issuer
                      ? "bg-emerald-500 text-black font-semibold shadow-md shadow-emerald-500/20"
                      : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  <span>{issuer}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedIssuer === issuer ? "bg-black/20 text-black" : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result Count Status */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
        <span>
          Hiển thị <span className="text-emerald-400 font-semibold">{filteredCertificates.length}</span> / {certificates.length} văn bằng &amp; chứng chỉ
        </span>
        {hasActiveFilter && (
          <span className="text-zinc-500">Đang áp dụng bộ lọc</span>
        )}
      </div>

      {/* Certificates Grid */}
      {filteredCertificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert) => (
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
                    {/* Badge indicating multiple images */}
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
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 mx-auto flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-zinc-200">
            Không tìm thấy chứng chỉ phù hợp
          </h3>
          <p className="text-xs text-zinc-400">
            Không có chứng chỉ nào khớp với từ khóa tìm kiếm hoặc đơn vị cấp đang chọn.
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black font-semibold text-xs font-mono hover:bg-emerald-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Xóa bộ lọc tìm kiếm
          </button>
        </div>
      )}

      {/* Bottom Navigation CTA */}
      <div className="pt-12 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/#contact"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold font-mono transition-all shadow-md shadow-emerald-500/20"
          >
            Liên hệ với Thịnh
          </Link>
          <Link
            href="/projects"
            className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
          >
            Xem Dự Án &gt;
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
              <h3 id="cert-modal-title" className="text-xl sm:text-2xl font-bold text-zinc-100 font-sans">
                {selectedCert.title}
              </h3>
              {selectedCert.credentialId && (
                <p className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ID Xác thực: {selectedCert.credentialId}
                </p>
              )}
            </div>

            {/* Modal Image Display */}
            {selectedCert.imageUrl && !modalImageError ? (
              <div className="space-y-3">
                {/* Bộ điều khiển chọn ảnh nếu chứng chỉ có từ 2 ảnh trở lên */}
                {selectedCert.images && selectedCert.images.length > 1 && (
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 pl-2">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Chứng chỉ gồm {selectedCert.images.length} trang ảnh:</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedImageIndex("all")}
                        className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                          selectedImageIndex === "all"
                            ? "bg-emerald-500 text-black font-semibold shadow-sm"
                            : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
                        }`}
                      >
                        Tất cả
                      </button>
                      {selectedCert.images.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                            selectedImageIndex === idx
                              ? "bg-emerald-500 text-black font-semibold shadow-sm"
                              : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
                          }`}
                        >
                          Ảnh {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Khung hiển thị ảnh */}
                {selectedImageIndex === "all" && selectedCert.images && selectedCert.images.length > 1 ? (
                  <div className="space-y-4">
                    {selectedCert.images.map((imgSrc, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
                          <span className="text-emerald-400 font-semibold">Trang / Bản số {idx + 1}:</span>
                          <a
                            href={imgSrc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-emerald-300 transition-colors flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Mở ảnh tab riêng</span>
                          </a>
                        </div>
                        <div className="relative w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/90 shadow-2xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgSrc}
                            alt={`${selectedCert.title} - Trang ${idx + 1}`}
                            className="w-full h-auto object-contain max-h-[75vh] mx-auto p-1 rounded-xl"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/90 shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        typeof selectedImageIndex === "number" && selectedCert.images
                          ? selectedCert.images[selectedImageIndex] || selectedCert.imageUrl
                          : selectedCert.imageUrl
                      }
                      alt={selectedCert.title}
                      className="w-full h-auto object-contain max-h-[75vh] mx-auto p-1 rounded-xl"
                      onError={() => setModalImageError(true)}
                    />
                  </div>
                )}
              </div>
            ) : null}

            {/* Validated Skills */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                Kỹ năng &amp; Năng lực được chứng thực:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedCert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    {skill}
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
                  <span>Mở File PDF Gốc Trong Tab Mới</span>
                </a>
              )}

              {selectedCert.pdfUrl && (
                <a
                  href={selectedCert.pdfUrl}
                  download
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white text-xs font-mono font-medium transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Tải PDF về máy</span>
                </a>
              )}

              {selectedCert.verifyUrl && (
                <a
                  href={selectedCert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono transition-colors ml-auto"
                >
                  <span>Kiểm tra trên trang cấp chứng chỉ</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
