"use client";

import React from "react";
import {
  Home,
  FileText,
  Sparkles,
  Calendar,
  User,
  Settings,
  Edit2,
  Check,
  AlertCircle,
} from "lucide-react";
import { AppScreen } from "@/lib/screens";

interface ScreenConfigHeaderProps {
  screen: AppScreen;
  onEditDetails: () => void;
}

const ICON_MAP = {
  Home,
  FileText,
  Sparkles,
  Calendar,
  User,
  Settings,
};

export const ScreenConfigHeader: React.FC<ScreenConfigHeaderProps> = ({
  screen,
  onEditDetails,
}) => {
  const Icon = ICON_MAP[screen.iconName] || FileText;
  const isConfigured = screen.status === "configured";

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        padding: "18px 24px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
        flexWrap: "wrap",
      }}
      className="screen-config-header"
    >
      {/* Left: Icon + Name + Key */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            backgroundColor: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={22} strokeWidth={1.9} />
        </div>

        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--text)",
              margin: "0 0 2px 0",
              letterSpacing: "-0.015em",
            }}
          >
            {screen.name}
          </h2>
          <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
            Screen key: <code style={{ color: "var(--text)" }}>{screen.key}</code>
          </div>
        </div>
      </div>

      {/* Middle Group: Category, Route, Status */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "36px",
          flexWrap: "wrap",
        }}
        className="screen-config-meta"
      >
        {/* Category */}
        <div>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginBottom: "3px" }}>
            Category
          </div>
          <span
            style={{
              display: "inline-block",
              padding: "2px 10px",
              borderRadius: "12px",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {screen.category}
          </span>
        </div>

        {/* Route */}
        <div>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginBottom: "3px" }}>
            Route
          </div>
          <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)" }}>
            {screen.route}
          </div>
        </div>

        {/* Status */}
        <div>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginBottom: "3px" }}>
            Status
          </div>
          {isConfigured ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--success)",
              }}
            >
              <Check size={14} strokeWidth={2.5} />
              <span>Configured</span>
            </div>
          ) : (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "#D97706",
              }}
            >
              <AlertCircle size={14} strokeWidth={2.5} />
              <span>Needs setup</span>
            </div>
          )}
        </div>
      </div>

      {/* Far Right: Edit Details Action */}
      <div>
        <button
          type="button"
          onClick={onEditDetails}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "7px 14px",
            fontSize: "12.5px",
            fontWeight: 500,
            color: "var(--text)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          className="edit-details-btn"
        >
          <Edit2 size={13} style={{ color: "var(--primary)" }} />
          <span>Edit Details</span>
        </button>
      </div>

      <style jsx global>{`
        .edit-details-btn:hover {
          border-color: var(--primary) !important;
          color: var(--primary) !important;
          background-color: var(--primary-light) !important;
        }
      `}</style>
    </div>
  );
};
