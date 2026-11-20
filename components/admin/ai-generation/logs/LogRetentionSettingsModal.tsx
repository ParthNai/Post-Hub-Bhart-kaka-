"use client";

import React, { useState } from "react";
import { Settings, X, Trash2, CheckCircle2 } from "lucide-react";
import type { LogRetentionConfig } from "@/lib/ai-request-logs";

interface LogRetentionSettingsModalProps {
  isOpen: boolean;
  config: LogRetentionConfig;
  onClose: () => void;
  onSave: (newDays: number, autoCleanup: boolean) => void;
  onTriggerCleanup: () => void;
  isSaving?: boolean;
}

export const LogRetentionSettingsModal: React.FC<LogRetentionSettingsModalProps> = ({
  isOpen,
  config,
  onClose,
  onSave,
  onTriggerCleanup,
  isSaving = false,
}) => {
  const [days, setDays] = useState(config.retentionDays);
  const [autoCleanup, setAutoCleanup] = useState(config.autoCleanupEnabled);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(days, autoCleanup);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 12, 30, 0.45)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          border: "1px solid #EAE4EE",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #EAE4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "#F3EFFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#7956C9",
              }}
            >
              <Settings size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#24213A" }}>
                API Log Retention & Storage
              </h3>
              <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#777184" }}>
                Manage automated archival and cleanup policies
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#777184",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Storage Metric Overview */}
            <div
              style={{
                backgroundColor: "#FAF9FD",
                borderRadius: "8px",
                padding: "12px 14px",
                border: "1px solid #EAE4EE",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                fontSize: "12px",
              }}
            >
              <div>
                <span style={{ color: "#777184", display: "block" }}>Total Stored Logs:</span>
                <span style={{ color: "#24213A", fontWeight: 700, fontSize: "14px" }}>
                  {config.totalStoredLogs.toLocaleString()}
                </span>
              </div>
              <div>
                <span style={{ color: "#777184", display: "block" }}>Estimated Storage:</span>
                <span style={{ color: "#24213A", fontWeight: 700, fontSize: "14px" }}>
                  {config.estimatedStorageSize}
                </span>
              </div>
            </div>

            {/* Retention Duration Selector */}
            <div>
              <label
                htmlFor="retention-days"
                style={{
                  display: "block",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "#24213A",
                  marginBottom: "6px",
                }}
              >
                Log Retention Window
              </label>
              <select
                id="retention-days"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value, 10))}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: "13px",
                  borderRadius: "8px",
                  border: "1px solid #EAE4EE",
                  backgroundColor: "#FFFFFF",
                  color: "#24213A",
                  outline: "none",
                }}
              >
                <option value={7}>7 Days (Recommended for high-traffic environments)</option>
                <option value={14}>14 Days</option>
                <option value={30}>30 Days (Standard default policy)</option>
                <option value={60}>60 Days</option>
                <option value={90}>90 Days (Extended compliance retention)</option>
              </select>
            </div>

            {/* Auto Cleanup Toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#24213A" }}>
                  Automatic Daily Cleanup
                </div>
                <div style={{ fontSize: "11px", color: "#777184" }}>
                  Purge expired requests nightly at 04:00 AM UTC
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoCleanup}
                onChange={(e) => setAutoCleanup(e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
            </div>

            {/* Last Cleanup Info */}
            <div style={{ fontSize: "11.5px", color: "#777184", display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={13} color="#10B981" />
              <span>Last successful automated cleanup: {config.lastCleanupTime}</span>
            </div>

            {/* Manual Purge Action */}
            <div style={{ borderTop: "1px solid #F1EDF5", paddingTop: "12px" }}>
              <button
                type="button"
                onClick={onTriggerCleanup}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #FCA5A5",
                  color: "#DC2626",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Trash2 size={12} />
                <span>Trigger Manual Cleanup Now</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "12px 20px",
              backgroundColor: "#FAF9FD",
              borderTop: "1px solid #EAE4EE",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                backgroundColor: "#FFFFFF",
                color: "#24213A",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#7956C9",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: isSaving ? "not-allowed" : "pointer",
              }}
            >
              {isSaving ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
