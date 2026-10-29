"use client";

import React, { useRef, useState } from "react";
import {
  UploadCloud,
  FolderOpen,
  FileText,
  HardDrive,
  Clock,
  Sliders,
  PlusSquare,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  FileCheck,
} from "lucide-react";
import type { ImportValidationResult } from "@/lib/export-import";

interface ImportDesignTokensCardProps {
  currentStep: number; // 1 | 2 | 3 | 4
  selectedFile: File | null;
  validationResult: ImportValidationResult | null;
  isValidating: boolean;
  onFileSelect: (file: File) => void;
  onClearFile: () => void;
  onValidateAndPreview: () => void;
  onOpenConfirmModal: () => void;
}

export const ImportDesignTokensCard: React.FC<ImportDesignTokensCardProps> = ({
  currentStep,
  selectedFile,
  validationResult,
  isValidating,
  onFileSelect,
  onClearFile,
  onValidateAndPreview,
  onOpenConfirmModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".json") || file.type === "application/json") {
        onFileSelect(file);
      } else {
        alert("Please drop a valid .json design-token configuration file.");
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const isValidationRun = validationResult !== null;
  const isImportable =
    validationResult !== null &&
    (validationResult.status === "valid" || validationResult.status === "valid_with_warnings") &&
    validationResult.tokensDetected > 0;

  // Validation Status pill
  const renderValidationStatus = () => {
    if (!isValidationRun) {
      return (
        <span style={{ fontSize: "12.5px", color: "var(--text-muted, #777184)" }}>
          Validation not run
        </span>
      );
    }
    if (validationResult.status === "valid") {
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: "#EBF8F2",
            color: "#1E8E5A",
          }}
        >
          <CheckCircle2 size={13} /> Valid
        </span>
      );
    }
    if (validationResult.status === "valid_with_warnings") {
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: "#FEF7E6",
            color: "#B76E00",
          }}
        >
          <AlertTriangle size={13} /> Valid with warnings
        </span>
      );
    }
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "2px 8px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: 600,
          backgroundColor: "#FCE8E6",
          color: "#D93025",
        }}
      >
        <XCircle size={13} /> Invalid
      </span>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
      }}
    >
      {/* Title & Description */}
      <div style={{ marginBottom: "20px" }}>
        <h2
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: "0 0 4px 0",
          }}
        >
          Import design tokens
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-muted, #777184)",
            margin: 0,
          }}
        >
          Upload a JSON file with design tokens to update your configuration. The file will be validated before import.
        </p>
      </div>

      {/* Main Two Columns Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* Left Column: Drag/Drop + Workflow Steps + Safety Note */}
        <div>
          {/* Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              borderRadius: "12px",
              border: isDragOver
                ? "2px dashed var(--primary, #7956C9)"
                : "2px dashed #E0D9E8",
              backgroundColor: isDragOver ? "#F7F3FC" : "#FCFBFD",
              padding: "36px 20px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              marginBottom: "24px",
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              style={{ display: "none" }}
              onChange={handleFileInputChange}
            />

            {/* Icon Box */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#EFEAF7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
                color: "var(--primary, #7956C9)",
              }}
            >
              <UploadCloud size={24} />
            </div>

            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text, #24213A)",
                marginBottom: "4px",
              }}
            >
              Drop a JSON configuration file here
            </div>

            <div
              style={{
                fontSize: "12.5px",
                color: "var(--text-muted, #777184)",
                marginBottom: "4px",
              }}
            >
              or choose a file from your computer
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "#A29DB0",
                marginBottom: "16px",
              }}
            >
              Supported format: .json
            </div>

            {/* Choose file button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--text, #24213A)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                cursor: "pointer",
              }}
            >
              <FolderOpen size={14} style={{ color: "var(--primary, #7956C9)" }} />
              <span>Choose file</span>
            </button>
          </div>

          {/* Workflow Steps Tracker */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
              padding: "0 10px",
              position: "relative",
            }}
          >
            {[
              { num: 1, label: "Select file" },
              { num: 2, label: "Validate configuration" },
              { num: 3, label: "Review changes" },
              { num: 4, label: "Confirm import" },
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isDone = currentStep > step.num;
              return (
                <div
                  key={step.num}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    position: "relative",
                    zIndex: 2,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: isActive || isDone ? "var(--primary, #7956C9)" : "#FFFFFF",
                      color: isActive || isDone ? "#FFFFFF" : "#777184",
                      border: isActive || isDone ? "none" : "1.5px solid #D5CEE0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {step.num}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "var(--text, #24213A)" : "var(--text-muted, #777184)",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step.label}
                  </div>
                </div>
              );
            })}

            {/* Connecting Line between steps */}
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "12%",
                right: "12%",
                height: "1px",
                backgroundColor: "#E2DCE8",
                zIndex: 1,
              }}
            />
          </div>

          {/* Import safety callout container */}
          <div
            style={{
              borderRadius: "10px",
              border: "1px solid #ECE7F2",
              backgroundColor: "#FAF9FC",
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text, #24213A)",
                marginBottom: "8px",
              }}
            >
              <Info size={15} style={{ color: "var(--primary, #7956C9)" }} />
              <span>Import safety</span>
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: "18px",
                fontSize: "12px",
                color: "var(--text-muted, #777184)",
                lineHeight: "1.7",
              }}
            >
              <li>Imported configurations must match the supported token schema.</li>
              <li>Invalid tokens must not be applied.</li>
              <li>Importing must not automatically publish changes.</li>
              <li>Existing configuration must remain unchanged until the import is validated and confirmed.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Validation Preview Card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            border: "1px solid var(--border, #EAE4EE)",
            padding: "22px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "440px",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--text, #24213A)",
                margin: "0 0 16px 0",
              }}
            >
              Validation preview
            </h3>

            {/* Key-Value rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Row 1: File name */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileText size={15} style={{ color: "#777184" }} />
                  <span style={{ fontSize: "12.5px", color: "var(--text-muted, #777184)" }}>File name</span>
                </div>
                <span
                  style={{
                    fontSize: "12.5px",
                    color: selectedFile ? "var(--text, #24213A)" : "var(--text-muted, #777184)",
                    fontWeight: selectedFile ? 600 : 400,
                    maxWidth: "180px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={selectedFile?.name}
                >
                  {selectedFile ? selectedFile.name : "No file selected"}
                </span>
              </div>

              {/* Row 2: File size */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <HardDrive size={15} style={{ color: "#777184" }} />
                  <span style={{ fontSize: "12.5px", color: "var(--text-muted, #777184)" }}>File size</span>
                </div>
                <span
                  style={{
                    fontSize: "12.5px",
                    color: validationResult?.fileSizeFormatted ? "var(--text, #24213A)" : "var(--text-muted, #777184)",
                    fontWeight: validationResult?.fileSizeFormatted ? 600 : 400,
                  }}
                >
                  {validationResult?.fileSizeFormatted || (selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "Not available")}
                </span>
              </div>

              {/* Row 3: Validation status */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Clock size={15} style={{ color: "#777184" }} />
                  <span style={{ fontSize: "12.5px", color: "var(--text-muted, #777184)" }}>Validation status</span>
                </div>
                {renderValidationStatus()}
              </div>

              {/* Row 4: Tokens detected */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sliders size={15} style={{ color: "#777184" }} />
                  <span style={{ fontSize: "12.5px", color: "var(--text-muted, #777184)" }}>Tokens detected</span>
                </div>
                <span
                  style={{
                    fontSize: "12.5px",
                    color: isValidationRun ? "var(--text, #24213A)" : "var(--text-muted, #777184)",
                    fontWeight: isValidationRun ? 600 : 400,
                  }}
                >
                  {isValidationRun ? `${validationResult.tokensDetected} tokens` : "Counts available after validation"}
                </span>
              </div>

              {/* Row 5: Added tokens */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <PlusSquare size={15} style={{ color: "#777184" }} />
                  <span style={{ fontSize: "12.5px", color: "var(--text-muted, #777184)" }}>Added tokens</span>
                </div>
                <span
                  style={{
                    fontSize: "12.5px",
                    color: isValidationRun
                      ? validationResult.addedTokens > 0 ? "#1E8E5A" : "var(--text, #24213A)"
                      : "var(--text-muted, #777184)",
                    fontWeight: isValidationRun ? 600 : 400,
                  }}
                >
                  {isValidationRun ? validationResult.addedTokens : "Counts available after validation"}
                </span>
              </div>

              {/* Row 6: Modified tokens */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <RefreshCw size={15} style={{ color: "#777184" }} />
                  <span style={{ fontSize: "12.5px", color: "var(--text-muted, #777184)" }}>Modified tokens</span>
                </div>
                <span
                  style={{
                    fontSize: "12.5px",
                    color: isValidationRun
                      ? validationResult.modifiedTokens > 0 ? "#B76E00" : "var(--text, #24213A)"
                      : "var(--text-muted, #777184)",
                    fontWeight: isValidationRun ? 600 : 400,
                  }}
                >
                  {isValidationRun ? validationResult.modifiedTokens : "Counts available after validation"}
                </span>
              </div>

              {/* Row 7: Invalid entries */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <AlertTriangle size={15} style={{ color: "#777184" }} />
                  <span style={{ fontSize: "12.5px", color: "var(--text-muted, #777184)" }}>Invalid entries</span>
                </div>
                <span
                  style={{
                    fontSize: "12.5px",
                    color: isValidationRun
                      ? validationResult.invalidEntries > 0 ? "#D93025" : "var(--text, #24213A)"
                      : "var(--text-muted, #777184)",
                    fontWeight: isValidationRun ? 600 : 400,
                  }}
                >
                  {isValidationRun ? validationResult.invalidEntries : "Counts available after validation"}
                </span>
              </div>
            </div>

            {/* Validation errors/warnings callout if any */}
            {isValidationRun && validationResult.errors.length > 0 && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: "#FDF3F2",
                  border: "1px solid #F8D7DA",
                  fontSize: "11.5px",
                  color: "#D93025",
                }}
              >
                {validationResult.errors[0]}
              </div>
            )}
            {isValidationRun && validationResult.warnings.length > 0 && validationResult.errors.length === 0 && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: "#FEF9EC",
                  border: "1px solid #FFEBAA",
                  fontSize: "11.5px",
                  color: "#B76E00",
                }}
              >
                {validationResult.warnings[0]}
              </div>
            )}
          </div>

          {/* Bottom Action Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid var(--border, #EAE4EE)",
              flexWrap: "wrap",
            }}
          >
            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClearFile}
              disabled={!selectedFile && !isValidationRun}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--text, #24213A)",
                cursor: !selectedFile && !isValidationRun ? "not-allowed" : "pointer",
                opacity: !selectedFile && !isValidationRun ? 0.5 : 1,
                transition: "all 0.15s ease",
              }}
            >
              Cancel
            </button>

            {/* Validate & Preview Button */}
            <button
              type="button"
              onClick={onValidateAndPreview}
              disabled={!selectedFile || isValidating}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--text, #24213A)",
                cursor: !selectedFile || isValidating ? "not-allowed" : "pointer",
                opacity: !selectedFile || isValidating ? 0.5 : 1,
                transition: "all 0.15s ease",
              }}
            >
              <FileCheck size={14} style={{ color: "var(--primary, #7956C9)" }} />
              <span>Validate & Preview</span>
            </button>

            {/* Import as Draft Button */}
            <button
              type="button"
              onClick={onOpenConfirmModal}
              disabled={!isImportable}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: isImportable ? "var(--primary, #7956C9)" : "#F2EEF8",
                color: isImportable ? "#FFFFFF" : "#A89FB6",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: isImportable ? "pointer" : "not-allowed",
                boxShadow: isImportable ? "0 2px 6px rgba(121, 86, 201, 0.25)" : "none",
                transition: "all 0.15s ease",
                marginLeft: "auto",
              }}
            >
              <FolderOpen size={14} />
              <span>Import as Draft</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
