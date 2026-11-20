"use client";

import React, { useState } from "react";
import { History, X, Search, Filter } from "lucide-react";
import type { CredentialAuditEvent } from "@/lib/ai-credentials";

interface CredentialAuditModalProps {
  isOpen: boolean;
  auditEvents: CredentialAuditEvent[];
  onClose: () => void;
}

export const CredentialAuditModal: React.FC<CredentialAuditModalProps> = ({
  isOpen,
  auditEvents,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  if (!isOpen) return null;

  const filtered = auditEvents.filter((ev) => {
    const matchesSearch =
      ev.adminOrService.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.credentialReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === "all" || ev.action === actionFilter;
    return matchesSearch && matchesAction;
  });

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
          maxWidth: "840px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #EAE4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "#F4EFFC",
                color: "#7956C9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <History size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#24213A", margin: 0 }}>
                Credential Audit History & Access Log
              </h2>
              <p style={{ fontSize: "12px", color: "#777184", margin: "2px 0 0 0" }}>
                Immutable audit trail of all AI provider key updates, rotations, and verification events.
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

        {/* Filters Toolbar */}
        <div
          style={{
            padding: "14px 24px",
            backgroundColor: "#FAF7F2",
            borderBottom: "1px solid #EAE4EE",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
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
              placeholder="Search audit events by admin, key ref, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                height: "36px",
                paddingLeft: "36px",
                paddingRight: "12px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontSize: "13px",
                color: "#24213A",
                backgroundColor: "#FFFFFF",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Filter size={15} color="#777184" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
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
              <option value="all">All Actions</option>
              <option value="Credential Rotated">Credential Rotated</option>
              <option value="Verification Attempted">Verification Attempted</option>
              <option value="Credential Updated">Credential Updated</option>
              <option value="Credential Added">Credential Added</option>
              <option value="Credential Revoked">Credential Revoked</option>
            </select>
          </div>
        </div>

        {/* Audit Table */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #EAE4EE", position: "sticky", top: 0 }}>
                <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Timestamp</th>
                <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Actor / Service</th>
                <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Reference</th>
                <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Action</th>
                <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Result</th>
                <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #EAE4EE", fontSize: "12px" }}>
                  <td style={{ padding: "12px 20px", whiteSpace: "nowrap", color: "#24213A" }}>{item.timestamp}</td>
                  <td style={{ padding: "12px 20px", fontWeight: 600, color: "#24213A" }}>{item.adminOrService}</td>
                  <td style={{ padding: "12px 20px", fontFamily: "monospace", color: "#24213A" }}>
                    {item.credentialReference}
                  </td>
                  <td style={{ padding: "12px 20px", color: "#24213A" }}>{item.action}</td>
                  <td style={{ padding: "12px 20px" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: 600,
                        backgroundColor: item.result === "Success" ? "#ECFDF5" : "#FEF2F2",
                        color: item.result === "Success" ? "#059669" : "#DC2626",
                      }}
                    >
                      {item.result}
                    </span>
                  </td>
                  <td style={{ padding: "12px 20px", color: "#777184" }}>{item.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid #EAE4EE",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
          }}
        >
          <span style={{ fontSize: "12px", color: "#777184" }}>
            Showing {filtered.length} audit records • Encrypted AES-256-GCM Vault
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "7px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#7956C9",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
