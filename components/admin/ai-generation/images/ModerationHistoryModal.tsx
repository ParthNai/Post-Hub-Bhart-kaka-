"use client";

import React, { useState, useEffect } from "react";
import { X, History, Check, AlertCircle, Flag } from "lucide-react";
import type { AiModerationHistoryItem } from "@/lib/ai-images";

interface ModerationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageId: string | null;
}

export function ModerationHistoryModal({
  isOpen,
  onClose,
  imageId,
}: ModerationHistoryModalProps) {
  if (!isOpen || !imageId) return null;

  return <HistoryModalContent key={imageId} imageId={imageId} onClose={onClose} />;
}

function HistoryModalContent({
  imageId,
  onClose,
}: {
  imageId: string;
  onClose: () => void;
}) {
  const [history, setHistory] = useState<AiModerationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/ai-generation/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "history", imageId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setHistory(data.history || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Error fetching history:", err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [imageId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#EAE4EE] shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE] bg-[#FAF7F2]">
          <div className="flex items-center gap-2 text-[#7956C9]">
            <div className="w-8 h-8 rounded-lg bg-[#E8DFF5] flex items-center justify-center">
              <History className="w-4 h-4 text-[#7956C9]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#24213A]">
                Moderation History
              </h3>
              <p className="text-xs text-[#777184] font-medium">
                Audit log for {imageId}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#777184] hover:text-[#24213A] hover:bg-[#FAF7F2] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Audit Trail List */}
        <div className="p-6 max-h-[380px] overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-8 text-center text-xs text-[#777184]">
              Loading history...
            </div>
          ) : history.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#777184]">
              No prior moderation entries recorded for this image.
            </div>
          ) : (
            <div className="relative border-l border-[#EAE4EE] ml-3 pl-5 space-y-5">
              {history.map((item) => {
                const isApproved = item.action === "approved";
                const isRejected = item.action === "rejected";
                const isFlagged = item.action === "flagged";

                return (
                  <div key={item.id} className="relative group">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        isApproved
                          ? "bg-[#10B981]"
                          : isRejected
                          ? "bg-[#EF4444]"
                          : isFlagged
                          ? "bg-[#F59E0B]"
                          : "bg-[#7956C9]"
                      }`}
                    />

                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#24213A] capitalize flex items-center gap-1.5">
                          {isApproved && <Check className="w-3 h-3 text-[#10B981]" />}
                          {isRejected && <AlertCircle className="w-3 h-3 text-[#EF4444]" />}
                          {isFlagged && <Flag className="w-3 h-3 text-[#F59E0B]" />}
                          {item.action}
                        </span>
                        <span className="text-[11px] text-[#777184]">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-[#524D63] mt-0.5">
                        By <span className="font-semibold text-[#24213A]">{item.reviewer}</span>
                      </p>
                      {item.reason && (
                        <p className="text-xs text-[#EF4444] font-medium mt-1 bg-red-50 p-2 rounded-md border border-red-100">
                          Reason: {item.reason}
                        </p>
                      )}
                      {item.notes && item.notes !== item.reason && (
                        <p className="text-xs text-[#777184] italic mt-1 bg-[#FAF7F2] p-2 rounded-md border border-[#EAE4EE]">
                          &quot;{item.notes}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#FAF7F2] border-t border-[#EAE4EE] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#EAE4EE] hover:bg-[#F2EDF7] text-[#24213A] text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
