"use client";

import React from "react";
import { metricsData } from "@/data/profile-data";
import { Activity, ShieldCheck, Zap, Trophy } from "lucide-react";

export function Metrics() {
  const getIcon = (id: string) => {
    switch (id) {
      case "exp":
        return <Zap className="w-5 h-5 text-emerald-400" />;
      case "sla":
        return <ShieldCheck className="w-5 h-5 text-cyan-400" />;
      case "throughput":
        return <Activity className="w-5 h-5 text-indigo-400" />;
      case "award":
        return <Trophy className="w-5 h-5 text-amber-400" />;
      default:
        return <Zap className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getAccentBorder = (accent: string) => {
    switch (accent) {
      case "emerald":
        return "hover:border-emerald-500/50 group-hover:text-emerald-400";
      case "cyan":
        return "hover:border-cyan-500/50 group-hover:text-cyan-400";
      case "indigo":
        return "hover:border-indigo-500/50 group-hover:text-indigo-400";
      case "amber":
        return "hover:border-amber-500/50 group-hover:text-amber-400";
      default:
        return "hover:border-emerald-500/50 group-hover:text-emerald-400";
    }
  };

  return (
    <section id="metrics" className="py-12 border-y border-zinc-900 bg-zinc-950/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsData.map((item) => (
            <div
              key={item.id}
              className={`group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 transition-all duration-300 ${getAccentBorder(
                item.accent
              )} hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 group-hover:scale-105 transition-transform">
                  {getIcon(item.id)}
                </div>
                {item.highlight && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-zinc-950 border border-zinc-800 text-zinc-400">
                    {item.highlight}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 group-hover:text-white transition-colors">
                    {item.value}
                  </span>
                  {item.suffix && (
                    <span className="text-sm font-semibold text-emerald-400">
                      {item.suffix}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-zinc-200 font-sans pt-1">
                  {item.label}
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {item.sublabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
