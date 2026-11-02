"use client";

import React, { useRef, useState } from "react";
import { Image as ImageIcon, UploadCloud, RefreshCw, Trash2, File, AlertCircle } from "lucide-react";
import { PosterTemplate } from "@/lib/templates";
import { PosterArtwork } from "../PosterArtwork";

interface PosterAssetsCardProps {
  draft: PosterTemplate;
  onReplaceAsset: () => void;
  onRemoveAsset: () => void;
  onUploadAsset: (file: File) => void;
}

export const PosterAssetsCard: React.FC<PosterAssetsCardProps> = ({
  draft,
  onReplaceAsset,
  onRemoveAsset,
  onUploadAsset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadError(null);
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Invalid format. Please upload JPG, PNG, or WEBP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File exceeds the 5 MB maximum size limit.");
      return;
    }
    onUploadAsset(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const assetName = draft.assetFileName || `${draft.id.toLowerCase()}-poster.jpg`;
  const dimensions = draft.assetDimensions || "1024 × 1365 px";
  const size = draft.fileSize || "245 KB";

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border, #EAE4EE)",
        borderRadius: "12px",
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.02)",
        marginBottom: "20px",
      }}
    >
      {/* Card Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "18px",
          paddingBottom: "12px",
          borderBottom: "1px solid var(--border, #EAE4EE)",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "6px",
            backgroundColor: "#F5F0FF",
            color: "var(--primary, #7956C9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ImageIcon size={16} />
        </div>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: 0,
          }}
        >
          3. Poster Assets
        </h2>
      </div>

      {uploadError && (
        <div
          style={{
            backgroundColor: "#FEF2F2",
            border: "1px solid #FCA5A5",
            borderRadius: "6px",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            color: "#991B1B",
            marginBottom: "16px",
          }}
        >
          <AlertCircle size={14} />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Two-Column Assets Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: "16px",
        }}
      >
        {/* Left: Current Asset Box */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid var(--border, #EAE4EE)",
            borderRadius: "10px",
            padding: "14px",
            display: "flex",
            gap: "14px",
            alignItems: "center",
          }}
        >
          {/* Thumbnail preview */}
          <div
            style={{
              width: "64px",
              height: "85px",
              borderRadius: "6px",
              overflow: "hidden",
              border: "1px solid var(--border, #EAE4EE)",
              flexShrink: 0,
              backgroundColor: "#f8fafc",
            }}
          >
            <PosterArtwork template={draft} />
          </div>

          {/* Asset Info & Actions */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--text-muted, #777184)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "2px",
              }}
            >
              Current Asset
            </div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--text, #24213A)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                marginBottom: "2px",
              }}
              title={assetName}
            >
              {assetName}
            </div>
            <div
              style={{
                fontSize: "11.5px",
                color: "var(--text-muted, #777184)",
                marginBottom: "10px",
              }}
            >
              {dimensions} • {size}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={onReplaceAsset}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "var(--primary, #7956C9)",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--primary-hover, #6846B5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--primary, #7956C9)";
                }}
              >
                <RefreshCw size={12} />
                <span>Replace Asset</span>
              </button>

              <button
                type="button"
                onClick={onRemoveAsset}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: "1px solid var(--border, #EAE4EE)",
                  backgroundColor: "#ffffff",
                  color: "var(--text-muted, #777184)",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FEF2F2";
                  e.currentTarget.style.color = "#DC2626";
                  e.currentTarget.style.borderColor = "#FCA5A5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.color = "var(--text-muted, #777184)";
                  e.currentTarget.style.borderColor = "var(--border, #EAE4EE)";
                }}
              >
                <Trash2 size={12} />
                <span>Remove Asset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Upload Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `1.5px dashed ${isDragOver ? "var(--primary, #7956C9)" : "#D2C4ED"}`,
            backgroundColor: isDragOver ? "#F5F0FF" : "var(--bg, #FAF7F2)",
            borderRadius: "10px",
            padding: "16px 14px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#EDE9FE",
              color: "var(--primary, #7956C9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "8px",
            }}
          >
            <UploadCloud size={20} />
          </div>

          <div
            style={{
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "2px",
            }}
          >
            Drop an image here or click to upload
          </div>

          <div
            style={{
              fontSize: "11px",
              color: "var(--text-muted, #777184)",
              marginBottom: "8px",
            }}
          >
            JPG, PNG, WEBP • Max 5 MB
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#ffffff",
              color: "var(--text, #24213A)",
              fontSize: "11.5px",
              fontWeight: 500,
            }}
          >
            <File size={12} />
            <span>Choose File</span>
          </div>
        </div>
      </div>
    </div>
  );
};
