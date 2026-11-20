"use client";

import React, { useState } from "react";
import { X, Settings, Check } from "lucide-react";
import type { WorkerSchedulingConfig } from "@/lib/ai-workers";

interface WorkerConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  configuration: WorkerSchedulingConfig;
  onSave: (updated: Partial<WorkerSchedulingConfig>) => Promise<void>;
}

export const WorkerConfigurationModal: React.FC<WorkerConfigurationModalProps> = ({
  isOpen,
  onClose,
  configuration,
  onSave,
}) => {
  const [formData, setFormData] = useState<WorkerSchedulingConfig>({ ...configuration });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await onSave(formData);
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
          maxWidth: "500px",
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
                Global Worker Configuration
              </h3>
              <p style={{ fontSize: "12px", color: "#777184", margin: 0 }}>
                Adjust heartbeat thresholds and crash recovery policies
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
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", backgroundColor: "#FAF7F2", borderRadius: "8px" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>Auto Restart Crashed Workers</div>
                <div style={{ fontSize: "11px", color: "#777184" }}>Automatically spin up new node upon missed heartbeats</div>
              </div>
              <input
                type="checkbox"
                checked={formData.autoRestart}
                onChange={(e) => setFormData({ ...formData, autoRestart: e.target.checked })}
                style={{ width: "18px", height: "18px", accentColor: "#7956C9" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#24213A", marginBottom: "4px" }}>
                Heartbeat Timeout Threshold (Seconds)
              </label>
              <input
                type="number"
                min={15}
                max={300}
                value={formData.heartbeatThresholdSeconds}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heartbeatThresholdSeconds: Math.max(10, parseInt(e.target.value, 10) || 60),
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#24213A", marginBottom: "4px" }}>
                  Restart Delay
                </label>
                <select
                  value={formData.restartDelay}
                  onChange={(e) => setFormData({ ...formData, restartDelay: e.target.value })}
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
                  <option value="1 min">1 min</option>
                  <option value="5 min">5 min</option>
                  <option value="10 min">10 min</option>
                  <option value="15 min">15 min</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#24213A", marginBottom: "4px" }}>
                  Max Jobs Per Worker
                </label>
                <select
                  value={formData.maxJobsPerWorker}
                  onChange={(e) =>
                    setFormData({ ...formData, maxJobsPerWorker: parseInt(e.target.value, 10) || 5 })
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
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={8}>8</option>
                  <option value={10}>10</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
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
                padding: "8px 18px",
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
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
