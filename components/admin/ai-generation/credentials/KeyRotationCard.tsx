"use client";

import React, { useState } from "react";
import { RefreshCw, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import type { ProviderCredential } from "@/lib/ai-credentials";

interface KeyRotationCardProps {
  credential: ProviderCredential | null;
  onRotateKey: (credentialId: string, replacementSecret: string) => Promise<void>;
}

export const KeyRotationCard: React.FC<KeyRotationCardProps> = ({
  credential,
  onRotateKey,
}) => {
  const [replacementKey, setReplacementKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!credential) {
    return (
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #EAE4EE",
          padding: "22px 24px",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
          color: "#777184",
          fontSize: "13px",
        }}
      >
        Select a credential to manage key rotation.
      </div>
    );
  }

  const handleRotate = async () => {
    if (!replacementKey || replacementKey.trim().length < 8) {
      setStatusMessage({ type: "error", text: "Replacement key must be at least 8 characters." });
      return;
    }

    try {
      setIsRotating(true);
      setStatusMessage(null);
      await onRotateKey(credential.id, replacementKey.trim());
      setReplacementKey("");
      setStatusMessage({ type: "success", text: "Credential rotated successfully with zero downtime!" });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to rotate credential";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsRotating(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        padding: "22px 24px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            backgroundColor: "#F4EFFC",
            color: "#7956C9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RefreshCw size={16} />
        </div>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
          }}
        >
          Key Rotation
        </h2>
      </div>

      {/* Rotation Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Current Credential:</span>
          <span style={{ fontFamily: "monospace", fontWeight: 600, color: "#24213A" }}>
            {credential.maskedReference}
          </span>
        </div>

        {/* Replacement Key Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#777184" }}>Replacement Key:</span>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={showKey ? "text" : "password"}
              placeholder="Enter new key..."
              value={replacementKey}
              onChange={(e) => setReplacementKey(e.target.value)}
              style={{
                width: "100%",
                height: "36px",
                padding: "0 36px 0 12px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontSize: "13px",
                color: "#24213A",
                backgroundColor: "#FAF7F2",
                outline: "none",
                fontFamily: showKey ? "inherit" : "monospace",
              }}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#777184",
                padding: "2px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Rotation Status:</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "2px 8px",
              borderRadius: "10px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "#EFF6FF",
              color: "#2563EB",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                backgroundColor: "#2563EB",
              }}
            />
            {credential.rotationStatus}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Last Rotation:</span>
          <span style={{ color: "#777184" }}>{credential.lastRotation}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Associated Services:</span>
          <span style={{ color: "#24213A", fontWeight: 500 }}>{credential.associatedServices}</span>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              backgroundColor: statusMessage.type === "success" ? "#ECFDF5" : "#FEF2F2",
              color: statusMessage.type === "success" ? "#059669" : "#DC2626",
              border: `1px solid ${statusMessage.type === "success" ? "#A7F3D0" : "#FECACA"}`,
            }}
          >
            {statusMessage.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Rotate Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
          <button
            type="button"
            onClick={handleRotate}
            disabled={isRotating}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 20px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#7956C9",
              color: "#FFFFFF",
              border: "none",
              cursor: isRotating ? "not-allowed" : "pointer",
              opacity: isRotating ? 0.7 : 1,
              boxShadow: "0 2px 4px rgba(121, 86, 201, 0.25)",
              transition: "all 0.15s ease",
            }}
          >
            <RefreshCw size={14} className={isRotating ? "animate-spin" : ""} />
            <span>{isRotating ? "Rotating..." : "Rotate Key"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
