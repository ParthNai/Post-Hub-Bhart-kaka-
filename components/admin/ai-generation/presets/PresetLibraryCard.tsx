"use client";

import React from "react";
import { Package, Search, FilterX, ChevronDown } from "lucide-react";
import type { AiPromptPreset } from "@/lib/ai-presets";
import { PresetThumbnail } from "./PresetThumbnail";

interface PresetLibraryCardProps {
  presets: AiPromptPreset[];
  selectedPresetId: string | null;
  onSelectPreset: (preset: AiPromptPreset) => void;
  onEditPreset: (preset: AiPromptPreset) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  onClearFilters: () => void;
}

export function PresetLibraryCard({
  presets,
  selectedPresetId,
  onSelectPreset,
  onEditPreset,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  selectedSort,
  setSelectedSort,
  onClearFilters,
}: PresetLibraryCardProps) {
  const categories = [
    "All Categories",
    "Festivals",
    "Business",
    "Education",
    "Offers",
    "Events",
    "Product",
    "Social Media",
    "Healthcare",
    "Real Estate",
  ];

  const statuses = ["All Statuses", "Active", "Draft", "Archived"];
  const sortOptions = ["Last Updated", "Name A-Z", "Category"];

  return (
    <div className="bg-white border border-[#EAE4EE] rounded-xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-[#7956C9]" />
        <h2 className="text-base font-bold text-[#24213A]">Preset Library</h2>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#777184] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search preset name..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] placeholder-[#777184] focus:outline-none focus:border-[#7956C9] focus:ring-1 focus:ring-[#7956C9]"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#777184] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#777184] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sort Filter */}
        <div className="relative">
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
          >
            {sortOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#777184] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Clear Filters */}
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#7956C9] hover:text-[#6845B8] hover:bg-[#FAF7F2] rounded-lg transition-colors"
        >
          <FilterX className="w-3.5 h-3.5" />
          <span>Clear Filters</span>
        </button>
      </div>

      {/* Grid of Preset Cards */}
      {presets.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[#EAE4EE] rounded-xl">
          <Package className="w-10 h-10 text-[#B8B2C4] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#24213A]">No presets found</p>
          <p className="text-xs text-[#777184] mt-1">
            Try adjusting your search or filter criteria.
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-3 px-3 py-1.5 text-xs text-[#7956C9] font-medium bg-[#E8DFF5]/50 hover:bg-[#E8DFF5] rounded-md transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {presets.slice(0, 8).map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`flex flex-col justify-between border rounded-xl overflow-hidden cursor-pointer transition-all duration-150 hover:shadow-md bg-white ${
                  isSelected
                    ? "border-[#7956C9] ring-2 ring-[#7956C9]/20 shadow-sm"
                    : "border-[#EAE4EE] hover:border-[#7956C9]/50"
                }`}
              >
                {/* Visual Thumbnail */}
                <div className="p-2.5 pb-0">
                  <PresetThumbnail type={preset.thumbnailType} size="md" />
                </div>

                {/* Content */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#24213A] truncate">
                      {preset.name}
                    </h3>
                    <div className="mt-1">
                      <span className="inline-block px-2 py-0.5 bg-[#E8DFF5] text-[#7956C9] text-[10px] font-semibold rounded-md">
                        {preset.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#777184] line-clamp-2 mt-1.5 leading-snug">
                      {preset.description}
                    </p>
                  </div>

                  {/* Card Footer: Status dot + Date + Edit button */}
                  <div className="pt-3 mt-2 border-t border-[#F2EEF6] flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          preset.status === "active"
                            ? "bg-[#16A34A]"
                            : preset.status === "draft"
                            ? "bg-[#EA580C]"
                            : "bg-[#71717A]"
                        }`}
                      />
                      <span
                        className={`capitalize font-medium ${
                          preset.status === "active"
                            ? "text-[#16A34A]"
                            : preset.status === "draft"
                            ? "text-[#EA580C]"
                            : "text-[#71717A]"
                        }`}
                      >
                        {preset.status}
                      </span>
                      <span className="text-[#A19DAA] text-[10px] ml-1">
                        {preset.updatedAt}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPreset(preset);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium text-[#7956C9] border border-[#7956C9] hover:bg-[#7956C9] hover:text-white rounded-md transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
