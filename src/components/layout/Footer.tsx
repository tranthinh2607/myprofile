"use client";

import React from "react";
import Link from "next/link";
import { Terminal, ArrowUp, Mail, Phone, ShieldCheck } from "lucide-react";
import { GithubIcon, LinkedinIcon, FacebookIcon, InstagramIcon, XIcon } from "@/components/icons/SocialIcons";
import { personalInfo } from "@/data/profile-data";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-zinc-950 border-t border-zinc-900 text-zinc-400 text-xs font-mono pt-16 pb-12">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-zinc-900/80">
          {/* Col 1: Identity & Status */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span className="text-zinc-200 text-sm font-semibold tracking-tight font-sans">
                {personalInfo.name}
              </span>
            </div>
            <p className="text-zinc-400 text-xs font-sans leading-relaxed max-w-md">
              {personalInfo.shortBio}
            </p>

            {/* System Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse" />
              <span>STATUS: OPEN FOR SOFTWARE ENGINEER & FULL-STACK ROLES</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-zinc-200 text-xs uppercase tracking-wider font-semibold">
              Điều hướng
            </h4>
            <ul className="space-y-2 text-zinc-400 text-xs">
              <li>
                <a href="#hero" className="hover:text-emerald-400 transition-colors">
                  &gt; Trang chủ &amp; Giới thiệu
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-400 transition-colors">
                  &gt; Về tôi &amp; Hành trình
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-emerald-400 transition-colors">
                  &gt; Dự án sản phẩm thật
                </a>
              </li>
              <li>
                <a href="#certificates" className="hover:text-emerald-400 transition-colors">
                  &gt; Chứng chỉ công nghệ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-emerald-400 transition-colors">
                  &gt; Liên hệ trực tiếp
                </a>
              </li>
              <li className="pt-1">
                <Link
                  href="/admin/messages"
                  className="text-zinc-600 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 text-[11px]"
                >
                  &gt; Hộp thư Kỹ sư (Admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Connect */}
          <div className="space-y-3">
            <h4 className="text-zinc-200 text-xs uppercase tracking-wider font-semibold">
              Liên kết trực tiếp
            </h4>
            <div className="flex flex-col space-y-2 text-xs">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors truncate"
              >
                <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="truncate">{personalInfo.email}</span>
              </a>
              <a
                href={`tel:${personalInfo.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>{personalInfo.phone}</span>
              </a>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group font-sans"
              >
                <GithubIcon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
                <span>GitHub Profile</span>
              </a>
              {personalInfo.facebook && (
                <a
                  href={personalInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group font-sans"
                >
                  <FacebookIcon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-400 transition-colors shrink-0" />
                  <span>Facebook Profile</span>
                </a>
              )}
              {personalInfo.instagram && (
                <a
                  href={personalInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group font-sans"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-pink-400 transition-colors shrink-0" />
                  <span>Instagram Profile</span>
                </a>
              )}
              {personalInfo.x && (
                <a
                  href={personalInfo.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group font-sans"
                >
                  <XIcon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
                  <span>X (Twitter) Profile</span>
                </a>
              )}
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group font-sans"
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-sky-400 transition-colors shrink-0" />
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-500/70" />
            <span>
              &copy; {new Date().getFullYear()} {personalInfo.name}.
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all text-xs"
            aria-label="Cuộn lên đầu trang"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
