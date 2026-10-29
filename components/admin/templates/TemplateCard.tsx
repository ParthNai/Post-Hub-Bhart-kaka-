"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Calendar, Eye, Edit2, Copy, Archive, Trash2, RotateCcw } from "lucide-react";
import { PosterTemplate, TemplateStatus } from "@/lib/templates";
import { PosterArtwork } from "./PosterArtwork";

interface TemplateCardProps {
  template: PosterTemplate;
  isSelected: boolean;
  onSelect: (template: PosterTemplate) => void;
  onEdit: (template: PosterTemplate) => void;
  onDuplicate: (template: PosterTemplate) => void;
  onToggleArchive: (template: PosterTemplate) => void;
  onDelete: (template: PosterTemplate) => void;
  onPreview: (template: PosterTemplate) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
  onEdit,
  onDuplicate,
  onToggleArchive,
  onDelete,
  onPreview,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Status badge colors matching reference
  const getStatusBadge = (status: TemplateStatus) => {
    switch (status) {
      case "Published":
        return {
          bg: "#E6F7ED",
          color: "#1E8E3E",
          label: "Published",
        };
      case "Draft":
        return {
          bg: "#FFF3E0",
          color: "#D97706",
          label: "Draft",
        };
      case "Archived":
        return {
          bg: "#F1F0F5",
          color: "#777184",
          label: "Archived",
        };
    }
  };

  // Category badge colors
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Business":
        return { bg: "#EDE9FE", color: "#6D28D9" };
      case "Festival":
        return { bg: "#FEE2E2", color: "#B91C1C" };
      case "Education":
        return { bg: "#E0F2FE", color: "#0369A1" };
      case "Promotion":
        return { bg: "#F3E8FF", color: "#7E22CE" };
      default:
        return { bg: "#F5F2F9", color: "#524C60" };
    }
  };

  const statusBadge = getStatusBadge(template.status);
  const catBadge = getCategoryBadge(template.category);

  return (
    <div
      onClick={() => onSelect(template)}
      style={{
        backgroundColor: "#ffffff",
        border: `1.5px solid ${isSelected ? "var(--primary, #7956C9)" : "var(--border, #EAE4EE)"}`,
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: isSelected
          ? "0 4px 14px rgba(121, 86, 201, 0.15)"
          : "0 1px 3px rgba(36, 33, 58, 0.03)",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        position: "relative",
      }}
      className="template-card-container"
    >
      {/* Poster Artwork Thumbnail Container */}
      <div
        style={{
          width: "100%",
          height: "170px",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#f8fafc",
          borderBottom: "1px solid var(--border, #EAE4EE)",
        }}
      >
        <PosterArtwork template={template} />

        {/* Status Badge in top-right of image */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: statusBadge.bg,
            color: statusBadge.color,
            fontSize: "11px",
            fontWeight: 600,
            padding: "3px 9px",
            borderRadius: "999px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            zIndex: 10,
          }}
        >
          {statusBadge.label}
        </div>
      </div>

      {/* Card Body */}
      <div
        style={{
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <div>
          {/* Header Row: Title & Overflow Menu */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "8px",
              marginBottom: "4px",
              position: "relative",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--text, #24213A)",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={template.name}
              >
                {template.name}
              </h3>
              <div
                style={{
                  fontSize: "11.5px",
                  color: "var(--text-muted, #777184)",
                  marginTop: "2px",
                }}
              >
                {template.id}
              </div>
            </div>

            {/* Overflow Action Menu Button */}
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                title="Template actions"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  color: "var(--text-muted, #777184)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--secondary, #F5F2F9)";
                  e.currentTarget.style.color = "var(--text, #24213A)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--text-muted, #777184)";
                }}
              >
                <MoreVertical size={16} />
              </button>

              {/* Overflow Menu Dropdown Popover */}
              {menuOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "28px",
                    backgroundColor: "#ffffff",
                    border: "1px solid var(--border, #EAE4EE)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 16px rgba(36, 33, 58, 0.12)",
                    padding: "4px",
                    width: "140px",
                    zIndex: 50,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(template);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 10px",
                      fontSize: "12.5px",
                      color: "var(--text, #24213A)",
                      background: "none",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary, #F5F2F9)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate(template);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 10px",
                      fontSize: "12.5px",
                      color: "var(--text, #24213A)",
                      background: "none",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary, #F5F2F9)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <Copy size={13} />
                    <span>Duplicate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onToggleArchive(template);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 10px",
                      fontSize: "12.5px",
                      color: "var(--text, #24213A)",
                      background: "none",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary, #F5F2F9)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {template.status === "Archived" ? (
                      <>
                        <RotateCcw size={13} />
                        <span>Unarchive</span>
                      </>
                    ) : (
                      <>
                        <Archive size={13} />
                        <span>Archive</span>
                      </>
                    )}
                  </button>

                  <div style={{ height: "1px", backgroundColor: "var(--border, #EAE4EE)", margin: "4px 0" }} />

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(template);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 10px",
                      fontSize: "12.5px",
                      color: "#DC2626",
                      background: "none",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FEE2E2")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tags Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", margin: "8px 0" }}>
            <span
              style={{
                backgroundColor: catBadge.bg,
                color: catBadge.color,
                fontSize: "11px",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "6px",
              }}
            >
              {template.category}
            </span>
            <span
              style={{
                backgroundColor: "#F5F2F9",
                color: "#524C60",
                fontSize: "11px",
                fontWeight: 500,
                padding: "2px 8px",
                borderRadius: "6px",
              }}
            >
              {template.format}
            </span>
          </div>

          {/* Last updated */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "11.5px",
              color: "var(--text-muted, #777184)",
              marginBottom: "12px",
            }}
          >
            <Calendar size={13} />
            <span>Last updated: {template.updatedAt}</span>
          </div>
        </div>

        {/* Preview Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPreview(template);
          }}
          style={{
            width: "100%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            backgroundColor: "#ffffff",
            border: "1px solid var(--border, #EAE4EE)",
            borderRadius: "6px",
            padding: "7px 12px",
            fontSize: "12.5px",
            fontWeight: 500,
            color: "var(--text, #24213A)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--secondary, #F5F2F9)";
            e.currentTarget.style.borderColor = "var(--primary-light, #D2C4ED)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.borderColor = "var(--border, #EAE4EE)";
          }}
        >
          <Eye size={14} style={{ color: "var(--text-muted, #777184)" }} />
          <span>Preview</span>
        </button>
      </div>
    </div>
  );
};
