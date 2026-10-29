"use client";

import React from "react";
import { Info, Layers, Smartphone, FileText } from "lucide-react";
import type { DesignTokenItem } from "@/lib/token-usage";

interface ReferencedByPanelProps {
  selectedToken: DesignTokenItem | null;
}

export const ReferencedByPanel: React.FC<ReferencedByPanelProps> = ({ selectedToken }) => {
  const compRefs = selectedToken?.references?.components || [];
  const screenRefs = selectedToken?.references?.screens || [];
  const styleRefs = selectedToken?.references?.stylesheets || [];

  const totalRefs = compRefs.length + screenRefs.length + styleRefs.length;

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
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <h3
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "var(--text, #24213A)",
              margin: 0,
            }}
          >
            Referenced by
          </h3>
          <Info size={15} style={{ color: "var(--text-muted, #777184)", cursor: "help" }} />
        </div>
        <p
          style={{
            fontSize: "12px",
            color: "var(--text-muted, #777184)",
            marginTop: "3px",
            marginBottom: 0,
          }}
        >
          {!selectedToken
            ? "No token selected. Select a token from the list to view its references."
            : totalRefs > 0
            ? `Found ${totalRefs} verified source references across components, screens and stylesheets.`
            : "No verified references found for this token in current scan scope."}
        </p>
      </div>

      {/* 1. Components Section */}
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid var(--border, #EAE4EE)",
          padding: "14px 16px",
          backgroundColor: "#FAF9FC",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              backgroundColor: "var(--secondary, #E8DFF5)",
              color: "var(--primary, #7956C9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Layers size={15} />
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text, #24213A)" }}>
            Components
          </span>
          {compRefs.length > 0 && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: "#EAE4EE",
                color: "var(--text, #24213A)",
                padding: "1px 7px",
                borderRadius: "10px",
                marginLeft: "auto",
              }}
            >
              {compRefs.length}
            </span>
          )}
        </div>

        {compRefs.length === 0 ? (
          <div style={{ paddingLeft: "36px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text, #24213A)" }}>
              No references available
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted, #777184)", marginTop: "2px" }}>
              Component references will appear here when available.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "36px" }}>
            {compRefs.map((comp) => (
              <div
                key={comp.file}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #ECE7F0",
                  fontSize: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>{comp.name}</span>
                  {comp.line && (
                    <span style={{ fontSize: "11px", color: "var(--text-muted, #777184)" }}>
                      line {comp.line}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontFamily: "var(--font-mono, monospace, sans-serif)",
                    color: "var(--primary, #7956C9)",
                    marginTop: "2px",
                  }}
                >
                  {comp.file}
                </div>
                {comp.description && (
                  <div style={{ fontSize: "11px", color: "var(--text-muted, #777184)", marginTop: "2px" }}>
                    {comp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Screens Section */}
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid var(--border, #EAE4EE)",
          padding: "14px 16px",
          backgroundColor: "#FAF9FC",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              backgroundColor: "var(--secondary, #E8DFF5)",
              color: "var(--primary, #7956C9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Smartphone size={15} />
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text, #24213A)" }}>
            Screens
          </span>
          {screenRefs.length > 0 && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: "#EAE4EE",
                color: "var(--text, #24213A)",
                padding: "1px 7px",
                borderRadius: "10px",
                marginLeft: "auto",
              }}
            >
              {screenRefs.length}
            </span>
          )}
        </div>

        {screenRefs.length === 0 ? (
          <div style={{ paddingLeft: "36px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text, #24213A)" }}>
              No references available
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted, #777184)", marginTop: "2px" }}>
              Screen references will appear here when available.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "36px" }}>
            {screenRefs.map((scr) => (
              <div
                key={scr.route}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #ECE7F0",
                  fontSize: "12px",
                }}
              >
                <div style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>{scr.name}</div>
                <div
                  style={{
                    fontSize: "11px",
                    fontFamily: "var(--font-mono, monospace, sans-serif)",
                    color: "var(--primary, #7956C9)",
                    marginTop: "2px",
                  }}
                >
                  {scr.route}
                </div>
                {scr.description && (
                  <div style={{ fontSize: "11px", color: "var(--text-muted, #777184)", marginTop: "2px" }}>
                    {scr.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Stylesheets / Token files Section */}
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid var(--border, #EAE4EE)",
          padding: "14px 16px",
          backgroundColor: "#FAF9FC",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              backgroundColor: "var(--secondary, #E8DFF5)",
              color: "var(--primary, #7956C9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FileText size={15} />
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text, #24213A)" }}>
            Stylesheets / Token files
          </span>
          {styleRefs.length > 0 && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: "#EAE4EE",
                color: "var(--text, #24213A)",
                padding: "1px 7px",
                borderRadius: "10px",
                marginLeft: "auto",
              }}
            >
              {styleRefs.length}
            </span>
          )}
        </div>

        {styleRefs.length === 0 ? (
          <div style={{ paddingLeft: "36px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text, #24213A)" }}>
              No references available
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted, #777184)", marginTop: "2px" }}>
              Stylesheet references will appear here when available.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "36px" }}>
            {styleRefs.map((st) => (
              <div
                key={st.file}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #ECE7F0",
                  fontSize: "12px",
                }}
              >
                <div style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>{st.name}</div>
                <div
                  style={{
                    fontSize: "11px",
                    fontFamily: "var(--font-mono, monospace, sans-serif)",
                    color: "var(--primary, #7956C9)",
                    marginTop: "2px",
                  }}
                >
                  {st.file}
                </div>
                {st.description && (
                  <div style={{ fontSize: "11px", color: "var(--text-muted, #777184)", marginTop: "2px" }}>
                    {st.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

