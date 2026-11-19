"use client";

import React from "react";

interface ImageThumbnailArtworkProps {
  type: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "full";
}

export function ImageThumbnailArtwork({
  type,
  className = "",
  size = "md",
}: ImageThumbnailArtworkProps) {
  const sizeClasses = {
    sm: "w-12 h-12 rounded-lg",
    md: "w-full h-48 rounded-xl",
    lg: "w-full h-64 rounded-xl",
    full: "w-full h-full",
  }[size];

  switch (type) {
    case "diwali":
      return (
        <div
          className={`relative overflow-hidden flex flex-col items-center justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "radial-gradient(circle at 50% 60%, #4a0404 0%, #2b0000 60%, #120000 100%)",
          }}
        >
          {/* Ornamental Mandala Backdrop */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#fef08a" strokeWidth="0.5" strokeDasharray="2,2" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="#f59e0b" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="25" fill="none" stroke="#fbbf24" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="text-center z-10 pt-2">
            <span className="text-base font-serif font-extrabold text-amber-200 tracking-wide drop-shadow block">
              Happy
            </span>
            <span className="text-xl font-serif font-black text-amber-300 tracking-wider drop-shadow-[0_0_8px_#f59e0b] block -mt-1">
              Diwali
            </span>
            <p className="text-[9px] text-amber-100/90 font-serif max-w-[160px] mx-auto mt-0.5 leading-tight">
              May the festival of lights bring happiness and prosperity
            </p>
          </div>

          {/* Three Clay Diyas with warm flames */}
          <div className="relative z-10 flex items-end justify-center gap-4 pb-2 w-full">
            {/* Left Small Diya */}
            <div className="flex flex-col items-center opacity-85">
              <div className="w-1.5 h-3 bg-gradient-to-t from-amber-500 to-yellow-200 rounded-full shadow-[0_0_8px_#f59e0b] animate-pulse" />
              <div className="w-8 h-2.5 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-900 rounded-b-full border-t border-amber-400/40" />
            </div>

            {/* Center Main Diya */}
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-4.5 bg-gradient-to-t from-amber-500 via-yellow-200 to-white rounded-full shadow-[0_0_14px_#f59e0b] animate-pulse" />
              <div className="w-12 h-3.5 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-900 rounded-b-full border-t border-amber-300 shadow-md flex items-center justify-center">
                <div className="w-6 h-0.5 bg-amber-400/60 rounded-full" />
              </div>
            </div>

            {/* Right Small Diya */}
            <div className="flex flex-col items-center opacity-85">
              <div className="w-1.5 h-3 bg-gradient-to-t from-amber-500 to-yellow-200 rounded-full shadow-[0_0_8px_#f59e0b] animate-pulse" />
              <div className="w-8 h-2.5 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-900 rounded-b-full border-t border-amber-400/40" />
            </div>
          </div>
        </div>
      );

    case "education":
      return (
        <div
          className={`relative overflow-hidden flex flex-col justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "linear-gradient(145deg, #f8fafc 0%, #e2e8f0 40%, #bfdbfe 100%)",
          }}
        >
          <div className="z-10">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 block">
              ADMISSION
            </span>
            <span className="text-xl font-black text-blue-800 tracking-tight block -mt-1">
              OPEN
            </span>
            <span className="inline-block bg-amber-400 text-blue-950 text-[9px] font-black px-2 py-0.5 rounded shadow-2xs mt-0.5">
              2026-27
            </span>
            <p className="text-[9px] text-slate-600 font-medium mt-1">
              Build Your Future With Us
            </p>
          </div>

          {/* Student Illustration with blue book */}
          <div className="relative z-10 flex items-end justify-between">
            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-2 py-1 rounded-lg border border-blue-200 text-blue-900 text-[10px] shadow-xs">
              <span>🎓</span>
              <span className="font-bold text-[9px]">Apply Now</span>
            </div>
            <div className="w-16 h-20 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-2xl flex flex-col items-center justify-end pb-1 shadow-md">
              <div className="w-7 h-7 rounded-full bg-amber-200 border-2 border-white mb-1 shadow-xs" />
              <div className="w-10 h-6 bg-blue-900 rounded-t flex items-center justify-center text-[10px] text-white">
                📘
              </div>
            </div>
          </div>
        </div>
      );

    case "business":
      return (
        <div
          className={`relative overflow-hidden flex flex-col justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #0c4a6e 50%, #0369a1 100%)",
          }}
        >
          {/* Skyscraper background silhouette */}
          <div className="absolute inset-0 opacity-25">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <rect x="5" y="40" width="15" height="60" fill="#ffffff" />
              <rect x="25" y="20" width="20" height="80" fill="#ffffff" />
              <rect x="50" y="30" width="18" height="70" fill="#ffffff" />
              <rect x="72" y="15" width="22" height="85" fill="#ffffff" />
            </svg>
          </div>

          <div className="z-10">
            <span className="text-base font-black text-white uppercase tracking-tight block">
              BUSINESS
            </span>
            <span className="text-lg font-black text-cyan-300 uppercase tracking-tight block -mt-1">
              GROWTH
            </span>
            <p className="text-[10px] text-cyan-100 font-medium mt-0.5">
              Grow Faster Together
            </p>
          </div>

          {/* Upward Blue Arrow Chart */}
          <div className="relative z-10 flex items-end justify-between px-2 pt-2">
            <div className="w-3 h-8 bg-cyan-400/60 rounded-t" />
            <div className="w-3 h-12 bg-cyan-300/80 rounded-t shadow-[0_0_8px_#38bdf8]" />
            <div className="w-3 h-16 bg-white rounded-t shadow-[0_0_12px_#ffffff]" />
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-300"
              viewBox="0 0 100 40"
              fill="none"
              strokeWidth="2.5"
            >
              <path d="M 5 35 Q 40 25, 65 15 T 95 5" />
              <circle cx="95" cy="5" r="3.5" fill="#34d399" />
            </svg>
          </div>
        </div>
      );

    case "navratri":
      return (
        <div
          className={`relative overflow-hidden flex flex-col items-center justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "radial-gradient(circle at 50% 40%, #ea580c 0%, #b45309 50%, #451a03 100%)",
          }}
        >
          {/* Traditional Arch Frame */}
          <div className="absolute inset-0 border-4 border-amber-300/40 m-2 rounded-t-full pointer-events-none" />

          <div className="text-center z-10 pt-2">
            <span className="text-sm font-serif font-bold text-amber-200 tracking-wider block">
              Happy
            </span>
            <span className="text-lg font-serif font-extrabold text-amber-100 tracking-wide drop-shadow block -mt-1">
              Navratri
            </span>
          </div>

          {/* Garba Dancers Vector Silhouette */}
          <div className="relative z-10 flex items-center justify-center gap-3 py-1">
            <div className="text-2xl animate-bounce" style={{ animationDuration: "2s" }}>
              💃
            </div>
            <div className="text-lg text-amber-300 font-serif">✦</div>
            <div className="text-2xl animate-bounce" style={{ animationDuration: "2s", animationDelay: "0.5s" }}>
              🕺
            </div>
          </div>

          <div className="z-10 text-[9px] text-amber-200 font-serif tracking-widest uppercase">
            Festive Celebrations
          </div>
        </div>
      );

    case "shoes":
      return (
        <div
          className={`relative overflow-hidden flex flex-col justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "linear-gradient(135deg, #c2410c 0%, #ea580c 40%, #fb923c 100%)",
          }}
        >
          <div className="z-10">
            <span className="text-[11px] font-black uppercase text-amber-100 tracking-widest block">
              FLAT
            </span>
            <div className="text-2xl font-black text-white leading-none drop-shadow">
              50% <span className="text-sm font-bold">OFF</span>
            </div>
            <p className="text-[9px] text-amber-100 font-medium mt-1">
              Shop Smart Shop Better
            </p>
          </div>

          {/* Sneaker Graphic Icon */}
          <div className="relative z-10 flex items-center justify-center py-2">
            <div className="text-4xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] transform -rotate-12 hover:scale-105 transition-transform">
              👟
            </div>
          </div>

          <div className="z-10 flex items-center justify-between text-white text-[9px] bg-black/20 px-2 py-0.5 rounded-full">
            <span>Limited Edition</span>
            <span>→</span>
          </div>
        </div>
      );

    case "skyscrapers":
      return (
        <div
          className={`relative overflow-hidden flex flex-col justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "linear-gradient(160deg, #0284c7 0%, #0369a1 40%, #0f172a 100%)",
          }}
        >
          {/* Glass Architectural lines */}
          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="10,100 30,15 70,15 90,100" fill="none" stroke="#ffffff" strokeWidth="1" />
              <line x1="30" y1="15" x2="30" y2="100" stroke="#ffffff" strokeWidth="0.5" />
              <line x1="70" y1="15" x2="70" y2="100" stroke="#ffffff" strokeWidth="0.5" />
              <line x1="20" y1="50" x2="80" y2="50" stroke="#ffffff" strokeWidth="0.5" />
              <line x1="15" y1="75" x2="85" y2="75" stroke="#ffffff" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="z-10">
            <span className="text-xs font-black uppercase text-sky-200 tracking-wider block">
              Dream Big
            </span>
            <span className="text-base font-bold text-white drop-shadow block -mt-0.5">
              Achieve More
            </span>
          </div>

          <div className="z-10 flex items-center justify-between text-white text-[9px] bg-sky-950/50 px-2 py-1 rounded backdrop-blur-xs">
            <span>Corporate Excellence</span>
            <span>✦</span>
          </div>
        </div>
      );

    case "dussehra":
      return (
        <div
          className={`relative overflow-hidden flex flex-col items-center justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "radial-gradient(circle at 50% 50%, #d97706 0%, #92400e 50%, #451a03 100%)",
          }}
        >
          <div className="text-center z-10 pt-2">
            <span className="text-sm font-serif font-bold text-amber-200 tracking-wider block">
              Happy
            </span>
            <span className="text-lg font-serif font-black text-amber-100 tracking-wide drop-shadow block -mt-1">
              Dussehra
            </span>
          </div>

          {/* Lord Rama Silhouette with Bow and Arrow */}
          <div className="relative z-10 flex flex-col items-center py-1">
            <div className="text-3xl text-amber-100 drop-shadow-[0_0_12px_#fbbf24]">
              🏹
            </div>
            <div className="text-[10px] text-amber-200/90 font-serif mt-1">
              Victory of Good Over Evil
            </div>
          </div>

          <div className="z-10 text-[9px] text-amber-300 font-serif">
            ✦ Shubh Vijayadashami ✦
          </div>
        </div>
      );

    case "fitness":
    default:
      return (
        <div
          className={`relative overflow-hidden flex flex-col justify-between p-3 select-none ${sizeClasses} ${className}`}
          style={{
            background: "linear-gradient(135deg, #0284c7 0%, #0d9488 50%, #15803d 100%)",
          }}
        >
          <div className="z-10">
            <span className="text-sm font-black uppercase text-white tracking-tight block">
              Stay Healthy
            </span>
            <span className="text-lg font-black text-emerald-200 uppercase tracking-tight block -mt-1">
              Stay Fit
            </span>
          </div>

          {/* Running Silhouette */}
          <div className="relative z-10 flex items-center justify-center py-2">
            <div className="text-4xl text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
              🏃‍♀️
            </div>
          </div>

          <div className="z-10 text-[9px] text-emerald-100 font-medium">
            Daily Wellness Campaign
          </div>
        </div>
      );
  }
}

