"use client";

import React, { useState } from "react";
import { X, AlertTriangle, ShieldCheck } from "lucide-react";
import type { QueuePriorityItem } from "@/lib/ai-queue-priority";

interface CancelRequestModalProps {
  isOpen: boolean;
  item: QueuePriorityItem | null;
  onClose: () => void;
  onConfirm: (item: QueuePriorityItem, reason: string) => Promise<void>;
}

export const CancelRequestModal: React.FC<CancelRequestModalProps> = ({
  isOpen,
  item,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for cancelling this request.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onConfirm(item, reason.trim());
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel request";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "460px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #EAE4EE",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "#FEE2E2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#DC2626",
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#24213A", margin: 0 }}>
                Cancel Queue Request
              </h3>
              <p style={{ fontSize: "12px", color: "#777184", margin: 0 }}>
                {item.id} — Position #{item.queuePosition}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#777184",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
          {error && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
                fontSize: "12px",
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              backgroundColor: "#FAF7F2",
              border: "1px solid #EAE4EE",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "16px",
              fontSize: "12px",
              color: "#544E61",
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <ShieldCheck size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong>Credit Safety Policy:</strong> If credits ({item.creditsDeducted || 25} credits) were reserved for this job, they will be automatically refunded to user <strong>{item.userId}</strong> upon cancellation.
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#24213A",
                marginBottom: "6px",
              }}
            >
              Cancellation Reason *
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Duplicate submission or user requested cancellation"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                backgroundColor: "#FAF7F2",
                fontSize: "12px",
                color: "#24213A",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                backgroundColor: "#FFFFFF",
                color: "#544E61",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#DC2626",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: isSubmitting ? "wait" : "pointer",
                boxShadow: "0 2px 4px rgba(220, 38, 38, 0.2)",
              }}
            >
              {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
