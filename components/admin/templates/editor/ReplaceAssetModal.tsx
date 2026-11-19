"use client";

import React, { useState, useRef } from "react";
import { X, RefreshCw, UploadCloud, AlertCircle } from "lucide-react";
import { PosterTemplate } from "@/lib/templates";

interface ReplaceAssetModalProps {
  template: PosterTemplate;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (asset: { fileName: string; dimensions?: string; fileSize?: string }) => void;
}

export const ReplaceAssetModal: React.FC<ReplaceAssetModalProps> = ({
  template,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [selectedFileSize, setSelectedFileSize] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Invalid file format. Please choose JPG, PNG, or WEBP.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5 MB limit.");
        return;
      }
      setSelectedFileName(file.name);
      setSelectedFileSize(`${Math.round(file.size / 1024)} KB`);
    }
  };

  const handleApply = () => {
    if (!selectedFileName) {
      setError("Please select a new asset file to replace.");
      return;
    }
    onConfirm({
      fileName: selectedFileName,
      dimensions: template.assetDimensions || "1024 × 1365 px",
      fileSize: selectedFileSize || "245 KB",
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          border: "1px solid var(--border, #EAE4EE)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "20px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#EDE9FE",
              color: "var(--primary, #7956C9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <RefreshCw size={20} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--text, #24213A)",
                margin: "0 0 4px 0",
              }}
            >
              Replace Poster Asset
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-muted, #777184)",
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              Choose a new graphic asset for <strong>{template.name}</strong> ({template.id}). Current asset:{" "}
              <code>{template.assetFileName || "poster.jpg"}</code>.
            </p>

            {error && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FCA5A5",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#991B1B",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            {/* File Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                marginTop: "14px",
                padding: "20px",
                borderRadius: "8px",
                border: "1.5px dashed var(--primary-light, #D2C4ED)",
                backgroundColor: "var(--bg, #FAF7F2)",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <UploadCloud size={24} style={{ color: "var(--primary, #7956C9)", margin: "0 auto 6px auto" }} />
              <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text, #24213A)" }}>
                {selectedFileName ? selectedFileName : "Click to select a replacement file"}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted, #777184)", marginTop: "2px" }}>
                {selectedFileSize ? `Size: ${selectedFileSize}` : "JPG, PNG, WEBP • Max 5 MB"}
              </div>
            </div>
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
            <X size={16} />
          </button>
        </div>

        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid var(--border, #EAE4EE)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "10px",
            backgroundColor: "var(--bg, #FAF7F2)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#ffffff",
              color: "var(--text, #24213A)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "var(--primary, #7956C9)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RefreshCw size={13} />
            <span>Apply Replacement</span>
          </button>
        </div>
      </div>
    </div>
  );
};
