"use client";

import React from "react";
import { Info } from "lucide-react";
import type { ProviderCredential } from "@/lib/ai-credentials";

interface CredentialDetailsCardProps {
  credential: ProviderCredential | null;
}

export const CredentialDetailsCard: React.FC<CredentialDetailsCardProps> = ({
  credential,
}) => {
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
        Select a credential to view details.
      </div>
    );
  }

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
          <Info size={16} />
        </div>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
          }}
        >
          Credential Details
        </h2>
      </div>

      {/* Details List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Provider:</span>
          <span style={{ fontWeight: 600, color: "#24213A" }}>{credential.providerName}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Credential Reference:</span>
          <span style={{ fontFamily: "monospace", fontWeight: 600, color: "#24213A" }}>
            {credential.maskedReference}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Environment:</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#10B981", fontWeight: 600 }}>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: credential.environment === "Production" ? "#10B981" : "#3B82F6",
              }}
            />
            {credential.environment}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Authentication Type:</span>
          <span style={{ color: "#24213A" }}>{credential.authType}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Associated Models:</span>
          <span style={{ color: "#24213A", fontWeight: 500 }}>{credential.associatedModels}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Created:</span>
          <span style={{ color: "#777184" }}>{credential.createdAt}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Last Updated:</span>
          <span style={{ color: "#777184" }}>{credential.lastUpdated}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Status:</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "2px 8px",
              borderRadius: "10px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: credential.status === "Active" ? "#ECFDF5" : "#FFFBEB",
              color: credential.status === "Active" ? "#059669" : "#D97706",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                backgroundColor: credential.status === "Active" ? "#059669" : "#D97706",
              }}
            />
            {credential.status}
          </span>
        </div>
      </div>
    </div>
  );
};
