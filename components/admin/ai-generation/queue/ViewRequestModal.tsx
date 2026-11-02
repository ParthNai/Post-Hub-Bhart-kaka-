"use client";

import React from "react";
import { X, Eye, Clock, CheckCircle2, AlertCircle, Play } from "lucide-react";
import type { AiQueueItem } from "@/lib/ai-queue";
import { PresetThumbnail } from "../presets/PresetThumbnail";

interface ViewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AiQueueItem | null;
}

export function ViewRequestModal({ isOpen, onClose, item }: ViewRequestModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#EAE4EE] shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE] bg-[#FAF7F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8DFF5] flex items-center justify-center text-[#7956C9]">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#24213A]">{item.id}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    item.status === "completed"
                      ? "bg-[#DCFCE7] text-[#16A34A]"
                      : item.status === "processing"
                      ? "bg-[#DBEAFE] text-[#2563EB]"
                      : item.status === "failed"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-[#E8DFF5] text-[#7956C9]"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-[#777184]">AI Generation Job Record</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#777184] hover:text-[#24213A] rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Visual Poster Banner & Prompt */}
          <div className="flex flex-col sm:flex-row gap-4 p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE4EE]">
            <div className="w-24 h-28 rounded-lg overflow-hidden border border-[#EAE4EE] shrink-0 shadow-2xs">
              <PresetThumbnail type={item.thumbnailType} size="full" />
            </div>
            <div className="flex-1 space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-[#777184] tracking-wider">
                Full Prompt
              </span>
              <p className="text-[#24213A] font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-[#EAE4EE]">
                {item.prompt}
              </p>
            </div>
          </div>

          {/* Error Banner if Failed */}
          {item.status === "failed" && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">
                  Generation Failed (HTTP {item.errorCode || "500"})
                </div>
                <div className="text-[11px] mt-0.5">{item.errorMessage}</div>
              </div>
            </div>
          )}

          {/* Grid Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 bg-white border border-[#EAE4EE] rounded-lg">
              <div className="text-[10px] text-[#777184]">Submitted By</div>
              <div className="font-semibold text-[#24213A] mt-0.5">{item.userName}</div>
              <div className="text-[10px] text-[#A19DAA]">{item.userRole || "User"}</div>
            </div>

            <div className="p-2.5 bg-white border border-[#EAE4EE] rounded-lg">
              <div className="text-[10px] text-[#777184]">Preset Applied</div>
              <div className="font-semibold text-[#24213A] mt-0.5">{item.presetName}</div>
            </div>

            <div className="p-2.5 bg-white border border-[#EAE4EE] rounded-lg">
              <div className="text-[10px] text-[#777184]">Provider / Model</div>
              <div className="font-semibold text-[#24213A] mt-0.5">{item.provider}</div>
            </div>

            <div className="p-2.5 bg-white border border-[#EAE4EE] rounded-lg">
              <div className="text-[10px] text-[#777184]">Dimensions & Format</div>
              <div className="font-semibold text-[#24213A] mt-0.5">
                {item.dimensions || "1080 × 1350 px"} ({item.format || "PNG"})
              </div>
            </div>

            <div className="p-2.5 bg-white border border-[#EAE4EE] rounded-lg">
              <div className="text-[10px] text-[#777184]">Submitted Timestamp</div>
              <div className="font-semibold text-[#24213A] mt-0.5">{item.submittedAt}</div>
            </div>

            <div className="p-2.5 bg-white border border-[#EAE4EE] rounded-lg">
              <div className="text-[10px] text-[#777184]">Processing Started</div>
              <div className="font-semibold text-[#24213A] mt-0.5">
                {item.processingStartedAt || "—"}
              </div>
            </div>
          </div>

          {/* Processing Lifecycle Timeline */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-[#24213A] block mb-2">
              Queue Lifecycle Timeline
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5 text-[#24213A]">
                <Clock className="w-3.5 h-3.5 text-[#7956C9]" />
                <span className="font-medium">1. Enqueued:</span>
                <span className="text-[#777184]">{item.submittedAt}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#24213A]">
                <Play className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="font-medium">2. Dispatched to Worker:</span>
                <span className="text-[#777184]">
                  {item.processingStartedAt
                    ? `${item.processingStartedAt} (Worker ${item.workerId || "01"})`
                    : "Waiting in queue"}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-[#24213A]">
                {item.status === "completed" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                ) : item.status === "failed" ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-[#B8B2C4]" />
                )}
                <span className="font-medium">3. Completion / Terminal:</span>
                <span className="text-[#777184]">
                  {item.completedAt
                    ? `${item.completedAt} (${item.durationSec || 18}s runtime)`
                    : item.status === "failed"
                    ? "Execution terminated with error"
                    : "In progress"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#FAF7F2] border-t border-[#EAE4EE] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-[#FAF7F2] border border-[#EAE4EE] text-xs font-medium text-[#24213A] rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
