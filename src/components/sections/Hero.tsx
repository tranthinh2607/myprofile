"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FileDown,
  Copy,
  Check,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Terminal,
  Cpu,
} from "lucide-react";
import {
  GithubIcon,
  FacebookIcon,
  InstagramIcon,
  XIcon,
  LinkedinIcon,
} from "@/components/icons/SocialIcons";
import { personalInfo, technicalPillars } from "@/data/profile-data";
import { useToast } from "@/components/layout/Toast";

export function Hero() {
  const { showToast } = useToast();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyToClipboard = async (text: string, type: "email" | "phone") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
        showToast("Đã sao chép Email vào bộ nhớ tạm!", "success");
      } else {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
        showToast("Đã sao chép Số điện thoại vào bộ nhớ tạm!", "success");
      }
    } catch {
      showToast("Không thể sao chép tự động. Vui lòng chọn thủ công.", "info");
    }
  };

  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Positioning & Pitch */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-mono shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse shrink-0" />
              <span>{personalInfo.availability.badgeText}</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-100 font-sans">
                {personalInfo.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xl sm:text-2xl font-mono font-medium text-emerald-400">
                  {personalInfo.title}
                </span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-zinc-700" />
                <span className="text-sm font-mono text-zinc-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  {personalInfo.location}
                </span>
              </div>
            </div>

            {/* Short Bio - Hiển thị chính dưới tên */}
            <p className="text-zinc-200 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
              {personalInfo.shortBio}
            </p>

            {/* 3 Trụ Cột Năng Lực Kỹ Thuật (Dạng thẻ tóm tắt ngắn gọn) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl pt-1">
              {technicalPillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/90 hover:border-zinc-700 transition-all group backdrop-blur-sm space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{pillar.icon}</span>
                    <h3 className="text-xs font-semibold text-zinc-100 font-sans group-hover:text-emerald-400 transition-colors">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Contact & Social Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {/* Email quick copy */}
              <button
                onClick={() => copyToClipboard(personalInfo.email, "email")}
                className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-medium font-sans text-zinc-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/40 group"
                title="Bấm để sao chép Email"
              >
                <Mail className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors shrink-0" />
                <span>{personalInfo.email}</span>
                {copiedEmail ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0" />
                )}
              </button>

              {/* Phone quick copy */}
              <button
                onClick={() => copyToClipboard(personalInfo.phone, "phone")}
                className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-medium font-sans text-zinc-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/40 group"
                title="Bấm để sao chép Số điện thoại"
              >
                <Phone className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors shrink-0" />
                <span>{personalInfo.phone}</span>
                {copiedPhone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0" />
                )}
              </button>

              {/* GitHub Button */}
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-medium font-sans text-zinc-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/40 group"
              >
                <GithubIcon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
                <span>GitHub</span>
              </a>

              {/* Facebook Button */}
              {personalInfo.facebook && (
                <a
                  href={personalInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-medium font-sans text-zinc-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/40 group"
                >
                  <FacebookIcon className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors shrink-0" />
                  <span>Facebook</span>
                </a>
              )}

              {/* Instagram Button */}
              {personalInfo.instagram && (
                <a
                  href={personalInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-medium font-sans text-zinc-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/40 group"
                >
                  <InstagramIcon className="w-4 h-4 text-zinc-400 group-hover:text-pink-400 transition-colors shrink-0" />
                  <span>Instagram</span>
                </a>
              )}

              {/* X Button */}
              {personalInfo.x && (
                <a
                  href={personalInfo.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-medium font-sans text-zinc-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/40 group"
                >
                  <XIcon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
                  <span>X</span>
                </a>
              )}

              {/* LinkedIn Button */}
              {personalInfo.linkedin && (
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-medium font-sans text-zinc-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/40 group"
                >
                  <LinkedinIcon className="w-4 h-4 text-zinc-400 group-hover:text-sky-400 transition-colors shrink-0" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href={personalInfo.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-semibold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <FileDown className="w-4 h-4" />
                <span>Tải CV Bản Kỹ Thuật (PDF)</span>
              </a>

              <a
                href="#projects"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-mono text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Khám Phá Dự Án Thật</span>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
              </a>
            </div>
          </div>

          {/* Right Column: High-Tech Portrait & Terminal Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Outer Glow Ring */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000" />

              {/* Main Container Card */}
              <div className="relative rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl">
                {/* Window Top Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 font-mono text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 text-zinc-400 text-[11px]">thinh@swe-dev:~</span>
                  </div>
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                </div>

                {/* Portrait Image */}
                <div className="relative w-full h-80 sm:h-96 bg-zinc-900">
                  <Image
                    src={personalInfo.avatarUrl}
                    alt={personalInfo.name}
                    fill
                    priority
                    className="object-cover object-top filter contrast-[1.05] brightness-95"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                </div>

                {/* Interactive Terminal Overlay at bottom */}
                <div className="p-4 bg-zinc-950/95 border-t border-zinc-800/80 font-mono text-xs space-y-2">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-emerald-400">engineer.profile</span>
                    <span className="text-zinc-400">--target="thinh"</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800/80 text-[11px] space-y-1 text-zinc-300">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Core Stack:</span>
                      <span className="text-emerald-300">Next.js 16 • React 19 • TypeScript</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Specialty:</span>
                      <span className="text-cyan-300">Full-Stack & GenAI Solutions</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Distinction:</span>
                      <span className="text-amber-400 font-semibold">Olympic CS 2nd Prize • GPA 3.45</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
