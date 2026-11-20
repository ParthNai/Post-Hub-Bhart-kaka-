"use client";

import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface CancelJobModalProps {
  isOpen: boolean;
  jobId: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isSubmitting?: boolean;
}

export const CancelJobModal: React.FC<CancelJobModalProps> = ({
  isOpen,
  jobId,
  onClose,
  onConfirm,
  isSubmitting = false,
}) => {
  const [reason, setReason] = useState("Administrative intervention");
  const [customNotes, setCustomNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = customNotes ? `${reason}: ${customNotes}` : reason;
    onConfirm(finalReason);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 12, 30, 0.45)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "460px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "1px solid #EAE4EE",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #EAE4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
                color: "#E53E3E",
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#24213A",
                  margin: 0,
                }}
              >
                Cancel Job Execution
              </h3>
              <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#777184" }}>
                Job ID: <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{jobId}</span>
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
              borderRadius: "4px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: "20px" }}>
            <p style={{ fontSize: "13px", color: "#4A4754", lineHeight: 1.5, margin: "0 0 16px 0" }}>
              Are you sure you want to cancel this AI generation job? The assigned worker will stop processing and the job state will transition to <strong>Cancelled</strong>.
            </p>

            <div style={{ marginBottom: "14px" }}>
              <label
                htmlFor="cancel-reason"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#24213A",
                  marginBottom: "6px",
                }}
              >
                Cancellation Reason
              </label>
              <select
                id="cancel-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: "13px",
                  borderRadius: "8px",
                  border: "1px solid #EAE4EE",
                  backgroundColor: "#FFFFFF",
                  color: "#24213A",
                  outline: "none",
                }}
              >
                <option value="Administrative intervention">Administrative intervention</option>
                <option value="User requested cancellation">User requested cancellation</option>
                <option value="Job stalled or unresponsive">Job stalled or unresponsive</option>
                <option value="Provider rate limit exceeded">Provider rate limit exceeded</option>
                <option value="Scheduled maintenance">Scheduled maintenance</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="cancel-notes"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#24213A",
                  marginBottom: "6px",
                }}
              >
                Optional Audit Notes
              </label>
              <textarea
                id="cancel-notes"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Enter details for the audit trail..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: "13px",
                  borderRadius: "8px",
                  border: "1px solid #EAE4EE",
                  backgroundColor: "#FFFFFF",
                  color: "#24213A",
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div
            style={{
              padding: "12px 20px",
              backgroundColor: "#FAF9FD",
              borderTop: "1px solid #EAE4EE",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                backgroundColor: "#FFFFFF",
                color: "#24213A",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Keep Running
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#E53E3E",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
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
