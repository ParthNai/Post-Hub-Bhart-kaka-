"use client";

import React, { useState } from "react";
import { Zap, Play, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { AiProviderFullConfig } from "@/lib/ai-generation";

interface ConnectionTestCardProps {
  config: AiProviderFullConfig;
  onTest: () => Promise<{
    success: boolean;
    latencyMs: number;
    message: string;
    verifiedAt: string;
    status: "connected" | "connection_failed" | "not_configured";
  }>;
}

export const ConnectionTestCard: React.FC<ConnectionTestCardProps> = ({
  config,
  onTest,
}) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs: number;
    message: string;
    verifiedAt: string;
  } | null>(
    config.credentialsVerified
      ? {
          success: true,
          latencyMs: 142,
          message: "Your provider is working correctly.",
          verifiedAt: config.lastVerifiedAt || "Oct 28, 2026 • 04:35 PM",
        }
      : null
  );

  const handleRunTest = async () => {
    setIsTesting(true);
    try {
      const res = await onTest();
      setTestResult(res);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Connection failed.";
      setTestResult({
        success: false,
        latencyMs: 0,
        message,
        verifiedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) + " • " + new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.02)",
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      {/* Card Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            backgroundColor: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Zap size={20} />
        </div>
        <div>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--foreground)",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Provider Connection Test
          </h2>
          <p
            style={{
              fontSize: "12.5px",
              color: "var(--text-muted)",
              margin: "2px 0 0 0",
            }}
          >
            Verify your provider configuration.
          </p>
        </div>
      </div>

      {/* Action Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Test Connection Button */}
        <button
          type="button"
          onClick={handleRunTest}
          disabled={isTesting}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--primary)",
            color: "#ffffff",
            padding: "10px 22px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            border: "none",
            cursor: isTesting ? "not-allowed" : "pointer",
            boxShadow: "0 2px 8px rgba(121, 86, 201, 0.25)",
            flexShrink: 0,
            transition: "all 0.15s ease",
          }}
        >
          {isTesting ? (
            <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <Play size={13} fill="#ffffff" />
          )}
          <span>Test Connection</span>
        </button>

        {/* Status Box */}
        {testResult ? (
          <div
            style={{
              flex: 1,
              minWidth: "240px",
              backgroundColor: testResult.success ? "#E6F4EA" : "#FEF2F2",
              border: testResult.success ? "1px solid #CEEAD6" : "1px solid #FEE2E2",
              borderRadius: "10px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {testResult.success ? (
              <CheckCircle2 size={20} color="#137333" style={{ flexShrink: 0 }} />
            ) : (
              <AlertCircle size={20} color="#DC2626" style={{ flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: testResult.success ? "#137333" : "#DC2626",
                }}
              >
                {testResult.success ? "Connection Successful" : "Connection Failed"}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: testResult.success ? "#1E7E34" : "#B91C1C",
                  marginTop: "1px",
                }}
              >
                {testResult.message}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                }}
              >
                Verified At: {testResult.verifiedAt}
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              fontSize: "12.5px",
              color: "var(--text-muted)",
            }}
          >
            Click Test Connection to verify API endpoint response and credentials.
          </div>
        )}
      </div>
    </div>
  );
};

