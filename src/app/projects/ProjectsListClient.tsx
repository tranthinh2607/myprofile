"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  UserCheck,
  Layers,
  Sparkles,
  ArrowLeft,
  X,
  Code2,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";
import { ProjectItem } from "@/types/profile";

interface ProjectsListClientProps {
  projects: ProjectItem[];
}

export function ProjectsListClient({ projects }: ProjectsListClientProps) {
  const [search, setSearch] = useState("");
  const [selectedTech, setSelectedTech] = useState("all");

  // Lấy danh sách các công nghệ phổ biến nhất
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((p) => {
      p.technologies.forEach((t) => techSet.add(t));
    });
    return Array.from(techSet);
  }, [projects]);

  // Lọc dự án theo tìm kiếm và công nghệ
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchSearch =
        search.trim() === "" ||
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(search.toLowerCase())) ||
        project.summary.toLowerCase().includes(search.toLowerCase()) ||
        project.role.toLowerCase().includes(search.toLowerCase()) ||
        project.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchTech =
        selectedTech === "all" ||
        project.technologies.includes(selectedTech);

      return matchSearch && matchTech;
    });
  }, [projects, search, selectedTech]);

  const hasActiveFilter = search.trim() !== "" || selectedTech !== "all";

  const clearFilters = () => {
    setSearch("");
    setSelectedTech("all");
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
            placeholder="Tìm kiếm dự án theo tên, vai trò, công nghệ (Next.js, Python, AI...)..."
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

        {/* Technology Filter Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Lọc theo công nghệ:</span>
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
              onClick={() => setSelectedTech("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedTech === "all"
                  ? "bg-emerald-500 text-black font-semibold shadow-md shadow-emerald-500/20"
                  : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              Tất cả ({projects.length})
            </button>
            {allTechnologies.map((tech) => {
              const count = projects.filter((p) => p.technologies.includes(tech)).length;
              return (
                <button
                  key={tech}
                  onClick={() => setSelectedTech(selectedTech === tech ? "all" : tech)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                    selectedTech === tech
                      ? "bg-emerald-500 text-black font-semibold shadow-md shadow-emerald-500/20"
                      : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  <span>{tech}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedTech === tech ? "bg-black/20 text-black" : "bg-zinc-800 text-zinc-400"
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
          Hiển thị <span className="text-emerald-400 font-semibold">{filteredProjects.length}</span> / {projects.length} dự án
        </span>
        {hasActiveFilter && (
          <span className="text-zinc-500">Đang áp dụng bộ lọc tùy biến</span>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-emerald-500/40 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-black/70"
            >
              {/* Image Preview (16:9 aspect ratio, rounded-xl, border-zinc-800, hover zoom) */}
              <div className="p-4 sm:p-5 pb-0">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-md">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                  {/* Role Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium bg-zinc-950/90 border border-zinc-700 text-emerald-400 backdrop-blur-md shadow-sm">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{project.role}</span>
                    </span>
                  </div>

                  {/* Live Status indicator if has demo */}
                  {project.demoUrl && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 text-[11px] font-mono backdrop-blur-sm shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse" />
                      <span>Live Demo Active</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-zinc-100 font-sans group-hover:text-emerald-400 transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed">
                    {project.description || project.summary}
                  </p>
                </div>

                {/* Bottom Footer: Tech stack & Links */}
                <div className="pt-4 border-t border-zinc-800/80 space-y-4">
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTech(t)}
                        title={`Lọc theo công nghệ ${t}`}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                          selectedTech === t
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                            : "bg-zinc-950 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Action links */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors group/link"
                        >
                          <GithubIcon className="w-3.5 h-3.5 group-hover/link:text-white" />
                          <span>Mã Nguồn GitHub</span>
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Xem Trực Tuyến (Demo)</span>
                        </a>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-zinc-400" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 mx-auto flex items-center justify-center">
            <Code2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-zinc-200">
            Không tìm thấy dự án phù hợp
          </h3>
          <p className="text-xs text-zinc-400">
            Không có dự án nào khớp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại.
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
            Liên hệ hợp tác
          </Link>
          <Link
            href="/certificates"
            className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
          >
            Xem Chứng Chỉ &gt;
          </Link>
        </div>
      </div>
    </div>
  );
}
