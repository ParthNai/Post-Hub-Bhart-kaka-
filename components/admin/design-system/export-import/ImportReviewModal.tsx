"use client";

import React, { useState } from "react";
import { X, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from "lucide-react";
import type { ImportValidationResult, DiffChangeType } from "@/lib/export-import";

interface ImportReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ImportValidationResult | null;
  onProceedToImport: () => void;
}

export const ImportReviewModal: React.FC<ImportReviewModalProps> = ({
  isOpen,
  onClose,
  result,
  onProceedToImport,
}) => {
  const [filterType, setFilterType] = useState<string>("all");

  if (!isOpen || !result) return null;

  const filteredDiffs = result.diffs.filter((d) => {
    if (filterType === "all") return true;
    if (filterType === "changes") return d.changeType === "added" || d.changeType === "modified";
    return d.changeType === filterType;
  });

  const isImportable =
    (result.status === "valid" || result.status === "valid_with_warnings") &&
    result.tokensDetected > 0;

  const renderBadge = (type: DiffChangeType) => {
    if (type === "added") {
      return (
        <span
          style={{
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "11px",
            fontWeight: 600,
            backgroundColor: "#EBF8F2",
            color: "#1E8E5A",
          }}
        >
          Added
        </span>
      );
    }
    if (type === "modified") {
      return (
        <span
          style={{
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "11px",
            fontWeight: 600,
            backgroundColor: "#FEF7E6",
            color: "#B76E00",
          }}
        >
          Modified
        </span>
      );
    }
    if (type === "invalid") {
      return (
        <span
          style={{
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "11px",
            fontWeight: 600,
            backgroundColor: "#FCE8E6",
            color: "#D93025",
          }}
        >
          Invalid
        </span>
      );
    }
    return (
      <span
        style={{
          display: "inline-block",
          padding: "2px 8px",
          borderRadius: "12px",
          fontSize: "11px",
          fontWeight: 500,
          backgroundColor: "#F1EDF5",
          color: "#777184",
        }}
      >
        Unchanged
      </span>
    );
  };

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
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "780px",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 40px rgba(36, 33, 58, 0.16)",
          border: "1px solid var(--border, #EAE4EE)",
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
            padding: "18px 24px",
            borderBottom: "1px solid var(--border, #EAE4EE)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text, #24213A)" }}>
                Review Configuration Changes
              </h3>
              {result.status === "valid" && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: 600,
                    backgroundColor: "#EBF8F2",
                    color: "#1E8E5A",
                  }}
                >
                  <CheckCircle2 size={12} /> Valid
                </span>
              )}
              {result.status === "valid_with_warnings" && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: 600,
                    backgroundColor: "#FEF7E6",
                    color: "#B76E00",
                  }}
                >
                  <AlertTriangle size={12} /> Valid with warnings
                </span>
              )}
              {result.status === "invalid" && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: 600,
                    backgroundColor: "#FCE8E6",
                    color: "#D93025",
                  }}
                >
                  <XCircle size={12} /> Invalid
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted, #777184)" }}>
              File: <strong>{result.fileName}</strong> ({result.fileSizeFormatted}) • {result.tokensDetected} tokens detected
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted, #777184)",
              padding: "4px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 24px",
            backgroundColor: "#FAF9FC",
            borderBottom: "1px solid var(--border, #EAE4EE)",
            fontSize: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#777184" }}>Filter:</span>
            {[
              { key: "all", label: `All (${result.diffs.length})` },
              { key: "changes", label: `Changes (${result.addedTokens + result.modifiedTokens})` },
              { key: "added", label: `Added (${result.addedTokens})` },
              { key: "modified", label: `Modified (${result.modifiedTokens})` },
              { key: "unchanged", label: `Unchanged (${result.unchangedTokens})` },
              ...(result.invalidEntries > 0 ? [{ key: "invalid", label: `Invalid (${result.invalidEntries})` }] : []),
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilterType(f.key)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: filterType === f.key ? "1px solid var(--primary, #7956C9)" : "1px solid transparent",
                  backgroundColor: filterType === f.key ? "#FFFFFF" : "transparent",
                  color: filterType === f.key ? "var(--primary, #7956C9)" : "#777184",
                  fontWeight: filterType === f.key ? 600 : 400,
                  cursor: "pointer",
                  fontSize: "11.5px",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ color: "var(--text-muted, #777184)" }}>
            Showing {filteredDiffs.length} entries
          </div>
        </div>

        {/* Diffs Table Content */}
        <div
          style={{
            padding: "16px 24px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {filteredDiffs.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted, #777184)" }}>
              No tokens match the selected filter.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border, #EAE4EE)", textAlign: "left", color: "#777184" }}>
                  <th style={{ padding: "8px 12px", fontWeight: 600 }}>Token</th>
                  <th style={{ padding: "8px 12px", fontWeight: 600 }}>Category</th>
                  <th style={{ padding: "8px 12px", fontWeight: 600 }}>Previous value</th>
                  <th style={{ padding: "8px 12px", fontWeight: 600 }}>New value</th>
                  <th style={{ padding: "8px 12px", fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDiffs.map((diff, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: "1px solid #F0ECF4",
                      backgroundColor: diff.changeType === "invalid" ? "#FFF8F7" : "transparent",
                    }}
                  >
                    <td style={{ padding: "8px 12px", fontFamily: "monospace", color: "var(--text, #24213A)", fontWeight: 500 }}>
                      {diff.token}
                    </td>
                    <td style={{ padding: "8px 12px", color: "#777184" }}>
                      {diff.category}
                    </td>
                    <td style={{ padding: "8px 12px", color: "#777184" }}>
                      {diff.previousValue}
                    </td>
                    <td style={{ padding: "8px 12px", fontWeight: 600, color: "var(--text, #24213A)" }}>
                      {diff.newValue}
                    </td>
                    <td style={{ padding: "8px 12px" }}>
                      {renderBadge(diff.changeType)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 24px",
            borderTop: "1px solid var(--border, #EAE4EE)",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div style={{ fontSize: "12px", color: "var(--text-muted, #777184)" }}>
            Draft safety: Applying changes will create a new draft without modifying published tokens.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 14px",
                fontSize: "12.5px",
                fontWeight: 600,
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                color: "var(--text, #24213A)",
                cursor: "pointer",
              }}
            >
              Close
            </button>

            {isImportable && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToImport();
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  borderRadius: "8px",
                  backgroundColor: "var(--primary, #7956C9)",
                  color: "#FFFFFF",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(121, 86, 201, 0.25)",
                }}
              >
                <span>Proceed to Import as Draft</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
