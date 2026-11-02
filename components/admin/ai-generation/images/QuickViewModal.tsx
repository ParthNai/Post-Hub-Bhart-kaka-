"use client";

import React, { useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Trash2, Flag } from "lucide-react";
import type { AiGeneratedImage } from "@/lib/ai-images";
import { ImageThumbnailArtwork } from "./ImageThumbnailArtwork";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: AiGeneratedImage | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onFlag: (id: string) => void;
}

export function QuickViewModal({
  isOpen,
  onClose,
  image,
  onApprove,
  onReject,
  onFlag,
}: QuickViewModalProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!isOpen || !image) return null;

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-[#EAE4EE] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#EAE4EE] bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-[#24213A]">{image.id}</h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                image.moderationStatus === "approved"
                  ? "bg-[#DCFCE7] text-[#16A34A]"
                  : image.moderationStatus === "pending"
                  ? "bg-[#FFEDD5] text-[#EA580C]"
                  : image.moderationStatus === "rejected"
                  ? "bg-[#FEE2E2] text-[#EF4444]"
                  : "bg-[#E8DFF5] text-[#7956C9]"
              }`}
            >
              {image.moderationStatus}
            </span>
            <span className="text-xs text-[#777184] hidden sm:inline">
              {image.category} • {image.dimensions}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center border border-[#EAE4EE] rounded-lg bg-white overflow-hidden">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-[#FAF7F2] text-[#777184] transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[10px] font-medium text-[#777184]">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-[#FAF7F2] text-[#777184] transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1.5 hover:bg-[#FAF7F2] text-[#777184] transition-colors border-l border-[#EAE4EE]"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#777184] hover:text-[#24213A] rounded-lg hover:bg-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Zoomable Image Canvas */}
        <div className="flex-1 overflow-auto p-6 bg-[#18181B] flex items-center justify-center">
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center center",
              transition: "transform 0.15s ease",
            }}
            className="w-80 h-96 rounded-xl overflow-hidden shadow-2xl border border-white/20"
          >
            <ImageThumbnailArtwork type={image.thumbnailType} size="full" />
          </div>
        </div>

        {/* Footer with Moderation Actions */}
        <div className="px-6 py-3.5 bg-[#FAF7F2] border-t border-[#EAE4EE] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#777184]">
            <span className="font-semibold text-[#24213A]">{image.userName}</span>:{" "}
            <span className="italic truncate max-w-sm inline-block align-bottom">
              &ldquo;{image.prompt}&rdquo;
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onApprove(image.id);
                onClose();
              }}
              className="px-3 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onReject(image.id);
                onClose();
              }}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onFlag(image.id);
                onClose();
              }}
              className="px-3 py-1.5 bg-[#7956C9] hover:bg-[#6845B8] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Flag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

