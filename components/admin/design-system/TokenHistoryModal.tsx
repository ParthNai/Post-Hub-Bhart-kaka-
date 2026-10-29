"use client";

import React from "react";
import type { DesignSystemVersionHistory } from "@/lib/design-system";
import { X, History, User } from "lucide-react";

interface TokenHistoryModalProps {
  isOpen: boolean;
  history: DesignSystemVersionHistory[];
  currentVersion: number;
  onClose: () => void;
}

export const TokenHistoryModal: React.FC<TokenHistoryModalProps> = ({
  isOpen,
  history,
  currentVersion,
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
        backgroundColor: "rgba(36, 33, 58, 0.45)",
        backdropFilter: "blur(4px)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid var(--border, #EAE4EE)",
          boxShadow: "0 20px 40px rgba(36, 33, 58, 0.15)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: "1px solid var(--border, #EAE4EE)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <History size={18} style={{ color: "var(--primary, #7956C9)" }} />
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text, #24213A)" }}>
              Design Token Audit History
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "var(--text-muted, #777184)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* History List */}
        <div
          style={{
            maxHeight: "360px",
            overflowY: "auto",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Current draft entry */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid var(--primary, #7956C9)",
              backgroundColor: "var(--primary-light, #F4F0FB)",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--primary, #7956C9)" }}>
                Version {currentVersion} (Current Working Draft)
              </span>
              <span
                style={{
                  fontSize: "10.5px",
                  fontWeight: 600,
                  padding: "2px 6px",
                  borderRadius: "4px",
                  backgroundColor: "var(--secondary, #E8DFF5)",
                  color: "var(--primary, #7956C9)",
                }}
              >
                Active
              </span>
            </div>
            <span style={{ fontSize: "11.5px", color: "var(--text-muted, #777184)" }}>
              In-memory or pending save
            </span>
          </div>

          {/* Past revisions */}
          {history.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "24px 0",
                color: "var(--text-muted, #777184)",
                fontSize: "13px",
              }}
            >
              No previous saved versions recorded yet.
            </div>
          ) : (
            history.map((entry, idx) => (
              <div
                key={idx}
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border, #EAE4EE)",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text, #24213A)" }}>
                    Version {entry.version}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted, #777184)" }}>
                    {new Date(entry.savedAt).toLocaleString()}
                  </span>
                </div>

                <p style={{ fontSize: "12px", color: "var(--text-muted, #777184)" }}>
                  {entry.summary}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "11px",
                    color: "var(--text-muted, #777184)",
                  }}
                >
                  <User size={12} />
                  <span>{entry.savedBy}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "14px 24px",
            backgroundColor: "#FAF9FC",
            borderTop: "1px solid var(--border, #EAE4EE)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "7px 16px",
              fontSize: "13px",
              fontWeight: 500,
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              color: "var(--text, #24213A)",
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
