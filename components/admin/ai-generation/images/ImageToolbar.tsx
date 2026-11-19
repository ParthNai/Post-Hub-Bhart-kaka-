"use client";

import React from "react";
import { Search, ChevronDown, Calendar, FilterX } from "lucide-react";

interface ImageToolbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedUser: string;
  setSelectedUser: (u: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  selectedTimeRange: string;
  setSelectedTimeRange: (t: string) => void;
  selectedProvider: string;
  setSelectedProvider: (p: string) => void;
  onClearFilters: () => void;
}

export function ImageToolbar({
  searchQuery,
  setSearchQuery,
  selectedUser,
  setSelectedUser,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  selectedTimeRange,
  setSelectedTimeRange,
  selectedProvider,
  setSelectedProvider,
  onClearFilters,
}: ImageToolbarProps) {
  const users = [
    "All Users",
    "Parth Patel",
    "Priya Shah",
    "Amit Desai",
    "Neha Patel",
    "Rohan Mehta",
    "Jigna Shah",
    "Karan Patel",
    "Meera Shah",
  ];

  const categories = [
    "All Categories",
    "Festivals & Events",
    "Education",
    "Business",
    "Offers & Promotions",
    "Health & Wellness",
  ];

  const statuses = ["All Statuses", "Approved", "Pending", "Rejected", "Flagged"];
  const timeRanges = ["Last 30 Days", "Last 7 Days", "Last 90 Days", "All Time"];
  const providers = ["All Providers", "OpenAI / DALL-E 3", "Google / Imagen"];

  return (
    <div className="bg-white border border-[#EAE4EE] rounded-xl p-3.5 shadow-xs flex flex-wrap items-center gap-3">
      {/* Search by Image ID or Request ID */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-3.5 h-3.5 text-[#777184] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by image ID or request ID..."
          className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] placeholder-[#777184] focus:outline-none focus:border-[#7956C9]"
        />
      </div>

      {/* Users Dropdown */}
      <div className="relative">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
        >
          {users.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 text-[#777184] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Categories Dropdown */}
      <div className="relative">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 text-[#777184] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Status Dropdown */}
      <div className="relative">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 text-[#777184] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Time Range Dropdown */}
      <div className="relative">
        <div className="flex items-center">
          <Calendar className="w-3.5 h-3.5 text-[#777184] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="appearance-none pl-8 pr-7 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
          >
            {timeRanges.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#777184] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Providers Dropdown */}
      <div className="relative">
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
        >
          {providers.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 text-[#777184] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Clear Filters */}
      <button
        type="button"
        onClick={onClearFilters}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#7956C9] hover:text-[#6845B8] hover:bg-[#FAF7F2] rounded-lg transition-colors ml-auto"
      >
        <FilterX className="w-3.5 h-3.5" />
        <span>Clear Filters</span>
      </button>
    </div>
  );
}

