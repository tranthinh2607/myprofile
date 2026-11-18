"use client";

import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";

export function SmoothScroll() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Tôn trọng cài đặt trợ năng của người dùng nếu họ chọn giảm chuyển động
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Khởi tạo Lenis với đường cong gia tốc (exponential ease-out) tạo cảm giác lướt trơn tru, đầm chắc
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Lắng nghe vị trí cuộn để hiển thị nút Back-to-Top
    const onScroll = (e: { scroll: number }) => {
      setShowScrollTop(e.scroll > 350);
    };

    lenis.on("scroll", onScroll);

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    // Bắt sự kiện click vào các thẻ <a> có liên kết neo nội bộ (#hero, #about, #projects, v.v.)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Kiểm tra xem có phải link neo nội bộ trên trang hiện tại không
      const isHashOnly = href.startsWith("#") && href.length > 1;
      const isPathHash =
        (href.startsWith("/#") || href.startsWith("./#")) &&
        (pathname === "/" || pathname === "");

      if (isHashOnly || isPathHash) {
        const hash = isHashOnly ? href : href.replace(/^\/?/, "");
        const targetElement = document.querySelector(hash);

        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: -80, // Bù trừ chiều cao thanh Header Navbar cố định
            duration: 1.3,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });

          // Cập nhật URL hash trên thanh địa chỉ mà không làm giật trang
          if (window.history.pushState) {
            window.history.pushState(null, "", hash);
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [pathname]);

  // Khi chuyển trang (route change), cuộn mượt về đầu trang mới
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Lướt mượt về đầu trang"
      title="Lướt mượt về đầu trang"
      className={`fixed bottom-6 left-6 z-40 p-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 border border-zinc-700/80 hover:border-emerald-500/50 shadow-2xl shadow-black/80 backdrop-blur-md transition-all duration-300 cursor-pointer flex items-center justify-center group ${
        showScrollTop
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1" />
    </button>
  );
}
