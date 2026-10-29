"use client";

import React, { useState } from "react";
import { X, Download, Check, Layers } from "lucide-react";
import { PosterTemplate } from "@/lib/templates";
import { PosterArtwork } from "./PosterArtwork";

interface FullPreviewModalProps {
  template: PosterTemplate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FullPreviewModal: React.FC<FullPreviewModalProps> = ({
  template,
  isOpen,
  onClose,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen || !template) return null;

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const getFormatDimensions = (format: string) => {
    switch (format) {
      case "3:4":
        return "1080 × 1440 px";
      case "4:5":
        return "1080 × 1350 px";
      case "9:16":
        return "1080 × 1920 px";
      case "1:1":
        return "1080 × 1080 px";
      default:
        return "1080 × 1440 px";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "840px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          border: "1px solid var(--border, #EAE4EE)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid var(--border, #EAE4EE)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#ffffff",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "var(--text, #24213A)",
                  margin: 0,
                }}
              >
                {template.name}
              </h2>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted, #777184)",
                  fontWeight: 500,
                }}
              >
                ({template.id})
              </span>
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-muted, #777184)",
                marginTop: "2px",
              }}
            >
              Full resolution preview • Aspect Ratio: {template.format} ({getFormatDimensions(template.format)})
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
              color: "var(--text-muted, #777184)",
              borderRadius: "6px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: "24px",
            padding: "24px",
            overflowY: "auto",
            backgroundColor: "var(--bg, #FAF7F2)",
          }}
        >
          {/* Poster Stage */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "16px",
              border: "1px solid var(--border, #EAE4EE)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "280px",
                height: "360px",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              }}
            >
              <PosterArtwork template={template} />
            </div>
          </div>

          {/* Details & Specs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid var(--border, #EAE4EE)",
                borderRadius: "12px",
                padding: "18px",
              }}
            >
              <h4
                style={{
                  fontSize: "13.5px",
                  fontWeight: 700,
                  color: "var(--text, #24213A)",
                  margin: "0 0 12px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Layers size={16} style={{ color: "var(--primary, #7956C9)" }} />
                <span>Template Specifications</span>
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted, #777184)" }}>Category:</span>
                  <span style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>{template.category}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted, #777184)" }}>Status:</span>
                  <span style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>{template.status}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted, #777184)" }}>Format / Aspect:</span>
                  <span style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>{template.format}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted, #777184)" }}>Resolution Target:</span>
                  <span style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>
                    {getFormatDimensions(template.format)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted, #777184)" }}>Asset File Size:</span>
                  <span style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>{template.fileSize}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted, #777184)" }}>Last Revision:</span>
                  <span style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>{template.updatedAt}</span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid var(--border, #EAE4EE)",
                borderRadius: "12px",
                padding: "16px 18px",
              }}
            >
              <h5
                style={{
                  fontSize: "12.5px",
                  fontWeight: 700,
                  color: "var(--text, #24213A)",
                  margin: "0 0 6px 0",
                }}
              >
                Description & Target Audience
              </h5>
              <p
                style={{
                  fontSize: "12.5px",
                  color: "var(--text-muted, #777184)",
                  lineHeight: "1.5",
                  margin: 0,
                }}
              >
                {template.description}
              </p>

              {template.tags && template.tags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
                  {template.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: "var(--secondary, #F5F2F9)",
                        color: "var(--primary, #7956C9)",
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Export Simulation Button */}
            <button
              type="button"
              onClick={handleDownload}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: downloaded ? "#10B981" : "var(--primary, #7956C9)",
                color: "#ffffff",
                padding: "12px 18px",
                borderRadius: "8px",
                fontSize: "13.5px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(121, 86, 201, 0.25)",
                transition: "all 0.2s ease",
              }}
            >
              {downloaded ? (
                <>
                  <Check size={16} />
                  <span>Preview Package Ready</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Export Poster Package</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
