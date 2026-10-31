"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, FileDown, Terminal, Send, Sun, Moon, BookOpen } from "lucide-react";
import { personalInfo } from "@/data/profile-data";

const navItems = [
  { label: "Về tôi", hash: "about" },
  { label: "Dự án", hash: "projects" },
  { label: "Chứng chỉ", hash: "certificates" },
  { label: "Bài viết", hash: "blog" },
  { label: "Liên hệ", hash: "contact" },
];

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [activeSection, setActiveSection] = useState<string>("about");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    // Initialize dark/light state
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    if (!isHomePage) {
      if (pathname.startsWith("/blog")) {
        setActiveSection("blog");
      }
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Scrollspy
      const sectionIds = navItems.map((item) => item.hash);
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sectionIds[i]);
        if (sectionEl && sectionEl.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage, pathname]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("theme", "dark");
      } catch {}
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("theme", "light");
      } catch {}
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 shadow-lg shadow-black/40 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href={isHomePage ? "#hero" : "/"}
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/60 transition-colors shadow-inner">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-semibold tracking-tight text-zinc-100 group-hover:text-emerald-400 transition-colors">
              thinh.tran<span className="text-emerald-400">()</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400 tracking-wider">
              SWE &amp; COMPUTER.ENG
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/60 border border-zinc-800/70 rounded-full px-3 py-1.5 backdrop-blur-sm shadow-inner">
          {navItems.map((item) => {
            const isActive = activeSection === item.hash;
            const targetHref = isHomePage ? `#${item.hash}` : `/#${item.hash}`;

            return (
              <a
                key={item.hash}
                href={targetHref}
                className={`px-4 py-1 rounded-full text-xs font-mono transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 font-medium shadow-sm border border-emerald-500/30"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 transition-colors cursor-pointer"
            title={isDark ? "Chế độ tối (Bấm để chuyển sáng)" : "Chế độ sáng (Bấm để chuyển tối)"}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          {/* Download CV */}
          <a
            href={personalInfo.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            download="TRANMAITRUONGTHINH.PDF"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-all duration-200 shadow-sm"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tải CV</span>
          </a>

          {/* Contact Action */}
          <a
            href={isHomePage ? "#contact" : "/#contact"}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold font-mono transition-all duration-200 shadow-md shadow-emerald-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Liên hệ</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white focus:outline-none cursor-pointer"
          aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950/98 border-b border-zinc-800/90 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-3">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const targetHref = isHomePage ? `#${item.hash}` : `/#${item.hash}`;
              return (
                <a
                  key={item.hash}
                  href={targetHref}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-mono text-zinc-300 hover:bg-zinc-900 hover:text-emerald-400 transition-colors flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] text-zinc-400">#{item.hash}</span>
                </a>
              );
            })}
            <Link
              href="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-mono text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center justify-between border-t border-zinc-850 mt-1"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Trang Blog Đầy Đủ
              </span>
              <span className="text-[10px] text-zinc-400">/blog</span>
            </Link>
          </nav>
          <div className="pt-3 flex flex-col gap-2 border-t border-zinc-800/80">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs font-mono text-zinc-400">Giao diện (Dark / Light):</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200 text-xs font-mono cursor-pointer"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
            </div>
            <a
              href={personalInfo.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              download="TRANMAITRUONGTHINH.PDF"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200 text-xs font-mono font-medium"
            >
              <FileDown className="w-4 h-4 text-emerald-400" />
              Tải CV Bản Đầy Đủ
            </a>
            <a
              href={isHomePage ? "#contact" : "/#contact"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-500 text-zinc-950 text-xs font-mono font-semibold"
            >
              <Send className="w-4 h-4" />
              Gửi Tin Nhắn Cho Tôi
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
