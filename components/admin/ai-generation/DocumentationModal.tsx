"use client";

import React from "react";
import { X, BookOpen } from "lucide-react";

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
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
          maxWidth: "640px",
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
              <BookOpen size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: "var(--foreground)" }}>
                AI Generation Documentation
              </h2>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                Architecture, prompt optimization, model limits & error codes.
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

        {/* Content Body */}
        <div
          style={{
            padding: "24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            fontSize: "13px",
            lineHeight: "1.6",
            color: "var(--foreground)",
          }}
        >
          {/* Section 1 */}
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 8px 0", color: "var(--primary)" }}>
              1. Supported Generative AI Models
            </h3>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "var(--text-muted)" }}>
              <li>
                <strong style={{ color: "var(--foreground)" }}>OpenAI DALL-E 3:</strong> Best for typography-aware poster graphics, festive occasions, and rich stylistic adherence. Generates at 1024×1024 or 1024×1792 natively.
              </li>
              <li>
                <strong style={{ color: "var(--foreground)" }}>Google Imagen 3:</strong> Superior photographic realism, corporate architecture, and natural textures. High token efficiency with fast inference time (~4s).
              </li>
              <li>
                <strong style={{ color: "var(--foreground)" }}>Stability AI SD3:</strong> Open weights generative model optimized for prompt adherence and multi-subject composition.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 8px 0", color: "var(--primary)" }}>
              2. Aspect Ratio & Dimensions
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--background)", textAlign: "left" }}>
                  <th style={{ padding: "8px 10px", border: "1px solid var(--border)" }}>Aspect Ratio</th>
                  <th style={{ padding: "8px 10px", border: "1px solid var(--border)" }}>Dimensions</th>
                  <th style={{ padding: "8px 10px", border: "1px solid var(--border)" }}>Primary Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "8px 10px", border: "1px solid var(--border)" }}>4:5</td>
                  <td style={{ padding: "8px 10px", border: "1px solid var(--border)" }}>1080 × 1350 px</td>
                  <td style={{ padding: "8px 10px", border: "1px solid var(--border)" }}>Instagram & Mobile feed posters</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 10px", border: "1px solid var(--border)" }}>1:1</td>
                  <td style={{ padding: "8px 10px", border: "1px solid var(--border)" }}>1080 × 1080 px</td>
                  <td style={{ padding: "8px 10px", border: "1px solid var(--border)" }}>Square product promotions & sales</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 10px", border: "1px solid var(--border)" }}>9:16</td>
                  <td style={{ padding: "8px 10px", border: "1px solid var(--border)" }}>1080 × 1920 px</td>
                  <td style={{ padding: "8px 10px", border: "1px solid var(--border)" }}>Vertical stories & status banners</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 10px", border: "1px solid var(--border)" }}>3:4</td>
                  <td style={{ padding: "8px 10px", border: "1px solid var(--border)" }}>1024 × 1365 px</td>
                  <td style={{ padding: "8px 10px", border: "1px solid var(--border)" }}>Print flyers & academic admission posters</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3 */}
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 8px 0", color: "var(--primary)" }}>
              3. Rate Limiting & Transient Error Recovery
            </h3>
            <p style={{ margin: "0 0 6px 0", color: "var(--text-muted)" }}>
              Requests that fail with <code style={{ color: "#D97706" }}>HTTP 429 Too Many Requests</code> or connection timeouts are eligible for one-click retry in the Generation Requests table. Rate limits are throttled at 5 requests per second per IP by default.
            </p>
          </div>
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
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

