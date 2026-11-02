"use client";

import React from "react";

interface PresetThumbnailProps {
  type: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "full";
}

export function PresetThumbnail({
  type,
  className = "",
  size = "md",
}: PresetThumbnailProps) {
  const sizeClasses = {
    sm: "w-14 h-14 rounded-lg",
    md: "w-full h-32 rounded-xl",
    lg: "w-28 h-36 rounded-xl",
    full: "w-full h-full",
  }[size];

  // Vector graphics matching the reference photo for each preset
  switch (type) {
    case "diwali":
      return (
        <div
          className={`relative overflow-hidden flex flex-col items-center justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "radial-gradient(circle at 50% 65%, #7c2d12 0%, #451a03 50%, #1c0b02 100%)",
          }}
        >
          {/* Subtle golden ornament pattern */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="diwali-mandala" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="15" cy="15" r="10" fill="none" stroke="#fef08a" strokeWidth="0.5" />
                  <circle cx="15" cy="15" r="5" fill="none" stroke="#f59e0b" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#diwali-mandala)" />
            </svg>
          </div>

          <div className="text-center z-10 pt-1">
            <span className="text-[10px] tracking-widest uppercase text-amber-300/80 font-serif block">
              Festival of Lights
            </span>
            <span className="text-sm font-serif font-bold text-amber-100 tracking-wide drop-shadow-sm">
              Happy Diwali
            </span>
          </div>

          {/* Diya Candle with warm radiant flame glow */}
          <div className="relative flex flex-col items-center z-10 pb-1">
            <div className="w-6 h-6 rounded-full bg-amber-400/30 blur-md absolute -top-4 animate-pulse" />
            <div
              className="w-2.5 h-4 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white relative z-10 shadow-[0_0_12px_#f59e0b]"
              style={{ borderRadius: "50% 50% 35% 35% / 60% 60% 40% 40%" }}
            />
            {/* Clay Diya Lamp Base */}
            <div className="w-12 h-3.5 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-900 rounded-b-full border-t border-amber-400/40 shadow-lg -mt-1 flex items-center justify-center">
              <div className="w-8 h-1 bg-amber-500/50 rounded-full" />
            </div>
            {/* Side sparkles */}
            <div className="flex gap-4 mt-1 opacity-70">
              <span className="text-[8px] text-amber-300">✦</span>
              <span className="text-[6px] text-amber-200">✦</span>
              <span className="text-[8px] text-amber-300">✦</span>
            </div>
          </div>
        </div>
      );

    case "business":
      return (
        <div
          className={`relative overflow-hidden flex flex-col justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 60%, #0369a1 100%)",
          }}
        >
          {/* Subtle grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf810_1px,transparent_1px),linear-gradient(to_bottom,#38bdf810_1px,transparent_1px)] bg-[size:16px_16px]" />

          <div className="z-10">
            <span className="text-[9px] font-semibold text-cyan-300 uppercase tracking-wider block">
              Enterprise Growth
            </span>
            <span className="text-xs font-bold text-white drop-shadow">
              Scale Your Future
            </span>
          </div>

          {/* Bar Chart & Trendline Graphic */}
          <div className="relative z-10 flex items-end justify-between px-2 pt-2">
            <div className="w-3 h-6 bg-cyan-500/40 rounded-t" />
            <div className="w-3 h-10 bg-cyan-400/60 rounded-t" />
            <div className="w-3 h-14 bg-cyan-300/80 rounded-t shadow-[0_0_8px_#38bdf8]" />
            <div className="w-3 h-18 bg-white rounded-t shadow-[0_0_12px_#ffffff]" />
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-400"
              viewBox="0 0 100 40"
              fill="none"
              strokeWidth="2"
            >
              <path d="M 5 35 Q 35 25, 60 18 T 95 6" />
              <circle cx="95" cy="6" r="3" fill="#34d399" />
            </svg>
          </div>
        </div>
      );

    case "education":
      return (
        <div
          className={`relative overflow-hidden flex flex-col justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "linear-gradient(145deg, #1d4ed8 0%, #1e40af 50%, #3b82f6 100%)",
          }}
        >
          {/* Academic circles */}
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-400/20 rounded-full blur-sm" />

          <div className="z-10">
            <span className="bg-amber-400 text-slate-900 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider inline-block">
              ADMISSION OPEN
            </span>
            <span className="text-xs font-bold text-white block mt-1">
              Build Your Career
            </span>
          </div>

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-white text-[10px]">
              <span>🎓</span>
              <span className="font-medium text-[9px]">2026 - 2027</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-xs text-white">
              📚
            </div>
          </div>
        </div>
      );

    case "sale":
      return (
        <div
          className={`relative overflow-hidden flex flex-col justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "linear-gradient(135deg, #ea580c 0%, #f97316 40%, #fbbf24 100%)",
          }}
        >
          {/* Palm leaf tropical shadow aesthetic */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-md" />

          <div className="z-10">
            <span className="text-[10px] font-black uppercase text-amber-100 tracking-widest block">
              SUMMER SALE
            </span>
            <div className="text-lg font-black text-white leading-tight drop-shadow-sm">
              50% <span className="text-xs font-bold">OFF</span>
            </div>
          </div>

          <div className="z-10 flex items-center justify-between">
            <span className="text-[9px] bg-black/20 text-white font-medium px-2 py-0.5 rounded-full">
              Limited Season
            </span>
            <span className="text-sm">🌴</span>
          </div>
        </div>
      );

    case "newyear":
      return (
        <div
          className={`relative overflow-hidden flex flex-col items-center justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "radial-gradient(circle at 50% 40%, #18181b 0%, #09090b 80%, #000000 100%)",
          }}
        >
          {/* Golden fireworks and sparkles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-20 h-20 rounded-full border border-dashed border-amber-300 animate-spin" style={{ animationDuration: "20s" }} />
          </div>

          <div className="flex gap-3 text-[10px] text-amber-300 z-10 pt-1">
            <span>✨</span>
            <span className="text-xs font-serif tracking-widest uppercase text-amber-200">
              Celebration
            </span>
            <span>✨</span>
          </div>

          <div className="text-center z-10 my-auto">
            <span className="text-base font-serif font-extrabold tracking-wider bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent drop-shadow">
              New Year
            </span>
            <span className="block text-xl font-sans font-black text-white tracking-widest drop-shadow-[0_0_10px_#f59e0b]">
              2026
            </span>
          </div>

          <div className="text-[9px] text-amber-300/80 font-medium z-10">
            ✦ Welcome ✦
          </div>
        </div>
      );

    case "product":
      return (
        <div
          className={`relative overflow-hidden flex flex-col justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "linear-gradient(145deg, #27272a 0%, #18181b 50%, #3f3f46 100%)",
          }}
        >
          <div className="z-10">
            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold block">
              Audio Pro
            </span>
            <span className="text-xs font-bold text-zinc-100">
              Noise Cancelling
            </span>
          </div>

          {/* Minimalist headphone icon graphic on pedestal */}
          <div className="relative z-10 flex flex-col items-center py-1">
            <div className="w-10 h-10 rounded-full border-2 border-zinc-300 flex items-center justify-center relative">
              <div className="w-2.5 h-5 bg-zinc-200 rounded-sm absolute -left-1.5 shadow" />
              <div className="w-2.5 h-5 bg-zinc-200 rounded-sm absolute -right-1.5 shadow" />
            </div>
            <div className="w-16 h-2 bg-black/40 rounded-full blur-[2px] mt-1" />
          </div>

          <div className="z-10 text-[8px] text-zinc-400 text-right">
            Studio Series
          </div>
        </div>
      );

    case "social":
      return (
        <div
          className={`relative overflow-hidden flex flex-col justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #f43f5e 100%)",
          }}
        >
          <div className="z-10">
            <span className="text-[9px] uppercase tracking-wider text-white/80 font-bold block">
              Viral Reach
            </span>
            <span className="text-xs font-extrabold text-white">
              Connect & Engage
            </span>
          </div>

          {/* Floating colorful social icons */}
          <div className="flex items-center justify-center gap-2 z-10 py-1">
            <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-[10px] shadow">
              ❤️
            </div>
            <div className="w-7 h-7 rounded-lg bg-white/30 backdrop-blur-sm flex items-center justify-center text-white text-xs shadow-md">
              💬
            </div>
            <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-[10px] shadow">
              🚀
            </div>
          </div>

          <div className="z-10 text-[8px] text-white/90 font-medium">
            #TrendingToday
          </div>
        </div>
      );

    case "corporate":
      return (
        <div
          className={`relative overflow-hidden flex flex-col justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "linear-gradient(160deg, #0284c7 0%, #0369a1 40%, #0f172a 100%)",
          }}
        >
          {/* Skyscraper architectural lines */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="20,100 35,20 65,20 80,100" fill="none" stroke="#ffffff" strokeWidth="1" />
              <line x1="35" y1="20" x2="35" y2="100" stroke="#ffffff" strokeWidth="0.5" />
              <line x1="65" y1="20" x2="65" y2="100" stroke="#ffffff" strokeWidth="0.5" />
              <line x1="25" y1="50" x2="75" y2="50" stroke="#ffffff" strokeWidth="0.5" />
              <line x1="22" y1="75" x2="78" y2="75" stroke="#ffffff" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="z-10">
            <span className="text-[9px] uppercase tracking-wider text-sky-200 font-semibold block">
              Global Summit
            </span>
            <span className="text-xs font-bold text-white drop-shadow">
              Corporate Strategy
            </span>
          </div>

          <div className="z-10 flex items-center justify-between text-white text-[9px] bg-sky-950/40 px-2 py-1 rounded backdrop-blur-xs">
            <span>Executive Brief</span>
            <span>→</span>
          </div>
        </div>
      );

    case "food":
      return (
        <div
          className={`relative overflow-hidden flex flex-col justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "linear-gradient(135deg, #881337 0%, #9f1239 50%, #4c0519 100%)",
          }}
        >
          <div className="z-10">
            <span className="text-[9px] uppercase tracking-wider text-rose-200 font-serif block">
              Chef Special
            </span>
            <span className="text-xs font-serif font-bold text-amber-100">
              Gourmet Bistro
            </span>
          </div>
          <div className="text-center z-10 text-xl">🍽️</div>
          <div className="z-10 text-[8px] text-amber-200/80">Fine Dining</div>
        </div>
      );

    case "health":
      return (
        <div
          className={`relative overflow-hidden flex flex-col justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "linear-gradient(135deg, #0284c7 0%, #059669 100%)",
          }}
        >
          <div className="z-10">
            <span className="text-[9px] uppercase tracking-wider text-teal-100 font-bold block">
              Health Check
            </span>
            <span className="text-xs font-bold text-white">
              Medical Wellness
            </span>
          </div>
          <div className="text-center z-10 text-xl">🩺</div>
          <div className="z-10 text-[8px] text-teal-100/90">24/7 Care</div>
        </div>
      );

    case "realestate":
      return (
        <div
          className={`relative overflow-hidden flex flex-col justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "linear-gradient(145deg, #18181b 0%, #27272a 60%, #b45309 100%)",
          }}
        >
          <div className="z-10">
            <span className="text-[9px] uppercase tracking-wider text-amber-300 font-bold block">
              Luxury Living
            </span>
            <span className="text-xs font-bold text-white">
              Modern Villa
            </span>
          </div>
          <div className="text-center z-10 text-xl">🏡</div>
          <div className="z-10 text-[8px] text-amber-200">Prime Location</div>
        </div>
      );

    case "tech":
    default:
      return (
        <div
          className={`relative overflow-hidden flex flex-col justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "linear-gradient(135deg, #4c1d95 0%, #7956c9 50%, #1e1b4b 100%)",
          }}
        >
          <div className="z-10">
            <span className="text-[9px] uppercase tracking-wider text-violet-200 font-bold block">
              AI Summit
            </span>
            <span className="text-xs font-bold text-white">
              Future Tech 2026
            </span>
          </div>
          <div className="text-center z-10 text-xl">⚡</div>
          <div className="z-10 text-[8px] text-violet-200">Innovate Now</div>
        </div>
      );
  }
}
