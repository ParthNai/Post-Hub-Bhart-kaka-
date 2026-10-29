"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  FileText,
  Sparkles,
  Calendar,
  User,
  Settings,
  Check,
  AlertCircle,
  MoreVertical,
  Sliders,
} from "lucide-react";
import { AppScreen } from "@/lib/screens";

interface ScreenListViewProps {
  screens: AppScreen[];
  onManage: (screen: AppScreen) => void;
  onEdit: (screen: AppScreen) => void;
  onArchive: (screen: AppScreen) => void;
}

const ICON_MAP = {
  Home,
  FileText,
  Sparkles,
  Calendar,
  User,
  Settings,
};

export const ScreenListView: React.FC<ScreenListViewProps> = ({
  screens,
  onManage,
  onEdit,
}) => {
  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr
              style={{
                backgroundColor: "#FAF9FC",
                borderBottom: "1px solid var(--border)",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-muted)",
              }}
            >
              <th style={{ padding: "14px 20px" }}>Screen Name</th>
              <th style={{ padding: "14px 16px" }}>Key</th>
              <th style={{ padding: "14px 16px" }}>Category</th>
              <th style={{ padding: "14px 16px" }}>Route</th>
              <th style={{ padding: "14px 16px" }}>Status</th>
              <th style={{ padding: "14px 16px" }}>Version</th>
              <th style={{ padding: "14px 16px" }}>Last Updated</th>
              <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {screens.map((screen) => {
              const Icon = ICON_MAP[screen.iconName] || FileText;
              const isConfigured = screen.status === "configured";

              return (
                <tr
                  key={screen.id}
                  style={{
                    borderBottom: "1px solid #FAF7F2",
                    fontSize: "13px",
                    color: "var(--text)",
                    transition: "background-color 0.15s ease",
                  }}
                  className="list-row-item"
                >
                  {/* Name + Icon */}
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          backgroundColor: "var(--primary-light)",
                          color: "var(--primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text)" }}>{screen.name}</div>
                        <div
                          style={{
                            fontSize: "11.5px",
                            color: "var(--text-muted)",
                            maxWidth: "240px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {screen.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Key */}
                  <td style={{ padding: "14px 16px" }}>
                    <code
                      style={{
                        backgroundColor: "#FAF7FD",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "11.5px",
                        color: "var(--primary)",
                      }}
                    >
                      {screen.key}
                    </code>
                  </td>

                  {/* Category */}
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "10px",
                        backgroundColor: "var(--primary-light)",
                        color: "var(--primary)",
                        fontSize: "11.5px",
                        fontWeight: 600,
                      }}
                    >
                      {screen.category}
                    </span>
                  </td>

                  {/* Route */}
                  <td style={{ padding: "14px 16px", color: "var(--text-muted)", fontSize: "12px" }}>
                    {screen.route}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "14px 16px" }}>
                    {isConfigured ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          backgroundColor: "#EDF7F2",
                          color: "var(--success)",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        <Check size={11} strokeWidth={2.5} />
                        Configured
                      </span>
                    ) : (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          backgroundColor: "#FEF6EE",
                          color: "#D97706",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        <AlertCircle size={11} strokeWidth={2.5} />
                        Needs setup
                      </span>
                    )}
                  </td>

                  {/* Version */}
                  <td style={{ padding: "14px 16px", color: "var(--text-muted)", fontSize: "12px" }}>
                    v{screen.version}.0
                  </td>

                  {/* Last updated */}
                  <td style={{ padding: "14px 16px", color: "var(--text-light)", fontSize: "12px" }}>
                    {screen.lastUpdated}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "14px 20px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      <Link
                        href={`/admin/app-screens/${screen.key}/configuration`}
                        style={{
                          backgroundColor: "var(--surface)",
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          padding: "4px 12px",
                          fontSize: "12px",
                          fontWeight: 500,
                          color: "var(--text)",
                          cursor: "pointer",
                          textDecoration: "none",
                        }}
                        className="manage-btn"
                      >
                        Manage
                      </Link>
                      <button
                        type="button"
                        onClick={() => onManage(screen)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-muted)",
                          padding: "4px",
                        }}
                        title="Quick layout drawer"
                      >
                        <Sliders size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(screen)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-muted)",
                          padding: "4px",
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style jsx global>{`
        .list-row-item:hover {
          background-color: var(--primary-light) !important;
        }
      `}</style>
    </div>
  );
};
