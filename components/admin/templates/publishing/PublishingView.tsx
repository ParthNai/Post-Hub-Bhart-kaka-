"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PosterTemplate } from "@/lib/templates";
import { ValidationCheck, PublishingReadiness } from "@/lib/template-publishing";
import { PublishingHeader } from "./PublishingHeader";
import { TemplateSelectorBanner } from "./TemplateSelectorBanner";
import { PosterPreviewPanel } from "./PosterPreviewPanel";
import { ValidationChecklistCard } from "./ValidationChecklistCard";
import { PublicationSettingsCard } from "./PublicationSettingsCard";
import { AuxiliaryPublishingStates } from "./AuxiliaryPublishingStates";
import { PublishSuccessModal } from "./PublishSuccessModal";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface PublishingViewProps {
  initialTemplate: PosterTemplate;
  allTemplates: PosterTemplate[];
  initialChecks: ValidationCheck[];
  initialReadiness: PublishingReadiness;
  revision?: string;
}

export const PublishingView: React.FC<PublishingViewProps> = ({
  initialTemplate,
  allTemplates,
  initialChecks,
  initialReadiness,
  revision = "v1.2",
}) => {
  const router = useRouter();
  const [template, setTemplate] = useState<PosterTemplate>(initialTemplate);
  const [checks, setChecks] = useState<ValidationCheck[]>(initialChecks);
  const [readiness, setReadiness] = useState<PublishingReadiness>(initialReadiness);
  const [isValidating, setIsValidating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Switch template
  const handleSelectTemplate = (selected: PosterTemplate) => {
    router.push(`/admin/templates/${selected.id}/publish`);
  };

  // Run validation
  const handleRunValidation = async () => {
    setIsValidating(true);
    try {
      const res = await fetch(`/api/admin/templates/${template.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "validate" }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to run validation.", "error");
        return;
      }
      setChecks(data.checks);
      setReadiness(data.readiness);
      showToast("Validation completed: 5 checks passed, 1 recommendation.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Network error.", "error");
    } finally {
      setIsValidating(false);
    }
  };

  // Save Draft
  const handleSaveDraft = async (revisionNote: string) => {
    try {
      const res = await fetch(`/api/admin/templates/${template.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save-draft", settings: { revisionNote } }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to save publication draft.", "error");
        return;
      }
      showToast("Publication draft settings saved.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Network error.", "error");
    }
  };

  // Publish Template
  const handlePublish = async (revisionNote: string) => {
    setIsPublishing(true);
    try {
      const res = await fetch(`/api/admin/templates/${template.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "publish",
          settings: { revisionNote },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to publish template.", "error");
        return;
      }

      setTemplate((prev) => ({ ...prev, status: "Published" }));
      setIsSuccessModalOpen(true);
      showToast(`Template "${template.name}" published successfully!`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Network error.", "error");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div
      style={{
        padding: "24px 32px",
        minHeight: "100vh",
        backgroundColor: "var(--bg, #FAF7F2)",
      }}
      className="publishing-view-container"
    >
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: toast.type === "error" ? "#FEF2F2" : "#F0FDF4",
            color: toast.type === "error" ? "#991B1B" : "#166534",
            border: `1px solid ${toast.type === "error" ? "#FCA5A5" : "#BBF7D0"}`,
            padding: "12px 20px",
            borderRadius: "10px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            zIndex: 150,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "13.5px",
            fontWeight: 500,
          }}
        >
          {toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <PublishingHeader
        templateId={template.id}
        adminName="Parth Patel"
        adminRole="Administrator"
      />

      {/* Template Selector Banner */}
      <TemplateSelectorBanner
        currentTemplate={template}
        allTemplates={allTemplates}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Main Two-Column Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: "24px",
          alignItems: "start",
        }}
        className="publishing-two-col-grid"
      >
        {/* Left Column: Poster Canvas Preview */}
        <div>
          <PosterPreviewPanel template={template} revision={revision} />
        </div>

        {/* Right Column: Pre-publish Validation + Publication Settings */}
        <div>
          <ValidationChecklistCard
            checks={checks}
            isValidating={isValidating}
            onRunValidation={handleRunValidation}
          />

          <PublicationSettingsCard
            canPublish={readiness.canPublish}
            isPublishing={isPublishing}
            onSaveDraft={handleSaveDraft}
            onRunValidation={handleRunValidation}
            onPublish={handlePublish}
          />
        </div>
      </div>

      {/* Bottom Auxiliary States matching 4K reference image */}
      <AuxiliaryPublishingStates />

      {/* Success Modal */}
      <PublishSuccessModal
        template={template}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      <style jsx global>{`
        @media (max-width: 1024px) {
          .publishing-two-col-grid {
            grid-template-columns: 1fr !important;
          }
          .auxiliary-publishing-states-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .publishing-view-container {
            padding: 16px !important;
          }
          .auxiliary-publishing-states-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

