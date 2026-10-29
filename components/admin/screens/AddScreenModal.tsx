"use client";

import React, { useState } from "react";
import { X, Plus, AlertCircle } from "lucide-react";
import { AppScreen, ScreenCategory } from "@/lib/screens";

interface AddScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newScreen: AppScreen) => void;
}

export const AddScreenModal: React.FC<AddScreenModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ScreenCategory>("Content");
  const [route, setRoute] = useState("");
  const [iconName, setIconName] = useState<AppScreen["iconName"]>("FileText");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    // Auto-generate key if key hasn't been manually diverged
    const generatedKey = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setKey(generatedKey);
    if (!route || route.startsWith("/app/")) {
      setRoute(`/app/${generatedKey}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a screen display name.");
      return;
    }
    if (!key.trim()) {
      setError("Please provide a unique screen key.");
      return;
    }
    if (!description.trim()) {
      setError("Please describe the purpose of this screen.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/screens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          key: key.trim(),
          description: description.trim(),
          category,
          route: route.trim() || `/app/${key.trim()}`,
          iconName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create screen.");
      } else {
        onCreated(data.screen);
        onClose();
        // Reset form
        setName("");
        setKey("");
        setDescription("");
        setRoute("");
      }
    } catch {
      setError("Network error while creating screen record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Close modal backdrop"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape") onClose();
        }}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(36, 33, 58, 0.45)",
          backdropFilter: "blur(2px)",
          zIndex: 70,
        }}
      />

      {/* Modal Dialog */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "520px",
          maxWidth: "94vw",
          backgroundColor: "var(--surface)",
          borderRadius: "16px",
          boxShadow: "0 16px 40px rgba(36, 33, 58, 0.18)",
          zIndex: 75,
          overflow: "hidden",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
              }}
            >
              <Plus size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text)", margin: 0 }}>
                Add New App Screen
              </h2>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Register a new configurable screen entry in the inventory
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close add screen modal"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "var(--text-muted)",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "20px 24px" }}>
          {error && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                backgroundColor: "var(--error-bg)",
                border: "1px solid var(--error-border)",
                color: "var(--error)",
                fontSize: "12.5px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Screen Name */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "5px" }}>
              Screen Name <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Explore & Discovery"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              style={{
                width: "100%",
                height: "38px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                padding: "0 12px",
                fontSize: "13px",
                color: "var(--text)",
              }}
            />
          </div>

          {/* Screen Key & Category Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "5px" }}>
                Screen Key <span style={{ color: "var(--error)" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="explore-discovery"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
                style={{
                  width: "100%",
                  height: "38px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  padding: "0 12px",
                  fontSize: "13px",
                  color: "var(--text)",
                  fontFamily: "monospace",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "5px" }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ScreenCategory)}
                style={{
                  width: "100%",
                  height: "38px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  padding: "0 10px",
                  fontSize: "13px",
                  color: "var(--text)",
                  backgroundColor: "var(--surface)",
                }}
              >
                <option value="Navigation">Navigation</option>
                <option value="Content">Content</option>
                <option value="Creation">Creation</option>
                <option value="Account">Account</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "5px" }}>
              Description <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Brief summary of screen purpose and configurable sections"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{
                width: "100%",
                height: "38px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                padding: "0 12px",
                fontSize: "13px",
                color: "var(--text)",
              }}
            />
          </div>

          {/* Route & Icon Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "12px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "5px" }}>
                App Route Destination
              </label>
              <input
                type="text"
                placeholder="/app/explore"
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                style={{
                  width: "100%",
                  height: "38px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  padding: "0 12px",
                  fontSize: "13px",
                  color: "var(--text)",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "5px" }}>
                Icon Identifier
              </label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value as AppScreen["iconName"])}
                style={{
                  width: "100%",
                  height: "38px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  padding: "0 10px",
                  fontSize: "13px",
                  color: "var(--text)",
                  backgroundColor: "var(--surface)",
                }}
              >
                <option value="Home">Home</option>
                <option value="FileText">FileText (Doc)</option>
                <option value="Sparkles">Sparkles (AI)</option>
                <option value="Calendar">Calendar</option>
                <option value="User">User</option>
                <option value="Settings">Settings</option>
              </select>
            </div>
          </div>

          {/* Modal Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
              paddingTop: "14px",
              borderTop: "1px solid var(--border)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
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
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "var(--primary)",
                fontSize: "13px",
                fontWeight: 600,
                color: "#FFFFFF",
                cursor: isSubmitting ? "wait" : "pointer",
              }}
            >
              {isSubmitting ? "Creating..." : "Add Screen"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
