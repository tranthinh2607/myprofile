"use client";

import React from "react";
import Image from "next/image";
import { projectsData } from "@/data/profile-data";
import { ExternalLink, UserCheck, Layers } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";

export function Projects() {
  return (
    <section id="projects" className="py-24 bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-mono">
            <span>// FEATURED REAL PROJECTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 font-sans">
            Dự Án Sản Phẩm & Công Cụ Kỹ Thuật Thực Tế
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Các dự án phần mềm và công cụ thực tế đã được triển khai, kiểm thử và ứng dụng trong môi trường đào tạo và quản trị hệ thống.
          </p>
        </div>

        {/* Direct 2-Column Grid of 4 Real Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projectsData.map((project) => (
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
                      <span
                        key={t}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300"
                      >
                        {t}
                      </span>
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
      </div>
    </section>
  );
}
