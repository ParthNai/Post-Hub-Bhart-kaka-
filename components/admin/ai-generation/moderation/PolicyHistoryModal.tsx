"use client";

import React, { useState } from "react";
import { X, Clock, RotateCcw, Check } from "lucide-react";
import type { ModerationPolicyRevision } from "@/lib/ai-moderation";

interface PolicyHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ModerationPolicyRevision[];
  currentVersion: string;
  onRestore: (revisionId: string) => Promise<boolean>;
}

export function PolicyHistoryModal({
  isOpen,
  onClose,
  history,
  currentVersion,
  onRestore,
}: PolicyHistoryModalProps) {
  const [restoringId, setRestoringId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRestore = async (id: string) => {
    if (!confirm("Are you sure you want to restore this historical policy version? Current configuration will be replaced.")) {
      return;
    }
    setRestoringId(id);
    const success = await onRestore(id);
    setRestoringId(null);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-[#EAE4EE] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE] bg-[#FAF7F2]">
          <div className="flex items-center gap-2 text-[#7956C9]">
            <div className="w-8 h-8 rounded-lg bg-[#E8DFF5] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#7956C9]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#24213A]">
                Policy Version History
              </h3>
              <p className="text-xs text-[#777184] font-medium">
                Audit trail and configuration rollback management
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

        {/* History List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#777184]">
              No prior policy revisions logged.
            </div>
          ) : (
            history.map((rev) => {
              const isCurrent = rev.version === currentVersion;

              return (
                <div
                  key={rev.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? "bg-purple-50/50 border-[#7956C9]/40 shadow-2xs"
                      : "bg-[#FAF7F2]/60 border-[#EAE4EE] hover:bg-[#FAF7F2]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#24213A] bg-white border border-[#EAE4EE] px-2 py-0.5 rounded shadow-2xs">
                        {rev.version}
                      </span>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#7956C9] bg-[#E8DFF5] px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3 stroke-[3]" />
                          Active
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-[#777184]">
                      {rev.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-[#24213A] font-medium mb-1">
                    {rev.summary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#777184] pt-2 border-t border-[#EAE4EE]/60">
                    <span>
                      Updated by <strong className="text-[#24213A]">{rev.updatedBy}</strong>
                    </span>

                    {!isCurrent && (
                      <button
                        type="button"
                        onClick={() => handleRestore(rev.id)}
                        disabled={restoringId === rev.id}
                        className="flex items-center gap-1 text-xs font-bold text-[#7956C9] hover:text-[#6846B8] bg-white hover:bg-purple-50 border border-[#EAE4EE] px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>
                          {restoringId === rev.id ? "Restoring..." : "Restore"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#FAF7F2] border-t border-[#EAE4EE] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#EAE4EE] hover:bg-[#F2EDF7] text-[#24213A] text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
