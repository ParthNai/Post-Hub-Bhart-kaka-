"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  FileText,
  Sparkles,
  Calendar,
  User,
  Settings,
  MoreVertical,
  Check,
  AlertCircle,
  Calendar as CalendarIcon,
  Edit2,
  Code2,
  Archive,
  Trash2,
  Sliders,
} from "lucide-react";
import { AppScreen } from "@/lib/screens";
import { MiniaturePreview } from "./MiniaturePreview";

interface ScreenCardProps {
  screen: AppScreen;
  onManage: (screen: AppScreen) => void;
  onEdit: (screen: AppScreen) => void;
  onViewConfig: (screen: AppScreen) => void;
  onArchive: (screen: AppScreen) => void;
  onDelete: (screen: AppScreen) => void;
}

const ICON_MAP = {
  Home,
  FileText,
  Sparkles,
  Calendar,
  User,
  Settings,
};

export const ScreenCard: React.FC<ScreenCardProps> = ({
  screen,
  onManage,
  onEdit,
  onViewConfig,
  onArchive,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const Icon = ICON_MAP[screen.iconName] || FileText;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isConfigured = screen.status === "configured";

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        padding: "16px 18px 14px 18px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "14px",
        transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
      }}
      className="screen-card-item"
    >
      {/* 1. Miniature Screen Preview */}
      <MiniaturePreview screen={screen} />

      {/* 2. Screen Identity Header: Icon + Name + Description */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            backgroundColor: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: "1px",
          }}
        >
          <Icon size={18} strokeWidth={1.9} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--text)",
              margin: "0 0 3px 0",
              letterSpacing: "-0.015em",
            }}
          >
            {screen.name}
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            {screen.description}
          </p>
        </div>
      </div>

      {/* 3. Category & Status Badges */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        {/* Category Tag */}
        <span
          style={{
            padding: "3px 10px",
            borderRadius: "12px",
            backgroundColor: "var(--primary-light)",
            color: "var(--primary)",
            fontSize: "11.5px",
            fontWeight: 600,
          }}
        >
          {screen.category}
        </span>

        {/* Status Badge */}
        {isConfigured ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 10px",
              borderRadius: "12px",
              backgroundColor: "#EDF7F2",
              color: "var(--success)",
              fontSize: "11.5px",
              fontWeight: 600,
            }}
          >
            <Check size={12} strokeWidth={2.5} />
            <span>Configured</span>
          </span>
        ) : (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 10px",
              borderRadius: "12px",
              backgroundColor: "#FEF6EE",
              color: "#D97706",
              fontSize: "11.5px",
              fontWeight: 600,
            }}
          >
            <AlertCircle size={12} strokeWidth={2.5} />
            <span>Needs setup</span>
          </span>
        )}
      </div>

      {/* 4. Bottom Row: Date + Manage Action + Overflow Menu */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "6px",
          borderTop: "1px solid #FAF7F2",
        }}
      >
        {/* Last updated date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "11.5px",
            color: "var(--text-light)",
          }}
        >
          <CalendarIcon size={12} />
          <span>Last updated: {screen.lastUpdated}</span>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Link
            href={`/admin/app-screens/${screen.key}/configuration`}
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "4px 14px",
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--text)",
              cursor: "pointer",
              transition: "all 0.15s ease",
              textDecoration: "none",
              display: "inline-block",
            }}
            className="manage-btn"
          >
            Manage
          </Link>

          {/* Overflow Menu */}
          <div style={{ position: "relative" }} ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              aria-label={`Actions for ${screen.name}`}
              style={{
                background: "none",
                border: "none",
                padding: "4px",
                borderRadius: "4px",
                cursor: "pointer",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="overflow-trigger-btn"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: "30px",
                  width: "180px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  boxShadow: "0 8px 24px rgba(36, 33, 58, 0.12)",
                  padding: "6px",
                  zIndex: 25,
                  animation: "fadeIn 0.15s ease-out",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(screen);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    fontSize: "12.5px",
                    color: "var(--text)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  className="dropdown-menu-item"
                >
                  <Edit2 size={13} />
                  <span>Edit Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onManage?.(screen);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    fontSize: "12.5px",
                    color: "var(--text)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  className="dropdown-menu-item"
                >
                  <Sliders size={13} />
                  <span>Quick Layout Drawer</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onViewConfig(screen);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    fontSize: "12.5px",
                    color: "var(--text)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  className="dropdown-menu-item"
                >
                  <Code2 size={13} />
                  <span>View JSON Config</span>
                </button>

                <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "4px 0" }} />

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onArchive(screen);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    fontSize: "12.5px",
                    color: "#D97706",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  className="dropdown-menu-item"
                >
                  <Archive size={13} />
                  <span>Archive Screen</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(screen);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    fontSize: "12.5px",
                    color: "var(--error)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  className="dropdown-menu-item delete"
                >
                  <Trash2 size={13} />
                  <span>Delete Screen</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .screen-card-item:hover {
          border-color: rgba(121, 86, 201, 0.35) !important;
          box-shadow: 0 6px 18px rgba(36, 33, 58, 0.06) !important;
        }
        .manage-btn:hover {
          border-color: var(--primary) !important;
          color: var(--primary) !important;
          background-color: var(--primary-light) !important;
        }
        .overflow-trigger-btn:hover {
          color: var(--text) !important;
          background-color: var(--primary-light) !important;
        }
        .dropdown-menu-item:hover {
          background-color: var(--primary-light);
        }
        .dropdown-menu-item.delete:hover {
          background-color: var(--error-bg);
        }
      `}</style>
    </div>
  );
};
