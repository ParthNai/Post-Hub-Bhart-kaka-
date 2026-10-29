"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  DetailedColorToken,
  ColorCategory,
  INITIAL_COLOR_TOKENS,
  isValidHex,
  normalizeHex,
} from "@/lib/color-tokens";
import { ColorTokensHeader } from "./ColorTokensHeader";
import { ColorCategoryTabs } from "./ColorCategoryTabs";
import { ColorTokenListCard } from "./ColorTokenListCard";
import { LiveComponentPreviewCard } from "./LiveComponentPreviewCard";
import { SelectedColorDetailsCard } from "./SelectedColorDetailsCard";
import { ContrastCheckCard } from "./ContrastCheckCard";
import { ColorTokensFooter } from "./ColorTokensFooter";
import { AddTokenModal } from "./AddTokenModal";
import { DiscardConfirmModal } from "../DiscardConfirmModal";
import { TokenHistoryModal } from "../TokenHistoryModal";
import { TokenExportModal } from "../TokenExportModal";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type { DesignSystemConfig } from "@/lib/design-system";

interface ColorTokensEditorViewProps {
  initialConfig: DesignSystemConfig;
}

export const ColorTokensEditorView: React.FC<ColorTokensEditorViewProps> = ({
  initialConfig,
}) => {
  // Merge initialConfig colorTokens with detailed metadata
  const initialDetailedList: DetailedColorToken[] = useMemo(() => {
    return INITIAL_COLOR_TOKENS.map((token) => {
      let currentHex = token.hex;
      if (token.id === "primary-violet" && initialConfig.colorTokens?.primaryViolet) {
        currentHex = initialConfig.colorTokens.primaryViolet;
      } else if (token.id === "soft-lavender" && initialConfig.colorTokens?.softLavender) {
        currentHex = initialConfig.colorTokens.softLavender;
      } else if (token.id === "warm-ivory" && initialConfig.colorTokens?.warmIvory) {
        currentHex = initialConfig.colorTokens.warmIvory;
      } else if (token.id === "main-text" && initialConfig.colorTokens?.mainText) {
        currentHex = initialConfig.colorTokens.mainText;
      } else if (token.id === "secondary-text" && initialConfig.colorTokens?.secondaryText) {
        currentHex = initialConfig.colorTokens.secondaryText;
      } else if (token.id === "border" && initialConfig.colorTokens?.border) {
        currentHex = initialConfig.colorTokens.border;
      }
      return { ...token, hex: currentHex };
    });
  }, [initialConfig]);

  const [savedTokens, setSavedTokens] = useState<DetailedColorToken[]>(initialDetailedList);
  const [tokens, setTokens] = useState<DetailedColorToken[]>(initialDetailedList);
  const [selectedTokenId, setSelectedTokenId] = useState<string>("primary-violet");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<ColorCategory>("All Colors");

  // Modals & UI states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedVal, setCopiedVal] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Clear feedback after timer
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Dirty state & Modified Token IDs
  const modifiedTokenIds = useMemo(() => {
    const set = new Set<string>();
    for (const token of tokens) {
      const original = savedTokens.find((s) => s.id === token.id);
      if (!original || original.hex.toUpperCase() !== token.hex.toUpperCase()) {
        set.add(token.id);
      }
    }
    return set;
  }, [tokens, savedTokens]);

  const isDirty = modifiedTokenIds.size > 0;

  // Filtered tokens
  const filteredTokens = useMemo(() => {
    return tokens.filter((token) => {
      // Category filter
      if (activeCategory !== "All Colors") {
        if (activeCategory === "Components") {
          // Components category covers interactive UI tokens
          if (token.category !== "Brand" && token.category !== "Borders") return false;
        } else if (token.category !== activeCategory) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = token.name.toLowerCase().includes(q);
        const matchesKey = token.key.toLowerCase().includes(q);
        const matchesHex = token.hex.toLowerCase().includes(q);
        return matchesName || matchesKey || matchesHex;
      }

      return true;
    });
  }, [tokens, activeCategory, searchQuery]);

  // Selected Token
  const selectedToken = useMemo(() => {
    return (
      tokens.find((t) => t.id === selectedTokenId) ||
      tokens[0] ||
      INITIAL_COLOR_TOKENS[0]
    );
  }, [tokens, selectedTokenId]);

  // Color mappings for Live Preview
  const tokenMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const t of tokens) {
      map[t.id] = t.hex;
    }
    return map;
  }, [tokens]);

  const primaryViolet = tokenMap["primary-violet"] || "#7956C9";
  const softLavender = tokenMap["soft-lavender"] || "#E8DFF5";
  const warmIvory = tokenMap["warm-ivory"] || "#FAF7F2";
  const mainText = tokenMap["main-text"] || "#24213A";
  const secondaryText = tokenMap["secondary-text"] || "#777184";
  const border = tokenMap["border"] || "#EAE4EE";

  // Update token hex value
  const handleUpdateHex = (tokenId: string, newHex: string) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === tokenId ? { ...t, hex: newHex } : t))
    );
  };

  // Add token
  const handleAddToken = (newToken: DetailedColorToken) => {
    setTokens((prev) => [...prev, newToken]);
    setSelectedTokenId(newToken.id);
    setFeedback({ type: "success", text: `Added new color token: ${newToken.name}` });
  };

  // Copy with fallback
  const handleCopyValue = async (value: string, label: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedVal(value);
      setTimeout(() => setCopiedVal(null), 1800);
      setFeedback({ type: "success", text: `Copied ${label} to clipboard: ${value}` });
    } catch {
      setFeedback({ type: "error", text: "Clipboard access failed" });
    }
  };

  // Save draft
  const handleSaveDraft = async () => {
    // Validate all hex codes
    for (const t of tokens) {
      if (!isValidHex(t.hex)) {
        setFeedback({
          type: "error",
          text: `Invalid hex code for ${t.name}: "${t.hex}". Must be format #RRGGBB.`,
        });
        return;
      }
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const normalizedColors = {
        primaryViolet: normalizeHex(primaryViolet),
        softLavender: normalizeHex(softLavender),
        warmIvory: normalizeHex(warmIvory),
        mainText: normalizeHex(mainText),
        secondaryText: normalizeHex(secondaryText),
        border: normalizeHex(border),
      };

      const res = await fetch("/api/admin/design-system", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_draft",
          draft: {
            colorTokens: normalizedColors,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.details?.join(", ") || data.error || "Save failed");
      }

      // Update saved state
      const updatedTokens = tokens.map((t) => ({ ...t, hex: normalizeHex(t.hex) }));
      setTokens(updatedTokens);
      setSavedTokens(updatedTokens);
      setFeedback({ type: "success", text: "Color tokens draft saved successfully!" });
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save draft.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset Draft
  const handleResetDraft = () => {
    if (isDirty) {
      setDiscardConfirmOpen(true);
    } else {
      setTokens(savedTokens);
      setFeedback({ type: "success", text: "Color tokens reset to latest saved draft." });
    }
  };

  // Confirm Discard
  const handleConfirmDiscard = () => {
    setTokens(savedTokens);
    setDiscardConfirmOpen(false);
    setFeedback({ type: "success", text: "Unsaved color changes discarded." });
  };

  const existingKeys = useMemo(() => new Set(tokens.map((t) => t.key)), [tokens]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "var(--bg, #FAF7F2)",
      }}
    >
      {/* Top Header */}
      <ColorTokensHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onResetDraft={handleResetDraft}
        onSaveDraft={handleSaveDraft}
        isSaving={isSaving}
        onExport={() => setExportOpen(true)}
        onHistory={() => setHistoryOpen(true)}
      />

      {/* Category Tabs */}
      <ColorCategoryTabs
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Floating Alert */}
      {feedback && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 18px",
            borderRadius: "10px",
            backgroundColor: feedback.type === "success" ? "#EDF7F2" : "#FDF2F2",
            border: `1px solid ${feedback.type === "success" ? "#C8E8D7" : "#F8D7DA"}`,
            color: feedback.type === "success" ? "#12805C" : "#D9383A",
            fontSize: "13px",
            fontWeight: 500,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {feedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main Two-Column Content Area */}
      <main
        style={{
          flex: 1,
          padding: "24px 32px 32px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "1600px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: "24px",
            alignItems: "start",
          }}
          className="color-editor-main-grid"
        >
          {/* Left Column: Token List & Live Component Preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <ColorTokenListCard
              tokens={filteredTokens}
              selectedTokenId={selectedToken.id}
              onSelectToken={(t) => setSelectedTokenId(t.id)}
              onUpdateHex={handleUpdateHex}
              onOpenAddToken={() => setAddModalOpen(true)}
              onCopyValue={handleCopyValue}
              copiedVal={copiedVal}
              modifiedTokenIds={modifiedTokenIds}
            />

            <LiveComponentPreviewCard
              primaryColor={primaryViolet}
              lavenderColor={softLavender}
              ivoryColor={warmIvory}
              mainTextColor={mainText}
              secondaryTextColor={secondaryText}
              borderColor={border}
            />
          </div>

          {/* Right Column: Selected Color Details & Contrast Check */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <SelectedColorDetailsCard
              token={selectedToken}
              onUpdateHex={(hex) => handleUpdateHex(selectedToken.id, hex)}
              onCopyValue={handleCopyValue}
              copiedVal={copiedVal}
            />

            <ContrastCheckCard
              primaryViolet={primaryViolet}
              mainText={mainText}
            />
          </div>
        </div>

        {/* Bottom Footer */}
        <ColorTokensFooter
          isDirty={isDirty}
          onDiscard={() => setDiscardConfirmOpen(true)}
          onSave={handleSaveDraft}
          isSaving={isSaving}
        />
      </main>

      {/* Modals */}
      <AddTokenModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddToken={handleAddToken}
        existingKeys={existingKeys}
      />

      <DiscardConfirmModal
        isOpen={discardConfirmOpen}
        onConfirm={handleConfirmDiscard}
        onCancel={() => setDiscardConfirmOpen(false)}
      />

      <TokenHistoryModal
        isOpen={historyOpen}
        history={initialConfig.history}
        currentVersion={initialConfig.version}
        onClose={() => setHistoryOpen(false)}
      />

      <TokenExportModal
        isOpen={exportOpen}
        config={initialConfig}
        onClose={() => setExportOpen(false)}
      />

      <style jsx global>{`
        .color-token-row:hover {
          border-color: var(--primary, #7956C9) !important;
          box-shadow: 0 4px 14px rgba(36, 33, 58, 0.05);
        }
        @media (max-width: 1100px) {
          .color-editor-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
