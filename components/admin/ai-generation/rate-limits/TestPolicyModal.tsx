"use client";

import React, { useState } from "react";
import { Play, X, CheckCircle2, AlertTriangle } from "lucide-react";

interface TestPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunTest: (params: { endpoint: string; requestCount: number; userId?: string; plan?: string }) => Promise<{
    allowed: boolean;
    enforcementAction: string;
    limitingPolicy: string;
    retryAfterSeconds?: number;
  }>;
}

export const TestPolicyModal: React.FC<TestPolicyModalProps> = ({
  isOpen,
  onClose,
  onRunTest,
}) => {
  const [endpoint, setEndpoint] = useState("/api/generate-image");
  const [requestCount, setRequestCount] = useState(1050);
  const [plan, setPlan] = useState("Free");
  const [userId, setUserId] = useState("user_2847");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    allowed: boolean;
    enforcementAction: string;
    limitingPolicy: string;
    retryAfterSeconds?: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const evaluation = await onRunTest({ endpoint, requestCount, userId, plan });
      setResult(evaluation);
    } finally {
      setIsLoading(false);
    }
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
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
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
              <Play size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#24213A" }}>
                Test Rate-Limit Policy
              </h3>
              <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#777184" }}>
                Simulate request evaluation safely without altering state
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
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleTest} style={{ padding: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "12.5px" }}>
            <div>
              <label htmlFor="test-endpoint" style={{ display: "block", color: "#24213A", fontWeight: 600, marginBottom: "4px" }}>
                Target Endpoint
              </label>
              <select
                id="test-endpoint"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  borderRadius: "6px",
                  border: "1px solid #EAE4EE",
                  backgroundColor: "#FFFFFF",
                  fontSize: "12.5px",
                  color: "#24213A",
                  outline: "none",
                }}
              >
                <option value="/api/generate-image">/api/generate-image</option>
                <option value="/api/edit-image">/api/edit-image</option>
                <option value="/api/status">/api/status</option>
              </select>
            </div>

            <div>
              <label htmlFor="test-request-count" style={{ display: "block", color: "#24213A", fontWeight: 600, marginBottom: "4px" }}>
                Simulated Request Volume
              </label>
              <input
                id="test-request-count"
                type="number"
                value={requestCount}
                onChange={(e) => setRequestCount(parseInt(e.target.value, 10) || 0)}
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  borderRadius: "6px",
                  border: "1px solid #EAE4EE",
                  fontSize: "12.5px",
                  color: "#24213A",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label htmlFor="test-plan" style={{ display: "block", color: "#24213A", fontWeight: 600, marginBottom: "4px" }}>
                  Client Plan
                </label>
                <select
                  id="test-plan"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    border: "1px solid #EAE4EE",
                    backgroundColor: "#FFFFFF",
                    fontSize: "12.5px",
                    color: "#24213A",
                    outline: "none",
                  }}
                >
                  <option value="Free">Free Plan</option>
                  <option value="Creator">Creator</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>

              <div>
                <label htmlFor="test-user-id" style={{ display: "block", color: "#24213A", fontWeight: 600, marginBottom: "4px" }}>
                  User Reference
                </label>
                <input
                  id="test-user-id"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    border: "1px solid #EAE4EE",
                    fontSize: "12.5px",
                    color: "#24213A",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Evaluation Result Banner */}
            {result && (
              <div
                style={{
                  marginTop: "6px",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  backgroundColor: result.allowed ? "#ECFDF5" : "#FEF2F2",
                  border: `1px solid ${result.allowed ? "#A7F3D0" : "#FECACA"}`,
                  fontSize: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, marginBottom: "4px" }}>
                  {result.allowed ? (
                    <CheckCircle2 size={16} color="#059669" />
                  ) : (
                    <AlertTriangle size={16} color="#DC2626" />
                  )}
                  <span style={{ color: result.allowed ? "#059669" : "#DC2626" }}>
                    Enforcement Outcome: {result.enforcementAction}
                  </span>
                </div>
                <div style={{ color: "#374151" }}>
                  Limiting Policy: <strong>{result.limitingPolicy}</strong>
                </div>
                {result.retryAfterSeconds && (
                  <div style={{ color: "#6B7280", marginTop: "2px" }}>
                    Retry-After Header: {result.retryAfterSeconds}s
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "7px 16px",
                borderRadius: "6px",
                border: "1px solid #EAE4EE",
                backgroundColor: "#FFFFFF",
                color: "#24213A",
                fontSize: "12.5px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "7px 18px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#7956C9",
                color: "#FFFFFF",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Evaluating..." : "Run Evaluation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
