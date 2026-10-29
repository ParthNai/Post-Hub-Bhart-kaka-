"use client";

import React, { useState, useEffect } from "react";
import { ExportImportHeader } from "./ExportImportHeader";
import { ExportDesignTokensCard } from "./ExportDesignTokensCard";
import { ImportDesignTokensCard } from "./ImportDesignTokensCard";
import { ExportImportFooter } from "./ExportImportFooter";
import { ExportPreviewModal } from "./ExportPreviewModal";
import { ImportReviewModal } from "./ImportReviewModal";
import { ConfirmImportModal } from "./ConfirmImportModal";
import {
  generateExportPayload,
  validateImportPayload,
  type ExportCategory,
  type ExportTokenPayload,
  type ImportValidationResult,
} from "@/lib/export-import";
import type { DesignSystemConfig } from "@/lib/design-system";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ExportImportViewProps {
  initialConfig: DesignSystemConfig;
}

export const ExportImportView: React.FC<ExportImportViewProps> = ({ initialConfig }) => {
  // Current active configuration
  const [currentConfig, setCurrentConfig] = useState<DesignSystemConfig>(initialConfig);

  // Export State: Colors, Typography, Spacing, Radius checked initially matching reference image
  const [selectedCategories, setSelectedCategories] = useState<Set<ExportCategory>>(
    new Set<ExportCategory>(["colors", "typography", "spacing", "radius"])
  );
  const [isExporting, setIsExporting] = useState(false);
  const [previewPayload, setPreviewPayload] = useState<ExportTokenPayload | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Import State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ImportValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Feedback toast
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Toggle export categories
  const handleToggleCategory = (cat: ExportCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (cat === "complete") {
        if (next.has("complete")) {
          next.clear();
        } else {
          next.add("colors");
          next.add("typography");
          next.add("spacing");
          next.add("radius");
          next.add("layout");
          next.add("complete");
        }
      } else {
        if (next.has(cat)) {
          next.delete(cat);
          next.delete("complete");
        } else {
          next.add(cat);
          if (
            next.has("colors") &&
            next.has("typography") &&
            next.has("spacing") &&
            next.has("radius") &&
            next.has("layout")
          ) {
            next.add("complete");
          }
        }
      }
      return next;
    });
  };

  // Trigger JSON Export file download
  const handleExportJSON = () => {
    try {
      setIsExporting(true);
      const payload = generateExportPayload(Array.from(selectedCategories), currentConfig);
      const jsonStr = JSON.stringify(payload, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const filename = `posthub-design-tokens-${new Date().toISOString().slice(0, 10)}.json`;

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setToast({
        type: "success",
        message: `Exported ${payload.categories.join(", ")} tokens as ${filename}`,
      });
    } catch (err: unknown) {
      console.error(err);
      setToast({
        type: "error",
        message: "Failed to generate export file.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Open Preview Modal
  const handlePreviewConfiguration = () => {
    const payload = generateExportPayload(Array.from(selectedCategories), currentConfig);
    setPreviewPayload(payload);
    setIsPreviewOpen(true);
  };

  // File selection
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setCurrentStep(2); // Step 2: Validate configuration

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) || "";
      setFileContent(content);

      // Perform validation immediately upon file read
      setIsValidating(true);
      try {
        const result = validateImportPayload(content, file.name, file.size, currentConfig);
        setValidationResult(result);
        if (result.status === "valid" || result.status === "valid_with_warnings") {
          setCurrentStep(3); // Step 3: Review changes
        }
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setIsValidating(false);
      }
    };
    reader.readAsText(file);
  };

  // Clear selected file
  const handleClearFile = () => {
    setSelectedFile(null);
    setFileContent(null);
    setValidationResult(null);
    setCurrentStep(1);
  };

  // Open review modal
  const handleValidateAndPreview = () => {
    if (!validationResult && fileContent && selectedFile) {
      const result = validateImportPayload(fileContent, selectedFile.name, selectedFile.size, currentConfig);
      setValidationResult(result);
    }
    setIsReviewModalOpen(true);
  };

  // Confirm and persist Draft via API
  const handleConfirmImport = async () => {
    if (!validationResult || !validationResult.parsedPayload) return;

    setIsImporting(true);
    try {
      const res = await fetch("/api/admin/design-system/export-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "import-draft",
          payload: validationResult.parsedPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to import draft configuration.");
      }

      setCurrentStep(4); // Step 4: Confirm import completed
      setIsConfirmModalOpen(false);
      setIsReviewModalOpen(false);

      if (data.config) {
        setCurrentConfig(data.config);
      }

      setToast({
        type: "success",
        message: data.message || "Imported configuration saved as a new draft.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setToast({
        type: "error",
        message: msg,
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "40px" }}>
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "24px",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 18px",
            borderRadius: "10px",
            backgroundColor: toast.type === "success" ? "#EBF8F2" : "#FCE8E6",
            color: toast.type === "success" ? "#1E8E5A" : "#D93025",
            border: `1px solid ${toast.type === "success" ? "#A3E6C8" : "#F8B4AF"}`,
            boxShadow: "0 8px 24px rgba(36, 33, 58, 0.12)",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <ExportImportHeader />

      {/* Export Card */}
      <ExportDesignTokensCard
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
        onExport={handleExportJSON}
        onPreview={handlePreviewConfiguration}
        isExporting={isExporting}
      />

      {/* Import Card */}
      <ImportDesignTokensCard
        currentStep={currentStep}
        selectedFile={selectedFile}
        validationResult={validationResult}
        isValidating={isValidating}
        onFileSelect={handleFileSelect}
        onClearFile={handleClearFile}
        onValidateAndPreview={handleValidateAndPreview}
        onOpenConfirmModal={() => setIsConfirmModalOpen(true)}
      />

      {/* Bottom Footer */}
      <ExportImportFooter />

      {/* Modals */}
      <ExportPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        payload={previewPayload}
        onDownload={() => {
          setIsPreviewOpen(false);
          handleExportJSON();
        }}
      />

      <ImportReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        result={validationResult}
        onProceedToImport={() => setIsConfirmModalOpen(true)}
      />

      <ConfirmImportModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmImport}
        result={validationResult}
        isImporting={isImporting}
      />
    </div>
  );
};
