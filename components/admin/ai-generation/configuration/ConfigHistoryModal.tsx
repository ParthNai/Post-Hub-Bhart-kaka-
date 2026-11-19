"use client";

import React from "react";
import { X, History, RotateCcw, Clock, User } from "lucide-react";
import type { AiConfigHistoryItem } from "@/lib/ai-generation";

interface ConfigHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: AiConfigHistoryItem[];
  onRestore: (id: string) => Promise<void>;
  isRestoring?: boolean;
}

export const ConfigHistoryModal: React.FC<ConfigHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onRestore,
  isRestoring = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
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
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          maxHeight: "85vh",
          backgroundColor: "var(--surface)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
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
              <h2 style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: "var(--foreground)" }}>
                Configuration History
              </h2>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                Audit trail of previous AI provider settings and parameters.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              color: "var(--text-muted)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* History List */}
        <div
          style={{
            padding: "20px 24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)", fontSize: "13px" }}>
              No configuration history recorded yet.
            </div>
          ) : (
            history.map((item, index) => {
              const isCurrent = index === 0;

              return (
                <div
                  key={item.id}
                  style={{
                    borderRadius: "10px",
                    border: isCurrent ? "1.5px solid var(--primary-light)" : "1px solid var(--border)",
                    backgroundColor: isCurrent ? "rgba(121, 86, 201, 0.03)" : "var(--surface)",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono, monospace)",
                          fontWeight: 700,
                          fontSize: "13px",
                          color: "var(--foreground)",
                        }}
                      >
                        {item.version}
                      </span>
                      {isCurrent && (
                        <span
                          style={{
                            fontSize: "10.5px",
                            fontWeight: 700,
                            backgroundColor: "var(--primary-light)",
                            color: "var(--primary)",
                            padding: "2px 8px",
                            borderRadius: "10px",
                          }}
                        >
                          Active Current
                        </span>
                      )}
                    </div>

                    {!isCurrent && (
                      <button
                        type="button"
                        onClick={() => onRestore(item.id)}
                        disabled={isRestoring}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "5px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          backgroundColor: "transparent",
                          color: "var(--primary)",
                          border: "1px solid var(--primary-light)",
                          cursor: isRestoring ? "not-allowed" : "pointer",
                        }}
                      >
                        <RotateCcw size={12} />
                        <span>Restore</span>
                      </button>
                    )}
                  </div>

                  <div style={{ fontSize: "13px", color: "var(--foreground)", lineHeight: "1.4" }}>
                    {item.changesSummary}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      fontSize: "11.5px",
                      color: "var(--text-muted)",
                      marginTop: "2px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <User size={12} />
                      <span>{item.author}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={12} />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--background)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
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

