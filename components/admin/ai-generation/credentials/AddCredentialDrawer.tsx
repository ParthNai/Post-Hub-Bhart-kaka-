"use client";

import React, { useState } from "react";
import { X, Eye, EyeOff, Shield, Calendar, Check, AlertCircle } from "lucide-react";
import type { AddCredentialInput, EnvironmentType, AuthType, AccessScopeType } from "@/lib/ai-credentials";
import { ProviderIcon } from "./ProviderLogos";

interface AddCredentialDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: AddCredentialInput) => Promise<void>;
}

export const AddCredentialDrawer: React.FC<AddCredentialDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [providerId, setProviderId] = useState<"openai" | "gemini" | "stability" | "replicate">("openai");
  const [credentialName, setCredentialName] = useState("");
  const [environment, setEnvironment] = useState<EnvironmentType>("Production");
  const [authType, setAuthType] = useState<AuthType>("API Key");
  const [secretKey, setSecretKey] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  const [accessScope, setAccessScope] = useState<AccessScopeType>("Full Access");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentialName.trim()) {
      setErrorMessage("Please enter a credential display name.");
      return;
    }
    if (!secretKey || secretKey.trim().length < 8) {
      setErrorMessage("Secret key must be at least 8 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onSave({
        providerId,
        credentialName: credentialName.trim(),
        environment,
        authType,
        secretKey: secretKey.trim(),
        expirationDate: expirationDate || null,
        accessScope,
      });

      // Clear inputs securely
      setCredentialName("");
      setSecretKey("");
      setExpirationDate("");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add credential";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "360px",
        flexShrink: 0,
      }}
    >
      {/* Drawer Container */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #EAE4EE",
          boxShadow: "0 4px 16px rgba(36, 33, 58, 0.06)",
          padding: "20px 22px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#24213A",
              margin: 0,
            }}
          >
            Add Credential
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#777184",
              padding: "4px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Provider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
              Provider <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ProviderIcon providerId={providerId} size={18} />
              </div>
              <select
                value={providerId}
                onChange={(e) => setProviderId(e.target.value as "openai" | "gemini" | "stability" | "replicate")}
                style={{
                  width: "100%",
                  height: "38px",
                  paddingLeft: "36px",
                  paddingRight: "12px",
                  borderRadius: "8px",
                  border: "1px solid #EAE4EE",
                  fontSize: "13px",
                  color: "#24213A",
                  backgroundColor: "#FFFFFF",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="openai">OpenAI</option>
                <option value="gemini">Gemini</option>
                <option value="stability">Stability AI</option>
                <option value="replicate">Replicate</option>
              </select>
            </div>
          </div>

          {/* Credential Display Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
              Credential Display Name <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Enter credential name"
              value={credentialName}
              onChange={(e) => setCredentialName(e.target.value)}
              style={{
                width: "100%",
                height: "38px",
                padding: "0 12px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontSize: "13px",
                color: "#24213A",
                outline: "none",
              }}
            />
          </div>

          {/* Environment */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
              Environment <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as EnvironmentType)}
              style={{
                width: "100%",
                height: "38px",
                padding: "0 12px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontSize: "13px",
                color: "#24213A",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="Production">Production</option>
              <option value="Staging">Staging</option>
              <option value="Development">Development</option>
            </select>
          </div>

          {/* Authentication Type */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
              Authentication Type <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <select
              value={authType}
              onChange={(e) => setAuthType(e.target.value as AuthType)}
              style={{
                width: "100%",
                height: "38px",
                padding: "0 12px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontSize: "13px",
                color: "#24213A",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="API Key">API Key</option>
              <option value="API Token">API Token</option>
              <option value="Bearer Token">Bearer Token</option>
            </select>
          </div>

          {/* Secret Key */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
              Secret Key <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showSecret ? "text" : "password"}
                placeholder="•••••••••••••"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                style={{
                  width: "100%",
                  height: "38px",
                  padding: "0 36px 0 12px",
                  borderRadius: "8px",
                  border: "1px solid #EAE4EE",
                  fontSize: "13px",
                  color: "#24213A",
                  outline: "none",
                  fontFamily: showSecret ? "inherit" : "monospace",
                }}
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
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
                {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Expiration Date (Optional) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#777184" }}>
              Expiration Date (Optional)
            </label>
            <div style={{ position: "relative" }}>
              <Calendar
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#777184",
                  pointerEvents: "none",
                }}
              />
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                style={{
                  width: "100%",
                  height: "38px",
                  paddingLeft: "36px",
                  paddingRight: "12px",
                  borderRadius: "8px",
                  border: "1px solid #EAE4EE",
                  fontSize: "13px",
                  color: "#24213A",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Access Scope */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
              Access Scope
            </label>
            <select
              value={accessScope}
              onChange={(e) => setAccessScope(e.target.value as AccessScopeType)}
              style={{
                width: "100%",
                height: "38px",
                padding: "0 12px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontSize: "13px",
                color: "#24213A",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="Full Access">Full Access</option>
              <option value="Read & Generate">Read & Generate</option>
              <option value="Image Generation Only">Image Generation Only</option>
              <option value="Restricted">Restricted</option>
            </select>
          </div>

          {/* Secure Encryption Callout */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "8px",
              backgroundColor: "#F8F5FD",
              border: "1px solid #EAE4EE",
              color: "#7956C9",
              fontSize: "12px",
              lineHeight: 1.4,
            }}
          >
            <Shield size={16} style={{ flexShrink: 0 }} />
            <span>Your credential will be stored securely and encrypted.</span>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                backgroundColor: "#FEF2F2",
                color: "#DC2626",
                border: "1px solid #FECACA",
              }}
            >
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                backgroundColor: "#FFFFFF",
                color: "#777184",
                border: "1px solid #EAE4EE",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                backgroundColor: "#7956C9",
                color: "#FFFFFF",
                border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: "0 2px 4px rgba(121, 86, 201, 0.25)",
                transition: "all 0.15s ease",
              }}
            >
              {isSubmitting ? "Saving..." : "Save Credential"}
            </button>
          </div>
        </form>
      </div>

      {/* Security Best Practices Card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #EAE4EE",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
          padding: "18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Shield size={16} color="#7956C9" />
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#24213A",
              margin: 0,
            }}
          >
            Security Best Practices
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", color: "#777184" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#F4EFFC",
                color: "#7956C9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Check size={11} strokeWidth={3} />
            </div>
            <span>Rotate credentials regularly</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#F4EFFC",
                color: "#7956C9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Check size={11} strokeWidth={3} />
            </div>
            <span>Use least privilege access</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#F4EFFC",
                color: "#7956C9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Check size={11} strokeWidth={3} />
            </div>
            <span>Monitor for unusual activity</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#F4EFFC",
                color: "#7956C9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Check size={11} strokeWidth={3} />
            </div>
            <span>Keep logs for audit purposes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
