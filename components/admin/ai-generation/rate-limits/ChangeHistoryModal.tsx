"use client";

import React from "react";
import { History, X } from "lucide-react";
import type { PolicyAuditRecord } from "@/lib/ai-rate-limits";

interface ChangeHistoryModalProps {
  isOpen: boolean;
  history: PolicyAuditRecord[];
  onClose: () => void;
}

export const ChangeHistoryModal: React.FC<ChangeHistoryModalProps> = ({
  isOpen,
  history,
  onClose,
}) => {
  if (!isOpen) return null;

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
          maxWidth: "560px",
          maxHeight: "80vh",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
          border: "1px solid #EAE4EE",
          display: "flex",
          flexDirection: "column",
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
                backgroundColor: "#F3EFFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#7956C9",
              }}
            >
              <History size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#24213A" }}>
                Rate-Limit Change History
              </h3>
              <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#777184" }}>
                Audit log of administrative rate limit policy updates
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
            <X size={16} />
          </button>
        </div>

        {/* List */}
        <div style={{ padding: "16px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
          {history.length === 0 ? (
            <div style={{ textAlign: "center", color: "#777184", fontSize: "13px", padding: "20px" }}>
              No configuration changes recorded yet.
            </div>
          ) : (
            history.map((record) => (
              <div
                key={record.id}
                style={{
                  padding: "12px 14px",
                  borderRadius: "8px",
                  backgroundColor: "#FAF9FD",
                  border: "1px solid #EAE4EE",
                  fontSize: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 700, color: "#24213A" }}>{record.action}</span>
                  <span style={{ color: "#777184", fontSize: "11px" }}>{record.timestamp}</span>
                </div>
                <div style={{ color: "#544E61", fontSize: "11.5px", marginBottom: "4px" }}>
                  {record.details}
                </div>
                <div style={{ color: "#7956C9", fontSize: "11px", fontWeight: 600 }}>
                  By: {record.adminName}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 20px",
            backgroundColor: "#FAF9FD",
            borderTop: "1px solid #EAE4EE",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "7px 16px",
              borderRadius: "6px",
              border: "1px solid #EAE4EE",
              backgroundColor: "#FFFFFF",
              color: "#24213A",
              fontSize: "12.5px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
