"use client";

import React, { useState } from "react";
import { Settings, Save, Check } from "lucide-react";
import type { WorkerSchedulingConfig } from "@/lib/ai-workers";

interface SchedulingConfigurationCardProps {
  configuration: WorkerSchedulingConfig;
  onSave: (updated: Partial<WorkerSchedulingConfig>) => Promise<void>;
}

export const SchedulingConfigurationCard: React.FC<SchedulingConfigurationCardProps> = ({
  configuration,
  onSave,
}) => {
  const [formData, setFormData] = useState<WorkerSchedulingConfig>({ ...configuration });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        padding: "18px 20px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Settings size={16} color="#7956C9" />
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
          }}
        >
          Scheduling & Configuration
        </h3>
      </div>

      {/* Auto Restart */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
        <span style={{ color: "#24213A", fontWeight: 500 }}>Auto Restart</span>
        <label
          style={{
            position: "relative",
            display: "inline-block",
            width: "38px",
            height: "20px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={formData.autoRestart}
            onChange={(e) => setFormData({ ...formData, autoRestart: e.target.checked })}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span
            style={{
              position: "absolute",
              cursor: "pointer",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: formData.autoRestart ? "#7956C9" : "#D1D5DB",
              borderRadius: "20px",
              transition: "0.2s",
            }}
          />
          <span
            style={{
              position: "absolute",
              height: "14px",
              width: "14px",
              left: formData.autoRestart ? "20px" : "3px",
              bottom: "3px",
              backgroundColor: "white",
              borderRadius: "50%",
              transition: "0.2s",
            }}
          />
        </label>
      </div>

      {/* Restart Delay */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
        <span style={{ color: "#24213A", fontWeight: 500 }}>Restart Delay</span>
        <select
          value={formData.restartDelay}
          onChange={(e) => setFormData({ ...formData, restartDelay: e.target.value })}
          style={{
            padding: "4px 10px",
            borderRadius: "6px",
            border: "1px solid #EAE4EE",
            backgroundColor: "#FAF7F2",
            fontSize: "12px",
            fontWeight: 500,
            color: "#24213A",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="1 min">1 min</option>
          <option value="5 min">5 min</option>
          <option value="10 min">10 min</option>
          <option value="15 min">15 min</option>
        </select>
      </div>

      {/* Max Jobs Per Worker */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
        <span style={{ color: "#24213A", fontWeight: 500 }}>Max Jobs Per Worker</span>
        <select
          value={formData.maxJobsPerWorker}
          onChange={(e) => setFormData({ ...formData, maxJobsPerWorker: parseInt(e.target.value, 10) || 5 })}
          style={{
            padding: "4px 10px",
            borderRadius: "6px",
            border: "1px solid #EAE4EE",
            backgroundColor: "#FAF7F2",
            fontSize: "12px",
            fontWeight: 500,
            color: "#24213A",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={8}>8</option>
          <option value={10}>10</option>
        </select>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "10px 16px",
          borderRadius: "8px",
          backgroundColor: savedSuccess ? "#16A34A" : "#7956C9",
          border: "none",
          color: "#FFFFFF",
          fontSize: "13px",
          fontWeight: 600,
          cursor: isSaving ? "wait" : "pointer",
          boxShadow: "0 2px 4px rgba(121, 86, 201, 0.2)",
          transition: "all 0.15s ease",
          marginTop: "6px",
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
          <>
            <Save size={14} />
            <span>Save Configuration</span>
          </>
        )}
      </button>
    </div>
  );
};
