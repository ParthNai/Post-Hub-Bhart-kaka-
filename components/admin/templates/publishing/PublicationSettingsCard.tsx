"use client";

import React, { useState } from "react";
import { Send, Save, RefreshCw, Smartphone, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";

interface PublicationSettingsCardProps {
  canPublish: boolean;
  isPublishing: boolean;
  onSaveDraft: (note: string) => Promise<void>;
  onRunValidation: () => void;
  onPublish: (note: string) => Promise<void>;
}

export const PublicationSettingsCard: React.FC<PublicationSettingsCardProps> = ({
  canPublish,
  isPublishing,
  onSaveDraft,
  onRunValidation,
  onPublish,
}) => {
  const [targetChannel] = useState("Production - App Store / Play Store");
  const [accessPermission] = useState("Public - All Users");
  const [revisionNote, setRevisionNote] = useState("Initial release of refreshed corporate promotional flyer");
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const handleSaveDraftClick = async () => {
    setIsSavingDraft(true);
    try {
      await onSaveDraft(revisionNote);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePublishClick = async () => {
    if (!canPublish || isPublishing) return;
    await onPublish(revisionNote);
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border, #EAE4EE)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border, #EAE4EE)",
        }}
      >
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: 0,
          }}
        >
          Publication Settings
        </h3>
      </div>

      {/* Settings Form */}
      <div style={{ padding: "20px" }}>
        {/* 1. Target Environment */}
        <div style={{ marginBottom: "14px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "6px",
            }}
          >
            <Smartphone size={14} style={{ color: "var(--primary, #7956C9)" }} />
            <span>Target Environment</span>
          </label>
          <div
            style={{
              padding: "9px 12px",
              borderRadius: "8px",
              backgroundColor: "#FAF7F2",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13px",
              color: "var(--text, #24213A)",
              fontWeight: 500,
            }}
          >
            {targetChannel}
          </div>
        </div>

        {/* 2. Access Permission */}
        <div style={{ marginBottom: "14px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "6px",
            }}
          >
            <ShieldCheck size={14} style={{ color: "#10B981" }} />
            <span>Access Permission</span>
          </label>
          <div
            style={{
              padding: "9px 12px",
              borderRadius: "8px",
              backgroundColor: "#FAF7F2",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13px",
              color: "var(--text, #24213A)",
              fontWeight: 500,
            }}
          >
            {accessPermission}
          </div>
        </div>

        {/* 3. Revision Note */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "6px",
            }}
          >
            <FileText size={14} style={{ color: "var(--text-muted, #777184)" }} />
            <span>Revision Note</span>
          </label>
          <input
            type="text"
            value={revisionNote}
            onChange={(e) => setRevisionNote(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13px",
              color: "var(--text, #24213A)",
              outline: "none",
              backgroundColor: "#ffffff",
            }}
            placeholder="Add release note..."
          />
        </div>

        {/* Deployment Notice Banner */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            padding: "10px 14px",
            borderRadius: "8px",
            backgroundColor: "#F5F3FF",
            border: "1px solid #DDD6FE",
            color: "#5B21B6",
            fontSize: "12px",
            lineHeight: 1.45,
            marginBottom: "20px",
          }}
        >
          <CheckCircle2 size={16} style={{ color: "var(--primary, #7956C9)", flexShrink: 0, marginTop: "1px" }} />
          <span>Publishing this template will make it available to mobile app users on their next feed refresh.</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handleSaveDraftClick}
            disabled={isSavingDraft || isPublishing}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 16px",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text, #24213A)",
              cursor: isSavingDraft ? "not-allowed" : "pointer",
            }}
            className="hover:bg-slate-50"
          >
            <Save size={14} />
            <span>{isSavingDraft ? "Saving..." : "Save as Draft"}</span>
          </button>

          <button
            type="button"
            onClick={onRunValidation}
            disabled={isPublishing}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 16px",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text, #24213A)",
              cursor: "pointer",
            }}
            className="hover:bg-slate-50"
          >
            <RefreshCw size={14} style={{ color: "var(--primary, #7956C9)" }} />
            <span>Run Validation</span>
          </button>

          <button
            type="button"
            onClick={handlePublishClick}
            disabled={!canPublish || isPublishing}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 20px",
              borderRadius: "8px",
              backgroundColor: canPublish ? "var(--primary, #7956C9)" : "#CBD5E1",
              border: "none",
              fontSize: "13px",
              fontWeight: 600,
              color: "#ffffff",
              cursor: canPublish && !isPublishing ? "pointer" : "not-allowed",
              boxShadow: canPublish ? "0 1px 3px rgba(121, 86, 201, 0.3)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            <Send size={14} />
            <span>{isPublishing ? "Publishing..." : "Publish Template"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
