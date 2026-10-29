"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { DesignTokenItem, TokenCategory, TokenUsageSummary } from "@/lib/token-usage";
import { TokenUsageHeader } from "./TokenUsageHeader";
import { TokenUsageMetricsRow } from "./TokenUsageMetricsRow";
import { TokenInventoryCard } from "./TokenInventoryCard";
import { TokenStatusLegendCard } from "./TokenStatusLegendCard";
import { TokenDetailsPanel } from "./TokenDetailsPanel";
import { ReferencedByPanel } from "./ReferencedByPanel";
import { PotentialImpactPanel } from "./PotentialImpactPanel";
import { TokenUsageFooter } from "./TokenUsageFooter";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface TokenUsageViewProps {
  initialTokens: DesignTokenItem[];
  initialSummary: TokenUsageSummary;
}

export const TokenUsageView: React.FC<TokenUsageViewProps> = ({
  initialTokens,
  initialSummary,
}) => {
  const [tokens, setTokens] = useState<DesignTokenItem[]>(initialTokens);
  const [summary, setSummary] = useState<TokenUsageSummary>(initialSummary);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TokenCategory>("All");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Clear feedback timer
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Selected Token instance
  const selectedToken = useMemo(() => {
    if (!selectedTokenId) return null;
    return tokens.find((t) => t.id === selectedTokenId) || null;
  }, [selectedTokenId, tokens]);

  // Client-side Filtered Tokens
  const filteredTokens = useMemo(() => {
    return tokens.filter((token) => {
      // Category filter
      if (selectedCategory !== "All" && token.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = token.id.toLowerCase().includes(query);
        const matchesName = token.name.toLowerCase().includes(query);
        const matchesCategory = token.category.toLowerCase().includes(query);
        const matchesValue = token.value.toLowerCase().includes(query);
        const matchesComponent = token.references.components.some((c) =>
          c.name.toLowerCase().includes(query) || c.file.toLowerCase().includes(query)
        );
        const matchesScreen = token.references.screens.some((s) =>
          s.name.toLowerCase().includes(query) || s.route.toLowerCase().includes(query)
        );

        if (!matchesId && !matchesName && !matchesCategory && !matchesValue && !matchesComponent && !matchesScreen) {
          return false;
        }
      }

      return true;
    });
  }, [tokens, selectedCategory, searchQuery]);

  // Handle Token Selection (toggle on/off)
  const handleSelectToken = (token: DesignTokenItem) => {
    setSelectedTokenId((prev) => (prev === token.id ? null : token.id));
  };

  // Refresh usage data scan
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/design-system/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "scan" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to scan token usage");
      }

      setSummary(data.summary);
      setTokens(data.tokens);
      setFeedback({
        type: "success",
        text: "Token usage and dependencies successfully refreshed.",
      });
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to refresh token usage",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "var(--bg, #FAF7F2)",
      }}
    >
      {/* Header */}
      <TokenUsageHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        scanStatus={summary.scanStatus}
      />

      {/* Floating Alert Toast */}
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

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          padding: "24px 32px 32px 32px",
          maxWidth: "1600px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* 1. Summary Metrics Strip */}
        <TokenUsageMetricsRow summary={summary} />

        {/* 2. Main Two-Column Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 480px",
            gap: "24px",
            alignItems: "start",
          }}
          className="token-usage-grid"
        >
          {/* Left Column: Inventory & Status Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <TokenInventoryCard
              tokens={filteredTokens}
              selectedTokenId={selectedTokenId}
              onSelectToken={handleSelectToken}
              activeCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <TokenStatusLegendCard />
          </div>

          {/* Right Column: Details, References & Impact */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              position: "sticky",
              top: "24px",
            }}
          >
            <TokenDetailsPanel selectedToken={selectedToken} />
            <ReferencedByPanel selectedToken={selectedToken} />
            <PotentialImpactPanel selectedToken={selectedToken} />
          </div>
        </div>

        {/* Bottom Footer */}
        <TokenUsageFooter summary={summary} />
      </main>
    </div>
  );
};

