"use client";

import React from "react";
import Link from "next/link";
import { FilePlus, Sparkles, Calendar, Users } from "lucide-react";

export interface QuickActionItem {
  id: string;
  title: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
}

const ACTIONS: QuickActionItem[] = [
  {
    id: "create-template",
    title: "Create Template",
    href: "/admin/templates",
    icon: FilePlus,
  },
  {
    id: "manage-ai",
    title: "Manage AI Settings",
    href: "/admin/ai-generation",
    icon: Sparkles,
  },
  {
    id: "add-festival",
    title: "Add Festival",
    href: "/admin/festivals",
    icon: Calendar,
  },
  {
    id: "view-users",
    title: "View Users",
    href: "/admin/users",
    icon: Users,
  },
];

export const QuickActions: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        padding: "22px 24px 20px 24px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--text)",
            margin: "0 0 4px 0",
          }}
        >
          Quick Actions
        </h2>
      </div>

      {/* 2x2 Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          flex: 1,
        }}
      >
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.id}
              href={action.href}
              style={{
                backgroundColor: "#FAF9FD",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "16px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "88px",
                textDecoration: "none",
                transition: "all 0.18s ease",
              }}
              className="quick-action-tile"
            >
              {/* Top: Icon */}
              <div style={{ color: "var(--primary)", marginBottom: "12px" }}>
                <Icon size={22} strokeWidth={1.8} />
              </div>

              {/* Bottom: Title & Arrow */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--text)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {action.title}
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "var(--primary)",
                    fontWeight: 500,
                    lineHeight: 1,
                  }}
                >
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <style jsx global>{`
        .quick-action-tile:hover {
          background-color: var(--primary-light) !important;
          border-color: rgba(121, 86, 201, 0.35) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(121, 86, 201, 0.08);
        }
      `}</style>
    </div>
  );
};
