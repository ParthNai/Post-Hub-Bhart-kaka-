"use client";

import React from "react";
import Link from "next/link";
import { Shield, Clock, Eye, Save, Search, Bell } from "lucide-react";

interface ModerationHeaderProps {
  onOpenHistory: () => void;
  onOpenPreview: () => void;
  onSave: () => void;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  userName?: string;
  userRole?: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export function ModerationHeader({
  onOpenHistory,
  onOpenPreview,
  onSave,
  isSaving = false,
  hasUnsavedChanges = false,
  userName = "Parth Patel",
  userRole = "Administrator",
  searchQuery = "",
  onSearchChange,
}: ModerationHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        marginBottom: "20px",
      }}
    >
      {/* Top Meta Bar: Breadcrumbs on Left, Admin User Info on Right */}
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
            fontSize: "13px",
            color: "#777184",
          }}
        >
          <Link
            href="/admin/dashboard"
            style={{
              color: "#777184",
              textDecoration: "none",
            }}
          >
            Admin
          </Link>
          <span style={{ opacity: 0.5 }}>/</span>
          <Link
            href="/admin/ai-generation"
            style={{
              color: "#777184",
              textDecoration: "none",
            }}
          >
            AI Image Generation
          </Link>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: "#7956C9", fontWeight: 600 }}>
            Moderation Policies
          </span>
        </div>

        {/* Right profile chip & notification bell */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Notification bell */}
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

          {/* User profile */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#F4F0FB",
                color: "#7956C9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              {userName.charAt(0)}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#24213A",
                  lineHeight: "1.2",
                }}
              >
                {userName}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "#777184",
                  lineHeight: "1.2",
                }}
              >
                {userRole}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Title Row & Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              backgroundColor: "#FAF7F2",
              border: "1px solid #E8DFF5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7956C9",
              flexShrink: 0,
            }}
          >
            <Shield size={22} />
          </div>
          <div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#24213A",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Moderation Rules &amp; Policies
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "#777184",
                marginTop: "3px",
                marginBottom: 0,
              }}
            >
              Configure image safety checks, moderation decisions and manual review requirements.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Search Input */}
          <div style={{ position: "relative", width: "240px" }}>
            <Search
              size={14}
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
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              style={{
                width: "100%",
                height: "36px",
                paddingLeft: "34px",
                paddingRight: "12px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                backgroundColor: "#FFFFFF",
                fontSize: "12px",
                color: "#24213A",
                outline: "none",
              }}
            />
          </div>

          <button
            type="button"
            onClick={onOpenHistory}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE4EE",
              color: "#24213A",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
            }}
          >
            <Clock size={14} color="#777184" />
            <span>Policy History</span>
          </button>

          <button
            type="button"
            onClick={onOpenPreview}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE4EE",
              color: "#24213A",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
            }}
          >
            <Eye size={14} color="#777184" />
            <span>Preview Rules</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              backgroundColor: isSaving ? "#9B85DA" : "#7956C9",
              border: "none",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "8px",
              cursor: isSaving ? "not-allowed" : "pointer",
              boxShadow: "0 2px 6px rgba(121, 86, 201, 0.3)",
              transition: "all 0.15s ease",
            }}
          >
            <Save size={14} />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
