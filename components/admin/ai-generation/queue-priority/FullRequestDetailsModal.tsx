"use client";

import React from "react";
import { X, FileText, User, Cpu, Clock, Coins, ArrowUp, XCircle } from "lucide-react";
import type { QueuePriorityItem } from "@/lib/ai-queue-priority";

interface FullRequestDetailsModalProps {
  isOpen: boolean;
  item: QueuePriorityItem | null;
  onClose: () => void;
  onChangePriority: (item: QueuePriorityItem) => void;
  onCancelRequest: (item: QueuePriorityItem) => void;
}

export const FullRequestDetailsModal: React.FC<FullRequestDetailsModalProps> = ({
  isOpen,
  item,
  onClose,
  onChangePriority,
  onCancelRequest,
}) => {
  if (!isOpen || !item) return null;

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
          maxWidth: "580px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
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
            position: "sticky",
            top: 0,
            backgroundColor: "#FFFFFF",
            zIndex: 10,
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
              <FileText size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#24213A", margin: 0 }}>
                Request Deep Dive: {item.id}
              </h3>
              <p style={{ fontSize: "12px", color: "#777184", margin: 0 }}>
                Job ID: {item.relatedJobId} • Worker: {item.workerId || "worker-pool-auto"}
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
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Prompt card */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#777184", marginBottom: "6px" }}>
              Generation Prompt
            </label>
            <div
              style={{
                backgroundColor: "#FAF7F2",
                border: "1px solid #EAE4EE",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "13px",
                color: "#24213A",
                lineHeight: 1.5,
              }}
            >
              {item.prompt || "No prompt text recorded."}
            </div>
          </div>

          {/* User & Allocation info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ padding: "12px", border: "1px solid #EAE4EE", borderRadius: "8px", backgroundColor: "#FFFFFF" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#777184", fontSize: "11px", fontWeight: 600, marginBottom: "4px" }}>
                <User size={13} />
                <span>USER DETAILS</span>
              </div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>{item.userName || item.userId}</div>
              <div style={{ fontSize: "11px", color: "#777184" }}>{item.userId} • {item.userRole || "Member"}</div>
            </div>

            <div style={{ padding: "12px", border: "1px solid #EAE4EE", borderRadius: "8px", backgroundColor: "#FFFFFF" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#777184", fontSize: "11px", fontWeight: 600, marginBottom: "4px" }}>
                <Coins size={13} />
                <span>BILLING & CREDITS</span>
              </div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>{item.creditsDeducted || 25} Credits</div>
              <div style={{ fontSize: "11px", color: item.refunded ? "#16A34A" : "#777184" }}>
                {item.refunded ? "Refunded upon cancellation" : "Reserved in user balance"}
              </div>
            </div>
          </div>

          {/* Execution Specs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ padding: "12px", border: "1px solid #EAE4EE", borderRadius: "8px", backgroundColor: "#FFFFFF" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#777184", fontSize: "11px", fontWeight: 600, marginBottom: "4px" }}>
                <Cpu size={13} />
                <span>ROUTING SPECIFICATION</span>
              </div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>{item.providerModelFormatted}</div>
              <div style={{ fontSize: "11px", color: "#777184" }}>Type: {item.generationType} • Aspect: {item.aspectRatio || "1:1"}</div>
            </div>

            <div style={{ padding: "12px", border: "1px solid #EAE4EE", borderRadius: "8px", backgroundColor: "#FFFFFF" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#777184", fontSize: "11px", fontWeight: 600, marginBottom: "4px" }}>
                <Clock size={13} />
                <span>QUEUE TIMINGS</span>
              </div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>Submitted: {item.submittedAt}</div>
              <div style={{ fontSize: "11px", color: "#777184" }}>
                {item.scheduledAt ? `Scheduled: ${item.scheduledAt}` : `Wait Time: ~${item.waitingDurationMinutes || 5} min`}
              </div>
            </div>
          </div>

          {/* Failure reason if applicable */}
          {item.failureReason && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
                fontSize: "12px",
              }}
            >
              <strong>Status Note:</strong> {item.failureReason}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onChangePriority(item);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #7956C9",
                backgroundColor: "#F3EFFC",
                color: "#7956C9",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <ArrowUp size={14} />
              <span>Change Priority</span>
            </button>

            {item.status !== "Completed" && item.status !== "Cancelled" && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCancelRequest(item);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid #FCA5A5",
                  backgroundColor: "#FFFFFF",
                  color: "#DC2626",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <XCircle size={14} />
                <span>Cancel Request</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                backgroundColor: "#FFFFFF",
                color: "#544E61",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
