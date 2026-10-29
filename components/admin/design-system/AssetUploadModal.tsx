"use client";

import React, { useState, useRef } from "react";
import type { BrandAsset } from "@/lib/design-system";
import { X, Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";

interface AssetUploadModalProps {
  asset: BrandAsset | null;
  onClose: () => void;
  onUploadSuccess: (updatedAsset: BrandAsset) => void;
}

export const AssetUploadModal: React.FC<AssetUploadModalProps> = ({
  asset,
  onClose,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!asset) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File exceeds maximum allowed size of 5MB.");
      return;
    }

    // Validate type
    const validTypes = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Invalid file format. Please upload PNG, JPEG, SVG, or WebP.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setErrorMsg("Please select an image file to upload.");
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("assetId", asset.id);

      const res = await fetch("/api/admin/design-system/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccessMsg(`Successfully updated ${asset.title}!`);
      setTimeout(() => {
        onUploadSuccess({
          ...asset,
          status: "available",
          filename: selectedFile.name,
          url: data.url,
          updatedAt: new Date().toISOString(),
        });
        onClose();
      }, 700);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to upload asset.");
    } finally {
      setIsUploading(false);
    }
  };

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
          maxWidth: "480px",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid var(--border, #EAE4EE)",
          boxShadow: "0 20px 40px rgba(36, 33, 58, 0.15)",
          overflow: "hidden",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        {/* Modal Header */}
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
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--text, #24213A)",
              }}
            >
              {asset.status === "available" ? "Replace" : "Upload"} {asset.title}
            </h3>
            <span style={{ fontSize: "12px", color: "var(--text-muted, #777184)" }}>
              Recommended: {asset.format}
            </span>
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
              borderRadius: "6px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed var(--border, #EAE4EE)",
              borderRadius: "12px",
              padding: "24px 16px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "#FAF9FC",
              transition: "border-color 0.15s ease",
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              style={{ display: "none" }}
            />

            {previewUrl ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "160px",
                    height: "80px",
                    position: "relative",
                    borderRadius: "8px",
                    border: "1px solid var(--border, #EAE4EE)",
                    backgroundColor: asset.id === "dark-logo" ? "#1E202C" : "#FFFFFF",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={previewUrl}
                    alt="Upload Preview"
                    fill
                    style={{ objectFit: "contain", padding: "6px" }}
                    unoptimized
                  />
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Click to choose a different file ({selectedFile?.name})
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    backgroundColor: "var(--secondary, #E8DFF5)",
                    color: "var(--primary, #7956C9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Upload size={20} />
                </div>
                <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text)" }}>
                  Click to browse or drop image here
                </span>
                <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                  Supports PNG, JPEG, SVG, WebP (Max 5MB)
                </span>
              </div>
            )}
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 12px",
                borderRadius: "8px",
                backgroundColor: "var(--error-bg, #FDF2F2)",
                border: "1px solid var(--error-border, #F8D7DA)",
                color: "var(--error, #D9383A)",
                fontSize: "12.5px",
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 12px",
                borderRadius: "8px",
                backgroundColor: "var(--success-bg, #EDF7F2)",
                border: "1px solid var(--success-border, #C8E8D7)",
                color: "var(--success, #12805C)",
                fontSize: "12.5px",
              }}
            >
              <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "10px",
            padding: "16px 24px",
            backgroundColor: "#FAF9FC",
            borderTop: "1px solid var(--border, #EAE4EE)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            style={{
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 500,
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              color: "var(--text-muted, #777184)",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedFile || isUploading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: "var(--primary, #7956C9)",
              color: "#FFFFFF",
              border: "none",
              cursor: !selectedFile || isUploading ? "not-allowed" : "pointer",
              opacity: !selectedFile || isUploading ? 0.6 : 1,
            }}
          >
            {isUploading && <Loader2 size={14} className="animate-spin" />}
            <span>{isUploading ? "Uploading..." : "Confirm & Save Asset"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
