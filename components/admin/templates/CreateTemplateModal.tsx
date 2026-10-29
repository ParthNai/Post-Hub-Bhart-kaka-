"use client";

import React, { useState } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { PosterTemplate, TemplateCategory, TemplateFormat, TemplateStatus } from "@/lib/templates";

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (templateData: Partial<PosterTemplate>) => Promise<{ success: boolean; error?: string }>;
}

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<TemplateCategory>("Business");
  const [format, setFormat] = useState<TemplateFormat>("3:4");
  const [status, setStatus] = useState<TemplateStatus>("Draft");
  const [description, setDescription] = useState("");
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a template name.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await onCreate({
        name: name.trim(),
        category,
        format,
        status,
        description: description.trim() || undefined,
        headline: headline.trim() || name.trim(),
        subheadline: subheadline.trim() || undefined,
      });

      if (!res.success) {
        setError(res.error || "Failed to create template.");
      } else {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
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
          maxWidth: "520px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          border: "1px solid var(--border, #EAE4EE)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid var(--border, #EAE4EE)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "var(--text, #24213A)",
                margin: "0 0 2px 0",
              }}
            >
              Create New Template
            </h2>
            <p
              style={{
                fontSize: "12.5px",
                color: "var(--text-muted, #777184)",
                margin: 0,
              }}
            >
              Add a new poster design to the Post Hub template repository.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              color: "var(--text-muted, #777184)",
              borderRadius: "6px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: "20px 22px" }}>
          {error && (
            <div
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #F87171",
                borderRadius: "8px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12.5px",
                color: "#991B1B",
                marginBottom: "16px",
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Template Name */}
          <div style={{ marginBottom: "14px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--text, #24213A)",
                marginBottom: "5px",
              }}
            >
              Template Name <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Autumn Music Fest Poster"
              style={{
                width: "100%",
                height: "38px",
                padding: "0 12px",
                borderRadius: "6px",
                border: "1px solid var(--border, #EAE4EE)",
                fontSize: "13px",
                color: "var(--text, #24213A)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Category & Format Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "14px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--text, #24213A)",
                  marginBottom: "5px",
                }}
              >
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TemplateCategory)}
                style={{
                  width: "100%",
                  height: "38px",
                  padding: "0 10px",
                  borderRadius: "6px",
                  border: "1px solid var(--border, #EAE4EE)",
                  fontSize: "13px",
                  color: "var(--text, #24213A)",
                  backgroundColor: "#ffffff",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="Business">Business</option>
                <option value="Festival">Festival</option>
                <option value="Education">Education</option>
                <option value="Promotion">Promotion</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--text, #24213A)",
                  marginBottom: "5px",
                }}
              >
                Aspect Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as TemplateFormat)}
                style={{
                  width: "100%",
                  height: "38px",
                  padding: "0 10px",
                  borderRadius: "6px",
                  border: "1px solid var(--border, #EAE4EE)",
                  fontSize: "13px",
                  color: "var(--text, #24213A)",
                  backgroundColor: "#ffffff",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="3:4">3:4 (Standard Flyer)</option>
                <option value="4:5">4:5 (Social Feed)</option>
                <option value="9:16">9:16 (Story / Reel)</option>
                <option value="1:1">1:1 (Square)</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div style={{ marginBottom: "14px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--text, #24213A)",
                marginBottom: "5px",
              }}
            >
              Initial Publishing Status
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value="Draft"
                  checked={status === "Draft"}
                  onChange={() => setStatus("Draft")}
                />
                <span>Draft</span>
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value="Published"
                  checked={status === "Published"}
                  onChange={() => setStatus("Published")}
                />
                <span>Published</span>
              </label>
            </div>
          </div>

          {/* Headline & Subheadline */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "14px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--text, #24213A)",
                  marginBottom: "5px",
                }}
              >
                Poster Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Special Offer"
                style={{
                  width: "100%",
                  height: "38px",
                  padding: "0 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border, #EAE4EE)",
                  fontSize: "13px",
                  color: "var(--text, #24213A)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--text, #24213A)",
                  marginBottom: "5px",
                }}
              >
                Subheadline
              </label>
              <input
                type="text"
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                placeholder="e.g. Limited Time Only"
                style={{
                  width: "100%",
                  height: "38px",
                  padding: "0 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border, #EAE4EE)",
                  fontSize: "13px",
                  color: "var(--text, #24213A)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--text, #24213A)",
                marginBottom: "5px",
              }}
            >
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of template design use case and audience."
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border, #EAE4EE)",
                fontSize: "13px",
                color: "var(--text, #24213A)",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Modal Footer Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
              paddingTop: "14px",
              borderTop: "1px solid var(--border, #EAE4EE)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
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
              type="submit"
              disabled={isSubmitting}
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
                cursor: isSubmitting ? "not-allowed" : "pointer",
                boxShadow: "0 1px 3px rgba(121, 86, 201, 0.25)",
              }}
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              <span>Create Template</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
