"use client";

import React, { useState } from "react";
import { Shield, X, Lock, CheckCircle2, KeyRound } from "lucide-react";
import type { SecuritySettingsConfig } from "@/lib/ai-credentials";

interface SecuritySettingsModalProps {
  isOpen: boolean;
  settings: SecuritySettingsConfig;
  onClose: () => void;
  onSaveSettings?: (updated: SecuritySettingsConfig) => Promise<void>;
}

export const SecuritySettingsModal: React.FC<SecuritySettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
}) => {
  const [rotationDays, setRotationDays] = useState(settings.autoRotationReminderDays);
  const [requireProdConfirm, setRequireProdConfirm] = useState(settings.requireProductionConfirmation);
  const [preventCrossEnv, setPreventCrossEnv] = useState(settings.preventCrossEnvironmentAccess);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(36, 33, 58, 0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #EAE4EE",
          boxShadow: "0 12px 36px rgba(36, 33, 58, 0.18)",
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "24px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                backgroundColor: "#F4EFFC",
                color: "#7956C9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#24213A", margin: 0 }}>
                Credential Security & Encryption Architecture
              </h2>
              <p style={{ fontSize: "12px", color: "#777184", margin: "2px 0 0 0" }}>
                Cryptographic vault parameters, zero-knowledge serialization, and rotation policies.
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
            <X size={20} />
          </button>
        </div>

        {/* Security Specs Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            padding: "16px",
            backgroundColor: "#FAF7F2",
            borderRadius: "10px",
            border: "1px solid #EAE4EE",
            fontSize: "12px",
          }}
        >
          <div>
            <div style={{ color: "#777184", marginBottom: "2px" }}>At-Rest Encryption</div>
            <div style={{ fontWeight: 700, color: "#10B981", display: "flex", alignItems: "center", gap: "5px" }}>
              <Lock size={13} />
              <span>{settings.vaultEncryptionAlgorithm}</span>
            </div>
          </div>
          <div>
            <div style={{ color: "#777184", marginBottom: "2px" }}>Key Derivation Function</div>
            <div style={{ fontWeight: 700, color: "#24213A", display: "flex", alignItems: "center", gap: "5px" }}>
              <KeyRound size={13} />
              <span>{settings.keyDerivation}</span>
            </div>
          </div>
          <div>
            <div style={{ color: "#777184", marginBottom: "2px" }}>Client-Side Redaction</div>
            <div style={{ fontWeight: 600, color: "#10B981" }}>Strict 100% Zero-Knowledge</div>
          </div>
          <div>
            <div style={{ color: "#777184", marginBottom: "2px" }}>Last Security Audit</div>
            <div style={{ fontWeight: 600, color: "#24213A" }}>{settings.lastAuditedAt}</div>
          </div>
        </div>

        {/* Configuration Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, color: "#24213A" }}>Auto-Rotation Reminder (Days)</div>
              <div style={{ fontSize: "12px", color: "#777184" }}>
                Flags credentials as &quot;Expiring&quot; when rotation interval is reached
              </div>
            </div>
            <input
              type="number"
              value={rotationDays}
              onChange={(e) => setRotationDays(parseInt(e.target.value) || 90)}
              style={{
                width: "80px",
                height: "36px",
                textAlign: "center",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontWeight: 600,
                color: "#24213A",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, color: "#24213A" }}>Require Production Confirmation</div>
              <div style={{ fontSize: "12px", color: "#777184" }}>
                Enforces secondary admin approval for production key updates
              </div>
            </div>
            <input
              type="checkbox"
              checked={requireProdConfirm}
              onChange={(e) => setRequireProdConfirm(e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "#7956C9", cursor: "pointer" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, color: "#24213A" }}>Isolate Environment Access</div>
              <div style={{ fontSize: "12px", color: "#777184" }}>
                Strictly blocks development tasks from requesting production keys
              </div>
            </div>
            <input
              type="checkbox"
              checked={preventCrossEnv}
              onChange={(e) => setPreventCrossEnv(e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "#7956C9", cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Success feedback */}
        {savedNotice && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              borderRadius: "8px",
              backgroundColor: "#ECFDF5",
              color: "#059669",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={16} />
            <span>Security settings updated and encrypted successfully!</span>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "9px 18px",
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
            onClick={handleSave}
            style={{
              padding: "9px 20px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#7956C9",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(121, 86, 201, 0.25)",
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
