"use client";

import React, { useState } from "react";
import { Shield, Search, MoreVertical, RefreshCw, CheckCircle2, Trash2, XCircle } from "lucide-react";
import type { ProviderCredential } from "@/lib/ai-credentials";
import { ProviderIcon } from "./ProviderLogos";

interface ProviderCredentialsTableProps {
  credentials: ProviderCredential[];
  selectedId: string;
  onSelectCredential: (id: string) => void;
  onRotateKey: (id: string) => void;
  onVerifyKey: (id: string) => void;
  onRevokeKey: (id: string) => void;
  onDeleteKey: (id: string) => void;
}

export const ProviderCredentialsTable: React.FC<ProviderCredentialsTableProps> = ({
  credentials,
  selectedId,
  onSelectCredential,
  onRotateKey,
  onVerifyKey,
  onRevokeKey,
  onDeleteKey,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredCredentials = credentials.filter((cred) => {
    const matchesSearch =
      cred.credentialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.maskedReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.environment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProvider =
      providerFilter === "all" || cred.providerId.toLowerCase() === providerFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all" || cred.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesProvider && matchesStatus;
  });

  const getStatusBadge = (status: ProviderCredential["status"]) => {
    switch (status) {
      case "Active":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "#ECFDF5",
              color: "#059669",
              border: "1px solid #A7F3D0",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#059669",
              }}
            />
            Active
          </span>
        );
      case "Expiring":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "#FFFBEB",
              color: "#D97706",
              border: "1px solid #FDE68A",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#D97706",
              }}
            />
            Expiring
          </span>
        );
      case "Revoked":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "#FEF2F2",
              color: "#DC2626",
              border: "1px solid #FECACA",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#DC2626",
              }}
            />
            Revoked
          </span>
        );
      default:
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "#EFF6FF",
              color: "#2563EB",
              border: "1px solid #BFDBFE",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#2563EB",
              }}
            />
            {status}
          </span>
        );
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        overflow: "hidden",
        marginBottom: "24px",
      }}
    >
      {/* Top Header & Search/Filter Toolbar */}
      <div
        style={{
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          borderBottom: "1px solid #EAE4EE",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
              fontSize: "16px",
              fontWeight: 700,
              color: "#24213A",
              margin: 0,
            }}
          >
            Provider Credentials
          </h2>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* Search box */}
          <div style={{ position: "relative" }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#777184",
              }}
            />
            <input
              type="text"
              placeholder="Search credentials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                height: "36px",
                paddingLeft: "36px",
                paddingRight: "14px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontSize: "13px",
                color: "#24213A",
                backgroundColor: "#FFFFFF",
                outline: "none",
                minWidth: "220px",
              }}
            />
          </div>

          {/* All Providers Filter */}
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            style={{
              height: "36px",
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
            <option value="all">All Providers</option>
            <option value="openai">OpenAI</option>
            <option value="gemini">Gemini</option>
            <option value="stability">Stability AI</option>
            <option value="replicate">Replicate</option>
          </select>

          {/* All Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              height: "36px",
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
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#FAF7F2", borderBottom: "1px solid #EAE4EE" }}>
              <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Provider</th>
              <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Credential Name</th>
              <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Credential Reference</th>
              <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Environment</th>
              <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Authentication Type</th>
              <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Credential Status</th>
              <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Last Updated</th>
              <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Last Rotation</th>
              <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCredentials.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: "36px", textAlign: "center", color: "#777184", fontSize: "13px" }}>
                  No credentials found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filteredCredentials.map((cred) => {
                const isSelected = cred.id === selectedId;
                return (
                  <tr
                    key={cred.id}
                    onClick={() => onSelectCredential(cred.id)}
                    style={{
                      borderBottom: "1px solid #EAE4EE",
                      backgroundColor: isSelected ? "#F8F5FD" : "#FFFFFF",
                      cursor: "pointer",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    {/* Provider */}
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <ProviderIcon providerId={cred.providerId} size={22} />
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>
                          {cred.providerName}
                        </span>
                      </div>
                    </td>

                    {/* Credential Name */}
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#24213A", fontWeight: 500 }}>
                      {cred.credentialName}
                    </td>

                    {/* Masked Reference */}
                    <td style={{ padding: "14px 20px" }}>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: "13px",
                          letterSpacing: "0.05em",
                          color: "#24213A",
                          fontWeight: 600,
                        }}
                      >
                        {cred.maskedReference}
                      </span>
                    </td>

                    {/* Environment */}
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#24213A" }}>
                      {cred.environment}
                    </td>

                    {/* Authentication Type */}
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#777184" }}>
                      {cred.authType}
                    </td>

                    {/* Credential Status */}
                    <td style={{ padding: "14px 20px" }}>
                      {getStatusBadge(cred.status)}
                    </td>

                    {/* Last Updated */}
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#777184" }}>
                      {cred.lastUpdated.split(",")[0] || cred.lastUpdated}
                    </td>

                    {/* Last Rotation */}
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#777184" }}>
                      {cred.lastRotation.split(",")[0] || cred.lastRotation}
                    </td>

                    {/* Actions Kebab Menu */}
                    <td style={{ padding: "14px 20px", textAlign: "center", position: "relative" }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === cred.id ? null : cred.id);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#777184",
                          padding: "4px",
                          borderRadius: "4px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === cred.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: "absolute",
                            right: "20px",
                            top: "40px",
                            backgroundColor: "#FFFFFF",
                            borderRadius: "10px",
                            border: "1px solid #EAE4EE",
                            boxShadow: "0 4px 14px rgba(36, 33, 58, 0.12)",
                            zIndex: 40,
                            minWidth: "170px",
                            padding: "6px 0",
                            textAlign: "left",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onRotateKey(cred.id);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              width: "100%",
                              padding: "8px 14px",
                              fontSize: "12px",
                              color: "#24213A",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <RefreshCw size={13} color="#7956C9" />
                            <span>Rotate Key</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onVerifyKey(cred.id);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              width: "100%",
                              padding: "8px 14px",
                              fontSize: "12px",
                              color: "#24213A",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <CheckCircle2 size={13} color="#10B981" />
                            <span>Verify Key</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onRevokeKey(cred.id);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              width: "100%",
                              padding: "8px 14px",
                              fontSize: "12px",
                              color: "#D97706",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <XCircle size={13} color="#D97706" />
                            <span>Revoke Key</span>
                          </button>

                          <div style={{ height: "1px", backgroundColor: "#EAE4EE", margin: "4px 0" }} />

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDeleteKey(cred.id);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              width: "100%",
                              padding: "8px 14px",
                              fontSize: "12px",
                              color: "#EF4444",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 size={13} color="#EF4444" />
                            <span>Delete Credential</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
