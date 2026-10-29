"use client";

import React from "react";
import { Crosshair } from "lucide-react";
import type { DesignTokenItem } from "@/lib/token-usage";

interface TokenDetailsPanelProps {
  selectedToken: DesignTokenItem | null;
}

export const TokenDetailsPanel: React.FC<TokenDetailsPanelProps> = ({ selectedToken }) => {
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
        gap: "16px",
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
        Token details
      </h3>

      {!selectedToken ? (
        /* Empty State with Crosshair/Target Icon matching reference */
        <div
          style={{
            minHeight: "140px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "24px 16px",
            borderRadius: "12px",
            border: "1px dashed var(--border, #EAE4EE)",
            backgroundColor: "#FAF8FC",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "var(--secondary, #E8DFF5)",
              color: "var(--primary, #7956C9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Crosshair size={24} />
          </div>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text-muted, #777184)",
              textAlign: "center",
            }}
          >
            Select a token to inspect its dependencies.
          </span>
        </div>
      ) : (
        /* Selected Token Details */
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "10px",
              borderBottom: "1px solid #F5F1F8",
            }}
          >
            <span style={{ color: "var(--text-muted, #777184)", fontSize: "12px" }}>Identifier</span>
            <span
              style={{
                fontFamily: "var(--font-mono, monospace, sans-serif)",
                fontWeight: 600,
                color: "var(--primary, #7956C9)",
                backgroundColor: "#F2EDF8",
                padding: "2px 8px",
                borderRadius: "6px",
              }}
            >
              {selectedToken.id}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "10px",
              borderBottom: "1px solid #F5F1F8",
            }}
          >
            <span style={{ color: "var(--text-muted, #777184)", fontSize: "12px" }}>Display Name</span>
            <span style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>{selectedToken.name}</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "10px",
              borderBottom: "1px solid #F5F1F8",
            }}
          >
            <span style={{ color: "var(--text-muted, #777184)", fontSize: "12px" }}>Category</span>
            <span
              style={{
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: "10px",
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: "#F2EDF8",
                color: "var(--primary, #7956C9)",
              }}
            >
              {selectedToken.category}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "10px",
              borderBottom: "1px solid #F5F1F8",
            }}
          >
            <span style={{ color: "var(--text-muted, #777184)", fontSize: "12px" }}>Current Configured Value</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {selectedToken.colorHex && (
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: selectedToken.colorHex,
                    display: "inline-block",
                    border: "1px solid rgba(0,0,0,0.1)",
                  }}
                />
              )}
              <span style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>{selectedToken.value}</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              paddingBottom: "10px",
              borderBottom: "1px solid #F5F1F8",
            }}
          >
            <span style={{ color: "var(--text-muted, #777184)", fontSize: "12px" }}>Description</span>
            <span style={{ color: "var(--text, #24213A)", fontSize: "12.5px", lineHeight: "1.4" }}>
              {selectedToken.description}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ color: "var(--text-muted, #777184)", fontSize: "12px" }}>Configuration Source</span>
            <span
              style={{
                fontSize: "11.5px",
                fontFamily: "var(--font-mono, monospace, sans-serif)",
                color: "var(--text-muted, #777184)",
              }}
            >
              {selectedToken.source}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

