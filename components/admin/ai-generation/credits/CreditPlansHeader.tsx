"use client";

import React from "react";
import Link from "next/link";
import { Coins, Download, Settings, Plus, Bell, ChevronDown } from "lucide-react";

interface CreditPlansHeaderProps {
  onExportTransactions: () => void;
  onOpenSettings: () => void;
  onCreatePlan: () => void;
  userName?: string;
  isExporting?: boolean;
}

export function CreditPlansHeader({
  onExportTransactions,
  onOpenSettings,
  onCreatePlan,
  userName = "Parth Patel",
  isExporting = false,
}: CreditPlansHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        marginBottom: "16px",
      }}
    >
      {/* Top Meta Bar: Breadcrumbs & Admin Profile */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Breadcrumbs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12.5px",
            color: "#777184",
          }}
        >
          <Link
            href="/admin/dashboard"
            style={{ color: "#777184", textDecoration: "none" }}
          >
            Dashboard
          </Link>
          <span style={{ opacity: 0.4 }}>/</span>
          <Link
            href="/admin/ai-generation"
            style={{ color: "#777184", textDecoration: "none" }}
          >
            AI Image Generation
          </Link>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ color: "#7956C9", fontWeight: 600 }}>
            Credit Plans &amp; User Allocation
          </span>
        </div>

        {/* Right profile chip & notification bell */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            type="button"
            title="Notifications"
            style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              color: "#777184",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                width: "7px",
                height: "7px",
                backgroundColor: "#EF4444",
                borderRadius: "50%",
                border: "2px solid #FFFFFF",
              }}
            />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "4px 10px 4px 6px",
              borderRadius: "20px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE4EE",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "#7956C9",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "PP"}
            </div>
            <span
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: "#24213A",
              }}
            >
              {userName}
            </span>
            <ChevronDown size={14} color="#777184" />
          </div>
        </div>
      </div>

      {/* Main Page Title and Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              backgroundColor: "#FAF7F2",
              border: "1px solid #E8DFF5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7956C9",
              flexShrink: 0,
              boxShadow: "0 2px 5px rgba(121, 86, 201, 0.12)",
            }}
          >
            <Coins size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#24213A",
                margin: 0,
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
              }}
            >
              Credit Plans &amp; User Allocation
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "#777184",
                margin: "4px 0 0 0",
              }}
            >
              Configure generation credits, manage user balances and review credit transactions.
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {/* Export Transactions Button */}
          <button
            onClick={onExportTransactions}
            disabled={isExporting}
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 15px",
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE4EE",
              color: "#24213A",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: isExporting ? "not-allowed" : "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
            }}
          >
            <Download size={15} color="#7956C9" />
            <span>{isExporting ? "Exporting..." : "Export Transactions"}</span>
          </button>

          {/* Credit Settings Button */}
          <button
            onClick={onOpenSettings}
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 15px",
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE4EE",
              color: "#24213A",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
            }}
          >
            <Settings size={15} color="#7956C9" />
            <span>Credit Settings</span>
          </button>

          {/* Create Plan Button */}
          <button
            onClick={onCreatePlan}
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 16px",
              borderRadius: "10px",
              backgroundColor: "#7956C9",
              border: "1px solid #7956C9",
              color: "#FFFFFF",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(121, 86, 201, 0.35)",
              transition: "all 0.15s ease",
            }}
          >
            <Plus size={16} strokeWidth={2.4} />
            <span>Create Credit Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
