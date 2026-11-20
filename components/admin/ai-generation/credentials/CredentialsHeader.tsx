"use client";

import React from "react";
import { Zap, Plus, History, Shield } from "lucide-react";

interface CredentialsHeaderProps {
  onAddCredential: () => void;
  onOpenAuditHistory: () => void;
  onOpenSecuritySettings: () => void;
  isDrawerOpen?: boolean;
}

export const CredentialsHeader: React.FC<CredentialsHeaderProps> = ({
  onAddCredential,
  onOpenAuditHistory,
  onOpenSecuritySettings,
  isDrawerOpen = false,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      {/* Title & Icon */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            backgroundColor: "#7956C9",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 4px rgba(121, 86, 201, 0.25)",
          }}
        >
          <Zap size={20} fill="#FFFFFF" />
        </div>
        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#24213A",
              letterSpacing: "-0.02em",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            API Access Keys & Credential Management
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#777184",
              margin: "3px 0 0 0",
            }}
          >
            Securely manage AI provider credentials, key rotation, credential access and integration status.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* + Add Credential Button */}
        <button
          type="button"
          onClick={onAddCredential}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "9px 18px",
            borderRadius: "9px",
            fontSize: "13px",
            fontWeight: 600,
            backgroundColor: isDrawerOpen ? "#6948b8" : "#7956C9",
            color: "#FFFFFF",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(121, 86, 201, 0.25)",
            transition: "all 0.15s ease",
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Credential</span>
        </button>

        {/* Credential Audit History Button */}
        <button
          type="button"
          onClick={onOpenAuditHistory}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "9px 16px",
            borderRadius: "9px",
            fontSize: "13px",
            fontWeight: 600,
            backgroundColor: "#FFFFFF",
            color: "#7956C9",
            border: "1px solid #7956C9",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <History size={15} />
          <span>Credential Audit History</span>
        </button>

        {/* Security Settings Button */}
        <button
          type="button"
          onClick={onOpenSecuritySettings}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "9px 16px",
            borderRadius: "9px",
            fontSize: "13px",
            fontWeight: 600,
            backgroundColor: "#FFFFFF",
            color: "#7956C9",
            border: "1px solid #7956C9",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <Shield size={15} />
          <span>Security Settings</span>
        </button>
      </div>
    </div>
  );
};
