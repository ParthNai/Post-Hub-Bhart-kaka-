"use client";

import React, { useState } from "react";
import { X, Check, AlertCircle, Send } from "lucide-react";
import { AppScreen } from "@/lib/screens";

interface ManageScreenDrawerProps {
  screen: AppScreen | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: AppScreen) => void;
}

interface DrawerFormProps {
  screen: AppScreen;
  onClose: () => void;
  onSave: (updated: AppScreen) => void;
}

const DrawerForm: React.FC<DrawerFormProps> = ({ screen, onClose, onSave }) => {
  const [headerTitle, setHeaderTitle] = useState(screen.configData.headerTitle || screen.name);
  const [bannerVisible, setBannerVisible] = useState(Boolean(screen.configData.bannerVisible));
  const [itemsPerPage, setItemsPerPage] = useState(screen.configData.itemsPerPage || 12);
  const [defaultLayout, setDefaultLayout] = useState(screen.configData.defaultLayout || "grid");
  const [tagsFilterEnabled, setTagsFilterEnabled] = useState(Boolean(screen.configData.tagsFilterEnabled ?? true));
  const [quickActionsEnabled, setQuickActionsEnabled] = useState(Boolean(screen.configData.quickActionsEnabled));
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      const updatedConfig = {
        ...screen.configData,
        headerTitle,
        bannerVisible,
        itemsPerPage,
        defaultLayout,
        tagsFilterEnabled,
        quickActionsEnabled,
      };

      const res = await fetch(`/api/admin/screens/${screen.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          configData: updatedConfig,
          status: "configured",
          statusMessage: "Configured and published by administrator",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onSave(data.screen);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        width: "460px",
        maxWidth: "100%",
        backgroundColor: "var(--surface)",
        boxShadow: "-8px 0 30px rgba(36, 33, 58, 0.15)",
        zIndex: 65,
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      {/* Drawer Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              style={{
                fontSize: "12px",
                padding: "2px 8px",
                borderRadius: "10px",
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                fontWeight: 600,
              }}
            >
              {screen.category}
            </span>
            <span style={{ fontSize: "12px", color: "var(--text-light)" }}>v{screen.version}.0</span>
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)", margin: 0 }}>
            {screen.name} Screen Configuration
          </h2>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            Route: <code>{screen.route}</code>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close configuration drawer"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            color: "var(--text-muted)",
            borderRadius: "6px",
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Drawer Scrollable Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Status info callout */}
        <div
          style={{
            padding: "12px 14px",
            borderRadius: "10px",
            backgroundColor: screen.status === "configured" ? "#EDF7F2" : "#FEF6EE",
            border: `1px solid ${screen.status === "configured" ? "#C8E8D7" : "#FCE7D0"}`,
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          {screen.status === "configured" ? (
            <Check size={16} color="var(--success)" style={{ marginTop: "2px", flexShrink: 0 }} />
          ) : (
            <AlertCircle size={16} color="#D97706" style={{ marginTop: "2px", flexShrink: 0 }} />
          )}
          <div>
            <div
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: screen.status === "configured" ? "var(--success)" : "#D97706",
              }}
            >
              {screen.status === "configured" ? "Published & Operational" : "Needs Layout Review"}
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
              {screen.statusMessage || "Configure layout components below and publish changes to app clients."}
            </div>
          </div>
        </div>

        {/* Configurable Settings */}
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", marginBottom: "12px" }}>
            Supported Component Settings
          </h3>

          {/* Header Title */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>
              App Screen Display Title
            </label>
            <input
              type="text"
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
              style={{
                width: "100%",
                height: "36px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                padding: "0 12px",
                fontSize: "13px",
                color: "var(--text)",
              }}
            />
          </div>

          {/* Default Layout */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>
              Component Layout Mode
            </label>
            <select
              value={defaultLayout}
              onChange={(e) => setDefaultLayout(e.target.value)}
              style={{
                width: "100%",
                height: "36px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                padding: "0 10px",
                fontSize: "13px",
                color: "var(--text)",
                backgroundColor: "var(--surface)",
              }}
            >
              <option value="grid">Standard Responsive Grid</option>
              <option value="masonry">Dynamic Masonry Layout</option>
              <option value="carousel_grid">Hero Carousel + Featured Grid</option>
              <option value="split_canvas">Split Interactive Canvas</option>
              <option value="form_sections">Structured Settings Sections</option>
            </select>
          </div>

          {/* Items Per Page */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>
              Cards / Items Per Batch
            </label>
            <input
              type="number"
              min="4"
              max="60"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              style={{
                width: "100%",
                height: "36px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                padding: "0 12px",
                fontSize: "13px",
                color: "var(--text)",
              }}
            />
          </div>

          {/* Feature Toggles */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              borderTop: "1px solid var(--border)",
              paddingTop: "14px",
            }}
          >
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <span style={{ fontSize: "13px", color: "var(--text)", fontWeight: 500 }}>
                Show Hero Banner / Carousel
              </span>
              <input
                type="checkbox"
                checked={bannerVisible}
                onChange={(e) => setBannerVisible(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <span style={{ fontSize: "13px", color: "var(--text)", fontWeight: 500 }}>
                Enable Category Tag Filtering
              </span>
              <input
                type="checkbox"
                checked={tagsFilterEnabled}
                onChange={(e) => setTagsFilterEnabled(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <span style={{ fontSize: "13px", color: "var(--text)", fontWeight: 500 }}>
                Enable Floating Quick Actions
              </span>
              <input
                type="checkbox"
                checked={quickActionsEnabled}
                onChange={(e) => setQuickActionsEnabled(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
              />
            </label>
          </div>
        </div>

        {/* Supported capabilities */}
        <div>
          <h4 style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase" }}>
            Verified Native Capabilities
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {screen.supportedCapabilities.map((cap) => (
              <span
                key={cap}
                style={{
                  padding: "3px 8px",
                  borderRadius: "6px",
                  backgroundColor: "#FAF7FD",
                  border: "1px solid var(--border)",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                }}
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Drawer Footer Actions */}
      <div
        style={{
          padding: "16px 24px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "var(--bg)",
        }}
      >
        {saveSuccess ? (
          <span style={{ fontSize: "12.5px", color: "var(--success)", fontWeight: 600 }}>
            ✓ Published to clients!
          </span>
        ) : (
          <span style={{ fontSize: "12px", color: "var(--text-light)" }}>
            Requires version confirmation
          </span>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface)",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text)",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isSaving}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--primary)",
              fontSize: "13px",
              fontWeight: 600,
              color: "#FFFFFF",
              cursor: isSaving ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Send size={13} />
            {isSaving ? "Saving..." : "Publish Configuration"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ManageScreenDrawer: React.FC<ManageScreenDrawerProps> = ({
  screen,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !screen) return null;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Close drawer backdrop"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape") onClose();
        }}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(36, 33, 58, 0.4)",
          backdropFilter: "blur(2px)",
          zIndex: 60,
        }}
      />
      <DrawerForm key={screen.id} screen={screen} onClose={onClose} onSave={onSave} />
    </>
  );
};
