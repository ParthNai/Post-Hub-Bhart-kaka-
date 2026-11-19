"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { ValidationCheck } from "@/lib/template-publishing";

interface ValidationChecklistCardProps {
  checks: ValidationCheck[];
  isValidating: boolean;
  onRunValidation: () => void;
}

export const ValidationChecklistCard: React.FC<ValidationChecklistCardProps> = ({
  checks,
  isValidating,
  onRunValidation,
}) => {
  const passedCount = checks.filter((c) => c.status === "Passed").length;
  const warningCount = checks.filter((c) => c.status === "Warning").length;
  const failedCount = checks.filter((c) => c.status === "Failed").length;

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border, #EAE4EE)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
        marginBottom: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border, #EAE4EE)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
          Pre-publish Validation
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "12px",
              color: "var(--text-muted, #777184)",
            }}
          >
            {passedCount} of {checks.length} verified
          </span>
        </div>
      </div>

      {/* Checks List */}
      <div style={{ padding: "8px 0" }}>
        {checks.map((check) => {
          const isPassed = check.status === "Passed";
          const isWarning = check.status === "Warning";
          const isFailed = check.status === "Failed";

          return (
            <div
              key={check.id}
              style={{
                padding: "12px 20px",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "14px",
                borderBottom: "1px solid rgba(234, 228, 238, 0.5)",
                transition: "background-color 0.15s ease",
              }}
              className="hover:bg-slate-50/50"
            >
              {/* Left: Status Icon + Title + Description */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", minWidth: 0 }}>
                <div style={{ marginTop: "2px", flexShrink: 0 }}>
                  {isPassed && <CheckCircle2 size={18} style={{ color: "#10B981" }} />}
                  {isWarning && <AlertTriangle size={18} style={{ color: "#F59E0B" }} />}
                  {isFailed && <XCircle size={18} style={{ color: "#EF4444" }} />}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "var(--text, #24213A)",
                    }}
                  >
                    {check.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted, #777184)",
                      marginTop: "1px",
                      lineHeight: 1.4,
                    }}
                  >
                    {check.description}
                  </div>
                </div>
              </div>

              {/* Right: Badge */}
              <div style={{ flexShrink: 0 }}>
                {isPassed && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      backgroundColor: "#ECFDF5",
                      color: "#059669",
                    }}
                  >
                    Passed
                  </span>
                )}
                {isWarning && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      backgroundColor: "#FEF3C7",
                      color: "#D97706",
                    }}
                  >
                    Warning
                  </span>
                )}
                {isFailed && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      backgroundColor: "#FEF2F2",
                      color: "#DC2626",
                    }}
                  >
                    Failed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Validation Summary Bar */}
      <div
        style={{
          padding: "14px 20px",
          backgroundColor: "#FAF7F2",
          borderTop: "1px solid var(--border, #EAE4EE)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Passed pill */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "#ECFDF5",
              color: "#059669",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10B981" }} />
            Passed: {passedCount}
          </span>

          {/* Warnings pill */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "#FEF3C7",
              color: "#D97706",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#F59E0B" }} />
            Warnings: {warningCount}
          </span>

          {/* Failed pill */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: failedCount > 0 ? "#FEF2F2" : "#F3F4F6",
              color: failedCount > 0 ? "#DC2626" : "#6B7280",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: failedCount > 0 ? "#EF4444" : "#9CA3AF",
              }}
            />
            Failed: {failedCount}
          </span>
        </div>

        {/* Run Validation Button */}
        <button
          type="button"
          onClick={onRunValidation}
          disabled={isValidating}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 14px",
            borderRadius: "6px",
            backgroundColor: "#ffffff",
            border: "1px solid var(--border, #EAE4EE)",
            fontSize: "12.5px",
            fontWeight: 600,
            color: "var(--text, #24213A)",
            cursor: isValidating ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
          }}
          className="hover:bg-slate-50"
        >
          <RefreshCw
            size={13}
            style={{
              color: "var(--primary, #7956C9)",
              animation: isValidating ? "spin 1s linear infinite" : "none",
            }}
          />
          <span>{isValidating ? "Validating..." : "Run Validation"}</span>
        </button>
      </div>
    </div>
  );
};

