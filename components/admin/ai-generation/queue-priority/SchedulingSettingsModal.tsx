"use client";

import React, { useState } from "react";
import { X, Settings, Check } from "lucide-react";
import type { QueueSchedulingSettings, PriorityConfig } from "@/lib/ai-queue-priority";

interface SchedulingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: QueueSchedulingSettings;
  config: PriorityConfig;
  onSave: (
    updatedSettings: Partial<QueueSchedulingSettings>,
    updatedConfig: Partial<PriorityConfig>
  ) => Promise<void>;
}

export const SchedulingSettingsModal: React.FC<SchedulingSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  config,
  onSave,
}) => {
  const [formData, setFormData] = useState<QueueSchedulingSettings>({ ...settings });
  const [configData, setConfigData] = useState<PriorityConfig>({ ...config });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await onSave(formData, configData);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 700);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #EAE4EE",
            position: "sticky",
            top: 0,
            backgroundColor: "#FFFFFF",
            zIndex: 10,
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
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#24213A", margin: 0 }}>
                Queue & Scheduling Settings
              </h3>
              <p style={{ fontSize: "12px", color: "#777184", margin: 0 }}>
                Configure global worker throughput, fair allocation, and provider limits
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
        <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
          {/* Section 1: Scheduling Mode & Concurrency */}
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#7956C9",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: "0 0 12px 0",
              }}
            >
              Concurrency & Modes
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#24213A", marginBottom: "4px" }}>
                  Scheduling Mode
                </label>
                <select
                  value={formData.schedulingMode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      schedulingMode: e.target.value as QueueSchedulingSettings["schedulingMode"],
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid #EAE4EE",
                    backgroundColor: "#FAF7F2",
                    fontSize: "12px",
                    color: "#24213A",
                    outline: "none",
                  }}
                >
                  <option value="Balanced">Balanced</option>
                  <option value="Throughput-Optimized">Throughput-Optimized</option>
                  <option value="Cost-Optimized">Cost-Optimized</option>
                  <option value="Strict-Priority">Strict-Priority</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#24213A", marginBottom: "4px" }}>
                  Max Concurrent Jobs
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={formData.maxConcurrentJobs}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxConcurrentJobs: Math.max(1, parseInt(e.target.value, 10) || 20),
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid #EAE4EE",
                    backgroundColor: "#FAF7F2",
                    fontSize: "12px",
                    color: "#24213A",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Toggles */}
          <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FAF7F2", borderRadius: "8px" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>Queue Processing</div>
                <div style={{ fontSize: "11px", color: "#777184" }}>Enable or pause global generation job intake</div>
              </div>
              <input
                type="checkbox"
                checked={formData.queueProcessing}
                onChange={(e) => setFormData({ ...formData, queueProcessing: e.target.checked })}
                style={{ width: "18px", height: "18px", accentColor: "#7956C9" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FAF7F2", borderRadius: "8px" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>Provider-Specific Limits</div>
                <div style={{ fontSize: "11px", color: "#777184" }}>Enforce per-vendor concurrency ceilings (OpenAI: 10, Gemini: 8, Stability: 6)</div>
              </div>
              <input
                type="checkbox"
                checked={formData.providerSpecificLimits}
                onChange={(e) => setFormData({ ...formData, providerSpecificLimits: e.target.checked })}
                style={{ width: "18px", height: "18px", accentColor: "#7956C9" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FAF7F2", borderRadius: "8px" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>Fair Scheduling Policy</div>
                <div style={{ fontSize: "11px", color: "#777184" }}>Boost starved lower-tier requests after threshold minutes</div>
              </div>
              <input
                type="checkbox"
                checked={configData.fairSchedulingPolicy}
                onChange={(e) => setConfigData({ ...configData, fairSchedulingPolicy: e.target.checked })}
                style={{ width: "18px", height: "18px", accentColor: "#7956C9" }}
              />
            </div>
          </div>

          {/* Section 3: Handling & Policies */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#24213A", marginBottom: "4px" }}>
                Scheduled Request Handling
              </label>
              <select
                value={formData.scheduledRequestHandling}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scheduledRequestHandling: e.target.value as QueueSchedulingSettings["scheduledRequestHandling"],
                  })
                }
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #EAE4EE",
                  backgroundColor: "#FAF7F2",
                  fontSize: "12px",
                  color: "#24213A",
                  outline: "none",
                }}
              >
                <option value="Process on Time">Process on Time</option>
                <option value="Immediate If Capacity">Immediate If Capacity</option>
                <option value="Batch Scheduled">Batch Scheduled</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#24213A", marginBottom: "4px" }}>
                Retry Policy
              </label>
              <select
                value={formData.retrySchedulingPolicy}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    retrySchedulingPolicy: e.target.value as QueueSchedulingSettings["retrySchedulingPolicy"],
                  })
                }
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #EAE4EE",
                  backgroundColor: "#FAF7F2",
                  fontSize: "12px",
                  color: "#24213A",
                  outline: "none",
                }}
              >
                <option value="Exponential Backoff">Exponential Backoff</option>
                <option value="Linear Retry">Linear Retry</option>
                <option value="Fixed Interval">Fixed Interval</option>
              </select>
            </div>
          </div>

          {/* Footer buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #F1EDF5", paddingTop: "16px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                backgroundColor: "#FFFFFF",
                color: "#544E61",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: savedSuccess ? "#16A34A" : "#7956C9",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: isSaving ? "wait" : "pointer",
                boxShadow: "0 2px 4px rgba(121, 86, 201, 0.2)",
              }}
            >
              {savedSuccess ? (
                <>
                  <Check size={14} />
                  <span>Saved!</span>
                </>
              ) : isSaving ? (
                <span>Saving...</span>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
