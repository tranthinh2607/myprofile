"use client";

import React, { useState } from "react";
import { experienceData } from "@/data/profile-data";
import { Briefcase, Calendar, MapPin, ChevronRight, CheckCircle2, Building2 } from "lucide-react";

export function Experience() {
  const [activeTabId, setActiveTabId] = useState<string>(experienceData[0].id);

  const activeExp = experienceData.find((e) => e.id === activeTabId) || experienceData[0];

  return (
    <section id="experience" className="py-24 bg-zinc-950/80 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-mono">
            <span>// EMPLOYMENT & TECHNICAL EXPERIENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 font-sans">
            Kinh Nghiệm Làm Việc & Đóng Góp Thực Tế
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Lịch sử công tác thực tế theo hợp đồng lao động và quá trình tham gia phát triển công nghệ, đảm bảo tính chuẩn xác và trung thực 100%.
          </p>
        </div>

        {/* Experience Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Role Selector Tabs */}
          <div className="lg:col-span-4 flex flex-col space-y-2.5">
            {experienceData.map((exp) => {
              const isSelected = exp.id === activeExp.id;
              return (
                <button
                  key={exp.id}
                  onClick={() => setActiveTabId(exp.id)}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                    isSelected
                      ? "bg-zinc-900 border-emerald-500/40 shadow-lg shadow-black/40"
                      : "bg-zinc-950 border-zinc-800/80 hover:bg-zinc-900/60 hover:border-zinc-700/80"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold font-sans ${
                          isSelected ? "text-emerald-400" : "text-zinc-200 group-hover:text-white"
                        }`}
                      >
                        {exp.role}
                      </span>
                      {exp.isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse" />
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3 text-zinc-400" />
                      <span className="line-clamp-1">{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                      <span>{exp.period}</span>
                      {exp.department && (
                        <>
                          <span>•</span>
                          <span className="text-zinc-400">{exp.department}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform shrink-0 ml-2 ${
                      isSelected
                        ? "text-emerald-400 translate-x-1"
                        : "text-zinc-400 group-hover:text-zinc-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Experience View */}
          <div className="lg:col-span-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 p-6 sm:p-8 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-800">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-100 font-sans">
                    {activeExp.role}
                  </h3>
                  {activeExp.department && (
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                      {activeExp.department}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
                  <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    {activeExp.company}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-zinc-300">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    {activeExp.period}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-zinc-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {activeExp.location}
                  </span>
                </div>
              </div>

              {activeExp.isCurrent && (
                <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono shrink-0">
                  Đang Đảm Nhiệm
                </span>
              )}
            </div>

            {/* Summary */}
            <p className="text-zinc-300 text-sm sm:text-base font-sans leading-relaxed">
              {activeExp.summary}
            </p>

            {/* Metrics badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activeExp.metrics.map((m) => (
                <div
                  key={m.label}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-center space-y-1"
                >
                  <div className="text-[11px] text-zinc-400 font-mono">{m.label}</div>
                  <div className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Duties & Responsibilities List */}
            {activeExp.duties && activeExp.duties.length > 0 && (
              <div className="p-5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Nhiệm Vụ & Đóng Góp Kỹ Thuật Trọng Tâm:
                </span>
                <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-300 font-sans">
                  {activeExp.duties.map((duty, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-emerald-400 font-mono font-bold text-xs shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="leading-relaxed">{duty}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technologies Used */}
            <div className="pt-4 border-t border-zinc-800 space-y-2">
              <span className="text-xs font-mono text-zinc-400">Kỹ năng, Công cụ & Hệ thống sử dụng:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeExp.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
