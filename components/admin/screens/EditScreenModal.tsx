"use client";

import React, { useState } from "react";
import { X, Edit2, AlertCircle } from "lucide-react";
import { AppScreen, ScreenCategory } from "@/lib/screens";

interface EditScreenModalProps {
  screen: AppScreen | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updated: AppScreen) => void;
}

interface EditModalFormProps {
  screen: AppScreen;
  onClose: () => void;
  onUpdated: (updated: AppScreen) => void;
}

const EditModalForm: React.FC<EditModalFormProps> = ({ screen, onClose, onUpdated }) => {
  const [name, setName] = useState(screen.name);
  const [key, setKey] = useState(screen.key);
  const [description, setDescription] = useState(screen.description);
  const [category, setCategory] = useState<ScreenCategory>(screen.category);
  const [route, setRoute] = useState(screen.route);
  const [iconName, setIconName] = useState<AppScreen["iconName"]>(screen.iconName);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/screens/${screen.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          key: key.trim(),
          description: description.trim(),
          category,
          route: route.trim(),
          iconName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update screen.");
      } else {
        onUpdated(data.screen);
        onClose();
      }
    } catch {
      setError("Network error while updating screen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "500px",
        maxWidth: "94vw",
        backgroundColor: "var(--surface)",
        borderRadius: "16px",
        boxShadow: "0 16px 40px rgba(36, 33, 58, 0.18)",
        zIndex: 75,
        overflow: "hidden",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
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
            <Edit2 size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text)", margin: 0 }}>
              Edit {screen.name}
            </h2>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Modify metadata and app destination
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close edit screen modal"
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

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "5px" }}>
            Screen Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "5px" }}>
              Screen Key
            </label>
            <input
              type="text"
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

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "5px" }}>
            Description
          </label>
          <input
            type="text"
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

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "5px" }}>
              App Route
            </label>
            <input
              type="text"
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
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export const EditScreenModal: React.FC<EditScreenModalProps> = ({
  screen,
  isOpen,
  onClose,
  onUpdated,
}) => {
  if (!isOpen || !screen) return null;

  return (
    <>
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
      <EditModalForm key={screen.id} screen={screen} onClose={onClose} onUpdated={onUpdated} />
    </>
  );
};
