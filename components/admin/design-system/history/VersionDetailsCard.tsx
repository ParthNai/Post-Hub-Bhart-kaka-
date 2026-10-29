"use client";

import React from "react";
import { FileSearch } from "lucide-react";
import type { VersionRecord } from "@/lib/version-history";

interface VersionDetailsCardProps {
  selectedVersion: VersionRecord | null;
}

export const VersionDetailsCard: React.FC<VersionDetailsCardProps> = ({ selectedVersion }) => {
  return (
    <div
      style={{
        backgroundColor: "var(--surface, #FFFFFF)",
        borderRadius: "16px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "22px 24px",
        boxShadow: "0 4px 16px -2px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <h3
        style={{
          fontSize: "17px",
          fontWeight: 700,
          color: "var(--text, #24213A)",
          margin: 0,
        }}
      >
        Version details
      </h3>

      {!selectedVersion ? (
        /* Empty State with Document Search Icon matching reference */
        <div
          style={{
            minHeight: "130px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "24px 16px",
            borderRadius: "12px",
            border: "1px dashed var(--border, #EAE4EE)",
            backgroundColor: "#FAF8FC",
          }}
        >
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              backgroundColor: "var(--secondary, #E8DFF5)",
              color: "var(--primary, #7956C9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileSearch size={22} />
          </div>
          <span
            style={{
              fontSize: "12.5px",
              fontWeight: 500,
              color: "var(--text-muted, #777184)",
              textAlign: "center",
            }}
          >
            Select a recorded version to inspect its changes.
          </span>
        </div>
      ) : (
        /* Selected Version Details */
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12.5px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "8px",
              borderBottom: "1px solid #F5F1F8",
            }}
          >
            <span style={{ color: "var(--text-muted, #777184)" }}>Version</span>
            <span
              style={{
                fontFamily: "var(--font-mono, monospace, sans-serif)",
                fontWeight: 700,
                color: "var(--primary, #7956C9)",
                backgroundColor: "#F2EDF8",
                padding: "2px 8px",
                borderRadius: "6px",
              }}
            >
              {selectedVersion.id}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "8px",
              borderBottom: "1px solid #F5F1F8",
            }}
          >
            <span style={{ color: "var(--text-muted, #777184)" }}>Author</span>
            <span style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>{selectedVersion.author}</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "8px",
              borderBottom: "1px solid #F5F1F8",
            }}
          >
            <span style={{ color: "var(--text-muted, #777184)" }}>Status</span>
            <span
              style={{
                textTransform: "capitalize",
                fontWeight: 600,
                color: selectedVersion.status === "published" ? "#12805C" : "var(--primary, #7956C9)",
              }}
            >
              {selectedVersion.status}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "3px",
              paddingBottom: "8px",
              borderBottom: "1px solid #F5F1F8",
            }}
          >
            <span style={{ color: "var(--text-muted, #777184)" }}>Summary</span>
            <span style={{ color: "var(--text, #24213A)", fontWeight: 500 }}>{selectedVersion.summary}</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "8px",
              borderBottom: "1px solid #F5F1F8",
            }}
          >
            <span style={{ color: "var(--text-muted, #777184)" }}>Base Version</span>
            <span style={{ fontFamily: "var(--font-mono, monospace, sans-serif)", color: "var(--text, #24213A)" }}>
              {selectedVersion.baseVersion || "Initial"}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ color: "var(--text-muted, #777184)" }}>Publication Record</span>
            <span style={{ color: "var(--text, #24213A)", fontSize: "11.5px" }}>
              {selectedVersion.publicationRecord || "Not published"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
