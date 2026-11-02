"use client";

import React, { useState } from "react";
import { FileText, Copy, Check, ChevronDown } from "lucide-react";
import { PosterTemplate, TemplateCategory } from "@/lib/templates";

interface BasicInformationCardProps {
  draft: PosterTemplate;
  onChange: (field: keyof PosterTemplate, value: unknown) => void;
  error?: string;
}

export const BasicInformationCard: React.FC<BasicInformationCardProps> = ({
  draft,
  onChange,
  error,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(draft.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nameLength = draft.name ? draft.name.length : 0;
  const descLength = draft.description ? draft.description.length : 0;

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
          <FileText size={16} />
        </div>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: 0,
          }}
        >
          1. Basic Information
        </h2>
      </div>

      {error && (
        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "#FEF2F2",
            border: "1px solid #FCA5A5",
            borderRadius: "6px",
            fontSize: "12px",
            color: "#991B1B",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {/* Row 1: Template Name & Template ID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        {/* Template Name */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <label
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--text, #24213A)",
              }}
            >
              Template Name <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <span style={{ fontSize: "11px", color: "var(--text-muted, #777184)" }}>
              {nameLength}/100
            </span>
          </div>
          <input
            type="text"
            required
            maxLength={100}
            value={draft.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g. Education Admission Poster"
            style={{
              width: "100%",
              height: "38px",
              padding: "0 12px",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13px",
              color: "var(--text, #24213A)",
              backgroundColor: "#ffffff",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.15s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--primary, #7956C9)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border, #EAE4EE)")}
          />
        </div>

        {/* Template ID (Read-only with Copy) */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "6px",
            }}
          >
            Template ID
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              readOnly
              value={draft.id}
              style={{
                width: "100%",
                height: "38px",
                paddingLeft: "12px",
                paddingRight: "36px",
                borderRadius: "6px",
                border: "1px solid var(--border, #EAE4EE)",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text, #24213A)",
                backgroundColor: "var(--bg, #FAF7F2)",
                outline: "none",
                boxSizing: "border-box",
                cursor: "default",
              }}
            />
            <button
              type="button"
              onClick={handleCopyId}
              title="Copy Template ID"
              style={{
                position: "absolute",
                right: "6px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                color: copied ? "#10B981" : "var(--text-muted, #777184)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Category & Lifecycle Status */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        {/* Category */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "6px",
            }}
          >
            Category <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={draft.category}
              onChange={(e) => onChange("category", e.target.value as TemplateCategory)}
              style={{
                width: "100%",
                height: "38px",
                paddingLeft: "12px",
                paddingRight: "32px",
                borderRadius: "6px",
                border: "1px solid var(--border, #EAE4EE)",
                fontSize: "13px",
                color: "var(--text, #24213A)",
                backgroundColor: "#ffffff",
                outline: "none",
                appearance: "none",
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            >
              <option value="Education">Education</option>
              <option value="Business">Business</option>
              <option value="Festival">Festival</option>
              <option value="Promotion">Promotion</option>
            </select>
            <ChevronDown
              size={14}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted, #777184)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* Lifecycle Status (Read-only metadata) */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "6px",
            }}
          >
            Lifecycle Status
          </label>
          <div
            style={{
              width: "100%",
              height: "38px",
              padding: "0 12px",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13px",
              color: "var(--text, #24213A)",
              backgroundColor: "var(--bg, #FAF7F2)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxSizing: "border-box",
              cursor: "default",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: draft.status === "Published" ? "#10B981" : "#F59E0B",
                display: "inline-block",
              }}
            />
            <span style={{ fontWeight: 500 }}>{draft.status}</span>
          </div>
        </div>
      </div>

      {/* Row 3: Description */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "6px",
          }}
        >
          <label
            style={{
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
            }}
          >
            Description
          </label>
          <span style={{ fontSize: "11px", color: "var(--text-muted, #777184)" }}>
            {descLength}/500
          </span>
        </div>
        <textarea
          rows={3}
          maxLength={500}
          value={draft.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Modern and professional education admission poster template for schools, colleges and coaching institutes."
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "6px",
            border: "1px solid var(--border, #EAE4EE)",
            fontSize: "13px",
            color: "var(--text, #24213A)",
            backgroundColor: "#ffffff",
            outline: "none",
            resize: "vertical",
            boxSizing: "border-box",
            lineHeight: "1.5",
            transition: "border-color 0.15s ease",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--primary, #7956C9)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border, #EAE4EE)")}
        />
      </div>
    </div>
  );
};
