"use client";

import React from "react";
import { X, History } from "lucide-react";
import { ScreenVersionHistory } from "@/lib/screens";

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history?: ScreenVersionHistory[];
  currentVersion?: number;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  history = [],
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Close modal backdrop"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape") onClose();
        }}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(36, 33, 58, 0.45)",
          backdropFilter: "blur(2px)",
          zIndex: 80,
        }}
      />

      {/* Modal Dialog */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "520px",
          maxWidth: "94vw",
          maxHeight: "80vh",
          backgroundColor: "var(--surface)",
          borderRadius: "16px",
          boxShadow: "0 16px 40px rgba(36, 33, 58, 0.18)",
          zIndex: 85,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <History size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", margin: 0 }}>
                Configuration Version History
              </h3>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Audit trail of saved draft revisions and baseline snapshots
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close version history modal"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "var(--text-muted)",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* History List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {history.length === 0 ? (
            <div style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
              No previous version records available for this screen.
            </div>
          ) : (
            history.map((rev, idx) => (
              <div
                key={idx}
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  backgroundColor: idx === 0 ? "#FAF7FD" : "var(--surface)",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "14px",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        padding: "1px 8px",
                        borderRadius: "8px",
                        backgroundColor: idx === 0 ? "var(--secondary)" : "#F4F0FB",
                        color: "var(--primary)",
                      }}
                    >
                      v{rev.version}.0
                    </span>
                    {idx === 0 && (
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--success)" }}>
                        Current Draft
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)" }}>
                    {rev.changesSummary}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-light)", marginTop: "2px" }}>
                    Saved by {rev.author} • {rev.savedAt}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--surface)",
                      fontSize: "11.5px",
                      color: "var(--text)",
                      cursor: "pointer",
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
