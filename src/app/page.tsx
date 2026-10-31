import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Metrics } from "@/components/sections/Metrics";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Certificates } from "@/components/sections/Certificates";
import { Articles } from "@/components/sections/Articles";
import { Contact } from "@/components/sections/Contact";
import { createPublicClient } from "@/lib/supabase/server";
import type { Post } from "@/types/supabase";

export const revalidate = 60;

async function getLatestPosts(): Promise<Post[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(6);

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export default async function Home() {
  const latestPosts = await getLatestPosts();

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* 1. Top Fixed Navigation */}
      <Header />

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col">
        {/* 2. Hero: Giới thiệu & Định vị Kỹ sư phần mềm */}
        <Hero />

        {/* 3. Key Engineering Metrics */}
        <Metrics />

        {/* 4. Journey / About: Tiểu sử cá nhân 3 giai đoạn với ảnh chụp thật */}
        <Skills />

        {/* 5. Projects: 4 Dự án thực tế dùng ảnh project.jpg */}
        <Projects />

        {/* 6. Certificates: 100% Chứng chỉ PDF thực tế */}
        <Certificates />

        {/* 7. Articles / Blog: Danh sách bài viết kỹ thuật từ Supabase */}
        <Articles initialPosts={latestPosts} />

        {/* 8. Contact: Form liên hệ, SĐT, Email, Facebook, GitHub */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
