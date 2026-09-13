"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { journeyStages } from "@/data/profile-data";
import { JourneyStage } from "@/types/profile";
import {
  Calendar,
  GraduationCap,
  Code2,
  ZoomIn,
  X,
  Sparkles,
  MapPin,
  Laptop,
  CheckCircle2,
} from "lucide-react";

interface ActiveModalPhoto {
  src: string;
  alt: string;
  caption: string;
  stageTitle: string;
  phaseLabel: string;
}

export function Skills() {
  const [selectedPhoto, setSelectedPhoto] = useState<ActiveModalPhoto | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
      }
    };
    if (selectedPhoto) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedPhoto]);

  const getStageIcon = (id: string) => {
    switch (id) {
      case "stage-1":
        return <Laptop className="w-4 h-4 text-emerald-400" />;
      case "stage-2":
        return <GraduationCap className="w-4 h-4 text-cyan-400" />;
      case "stage-3":
        return <Code2 className="w-4 h-4 text-purple-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getThemeClasses = (color: "emerald" | "cyan" | "purple") => {
    switch (color) {
      case "purple":
        return {
          border: "border-purple-500/25 hover:border-purple-500/50",
          badgeBg: "bg-purple-500/10 text-purple-300 border-purple-500/30",
          dot: "bg-purple-400",
          icon: "text-purple-400",
          glow: "shadow-[0_0_30px_rgba(168,85,247,0.1)]",
        };
      case "cyan":
        return {
          border: "border-cyan-500/25 hover:border-cyan-500/50",
          badgeBg: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
          dot: "bg-cyan-400",
          icon: "text-cyan-400",
          glow: "shadow-[0_0_30px_rgba(6,182,212,0.1)]",
        };
      case "emerald":
      default:
        return {
          border: "border-emerald-500/25 hover:border-emerald-500/50",
          badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
          dot: "bg-emerald-400",
          icon: "text-emerald-400",
          glow: "shadow-[0_0_30px_rgba(16,185,129,0.1)]",
        };
    }
  };

  const openPhotoModal = (stage: JourneyStage) => {
    setSelectedPhoto({
      src: stage.image,
      alt: stage.imageAlt,
      caption: stage.imageCaption,
      stageTitle: stage.title,
      phaseLabel: stage.phaseLabel,
    });
  };

  return (
    <section id="about" className="py-20 relative bg-zinc-950 border-t border-zinc-900 overflow-hidden">
      {/* Anchor targets for #skills and #journey */}
      <span id="skills" className="absolute -top-24 pointer-events-none" />
      <span id="journey" className="absolute -top-24 pointer-events-none" />

      {/* Subtle background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[250px] bg-purple-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-emerald-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>// CAREER TIMELINE &amp; BIOGRAPHY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-100 font-sans">
            Tiểu Sử &amp; Hành Trình Nghề Nghiệp
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base font-sans leading-relaxed">
            Hành trình từ tự học phần cứng &amp; thuật toán, 4 năm đại học HUTECH kết hợp trợ giảng tin học quốc tế, đến vai trò Kỹ sư máy tính và phát triển phần mềm AI thực tế.
          </p>
        </div>

        {/* 3 Compact Stages Cards with 1 Large Photo Each */}
        <div className="space-y-12">
          {journeyStages.map((stage) => {
            const theme = getThemeClasses(stage.highlightColor);

            return (
              <div
                key={stage.id}
                className={`rounded-2xl bg-zinc-900/40 border ${theme.border} p-6 sm:p-8 transition-all duration-300 hover:bg-zinc-900/60 backdrop-blur-sm relative group ${theme.glow}`}
              >
                {/* Header: Phase, Period & Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-zinc-800/80">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase bg-zinc-950 border border-zinc-800 text-zinc-200">
                      {stage.phaseLabel}
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-zinc-950 border border-zinc-800 text-zinc-300">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{stage.period}</span>
                      {stage.isCurrent && (
                        <span className="inline-flex items-center gap-1 ml-1.5 px-2 py-0.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-[10px] text-purple-300 font-sans font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                          Hiện tại
                        </span>
                      )}
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${theme.badgeBg}`}>
                    {stage.badge}
                  </span>
                </div>

                {/* 2-Column Balanced Layout: 50% Content | 50% Single Large Photo */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
                  {/* Left Column: 50% (col-span-6) */}
                  <div className="lg:col-span-6 space-y-5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                        {getStageIcon(stage.id)}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-zinc-100 font-sans tracking-tight">
                        {stage.title}
                      </h3>
                    </div>

                    {/* Highlights Bullet Points */}
                    <div className="space-y-2.5 pt-1">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                        Điểm nhấn cốt lõi:
                      </div>
                      <ul className="space-y-2.5">
                        {stage.highlights.map((item, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-2.5 text-sm text-zinc-300 leading-relaxed font-sans">
                            <CheckCircle2 className={`w-4 h-4 ${theme.icon} shrink-0 mt-0.5`} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Skills Tags */}
                    <div className="pt-2 space-y-2">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                        Kỹ năng:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {stage.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: 50% (col-span-6) - 1 Single Large Authentic Photo */}
                  <div className="lg:col-span-6">
                    <div
                      onClick={() => openPhotoModal(stage)}
                      className="group/photo relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/90 hover:border-zinc-700 transition-all duration-300 cursor-pointer shadow-2xl"
                      title="Bấm để phóng to ảnh sắc nét"
                    >
                      <Image
                        src={stage.image}
                        alt={stage.imageAlt}
                        fill
                        className="object-cover object-center group-hover/photo:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, 600px"
                      />

                      {/* Subtle Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                      {/* Zoom Icon Pill */}
                      <div className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover/photo:opacity-100 transition-opacity">
                        <ZoomIn className="w-4 h-4" />
                      </div>

                      {/* Floating Caption Bar at Bottom */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950/85 backdrop-blur-md border border-zinc-700/60 text-xs text-zinc-200 shadow-md max-w-full">
                          <MapPin className={`w-3.5 h-3.5 ${theme.icon} shrink-0`} />
                          <span className="truncate">{stage.imageCaption}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* High-Resolution Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-zinc-900 rounded-2xl border border-zinc-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/80">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase bg-zinc-900 border border-zinc-800 text-zinc-300">
                  {selectedPhoto.phaseLabel}
                </span>
                <span className="text-sm font-semibold text-zinc-200 truncate">
                  {selectedPhoto.stageTitle}
                </span>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="relative w-full h-[55vh] sm:h-[65vh] bg-black">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            </div>

            {/* Modal Footer / Caption */}
            <div className="px-5 py-3.5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium text-zinc-200">{selectedPhoto.caption}</span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500 hidden sm:inline">
                Nhấn ESC hoặc bấm ngoài để đóng
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
