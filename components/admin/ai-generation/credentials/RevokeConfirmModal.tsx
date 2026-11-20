"use client";

import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import type { ProviderCredential } from "@/lib/ai-credentials";

interface RevokeConfirmModalProps {
  isOpen: boolean;
  credential: ProviderCredential | null;
  onClose: () => void;
  onConfirmRevoke: (credentialId: string, reason: string) => Promise<void>;
}

export const RevokeConfirmModal: React.FC<RevokeConfirmModalProps> = ({
  isOpen,
  credential,
  onClose,
  onConfirmRevoke,
}) => {
  const [reason, setReason] = useState("Administrative revocation / key retirement");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !credential) return null;

  const handleRevoke = async () => {
    try {
      setIsSubmitting(true);
      await onConfirmRevoke(credential.id, reason);
      onClose();
    } catch {
      // handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(36, 33, 58, 0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #EAE4EE",
          boxShadow: "0 10px 30px rgba(36, 33, 58, 0.15)",
          width: "100%",
          maxWidth: "460px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "#FEF2F2",
                color: "#DC2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#24213A", margin: 0 }}>
                Revoke Provider Credential
              </h3>
              <p style={{ fontSize: "12px", color: "#777184", margin: "2px 0 0 0" }}>
                {credential.providerName} — {credential.credentialName} ({credential.maskedReference})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#777184",
              padding: "4px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Impact Warning */}
        <div
          style={{
            padding: "12px 14px",
            borderRadius: "8px",
            backgroundColor: "#FFFBEB",
            border: "1px solid #FDE68A",
            fontSize: "12px",
            color: "#92400E",
            lineHeight: 1.5,
          }}
        >
          <strong>Warning:</strong> This credential is used by{" "}
          <strong>{credential.associatedServices}</strong> in <strong>{credential.environment}</strong>. Revoking will
          prevent further requests from using this key and may cause service interruption until rotated.
        </div>

        {/* Reason Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
            Reason for Revocation
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{
              width: "100%",
              height: "36px",
              padding: "0 12px",
              borderRadius: "8px",
              border: "1px solid #EAE4EE",
              fontSize: "13px",
              color: "#24213A",
              outline: "none",
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#FFFFFF",
              color: "#777184",
              border: "1px solid #EAE4EE",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRevoke}
            disabled={isSubmitting}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#DC2626",
              color: "#FFFFFF",
              border: "none",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              boxShadow: "0 2px 4px rgba(220, 38, 38, 0.25)",
            }}
          >
            {isSubmitting ? "Revoking..." : "Confirm Revocation"}
          </button>
        </div>
      </div>
    </div>
  );
};
