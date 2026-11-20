"use client";

import React from "react";
import { Image as ImageIcon, ExternalLink } from "lucide-react";
import type { JobGeneratedOutput } from "@/lib/ai-job-trace";

interface GeneratedOutputCardProps {
  output: JobGeneratedOutput;
  onViewAsset?: () => void;
}

export const GeneratedOutputCard: React.FC<GeneratedOutputCardProps> = ({
  output,
  onViewAsset,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        padding: "16px 18px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "14px",
          fontSize: "14px",
          fontWeight: 700,
          color: "#24213A",
        }}
      >
        <ImageIcon size={16} color="#7956C9" />
        <span>Generated Output</span>
      </div>

      {/* Main Container: Split into Left Preview Placeholder & Right Key-Values */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          flex: 1,
        }}
      >
        {/* Left Side: Dashed Placeholder or Thumbnail */}
        <div
          style={{
            flex: "1 1 50%",
            border: "1.5px dashed #DDD7EE",
            borderRadius: "10px",
            backgroundColor: "#FAF9FD",
            padding: "16px 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            minHeight: "130px",
          }}
        >
          {output.isAvailable && output.previewUrl ? (
            <div style={{ position: "relative", width: "100%", textAlign: "center" }}>
              <img
                src={output.previewUrl}
                alt="Generated Output Preview"
                style={{
                  maxHeight: "110px",
                  maxWidth: "100%",
                  objectFit: "contain",
                  borderRadius: "6px",
                  margin: "0 auto",
                }}
              />
              {onViewAsset && (
                <button
                  type="button"
                  onClick={onViewAsset}
                  style={{
                    marginTop: "6px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11px",
                    color: "#7956C9",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  <ExternalLink size={12} />
                  <span>Expand Preview</span>
                </button>
              )}
            </div>
          ) : (
            <>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "#EFEAF8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "8px",
                }}
              >
                <ImageIcon size={22} color="#7956C9" />
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#24213A",
                  lineHeight: "1.2",
                }}
              >
                No output asset available
              </div>
              <div
                style={{
                  fontSize: "10.5px",
                  color: "#777184",
                  marginTop: "3px",
                  lineHeight: "1.3",
                }}
              >
                (Job is still processing or output not generated)
              </div>
            </>
          )}
        </div>

        {/* Right Side: Key-Values List */}
        <div
          style={{
            flex: "1 1 50%",
            display: "flex",
            flexDirection: "column",
            gap: "9px",
            fontSize: "12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#777184" }}>Asset Reference:</span>
            <span style={{ color: "#24213A", fontWeight: 500, fontFamily: output.assetReference !== "—" ? "monospace" : "inherit" }}>
              {output.assetReference}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#777184" }}>Dimensions:</span>
            <span style={{ color: "#24213A", fontWeight: 500 }}>
              {output.dimensions}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#777184" }}>Storage Status:</span>
            <span style={{ color: "#24213A", fontWeight: 500 }}>
              {output.storageStatus}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#777184" }}>Created At:</span>
            <span style={{ color: "#24213A", fontWeight: 500 }}>
              {output.createdAt}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#777184" }}>Moderation:</span>
            <span style={{ color: "#24213A", fontWeight: 500 }}>
              {output.moderation}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
