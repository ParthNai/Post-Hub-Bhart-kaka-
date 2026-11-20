"use client";

import React, { useState } from "react";
import { X, Settings, ShieldCheck, Globe, Sparkles } from "lucide-react";

interface CategorySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings: () => void;
}

export const CategorySettingsModal: React.FC<CategorySettingsModalProps> = ({
  isOpen,
  onClose,
  onSaveSettings,
}) => {
  const [autoMapKeywords, setAutoMapKeywords] = useState(true);
  const [requireMultilingualReview, setRequireMultilingualReview] = useState(false);
  const [restrictEmptyCategoriesInApp, setRestrictEmptyCategoriesInApp] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(36, 33, 58, 0.4)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "520px",
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
          border: "1px solid #EAE4EE",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid #EAE4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Settings size={18} color="#7956C9" />
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#24213A", margin: 0 }}>
              Category & Taxonomy Settings
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#777184",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <Sparkles size={18} color="#7956C9" style={{ marginTop: "2px", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>
                Automatic Keyword Association
              </div>
              <div style={{ fontSize: "12px", color: "#777184", marginBottom: "6px" }}>
                Auto-assign new festival poster requests and templates to categories matching event tags.
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={autoMapKeywords}
                  onChange={(e) => setAutoMapKeywords(e.target.checked)}
                  style={{ accentColor: "#7956C9" }}
                />
                <span>Enable automated keyword mapping</span>
              </label>
            </div>
          </div>

          <div style={{ height: "1px", backgroundColor: "#FAF7F2" }} />

          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <ShieldCheck size={18} color="#059669" style={{ marginTop: "2px", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>
                Empty Category Protection
              </div>
              <div style={{ fontSize: "12px", color: "#777184", marginBottom: "6px" }}>
                Hide categories from mobile app user navigation if they contain zero published events.
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={restrictEmptyCategoriesInApp}
                  onChange={(e) => setRestrictEmptyCategoriesInApp(e.target.checked)}
                  style={{ accentColor: "#7956C9" }}
                />
                <span>Hide empty categories in mobile feeds</span>
              </label>
            </div>
          </div>

          <div style={{ height: "1px", backgroundColor: "#FAF7F2" }} />

          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <Globe size={18} color="#3B82F6" style={{ marginTop: "2px", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>
                Multilingual Review Enforcement
              </div>
              <div style={{ fontSize: "12px", color: "#777184", marginBottom: "6px" }}>
                Flag categories lacking Gujarati or Hindi translations before public app deployment.
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={requireMultilingualReview}
                  onChange={(e) => setRequireMultilingualReview(e.target.checked)}
                  style={{ accentColor: "#7956C9" }}
                />
                <span>Require regional translations check</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 22px",
            borderTop: "1px solid #EAE4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "10px",
            backgroundColor: "#FAF7F2",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "7px 16px",
              borderRadius: "8px",
              fontSize: "12.5px",
              fontWeight: 600,
              backgroundColor: "#FFFFFF",
              color: "#24213A",
              border: "1px solid #EAE4EE",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSaveSettings();
              onClose();
            }}
            style={{
              padding: "7px 18px",
              borderRadius: "8px",
              fontSize: "12.5px",
              fontWeight: 600,
              backgroundColor: "#7956C9",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
