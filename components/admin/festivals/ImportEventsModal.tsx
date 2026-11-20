"use client";

import React, { useState } from "react";
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react";
import type { FestivalEvent } from "@/lib/festivals";

interface ImportEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: Partial<FestivalEvent>[]) => Promise<{ importedCount: number; duplicatesSkipped: number }>;
}

export const ImportEventsModal: React.FC<ImportEventsModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [importJson, setImportJson] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const samplePayload = JSON.stringify(
    [
      {
        name: "Raksha Bandhan",
        category: "Religious",
        type: "Festival",
        startDate: "2027-08-28",
        region: "India",
        language: "Hindi",
        shortDescription: "Celebration of the sacred bond between brothers and sisters.",
      },
      {
        name: "Independence Day",
        category: "National",
        type: "National Holiday",
        startDate: "2027-08-15",
        region: "India",
        language: "Hindi",
        shortDescription: "Nationwide celebration of Indian independence.",
      },
    ],
    null,
    2
  );

  const handleImport = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setResultMessage(null);

      const parsed = JSON.parse(importJson || samplePayload);
      if (!Array.isArray(parsed)) {
        throw new Error("Payload must be an array of festival event objects.");
      }

      const res = await onImport(parsed);
      setResultMessage(`Successfully imported ${res.importedCount} new events! (${res.duplicatesSkipped} duplicates skipped)`);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to import events";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(36, 33, 58, 0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #EAE4EE",
          boxShadow: "0 12px 36px rgba(36, 33, 58, 0.18)",
          width: "100%",
          maxWidth: "560px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          padding: "24px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                backgroundColor: "#F4EFFC",
                color: "#7956C9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Upload size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#24213A", margin: 0 }}>
                Import Festival Calendar
              </h2>
              <p style={{ fontSize: "12px", color: "#777184", margin: "2px 0 0 0" }}>
                Import yearly festivals and cultural events via JSON or CSV format.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#777184",
              padding: "4px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Textarea for JSON */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
            Paste Calendar JSON Payload
          </label>
          <textarea
            rows={8}
            placeholder={samplePayload}
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #EAE4EE",
              fontSize: "12px",
              fontFamily: "monospace",
              color: "#24213A",
              backgroundColor: "#FAF7F2",
              outline: "none",
              resize: "vertical",
            }}
          />
        </div>

        {/* Feedback messages */}
        {resultMessage && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              borderRadius: "8px",
              backgroundColor: "#ECFDF5",
              color: "#059669",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={16} />
            <span>{resultMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              borderRadius: "8px",
              backgroundColor: "#FEF2F2",
              color: "#DC2626",
              fontSize: "12px",
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#FFFFFF",
              color: "#777184",
              border: "1px solid #EAE4EE",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={isSubmitting}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#7956C9",
              color: "#FFFFFF",
              border: "none",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              boxShadow: "0 2px 4px rgba(121, 86, 201, 0.25)",
            }}
          >
            {isSubmitting ? "Importing..." : "Run Import"}
          </button>
        </div>
      </div>
    </div>
  );
};
