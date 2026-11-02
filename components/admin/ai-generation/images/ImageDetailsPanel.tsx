"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Info,
  X,
  User,
  Tag,
  FileText,
  Sparkles,
  Cpu,
  Maximize2,
  FileCode,
  HardDrive,
  Calendar,
  ShieldCheck,
  Check,
  Trash2,
  Flag,
  History,
} from "lucide-react";
import type { AiGeneratedImage } from "@/lib/ai-images";
import { ImageThumbnailArtwork } from "./ImageThumbnailArtwork";

interface ImageDetailsPanelProps {
  image: AiGeneratedImage | null;
  onClose?: () => void;
  onApprove: (id: string, notes: string) => Promise<boolean>;
  onReject: (id: string) => void;
  onFlag: (id: string) => void;
  onViewHistory: (id: string) => void;
}

export function ImageDetailsPanel({
  image,
  onClose,
  onApprove,
  onReject,
  onFlag,
  onViewHistory,
}: ImageDetailsPanelProps) {
  const [notes, setNotes] = useState(image?.moderationNotes || "Beautiful design. Approved.");
  const [isApproving, setIsApproving] = useState(false);

  if (!image) {
    return (
      <div className="bg-white border border-[#EAE4EE] rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-[#7956C9]" />
          <h3 className="text-sm font-bold text-[#24213A]">Image Details</h3>
        </div>
        <div className="py-12 text-center text-xs text-[#777184]">
          Select an image from the library to review details and moderation controls.
        </div>
      </div>
    );
  }

  const handleApproveClick = async () => {
    setIsApproving(true);
    await onApprove(image.id, notes);
    setIsApproving(false);
  };

  return (
    <div className="bg-white border border-[#EAE4EE] rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F2EEF6]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#7956C9]" />
            <h3 className="text-sm font-bold text-[#24213A]">Image Details</h3>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#777184] hover:text-[#24213A] rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Full-width Image Preview Canvas */}
        <div className="w-full h-56 rounded-xl overflow-hidden border border-[#EAE4EE] shadow-xs mb-4 relative bg-[#FAF7F2]">
          <ImageThumbnailArtwork type={image.thumbnailType} size="full" />
        </div>

        {/* Detailed Metadata Grid */}
        <div className="space-y-2 text-xs">
          {/* Image ID */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[#777184]">
              <FileCode className="w-3.5 h-3.5" />
              <span>Image ID:</span>
            </div>
            <span className="font-bold text-[#24213A]">{image.id}</span>
          </div>

          {/* Request ID */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[#777184]">
              <Cpu className="w-3.5 h-3.5" />
              <span>Request ID:</span>
            </div>
            <Link
              href={`/admin/ai-generation/queue`}
              className="font-bold text-[#7956C9] hover:underline"
            >
              {image.requestId}
            </Link>
          </div>

          {/* User */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[#777184]">
              <User className="w-3.5 h-3.5" />
              <span>User:</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-[#E8DFF5] text-[#7956C9] font-bold text-[9px] flex items-center justify-center">
                {image.userName.charAt(0)}
              </div>
              <span className="font-semibold text-[#24213A]">{image.userName}</span>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[#777184]">
              <Tag className="w-3.5 h-3.5" />
              <span>Category:</span>
            </div>
            <span className="font-semibold text-[#24213A]">{image.category}</span>
          </div>

          {/* Prompt */}
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-center gap-1.5 text-[#777184]">
              <FileText className="w-3.5 h-3.5" />
              <span>Prompt:</span>
            </div>
            <p className="text-[11px] text-[#24213A] bg-[#FAF7F2] p-2 rounded-lg border border-[#EAE4EE] leading-relaxed max-h-20 overflow-y-auto">
              {image.prompt}
            </p>
          </div>

          {/* Preset */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[#777184]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preset:</span>
            </div>
            <span className="font-semibold text-[#24213A]">{image.presetName}</span>
          </div>

          {/* Provider */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[#777184]">
              <Cpu className="w-3.5 h-3.5" />
              <span>Provider:</span>
            </div>
            <span className="font-semibold text-[#24213A]">{image.provider}</span>
          </div>

          {/* Dimensions */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[#777184]">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Dimensions:</span>
            </div>
            <span className="text-[#24213A]">{image.dimensions}</span>
          </div>

          {/* Format */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[#777184]">
              <FileCode className="w-3.5 h-3.5" />
              <span>Format:</span>
            </div>
            <span className="text-[#24213A]">{image.format}</span>
          </div>

          {/* Size */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[#777184]">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Size:</span>
            </div>
            <span className="text-[#24213A]">{image.fileSize}</span>
          </div>

          {/* Created */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[#777184]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created:</span>
            </div>
            <span className="text-[#24213A]">{image.createdAt}</span>
          </div>
        </div>
      </div>

      {/* Moderation Workspace Sub-panel */}
      <div className="mt-5 pt-4 border-t border-[#F2EEF6] space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#7956C9]" />
          <h4 className="text-xs font-bold text-[#24213A]">Moderation Workspace</h4>
        </div>

        {/* Current Status Pill */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#777184] font-medium">Status:</span>
          <div>
            {image.moderationStatus === "approved" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
                ✓ Approved
              </span>
            ) : image.moderationStatus === "pending" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFEDD5] text-[#EA580C]">
                ⏱ Pending Review
              </span>
            ) : image.moderationStatus === "rejected" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#EF4444]">
                ⊘ Rejected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8DFF5] text-[#7956C9]">
                🚩 Flagged
              </span>
            )}
          </div>
        </div>

        {/* Notes Input */}
        <div>
          <label className="block text-[11px] font-medium text-[#777184] mb-1">
            Notes:
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add moderation notes..."
            className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
          />
        </div>

        {/* Moderation Action Buttons (Approve, Reject, Flag) */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Approve */}
          <button
            type="button"
            onClick={handleApproveClick}
            disabled={isApproving}
            className="py-1.5 px-2 bg-white hover:bg-[#DCFCE7]/40 border border-[#16A34A] text-[#16A34A] rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Approve</span>
          </button>

          {/* Reject */}
          <button
            type="button"
            onClick={() => onReject(image.id)}
            className="py-1.5 px-2 bg-white hover:bg-[#FEE2E2]/40 border border-[#EF4444] text-[#EF4444] rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>

          {/* Flag */}
          <button
            type="button"
            onClick={() => onFlag(image.id)}
            className="py-1.5 px-2 bg-white hover:bg-[#FAF7F2] border border-[#7956C9] text-[#7956C9] rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Flag</span>
          </button>
        </div>

        {/* View Moderation History Link */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => onViewHistory(image.id)}
            className="inline-flex items-center gap-1.5 text-xs text-[#7956C9] hover:text-[#6845B8] font-semibold transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            <span>View Moderation History</span>
          </button>
        </div>
      </div>
    </div>
  );
}

