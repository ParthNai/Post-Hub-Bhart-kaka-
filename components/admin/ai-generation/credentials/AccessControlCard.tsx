"use client";

import React from "react";
import { Shield, Info } from "lucide-react";
import type { ProviderCredential } from "@/lib/ai-credentials";

interface AccessControlCardProps {
  credential: ProviderCredential | null;
}

export const AccessControlCard: React.FC<AccessControlCardProps> = ({
  credential,
}) => {
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
          <Shield size={16} />
        </div>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
          }}
        >
          Access Control
        </h2>
      </div>

      {/* Access Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Authorized Service:</span>
          <span style={{ fontWeight: 600, color: "#24213A" }}>
            {credential ? credential.authorizedService : "AI Generation Service"}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Allowed Operations:</span>
          <span style={{ color: "#24213A", fontWeight: 500 }}>
            {credential ? credential.allowedOperations : "Read, Generate"}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Environment Scope:</span>
          <span style={{ color: "#24213A", fontWeight: 500 }}>
            {credential ? credential.environment : "Production"}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Access Policy:</span>
          <span style={{ color: "#24213A", fontWeight: 500 }}>
            {credential ? credential.accessPolicy : "Role Based Access"}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Last Access Event:</span>
          <span style={{ color: "#777184" }}>
            {credential ? credential.lastAccessEvent : "Nov 19, 2025, 10:20 AM"}
          </span>
        </div>

        {/* Info Box Callout */}
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 14px",
            borderRadius: "8px",
            backgroundColor: "#F8F5FD",
            border: "1px solid #EAE4EE",
            color: "#7956C9",
            fontSize: "12px",
            lineHeight: 1.4,
          }}
        >
          <Info size={15} style={{ flexShrink: 0 }} />
          <span>Only authorized services can access these credentials.</span>
        </div>
      </div>
    </div>
  );
};
