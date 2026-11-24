"use client";

import React, { useState } from "react";
import {
  Crown,
  Search,
  Filter,
  Pencil,
  Copy,
  MoreVertical,
  Check,
  Archive,
} from "lucide-react";
import type { CreditPlan } from "@/lib/ai-credits";
import { formatCredits } from "@/lib/ai-credits";

interface CreditPlansTableProps {
  plans: CreditPlan[];
  onEditPlan: (plan: CreditPlan) => void;
  onDuplicatePlan: (planId: string) => void;
  onToggleStatus: (planId: string) => void;
  onArchivePlan: (planId: string) => void;
}

export function CreditPlansTable({
  plans,
  onEditPlan,
  onDuplicatePlan,
  onToggleStatus,
  onArchivePlan,
}: CreditPlansTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredPlans = plans.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || p.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        overflow: "hidden",
        marginBottom: "20px",
      }}
    >
      {/* Header & Controls */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          borderBottom: "1px solid #EAE4EE",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "#FAF7F2",
              border: "1px solid #E8DFF5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7956C9",
              flexShrink: 0,
            }}
          >
            <Crown size={16} strokeWidth={2.2} />
          </div>
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#24213A",
              margin: 0,
            }}
          >
            Credit Plans
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Search plans */}
          <div style={{ position: "relative" }}>
            <Search
              size={14}
              color="#777184"
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plans..."
              style={{
                paddingLeft: "32px",
                paddingRight: "12px",
                paddingTop: "6px",
                paddingBottom: "6px",
                backgroundColor: "#FAF7F2",
                border: "1px solid #EAE4EE",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#24213A",
                outline: "none",
                width: "180px",
              }}
            />
          </div>

          {/* Filter dropdown */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                backgroundColor: "#FAF7F2",
                border: "1px solid #EAE4EE",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#24213A",
                cursor: "pointer",
              }}
            >
              <Filter size={13} color="#777184" />
              <span>Filter ▾</span>
            </button>

            {isFilterOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  marginTop: "6px",
                  width: "140px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "10px",
                  border: "1px solid #EAE4EE",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
                  padding: "4px 0",
                  zIndex: 20,
                  fontSize: "12px",
                }}
              >
                {["All", "Active", "Draft", "Archived"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setStatusFilter(st);
                      setIsFilterOpen(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "6px 12px",
                      backgroundColor: "transparent",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontWeight: statusFilter === st ? 700 : 500,
                      color: statusFilter === st ? "#7956C9" : "#24213A",
                      cursor: "pointer",
                    }}
                  >
                    <span>{st}</span>
                    {statusFilter === st && <Check size={13} color="#7956C9" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                backgroundColor: "#FAF7F2",
                color: "#777184",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                borderBottom: "1px solid #EAE4EE",
              }}
            >
              <th style={{ padding: "12px 18px" }}>Plan Name</th>
              <th style={{ padding: "12px 16px" }}>Credits Included</th>
              <th style={{ padding: "12px 16px" }}>Validity</th>
              <th style={{ padding: "12px 16px" }}>Plan Type</th>
              <th style={{ padding: "12px 16px" }}>Status</th>
              <th style={{ padding: "12px 16px" }}>Last Updated</th>
              <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlans.map((plan) => {
              const statusBg =
                plan.status === "Active"
                  ? "#ECFDF5"
                  : plan.status === "Draft"
                    ? "#FEF3C7"
                    : "#F3F4F6";
              const statusColor =
                plan.status === "Active"
                  ? "#10B981"
                  : plan.status === "Draft"
                    ? "#D97706"
                    : "#6B7280";
              const statusBorder =
                plan.status === "Active"
                  ? "#A7F3D0"
                  : plan.status === "Draft"
                    ? "#FDE68A"
                    : "#E5E7EB";

              return (
                <tr
                  key={plan.id}
                  style={{
                    borderBottom: "1px solid #F3EDF7",
                    fontSize: "12.5px",
                    color: "#24213A",
                  }}
                >
                  <td style={{ padding: "14px 18px", fontWeight: 600 }}>
                    {plan.name}
                  </td>
                  <td style={{ padding: "14px 16px", fontWeight: 600 }}>
                    {formatCredits(plan.credits)}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#645D73" }}>
                    {plan.validityDays ? `${plan.validityDays} Days` : "Lifetime"}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#645D73" }}>
                    {plan.type}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor: statusBg,
                        color: statusColor,
                        border: `1px solid ${statusBorder}`,
                      }}
                    >
                      {plan.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#777184" }}>
                    {plan.updatedAt ? new Date(plan.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </td>
                  <td style={{ padding: "14px 18px", textAlign: "right" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => onEditPlan(plan)}
                        title="Edit Plan"
                        style={{
                          background: "none",
                          border: "none",
                          padding: "4px",
                          cursor: "pointer",
                          color: "#777184",
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicatePlan(plan.id)}
                        title="Duplicate Plan"
                        style={{
                          background: "none",
                          border: "none",
                          padding: "4px",
                          cursor: "pointer",
                          color: "#777184",
                        }}
                      >
                        <Copy size={14} />
                      </button>
                      <div style={{ position: "relative" }}>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId(activeMenuId === plan.id ? null : plan.id)
                          }
                          title="More options"
                          style={{
                            background: "none",
                            border: "none",
                            padding: "4px",
                            cursor: "pointer",
                            color: "#777184",
                          }}
                        >
                          <MoreVertical size={14} />
                        </button>
                        {activeMenuId === plan.id && (
                          <div
                            style={{
                              position: "absolute",
                              right: 0,
                              top: "100%",
                              backgroundColor: "#FFFFFF",
                              border: "1px solid #EAE4EE",
                              boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                              borderRadius: "8px",
                              padding: "4px 0",
                              zIndex: 10,
                              minWidth: "120px",
                              textAlign: "left",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                onToggleStatus(plan.id);
                                setActiveMenuId(null);
                              }}
                              style={{
                                width: "100%",
                                padding: "6px 12px",
                                background: "none",
                                border: "none",
                                textAlign: "left",
                                fontSize: "12px",
                                color: "#24213A",
                                cursor: "pointer",
                              }}
                            >
                              Toggle Status
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onArchivePlan(plan.id);
                                setActiveMenuId(null);
                              }}
                              style={{
                                width: "100%",
                                padding: "6px 12px",
                                background: "none",
                                border: "none",
                                textAlign: "left",
                                fontSize: "12px",
                                color: "#EF4444",
                                cursor: "pointer",
                              }}
                            >
                              Archive
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        style={{
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #EAE4EE",
          fontSize: "12px",
          color: "#777184",
        }}
      >
        <span>
          Showing 1 to {filteredPlans.length} of {plans.length} plans
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "6px",
              backgroundColor: "#7956C9",
              color: "#FFFFFF",
              fontSize: "11px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            1
          </span>
        </div>
      </div>
    </div>
  );
}
