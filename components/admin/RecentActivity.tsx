"use client";

import React from "react";
import { FileText, Calendar, Sliders, Image as ImageIcon, SearchX } from "lucide-react";
import { ActivityItem } from "@/app/api/admin/dashboard/route";

interface RecentActivityProps {
  activities?: ActivityItem[];
  searchQuery?: string;
  onClearSearch?: () => void;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    iconName: "FileText",
    title: "Template draft updated",
    description: 'Template "Business Promotion" was updated by admin.',
    timeAgo: "2 hours ago",
    category: "templates",
  },
  {
    id: "act-2",
    iconName: "Calendar",
    title: "Festival content scheduled",
    description: "Diwali festival campaign scheduled for Oct 28, 2025.",
    timeAgo: "5 hours ago",
    category: "festivals",
  },
  {
    id: "act-3",
    iconName: "Sliders",
    title: "AI provider configuration reviewed",
    description: "AI provider settings were updated successfully.",
    timeAgo: "1 day ago",
    category: "ai",
  },
  {
    id: "act-4",
    iconName: "Image",
    title: "New template submitted for review",
    description: 'Template "Social Media Post" submitted for review.',
    timeAgo: "1 day ago",
    category: "templates",
  },
];

const ICON_MAP = {
  FileText,
  Calendar,
  Sliders,
  Image: ImageIcon,
};

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = DEFAULT_ACTIVITIES,
  searchQuery = "",
  onClearSearch,
}) => {
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
          Recent Activity
        </h2>
        <span style={{ fontSize: "12px", color: "var(--text-light)" }}>
          Illustrative demo content
        </span>
      </div>

      {/* Activity List or Empty State */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          flex: 1,
        }}
      >
        {activities.length === 0 ? (
          <div
            style={{
              padding: "36px 16px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
              }}
            >
              <SearchX size={20} />
            </div>
            <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text)" }}>
              No matching activity
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", maxWidth: "240px", margin: 0 }}>
              No recent activity matching &quot;{searchQuery}&quot;. Try adjusting your keywords.
            </p>
            {onClearSearch && (
              <button
                type="button"
                onClick={onClearSearch}
                style={{
                  marginTop: "6px",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  backgroundColor: "var(--primary-light)",
                  color: "var(--primary)",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Clear filter
              </button>
            )}
          </div>
        ) : (
          activities.map((item) => {
            const Icon = ICON_MAP[item.iconName] || FileText;

            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  padding: "8px 0",
                  borderBottom: "1px solid #FAF7F2",
                }}
              >
                {/* Icon square */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: "var(--primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  <Icon size={18} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      marginBottom: "3px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13.5px",
                        fontWeight: 600,
                        color: "var(--text)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.title}
                    </span>
                    <span
                      style={{
                        fontSize: "11.5px",
                        color: "var(--text-light)",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {item.timeAgo}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      margin: 0,
                      lineHeight: 1.45,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
