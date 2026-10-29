"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, RotateCcw, Bookmark, MoreHorizontal, FileCode, History, Loader2 } from "lucide-react";

interface ColorTokensHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetDraft: () => void;
  onSaveDraft: () => void;
  isSaving: boolean;
  onExport: () => void;
  onHistory: () => void;
}

export const ColorTokensHeader: React.FC<ColorTokensHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onResetDraft,
  onSaveDraft,
  isSaving,
  onExport,
  onHistory,
}) => {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  useEffect(() => {
    if (!moreMenuOpen) return;
    const handleClick = () => setMoreMenuOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [moreMenuOpen]);

  return (
    <header
      style={{
        padding: "20px 32px 14px 32px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        backgroundColor: "var(--bg, #FAF7F2)",
        borderBottom: "1px solid var(--border, #EAE4EE)",
      }}
    >
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12.5px",
          color: "var(--text-muted, #777184)",
        }}
      >
        <Link href="/admin/dashboard" style={{ color: "inherit", textDecoration: "none" }}>
          Admin
        </Link>
        <span>/</span>
        <Link href="/admin/design-system" style={{ color: "inherit", textDecoration: "none" }}>
          Design System
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text, #24213A)", fontWeight: 500 }}>Colors</span>
      </nav>

      {/* Title & Actions Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "var(--text, #24213A)",
              }}
            >
              Color Tokens
            </h1>
            <span
              style={{
                display: "inline-block",
                fontSize: "12px",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "6px",
                backgroundColor: "var(--secondary, #E8DFF5)",
                color: "var(--primary, #7956C9)",
              }}
            >
              Draft
            </span>
          </div>
          <p
            style={{
              fontSize: "13.5px",
              color: "var(--text-muted, #777184)",
              marginTop: "2px",
            }}
          >
            Fine-tune your brand palette and preview supported color changes.
          </p>
        </div>

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Search Box */}
          <div style={{ position: "relative" }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted, #777184)",
              }}
            />
            <input
              type="text"
              placeholder="Find a color token..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                padding: "8px 14px 8px 34px",
                fontSize: "13px",
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                color: "var(--text, #24213A)",
                outline: "none",
                width: "190px",
              }}
            />
          </div>

          {/* Reset Draft */}
          <button
            type="button"
            onClick={onResetDraft}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 500,
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              color: "var(--text, #24213A)",
              cursor: "pointer",
            }}
          >
            <RotateCcw size={14} style={{ color: "var(--text-muted, #777184)" }} />
            <span>Reset Draft</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: "var(--primary, #7956C9)",
              color: "#FFFFFF",
              border: "none",
              cursor: isSaving ? "not-allowed" : "pointer",
              opacity: isSaving ? 0.7 : 1,
              boxShadow: "0 2px 6px rgba(121, 86, 201, 0.25)",
            }}
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Bookmark size={14} />}
            <span>{isSaving ? "Saving..." : "Save Draft"}</span>
          </button>

          {/* More Options */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMoreMenuOpen(!moreMenuOpen);
              }}
              aria-label="More options"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                color: "var(--text-muted, #777184)",
                cursor: "pointer",
              }}
            >
              <MoreHorizontal size={17} />
            </button>

            {moreMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "42px",
                  width: "210px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "10px",
                  border: "1px solid var(--border, #EAE4EE)",
                  boxShadow: "0 10px 30px rgba(36, 33, 58, 0.12)",
                  zIndex: 40,
                  padding: "6px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    onExport();
                    setMoreMenuOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    fontSize: "12.5px",
                    color: "var(--text)",
                    background: "none",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <FileCode size={14} /> Export Colors (JSON)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onHistory();
                    setMoreMenuOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    fontSize: "12.5px",
                    color: "var(--text)",
                    background: "none",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <History size={14} /> View Token History
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
