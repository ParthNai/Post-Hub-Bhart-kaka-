"use client";

import React, { useState } from "react";
import { X, ArrowUp, AlertCircle } from "lucide-react";
import type { QueuePriorityItem, QueuePriorityLevel } from "@/lib/ai-queue-priority";

interface ChangePriorityModalProps {
  isOpen: boolean;
  item: QueuePriorityItem | null;
  onClose: () => void;
  onConfirm: (item: QueuePriorityItem, newPriority: QueuePriorityLevel, reason: string) => Promise<void>;
}

export const ChangePriorityModal: React.FC<ChangePriorityModalProps> = ({
  isOpen,
  item,
  onClose,
  onConfirm,
}) => {
  const [selectedPriority, setSelectedPriority] = useState<QueuePriorityLevel>("High");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const priorityOptions: { level: QueuePriorityLevel; desc: string; color: string; bg: string }[] = [
    { level: "Critical", desc: "Top priority – process immediately, preempts normal queue", color: "#DC2626", bg: "#FEE2E2" },
    { level: "High", desc: "High priority – prioritizes before standard requests", color: "#EA580C", bg: "#FFEDD5" },
    { level: "Normal", desc: "Standard priority – default queue order", color: "#16A34A", bg: "#DCFCE7" },
    { level: "Low", desc: "Low priority – processed during low system load", color: "#0284C7", bg: "#E0F2FE" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide an audit reason for changing this request's priority.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onConfirm(item, selectedPriority, reason.trim());
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change priority";
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
          maxWidth: "480px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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
                backgroundColor: "#F3EFFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#7956C9",
              }}
            >
              <ArrowUp size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#24213A", margin: 0 }}>
                Change Priority Level
              </h3>
              <p style={{ fontSize: "12px", color: "#777184", margin: 0 }}>
                Request: {item.id} ({item.userId})
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
              borderRadius: "6px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 12px",
                borderRadius: "8px",
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
                fontSize: "12px",
                marginBottom: "16px",
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#24213A",
                marginBottom: "8px",
              }}
            >
              Select New Priority
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {priorityOptions.map((opt) => {
                const isSelected = selectedPriority === opt.level;
                return (
                  <div
                    key={opt.level}
                    onClick={() => setSelectedPriority(opt.level)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: isSelected ? "2px solid #7956C9" : "1px solid #EAE4EE",
                      backgroundColor: isSelected ? "#FBF8FF" : "#FFFFFF",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 700,
                          backgroundColor: opt.bg,
                          color: opt.color,
                        }}
                      >
                        {opt.level}
                      </span>
                      <span style={{ fontSize: "12px", color: "#544E61" }}>{opt.desc}</span>
                    </div>
                    <input
                      type="radio"
                      name="priority"
                      checked={isSelected}
                      onChange={() => setSelectedPriority(opt.level)}
                      style={{ accentColor: "#7956C9" }}
                    />
                  </div>
                );
              })}
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
              Reason for Priority Change *
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Urgent executive campaign graphic requested for immediate release"
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

          {/* Actions */}
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#7956C9",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: isSubmitting ? "wait" : "pointer",
                boxShadow: "0 2px 4px rgba(121, 86, 201, 0.2)",
              }}
            >
              {isSubmitting ? "Updating..." : "Update Priority"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
