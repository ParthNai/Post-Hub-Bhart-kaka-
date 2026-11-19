"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PosterTemplate, validateTemplateInput } from "@/lib/templates";
import { TemplateEditorHeader } from "./TemplateEditorHeader";
import { BasicInformationCard } from "./BasicInformationCard";
import { PosterFormatCard } from "./PosterFormatCard";
import { PosterAssetsCard } from "./PosterAssetsCard";
import { SupportedCustomizationCard } from "./SupportedCustomizationCard";
import { PosterPreviewCanvas } from "./PosterPreviewCanvas";
import { EditorBottomBar } from "./EditorBottomBar";
import { DiscardConfirmModal } from "./DiscardConfirmModal";
import { PublishConfirmModal } from "./PublishConfirmModal";
import { ReplaceAssetModal } from "./ReplaceAssetModal";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface TemplateEditorViewProps {
  initialTemplate: PosterTemplate;
}

export const TemplateEditorView: React.FC<TemplateEditorViewProps> = ({ initialTemplate }) => {
  const router = useRouter();

  // Baseline persisted state
  const [template, setTemplate] = useState<PosterTemplate>(initialTemplate);
  // Local editable draft state
  const [draft, setDraft] = useState<PosterTemplate>(JSON.parse(JSON.stringify(initialTemplate)));

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>(undefined);

  // Modals state
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isReplaceAssetOpen, setIsReplaceAssetOpen] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Determine if draft is dirty compared to persisted baseline
  const isDirty = useMemo(() => {
    return (
      draft.name !== template.name ||
      draft.category !== template.category ||
      draft.format !== template.format ||
      draft.description !== template.description ||
      draft.headline !== template.headline ||
      draft.subheadline !== template.subheadline ||
      draft.ctaText !== template.ctaText ||
      draft.assetFileName !== template.assetFileName ||
      draft.fontSelection !== template.fontSelection ||
      draft.alignment !== template.alignment ||
      JSON.stringify(draft.editableTextFields) !== JSON.stringify(template.editableTextFields) ||
      JSON.stringify(draft.textColours) !== JSON.stringify(template.textColours)
    );
  }, [draft, template]);

  // Field change handler
  const handleFieldChange = (field: keyof PosterTemplate, value: unknown) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValidationError(undefined);
  };

  // Save draft action
  const handleSaveDraft = async () => {
    const val = validateTemplateInput(draft);
    if (!val.valid) {
      setValidationError(val.errors.join(" "));
      showToast(val.errors[0] || "Validation error.", "error");
      return;
    }

    setIsSaving(true);
    setValidationError(undefined);

    try {
      const res = await fetch(`/api/admin/templates/${draft.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      const data = await res.json();
      if (!res.ok) {
        setValidationError(data.error || "Failed to save draft.");
        showToast(data.error || "Failed to save draft.", "error");
        return;
      }

      const updated = data.template as PosterTemplate;
      setTemplate(updated);
      setDraft(JSON.parse(JSON.stringify(updated)));
      showToast(`Draft saved successfully for template ${updated.id}.`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to connect to template service.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Publish action
  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      // First ensure any pending draft fields are saved
      const saveRes = await fetch(`/api/admin/templates/${draft.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!saveRes.ok) {
        const data = await saveRes.json();
        showToast(data.error || "Failed to prepare template for publication.", "error");
        return;
      }

      // Then execute publish action
      const res = await fetch(`/api/admin/templates/${draft.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to publish template.", "error");
        return;
      }

      const published = data.template as PosterTemplate;
      setTemplate(published);
      setDraft(JSON.parse(JSON.stringify(published)));
      showToast(`Template ${published.id} (${published.name}) is now live!`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to publish template.", "error");
    } finally {
      setIsPublishing(false);
    }
  };

  // Discard action
  const handleDiscard = () => {
    setDraft(JSON.parse(JSON.stringify(template)));
    setValidationError(undefined);
    showToast("Reverted all unsaved edits to last saved state.", "info");
  };

  // Cancel action
  const handleCancel = () => {
    if (isDirty) {
      setIsDiscardOpen(true);
    } else {
      router.push("/admin/templates");
    }
  };

  // Asset handlers
  const handleReplaceAssetConfirm = (asset: { fileName: string; dimensions?: string; fileSize?: string }) => {
    setDraft((prev) => ({
      ...prev,
      assetFileName: asset.fileName,
      assetDimensions: asset.dimensions || prev.assetDimensions,
      fileSize: asset.fileSize || prev.fileSize,
    }));
    showToast(`Asset selected: ${asset.fileName}`);
  };

  const handleRemoveAsset = () => {
    setDraft((prev) => ({
      ...prev,
      assetFileName: "unassigned-placeholder.jpg",
      fileSize: "0 KB",
    }));
    showToast("Removed current asset.", "info");
  };

  const handleUploadAsset = (file: File) => {
    const sizeKb = Math.round(file.size / 1024);
    setDraft((prev) => ({
      ...prev,
      assetFileName: file.name,
      fileSize: `${sizeKb} KB`,
    }));
    showToast(`Uploaded new asset: ${file.name} (${sizeKb} KB)`);
  };

  return (
    <div
      style={{
        padding: "24px 32px 40px 32px",
        minHeight: "100%",
        boxSizing: "border-box",
        maxWidth: "1600px",
        margin: "0 auto",
      }}
    >
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "74px",
            right: "24px",
            backgroundColor: toast.type === "error" ? "#DC2626" : "#24213A",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
            zIndex: 999,
          }}
        >
          {toast.type === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <CheckCircle2 size={16} style={{ color: "#34D399" }} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Editor Header */}
      <TemplateEditorHeader
        template={draft}
        isDirty={isDirty}
        isSaving={isSaving}
        isPublishing={isPublishing}
        onDiscard={() => setIsDiscardOpen(true)}
        onSaveDraft={handleSaveDraft}
        onPublish={() => setIsPublishOpen(true)}
      />

      {/* Two-Column Responsive Workspace */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.45fr 1fr",
          gap: "24px",
          alignItems: "start",
        }}
        className="template-editor-grid"
      >
        {/* Left Column: Form & Customization Cards */}
        <div style={{ minWidth: 0 }}>
          <BasicInformationCard
            draft={draft}
            onChange={handleFieldChange}
            error={validationError}
          />

          <PosterFormatCard
            draft={draft}
            onChange={handleFieldChange}
          />

          <PosterAssetsCard
            draft={draft}
            onReplaceAsset={() => setIsReplaceAssetOpen(true)}
            onRemoveAsset={handleRemoveAsset}
            onUploadAsset={handleUploadAsset}
          />

          <SupportedCustomizationCard
            draft={draft}
            onChange={handleFieldChange}
          />
        </div>

        {/* Right Column: Poster Preview Canvas */}
        <div style={{ minWidth: 0 }}>
          <PosterPreviewCanvas
            draft={draft}
            onRefresh={() => showToast("Preview refreshed.", "info")}
          />
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <EditorBottomBar
        isDirty={isDirty}
        isSaving={isSaving}
        isPublishing={isPublishing}
        onCancel={handleCancel}
        onDiscard={() => setIsDiscardOpen(true)}
        onSaveDraft={handleSaveDraft}
        onPublish={() => setIsPublishOpen(true)}
      />

      {/* Interactive Modals */}
      <DiscardConfirmModal
        isOpen={isDiscardOpen}
        onClose={() => setIsDiscardOpen(false)}
        onConfirm={handleDiscard}
      />

      <PublishConfirmModal
        template={draft}
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        onConfirm={handlePublish}
      />

      <ReplaceAssetModal
        template={draft}
        isOpen={isReplaceAssetOpen}
        onClose={() => setIsReplaceAssetOpen(false)}
        onConfirm={handleReplaceAssetConfirm}
      />

      <style jsx>{`
        @media (max-width: 1024px) {
          .template-editor-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
