"use client";

import React from "react";
import { Info } from "lucide-react";
import { ScreenCategory } from "@/lib/screens";

export interface GeneralFormData {
  name: string;
  description: string;
  category: ScreenCategory;
  route: string;
  visibilityEnabled: boolean;
  minAppVersion: string;
}

interface GeneralSectionProps {
  data: GeneralFormData;
  onChange: (updated: Partial<GeneralFormData>) => void;
  errors?: Partial<Record<keyof GeneralFormData, string>>;
}

export const GeneralSection: React.FC<GeneralSectionProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Section Header */}
      <div>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--text)",
            margin: "0 0 4px 0",
          }}
        >
          General
        </h3>
        <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>
          Basic information and settings for this screen.
        </p>
      </div>

      {/* 1. Screen display name */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "12.5px",
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: "5px",
          }}
        >
          Screen display name <span style={{ color: "var(--error)" }}>*</span>
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          style={{
            width: "100%",
            height: "38px",
            borderRadius: "8px",
            border: `1px solid ${errors.name ? "var(--error)" : "var(--border)"}`,
            padding: "0 12px",
            fontSize: "13px",
            color: "var(--text)",
            backgroundColor: "var(--surface)",
            outline: "none",
          }}
          className="form-control-input"
        />
        <div style={{ fontSize: "11.5px", color: "var(--text-light)", marginTop: "4px" }}>
          This name will be shown in the admin panel.
        </div>
        {errors.name && (
          <div style={{ fontSize: "11.5px", color: "var(--error)", marginTop: "2px" }}>
            {errors.name}
          </div>
        )}
      </div>

      {/* 2. Screen description */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "12.5px",
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: "5px",
          }}
        >
          Screen description <span style={{ color: "var(--error)" }}>*</span>
        </label>
        <textarea
          rows={3}
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          style={{
            width: "100%",
            borderRadius: "8px",
            border: `1px solid ${errors.description ? "var(--error)" : "var(--border)"}`,
            padding: "8px 12px",
            fontSize: "13px",
            color: "var(--text)",
            backgroundColor: "var(--surface)",
            outline: "none",
            resize: "vertical",
            lineHeight: 1.5,
          }}
          className="form-control-input"
        />
        <div style={{ fontSize: "11.5px", color: "var(--text-light)", marginTop: "4px" }}>
          A short description of what this screen does.
        </div>
        {errors.description && (
          <div style={{ fontSize: "11.5px", color: "var(--error)", marginTop: "2px" }}>
            {errors.description}
          </div>
        )}
      </div>

      {/* 3. Screen category */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "12.5px",
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: "5px",
          }}
        >
          Screen category <span style={{ color: "var(--error)" }}>*</span>
        </label>
        <div style={{ position: "relative" }}>
          <select
            aria-label="Screen category"
            value={data.category}
            onChange={(e) => onChange({ category: e.target.value as ScreenCategory })}
            style={{
              width: "100%",
              height: "38px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              padding: "0 12px",
              fontSize: "13px",
              color: "var(--text)",
              backgroundColor: "var(--surface)",
              outline: "none",
              cursor: "pointer",
            }}
            className="form-control-input"
          >
            <option value="Navigation">Navigation</option>
            <option value="Content">Content</option>
            <option value="Creation">Creation</option>
            <option value="Account">Account</option>
          </select>
        </div>
        <div style={{ fontSize: "11.5px", color: "var(--text-light)", marginTop: "4px" }}>
          Select the category for this screen.
        </div>
      </div>

      {/* 4. Screen route */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "12.5px",
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: "5px",
          }}
        >
          Screen route <span style={{ color: "var(--error)" }}>*</span>
        </label>
        <input
          type="text"
          value={data.route}
          onChange={(e) => onChange({ route: e.target.value })}
          style={{
            width: "100%",
            height: "38px",
            borderRadius: "8px",
            border: `1px solid ${errors.route ? "var(--error)" : "var(--border)"}`,
            padding: "0 12px",
            fontSize: "13px",
            color: "var(--text)",
            backgroundColor: "var(--surface)",
            outline: "none",
          }}
          className="form-control-input"
        />
        <div style={{ fontSize: "11.5px", color: "var(--text-light)", marginTop: "4px" }}>
          The route path for this screen (e.g. /home, /templates).
        </div>
        {errors.route && (
          <div style={{ fontSize: "11.5px", color: "var(--error)", marginTop: "2px" }}>
            {errors.route}
          </div>
        )}
      </div>

      {/* 5. Screen visibility toggle */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "12.5px",
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: "6px",
          }}
        >
          Screen visibility
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Custom Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={data.visibilityEnabled}
            aria-label="Toggle screen visibility"
            onClick={() => onChange({ visibilityEnabled: !data.visibilityEnabled })}
            style={{
              width: "42px",
              height: "24px",
              borderRadius: "12px",
              backgroundColor: data.visibilityEnabled ? "var(--primary)" : "#E4DEEC",
              border: "none",
              cursor: "pointer",
              position: "relative",
              transition: "background-color 0.2s ease",
              padding: "2px",
            }}
          >
            <span
              style={{
                display: "block",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                transform: data.visibilityEnabled ? "translateX(18px)" : "translateX(0)",
                transition: "transform 0.2s ease",
              }}
            />
          </button>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)" }}>
            {data.visibilityEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
        <div style={{ fontSize: "11.5px", color: "var(--text-light)", marginTop: "4px" }}>
          Controls whether this screen is visible in the app.
        </div>
      </div>

      {/* 6. Minimum supported app version */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "12.5px",
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: "5px",
          }}
        >
          Minimum supported app version
        </label>
        <input
          type="text"
          value={data.minAppVersion}
          onChange={(e) => onChange({ minAppVersion: e.target.value })}
          style={{
            width: "100%",
            height: "38px",
            borderRadius: "8px",
            border: `1px solid ${errors.minAppVersion ? "var(--error)" : "var(--border)"}`,
            padding: "0 12px",
            fontSize: "13px",
            color: "var(--text)",
            backgroundColor: "var(--surface)",
            outline: "none",
          }}
          className="form-control-input"
        />
        <div style={{ fontSize: "11.5px", color: "var(--text-light)", marginTop: "4px" }}>
          The minimum app version required for this screen.
        </div>
        {errors.minAppVersion && (
          <div style={{ fontSize: "11.5px", color: "var(--error)", marginTop: "2px" }}>
            {errors.minAppVersion}
          </div>
        )}
      </div>

      {/* 7. Bottom Notice strip */}
      <div
        style={{
          marginTop: "6px",
          backgroundColor: "#FAF7FD",
          border: "1px solid #E8DFF5",
          borderRadius: "8px",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Info size={16} style={{ color: "var(--primary)", flexShrink: 0 }} />
        <span style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.4 }}>
          Only settings supported by the connected app can affect the published experience.
        </span>
      </div>

      <style jsx global>{`
        .form-control-input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 3px rgba(121, 86, 201, 0.12) !important;
        }
      `}</style>
    </div>
  );
};
