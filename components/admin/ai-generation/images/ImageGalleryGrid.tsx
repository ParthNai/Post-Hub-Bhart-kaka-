"use client";

import React from "react";
import { Eye, CheckCircle2, Clock, AlertCircle, Flag, ChevronLeft, ChevronRight } from "lucide-react";
import type { AiGeneratedImage } from "@/lib/ai-images";
import { ImageThumbnailArtwork } from "./ImageThumbnailArtwork";

interface ImageGalleryGridProps {
  images: AiGeneratedImage[];
  selectedImageId: string | null;
  onSelectImage: (img: AiGeneratedImage) => void;
  onQuickView: (img: AiGeneratedImage) => void;
  selectedIds: string[];
  onToggleSelectId: (id: string) => void;
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}

export function ImageGalleryGrid({
  images,
  selectedImageId,
  onSelectImage,
  onQuickView,
  selectedIds,
  onToggleSelectId,
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: ImageGalleryGridProps) {
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className="space-y-4">
      {/* 4x2 Grid */}
      {images.length === 0 ? (
        <div className="bg-white border border-[#EAE4EE] rounded-xl p-12 text-center">
          <p className="text-sm font-semibold text-[#24213A]">No images found</p>
          <p className="text-xs text-[#777184] mt-1">
            Try adjusting your search criteria or filter options.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((img) => {
            const isSelected = selectedImageId === img.id;
            const isChecked = selectedIds.includes(img.id);

            return (
              <div
                key={img.id}
                onClick={() => onSelectImage(img)}
                className={`bg-white border rounded-xl overflow-hidden cursor-pointer transition-all duration-150 hover:shadow-md flex flex-col justify-between ${
                  isSelected
                    ? "border-[#7956C9] ring-2 ring-[#7956C9]/20 shadow-sm"
                    : "border-[#EAE4EE] hover:border-[#7956C9]/40"
                }`}
              >
                {/* Artwork Canvas with Checkbox */}
                <div className="relative p-2 pb-0">
                  <div className="relative rounded-lg overflow-hidden border border-[#EAE4EE]">
                    <ImageThumbnailArtwork type={img.thumbnailType} size="md" />

                    {/* Selection Checkbox */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelectId(img.id);
                      }}
                      className="absolute top-2 left-2 z-20 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-[#7956C9] focus:ring-[#7956C9] bg-white/80 backdrop-blur-xs cursor-pointer shadow-xs border-[#EAE4EE]"
                      />
                    </div>
                  </div>
                </div>

                {/* Card Content & Metadata */}
                <div className="p-3 pt-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#24213A] truncate">
                      {img.id}
                    </h3>
                    <p className="text-[11px] text-[#777184] truncate mt-0.5">
                      {img.requestId} • {img.userName}
                    </p>
                  </div>

                  {/* Bottom Row: Status Badge & Quick View Button */}
                  <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#F2EEF6]">
                    {/* Status Pill */}
                    <div>
                      {img.moderationStatus === "approved" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DCFCE7] text-[#16A34A]">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </span>
                      ) : img.moderationStatus === "pending" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFEDD5] text-[#EA580C]">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      ) : img.moderationStatus === "rejected" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEE2E2] text-[#EF4444]">
                          <AlertCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8DFF5] text-[#7956C9]">
                          <Flag className="w-3 h-3" />
                          Flagged
                        </span>
                      )}
                    </div>

                    {/* Quick View Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(img);
                      }}
                      className="w-7 h-7 rounded-lg border border-[#EAE4EE] bg-white hover:bg-[#FAF7F2] text-[#777184] hover:text-[#7956C9] flex items-center justify-center transition-colors shadow-2xs"
                      title="Quick View"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer matching Screen 22 */}
      <div className="bg-white border border-[#EAE4EE] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#777184] shadow-xs">
        <div>
          Showing {startItem} – {endItem} of {total.toLocaleString()} images
        </div>

        <div className="flex items-center gap-4">
          {/* Rows Per Page */}
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
              className="px-2 py-1 bg-white border border-[#EAE4EE] rounded-md text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
            >
              <option value={8}>8</option>
              <option value={16}>16</option>
              <option value={24}>24</option>
            </select>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="p-1 border border-[#EAE4EE] rounded-md disabled:opacity-40 hover:bg-[#FAF7F2] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Pills */}
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                page === 1
                  ? "bg-[#7956C9] text-white"
                  : "border border-[#EAE4EE] hover:bg-[#FAF7F2] text-[#24213A]"
              }`}
            >
              1
            </button>

            {totalPages >= 2 && (
              <button
                type="button"
                onClick={() => onPageChange(2)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                  page === 2
                    ? "bg-[#7956C9] text-white"
                    : "border border-[#EAE4EE] hover:bg-[#FAF7F2] text-[#24213A]"
                }`}
              >
                2
              </button>
            )}

            {totalPages >= 3 && (
              <button
                type="button"
                onClick={() => onPageChange(3)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                  page === 3
                    ? "bg-[#7956C9] text-white"
                    : "border border-[#EAE4EE] hover:bg-[#FAF7F2] text-[#24213A]"
                }`}
              >
                3
              </button>
            )}

            {totalPages > 4 && <span className="px-1 text-[#A19DAA]">...</span>}

            {totalPages > 3 && (
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                  page === totalPages
                    ? "bg-[#7956C9] text-white"
                    : "border border-[#EAE4EE] hover:bg-[#FAF7F2] text-[#24213A]"
                }`}
              >
                {totalPages}
              </button>
            )}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="p-1 border border-[#EAE4EE] rounded-md disabled:opacity-40 hover:bg-[#FAF7F2] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

