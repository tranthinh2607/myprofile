import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Home } from "lucide-react";

export const metadata: Metadata = {
  title: {
    template: "%s | Blog - Trần Mai Trường Thịnh",
    default: "Blog Kỹ Thuật | Trần Mai Trường Thịnh",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col">
      {/* Re-use the main Header with Blog nav */}
      <Header />

      <main className="flex-1 pt-16">
        {children}
      </main>

      <Footer />
    </div>
  );
}
