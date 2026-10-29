"use client";

import React, { useState } from "react";
import { DetailedColorToken, isValidHex, normalizeHex } from "@/lib/color-tokens";
import { X, Plus, AlertCircle } from "lucide-react";

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToken: (token: DetailedColorToken) => void;
  existingKeys: Set<string>;
}

export const AddTokenModal: React.FC<AddTokenModalProps> = ({
  isOpen,
  onClose,
  onAddToken,
  existingKeys,
}) => {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [category, setCategory] = useState<"Brand" | "Backgrounds" | "Text" | "Borders" | "Components">("Brand");
  const [hex, setHex] = useState("#F59E0B");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!key || key.startsWith("color.")) {
      const slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ".")
        .replace(/^\.+|\.+$/g, "");
      setKey(slug ? `color.${slug}` : "color.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = name.trim();
    const cleanKey = key.trim().toLowerCase();
    const cleanHex = hex.trim();

    if (!cleanName) {
      setErrorMsg("Token name is required.");
      return;
    }

    if (!cleanKey || !cleanKey.startsWith("color.")) {
      setErrorMsg("Token key must start with 'color.' (e.g. color.accent.warning).");
      return;
    }

    if (existingKeys.has(cleanKey)) {
      setErrorMsg(`Token key "${cleanKey}" already exists.`);
      return;
    }

    if (!isValidHex(cleanHex)) {
      setErrorMsg("Please enter a valid hexadecimal color (e.g. #F59E0B).");
      return;
    }

    const id = cleanKey.replace(/\./g, "-");

    const newToken: DetailedColorToken = {
      id,
      key: cleanKey,
      name: cleanName,
      hex: normalizeHex(cleanHex),
      category,
      description: description.trim() || `Custom token: ${cleanName}`,
      isCustom: true,
      usage: [
        {
          title: "Custom component mapping",
          description: "Unreferenced token. Pending component registration.",
          iconType: "control",
        },
      ],
    };

    onAddToken(newToken);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(36, 33, 58, 0.45)",
        backdropFilter: "blur(4px)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid var(--border, #EAE4EE)",
          boxShadow: "0 20px 40px rgba(36, 33, 58, 0.15)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: "1px solid var(--border, #EAE4EE)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Plus size={18} style={{ color: "var(--primary, #7956C9)" }} />
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text, #24213A)" }}>
              Add New Color Token
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "var(--text-muted, #777184)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {errorMsg && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 12px",
                borderRadius: "8px",
                backgroundColor: "var(--error-bg, #FDF2F2)",
                border: "1px solid var(--error-border, #F8D7DA)",
                color: "var(--error, #D9383A)",
                fontSize: "12.5px",
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Token Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted, #777184)" }}>
              Token Display Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Warning Amber"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              style={{
                padding: "8px 12px",
                fontSize: "13.5px",
                border: "1px solid var(--border, #EAE4EE)",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </div>

          {/* Token Key */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted, #777184)" }}>
              Token Key *
            </label>
            <input
              type="text"
              placeholder="color.accent.warning"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              style={{
                padding: "8px 12px",
                fontSize: "13.5px",
                fontFamily: "monospace",
                border: "1px solid var(--border, #EAE4EE)",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </div>

          {/* Category */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted, #777184)" }}>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "Brand" | "Backgrounds" | "Text" | "Borders" | "Components")}
              style={{
                padding: "8px 12px",
                fontSize: "13.5px",
                border: "1px solid var(--border, #EAE4EE)",
                borderRadius: "8px",
                outline: "none",
              }}
            >
              <option value="Brand">Brand</option>
              <option value="Backgrounds">Backgrounds</option>
              <option value="Text">Text</option>
              <option value="Borders">Borders</option>
              <option value="Components">Components</option>
            </select>
          </div>

          {/* Initial HEX & Picker */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted, #777184)" }}>
              Initial Color Value (HEX) *
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="color"
                value={isValidHex(hex) && normalizeHex(hex).length === 7 ? normalizeHex(hex) : "#F59E0B"}
                onChange={(e) => setHex(e.target.value.toUpperCase())}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  fontSize: "13px",
                  fontFamily: "monospace",
                  border: "1px solid var(--border, #EAE4EE)",
                  borderRadius: "8px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted, #777184)" }}>
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Purpose and component usage context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                padding: "8px 12px",
                fontSize: "13px",
                border: "1px solid var(--border, #EAE4EE)",
                borderRadius: "8px",
                outline: "none",
                resize: "none",
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
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
              Cancel
            </button>

            <button
              type="submit"
              style={{
                padding: "8px 18px",
                fontSize: "13px",
                fontWeight: 600,
                borderRadius: "8px",
                backgroundColor: "var(--primary, #7956C9)",
                color: "#FFFFFF",
                border: "none",
                cursor: "pointer",
              }}
            >
              Add Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
