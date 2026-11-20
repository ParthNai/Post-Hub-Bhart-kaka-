"use client";

import React, { useState } from "react";
import { ListFilter, Edit2, MoreVertical, CheckCircle, PauseCircle, Trash2 } from "lucide-react";
import type { RateLimitPolicy } from "@/lib/ai-rate-limits";

interface PolicyOverviewTableProps {
  policies: RateLimitPolicy[];
  selectedPolicyId: string | null;
  onSelectPolicy: (policy: RateLimitPolicy) => void;
  onToggleStatus: (policyId: string) => void;
  onDeletePolicy?: (policyId: string) => void;
}

export const PolicyOverviewTable: React.FC<PolicyOverviewTableProps> = ({
  policies,
  selectedPolicyId,
  onSelectPolicy,
  onToggleStatus,
  onDeletePolicy,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
      }}
    >
      {/* Title */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #EAE4EE",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <ListFilter size={16} color="#7956C9" />
        <span style={{ fontSize: "14px", fontWeight: 700, color: "#24213A" }}>
          Rate-Limit Policy Overview
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12.5px",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#FAF9FD", borderBottom: "1px solid #EAE4EE" }}>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600 }}>Policy Name</th>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600 }}>Policy Scope</th>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600 }}>API Endpoint</th>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600 }}>Request Limit</th>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600 }}>Time Window</th>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600 }}>Burst Allowance</th>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600 }}>Policy Status</th>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600 }}>Last Updated</th>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600, textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p) => {
              const isSelected = selectedPolicyId === p.id;
              const isActive = p.status === "Active";

              return (
                <tr
                  key={p.id}
                  onClick={() => onSelectPolicy(p)}
                  style={{
                    borderBottom: "1px solid #F1EDF5",
                    backgroundColor: isSelected ? "#FBF9FE" : "transparent",
                    cursor: "pointer",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  <td style={{ padding: "12px 14px", color: "#24213A", fontWeight: 600 }}>
                    {p.name}
                  </td>

                  <td style={{ padding: "12px 14px", color: "#544E61" }}>
                    {p.scope}
                  </td>

                  <td style={{ padding: "12px 14px", color: "#24213A", fontFamily: "monospace" }}>
                    {p.endpoint}
                  </td>

                  <td style={{ padding: "12px 14px", color: "#24213A", fontWeight: 600 }}>
                    {p.requestLimit.toLocaleString()}
                  </td>

                  <td style={{ padding: "12px 14px", color: "#544E61" }}>
                    {p.timeWindow}
                  </td>

                  <td style={{ padding: "12px 14px", color: "#544E61" }}>
                    {p.burstAllowance}
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <span
                        style={{
                          backgroundColor: isActive ? "#EAFBF0" : "#FEF3C7",
                          color: isActive ? "#1E824C" : "#D97706",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span
                          style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            backgroundColor: isActive ? "#10B981" : "#F59E0B",
                          }}
                        />
                        <span>{p.status}</span>
                      </span>
                    </div>
                  </td>

                  <td style={{ padding: "12px 14px", color: "#777184", whiteSpace: "nowrap" }}>
                    {p.lastUpdated}
                  </td>

                  <td style={{ padding: "12px 14px", textAlign: "center" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        position: "relative",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        title="Edit policy in configuration form"
                        onClick={() => onSelectPolicy(p)}
                        style={{
                          padding: "4px",
                          borderRadius: "4px",
                          border: "none",
                          background: "none",
                          color: "#777184",
                          cursor: "pointer",
                        }}
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        type="button"
                        title="More actions"
                        onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                        style={{
                          padding: "4px",
                          borderRadius: "4px",
                          border: "none",
                          background: "none",
                          color: "#777184",
                          cursor: "pointer",
                        }}
                      >
                        <MoreVertical size={14} />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === p.id && (
                        <div
                          style={{
                            position: "absolute",
                            right: 0,
                            top: "100%",
                            backgroundColor: "#FFFFFF",
                            borderRadius: "8px",
                            border: "1px solid #EAE4EE",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            padding: "4px",
                            zIndex: 10,
                            minWidth: "140px",
                            textAlign: "left",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onToggleStatus(p.id);
                              setOpenMenuId(null);
                            }}
                            style={{
                              width: "100%",
                              padding: "6px 10px",
                              borderRadius: "4px",
                              border: "none",
                              background: "none",
                              color: "#24213A",
                              fontSize: "12px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            {isActive ? <PauseCircle size={13} color="#D97706" /> : <CheckCircle size={13} color="#10B981" />}
                            <span>{isActive ? "Pause Policy" : "Activate Policy"}</span>
                          </button>

                          {onDeletePolicy && (
                            <button
                              type="button"
                              onClick={() => {
                                onDeletePolicy(p.id);
                                setOpenMenuId(null);
                              }}
                              style={{
                                width: "100%",
                                padding: "6px 10px",
                                borderRadius: "4px",
                                border: "none",
                                background: "none",
                                color: "#DC2626",
                                fontSize: "12px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <Trash2 size={13} />
                              <span>Delete Policy</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
