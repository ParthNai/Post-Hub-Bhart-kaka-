"use client";

import React, { useState } from "react";
import { Settings } from "lucide-react";
import type { RateLimitPolicy, RateLimitScope, EnforcementMode } from "@/lib/ai-rate-limits";

interface RateLimitConfigFormProps {
  selectedPolicy: RateLimitPolicy | null;
  onUpdatePolicy: (policyId: string, updated: Partial<RateLimitPolicy>) => void;
  onReset: () => void;
  isUpdating?: boolean;
}

export const RateLimitConfigForm: React.FC<RateLimitConfigFormProps> = ({
  selectedPolicy,
  onUpdatePolicy,
  onReset,
  isUpdating = false,
}) => {
  const [prevPolicyId, setPrevPolicyId] = useState<string | undefined>(selectedPolicy?.id);
  const [name, setName] = useState(selectedPolicy?.name || "Global Rate Limit");
  const [scope, setScope] = useState<RateLimitScope>(selectedPolicy?.scope || "Global");
  const [endpoint, setEndpoint] = useState(selectedPolicy?.endpoint || "/api/generate-image");
  const [maxRequests, setMaxRequests] = useState(
    selectedPolicy ? selectedPolicy.requestLimit.toLocaleString() : "1,000"
  );
  const [timeWindow, setTimeWindow] = useState(selectedPolicy?.timeWindow || "1 Hour");
  const [burstAllowance, setBurstAllowance] = useState(
    selectedPolicy ? selectedPolicy.burstAllowance.toString() : "100"
  );
  const [enforcementMode, setEnforcementMode] = useState<EnforcementMode>(
    selectedPolicy?.enforcementMode || "Throttling (Queue)"
  );
  const [enabled, setEnabled] = useState(selectedPolicy ? selectedPolicy.enabled : true);

  // Synchronize when selectedPolicy prop changes (React recommended pattern)
  if (selectedPolicy && selectedPolicy.id !== prevPolicyId) {
    setPrevPolicyId(selectedPolicy.id);
    setName(selectedPolicy.name);
    setScope(selectedPolicy.scope);
    setEndpoint(selectedPolicy.endpoint);
    setMaxRequests(selectedPolicy.requestLimit.toLocaleString());
    setTimeWindow(selectedPolicy.timeWindow);
    setBurstAllowance(selectedPolicy.burstAllowance.toString());
    setEnforcementMode(selectedPolicy.enforcementMode);
    setEnabled(selectedPolicy.enabled);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPolicy) return;

    const parsedLimit = parseInt(maxRequests.replace(/,/g, ""), 10) || selectedPolicy.requestLimit;
    const parsedBurst = parseInt(burstAllowance.replace(/,/g, ""), 10) || selectedPolicy.burstAllowance;

    onUpdatePolicy(selectedPolicy.id, {
      name,
      scope,
      endpoint,
      requestLimit: parsedLimit,
      timeWindow,
      burstAllowance: parsedBurst,
      enforcementMode,
      enabled,
      status: enabled ? "Active" : "Paused",
    });
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        padding: "18px 20px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
          fontSize: "14px",
          fontWeight: 700,
          color: "#24213A",
        }}
      >
        <Settings size={16} color="#7956C9" />
        <span>Rate-Limit Configuration</span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
            marginBottom: "16px",
            fontSize: "12.5px",
          }}
        >
          {/* Policy Name */}
          <div>
            <label
              htmlFor="policy-name"
              style={{ display: "block", color: "#24213A", fontWeight: 600, marginBottom: "4px" }}
            >
              Policy Name <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              id="policy-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: "6px",
                border: "1px solid #EAE4EE",
                outline: "none",
                fontSize: "12.5px",
                color: "#24213A",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Policy Scope */}
          <div>
            <label
              htmlFor="policy-scope"
              style={{ display: "block", color: "#24213A", fontWeight: 600, marginBottom: "4px" }}
            >
              Policy Scope <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <select
              id="policy-scope"
              value={scope}
              onChange={(e) => setScope(e.target.value as RateLimitScope)}
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: "6px",
                border: "1px solid #EAE4EE",
                backgroundColor: "#FFFFFF",
                outline: "none",
                fontSize: "12.5px",
                color: "#24213A",
                boxSizing: "border-box",
              }}
            >
              <option value="Global">Global</option>
              <option value="Per User">Per User</option>
              <option value="Per Subscription Plan">Per Subscription Plan</option>
              <option value="Per Provider">Per Provider</option>
              <option value="Per Endpoint">Per Endpoint</option>
            </select>
          </div>

          {/* API Endpoint */}
          <div>
            <label
              htmlFor="policy-endpoint"
              style={{ display: "block", color: "#24213A", fontWeight: 600, marginBottom: "4px" }}
            >
              API Endpoint <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <select
              id="policy-endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: "6px",
                border: "1px solid #EAE4EE",
                backgroundColor: "#FFFFFF",
                outline: "none",
                fontSize: "12.5px",
                color: "#24213A",
                boxSizing: "border-box",
              }}
            >
              <option value="/api/generate-image">/api/generate-image</option>
              <option value="/api/edit-image">/api/edit-image</option>
              <option value="/api/status">/api/status</option>
            </select>
          </div>

          {/* Maximum Requests */}
          <div>
            <label
              htmlFor="policy-max-requests"
              style={{ display: "block", color: "#24213A", fontWeight: 600, marginBottom: "4px" }}
            >
              Maximum Requests <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              id="policy-max-requests"
              type="text"
              value={maxRequests}
              onChange={(e) => setMaxRequests(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: "6px",
                border: "1px solid #EAE4EE",
                outline: "none",
                fontSize: "12.5px",
                color: "#24213A",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Time Window */}
          <div>
            <label
              htmlFor="policy-time-window"
              style={{ display: "block", color: "#24213A", fontWeight: 600, marginBottom: "4px" }}
            >
              Time Window <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <select
              id="policy-time-window"
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: "6px",
                border: "1px solid #EAE4EE",
                backgroundColor: "#FFFFFF",
                outline: "none",
                fontSize: "12.5px",
                color: "#24213A",
                boxSizing: "border-box",
              }}
            >
              <option value="1 Hour">1 Hour</option>
              <option value="5 Minutes">5 Minutes</option>
              <option value="1 Minute">1 Minute</option>
              <option value="24 Hours">24 Hours</option>
            </select>
          </div>

          {/* Burst Allowance */}
          <div>
            <label
              htmlFor="policy-burst"
              style={{ display: "block", color: "#24213A", fontWeight: 600, marginBottom: "4px" }}
            >
              Burst Allowance
            </label>
            <input
              id="policy-burst"
              type="text"
              value={burstAllowance}
              onChange={(e) => setBurstAllowance(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: "6px",
                border: "1px solid #EAE4EE",
                outline: "none",
                fontSize: "12.5px",
                color: "#24213A",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Enforcement Mode */}
          <div>
            <label
              htmlFor="policy-enforcement"
              style={{ display: "block", color: "#24213A", fontWeight: 600, marginBottom: "4px" }}
            >
              Enforcement Mode
            </label>
            <select
              id="policy-enforcement"
              value={enforcementMode}
              onChange={(e) => setEnforcementMode(e.target.value as EnforcementMode)}
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: "6px",
                border: "1px solid #EAE4EE",
                backgroundColor: "#FFFFFF",
                outline: "none",
                fontSize: "12.5px",
                color: "#24213A",
                boxSizing: "border-box",
              }}
            >
              <option value="Throttling (Queue)">Throttling (Queue)</option>
              <option value="Reject Request (HTTP 429)">Reject Request (HTTP 429)</option>
              <option value="Delayed Retry">Delayed Retry</option>
              <option value="Temporary Cooldown">Temporary Cooldown</option>
            </select>
          </div>

          {/* Policy Enabled Toggle */}
          <div>
            <span
              style={{ display: "block", color: "#24213A", fontWeight: 600, marginBottom: "6px" }}
            >
              Policy Enabled <span style={{ color: "#EF4444" }}>*</span>
            </span>
            <div style={{ display: "flex", alignItems: "center", height: "34px" }}>
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                style={{
                  width: "40px",
                  height: "22px",
                  borderRadius: "11px",
                  backgroundColor: enabled ? "#7956C9" : "#DDD7EE",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background-color 0.15s ease",
                  padding: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: enabled ? "21px" : "3px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#FFFFFF",
                    transition: "left 0.15s ease",
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "auto" }}>
          <button
            type="button"
            onClick={onReset}
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
            Reset
          </button>

          <button
            type="submit"
            disabled={isUpdating}
            style={{
              padding: "7px 18px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#7956C9",
              color: "#FFFFFF",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: isUpdating ? "not-allowed" : "pointer",
              boxShadow: "0 1px 2px rgba(121, 86, 201, 0.2)",
            }}
          >
            {isUpdating ? "Updating..." : "Update Policy"}
          </button>
        </div>
      </form>
    </div>
  );
};
