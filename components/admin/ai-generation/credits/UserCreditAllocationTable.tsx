"use client";

import React, { useState } from "react";
import { Users, Search, MoreVertical, PlusCircle, History } from "lucide-react";
import type { UserCreditAccount } from "@/lib/ai-credits";
import { formatCredits } from "@/lib/ai-credits";

interface UserCreditAllocationTableProps {
  users: UserCreditAccount[];
  onSelectUserForAllocation: (user: UserCreditAccount) => void;
  onViewUserTransactions?: (user: UserCreditAccount) => void;
}

export function UserCreditAllocationTable({
  users,
  onSelectUserForAllocation,
  onViewUserTransactions,
}: UserCreditAllocationTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || u.status === statusFilter;
    const matchesPlan =
      planFilter === "All Plans" || u.planName === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
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
            <Users size={16} strokeWidth={2.2} />
          </div>
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#24213A",
              margin: 0,
            }}
          >
            User Credit Allocation
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Search input */}
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
              placeholder="Search users..."
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

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "6px 12px",
              backgroundColor: "#FAF7F2",
              border: "1px solid #EAE4EE",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#24213A",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="All Status">All Status ▾</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending">Pending</option>
          </select>

          {/* Plans filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            style={{
              padding: "6px 12px",
              backgroundColor: "#FAF7F2",
              border: "1px solid #EAE4EE",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#24213A",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="All Plans">All Plans ▾</option>
            <option value="Starter">Starter</option>
            <option value="Creator">Creator</option>
            <option value="Professional">Professional</option>
            <option value="Business">Business</option>
          </select>
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
              <th style={{ padding: "12px 18px" }}>User</th>
              <th style={{ padding: "12px 16px" }}>Account / Email</th>
              <th style={{ padding: "12px 16px" }}>Purchased Credits</th>
              <th style={{ padding: "12px 16px" }}>Promotional Credits</th>
              <th style={{ padding: "12px 16px" }}>Admin Granted</th>
              <th style={{ padding: "12px 16px" }}>Credits Used</th>
              <th style={{ padding: "12px 16px" }}>Available Balance</th>
              <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const initials = user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <tr
                  key={user.userId}
                  style={{
                    borderBottom: "1px solid #F3EDF7",
                    fontSize: "12.5px",
                    color: "#24213A",
                  }}
                >
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "#F4EFFC",
                          color: "#7956C9",
                          fontSize: "11px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #E8DFF5",
                          flexShrink: 0,
                        }}
                      >
                        {initials}
                      </div>
                      <span style={{ fontWeight: 600 }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#645D73" }}>
                    {user.email}
                  </td>
                  <td style={{ padding: "14px 16px", fontWeight: 600 }}>
                    {formatCredits(user.purchasedCredits)}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#645D73" }}>
                    {formatCredits(user.promotionalCredits)}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#645D73" }}>
                    {formatCredits(user.adminGrantedCredits)}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#645D73" }}>
                    {formatCredits(user.creditsUsed)}
                  </td>
                  <td style={{ padding: "14px 16px", fontWeight: 700, color: "#7956C9" }}>
                    {formatCredits(user.availableBalance)}
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
                        onClick={() => onSelectUserForAllocation(user)}
                        title="Allocate Credits"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "4px 8px",
                          backgroundColor: "#FAF7F2",
                          border: "1px solid #EAE4EE",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#7956C9",
                          cursor: "pointer",
                        }}
                      >
                        <PlusCircle size={12} />
                        <span>Allocate</span>
                      </button>
                      {onViewUserTransactions && (
                        <button
                          type="button"
                          onClick={() => onViewUserTransactions(user)}
                          title="View Ledger"
                          style={{
                            background: "none",
                            border: "none",
                            padding: "4px",
                            cursor: "pointer",
                            color: "#777184",
                          }}
                        >
                          <History size={14} />
                        </button>
                      )}
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
          Showing 1 to {filteredUsers.length} of {users.length} users
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
