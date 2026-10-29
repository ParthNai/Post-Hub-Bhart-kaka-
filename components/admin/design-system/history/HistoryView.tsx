"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { VersionRecord, VersionHistorySummary, ChangeType, VersionStatus, TokenDiffItem } from "@/lib/version-history";
import { HistoryHeader } from "./HistoryHeader";
import { HistoryMetricsRow } from "./HistoryMetricsRow";
import { ChangeHistoryTableCard } from "./ChangeHistoryTableCard";
import { VersionDetailsCard } from "./VersionDetailsCard";
import { CompareVersionsCard } from "./CompareVersionsCard";
import { ChangeActionsCard } from "./ChangeActionsCard";
import { HistoryFooter } from "./HistoryFooter";
import { ViewFullVersionModal } from "./ViewFullVersionModal";
import { RestoreConfirmModal } from "./RestoreConfirmModal";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface HistoryViewProps {
  initialRecords: VersionRecord[];
  initialSummary: VersionHistorySummary;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  initialRecords,
  initialSummary,
}) => {
  const [records] = useState<VersionRecord[]>(initialRecords);
  const [summary, setSummary] = useState<VersionHistorySummary>(initialSummary);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChangeType, setSelectedChangeType] = useState<ChangeType>("All");
  const [selectedStatus, setSelectedStatus] = useState<VersionStatus | "All">("All");

  // Comparison state
  const [baseVersion, setBaseVersion] = useState<string>("v1.0.3");
  const [compareVersion, setCompareVersion] = useState<string>("v1.0.4");
  const [diffs, setDiffs] = useState<TokenDiffItem[]>([
    { tokenId: "color.primary", previousValue: "#7956C9", newValue: "#6F4DB8", changeType: "Modified" },
    { tokenId: "spacing.4", previousValue: "16 px", newValue: "20 px", changeType: "Modified" },
    { tokenId: "typography.body", previousValue: "14 px", newValue: "16 px", changeType: "Added" },
  ]);
  const [isComparing, setIsComparing] = useState(false);

  // Modals & Action states
  const [fullVersionModalOpen, setFullVersionModalOpen] = useState(false);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Clear feedback after timer
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Selected Version instance
  const selectedVersion = useMemo(() => {
    if (!selectedVersionId) return null;
    return records.find((r) => r.id === selectedVersionId) || null;
  }, [selectedVersionId, records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Change Type filter
      if (selectedChangeType !== "All" && rec.changeType !== selectedChangeType) {
        return false;
      }

      // Status filter
      if (selectedStatus !== "All" && rec.status !== selectedStatus) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = rec.id.toLowerCase().includes(q);
        const matchesSummary = rec.summary.toLowerCase().includes(q);
        const matchesAuthor = rec.author.toLowerCase().includes(q);
        if (!matchesId && !matchesSummary && !matchesAuthor) {
          return false;
        }
      }

      return true;
    });
  }, [records, selectedChangeType, selectedStatus, searchQuery]);

  // Select a version
  const handleSelectVersion = (rec: VersionRecord) => {
    setSelectedVersionId((prev) => (prev === rec.id ? null : rec.id));
    if (rec.baseVersion) {
      setBaseVersion(rec.baseVersion);
      setCompareVersion(rec.id);
      if (rec.diffs.length > 0) {
        setDiffs(rec.diffs);
      }
    }
  };

  // Compare versions action
  const handleCompare = async () => {
    if (!baseVersion || !compareVersion) return;
    setIsComparing(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/design-system/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "compare",
          baseVersion,
          compareVersion,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to compare versions");
      }

      setDiffs(data.diffs || []);
      setFeedback({
        type: "success",
        text: `Compared ${baseVersion} with ${compareVersion} (${data.diffs.length} differences).`,
      });
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to compare versions",
      });
    } finally {
      setIsComparing(false);
    }
  };

  // Restore as draft action
  const handleConfirmRestore = async () => {
    if (!selectedVersion) return;
    setIsRestoring(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/design-system/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "restore",
          versionId: selectedVersion.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to restore version");
      }

      setSummary((prev) => ({
        ...prev,
        currentDraft: `${selectedVersion.id} (Restored)`,
        historySource: ".data/design-tokens.json",
      }));

      setFeedback({
        type: "success",
        text: data.message || `Version ${selectedVersion.id} restored as active working draft.`,
      });
      setRestoreModalOpen(false);
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to restore version",
      });
    } finally {
      setIsRestoring(false);
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
      <HistoryHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedChangeType={selectedChangeType}
        onChangeTypeChange={setSelectedChangeType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
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
        <HistoryMetricsRow summary={summary} />

        {/* 2. Main Two-Column Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 480px",
            gap: "24px",
            alignItems: "start",
          }}
          className="history-layout-grid"
        >
          {/* Left Column: Change History List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <ChangeHistoryTableCard
              records={filteredRecords}
              selectedVersionId={selectedVersionId}
              onSelectVersion={handleSelectVersion}
            />
          </div>

          {/* Right Column: Version Details, Compare & Actions */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              position: "sticky",
              top: "24px",
            }}
          >
            <VersionDetailsCard selectedVersion={selectedVersion} />

            <CompareVersionsCard
              records={records}
              baseVersion={baseVersion}
              onBaseVersionChange={setBaseVersion}
              compareVersion={compareVersion}
              onCompareVersionChange={setCompareVersion}
              onCompare={handleCompare}
              isComparing={isComparing}
              diffs={diffs}
            />

            <ChangeActionsCard
              selectedVersion={selectedVersion}
              onViewFullVersion={() => setFullVersionModalOpen(true)}
              onRestoreDraft={() => setRestoreModalOpen(true)}
              isRestoring={isRestoring}
            />
          </div>
        </div>

        {/* Bottom Footer */}
        <HistoryFooter summary={summary} />
      </main>

      {/* Modals */}
      <ViewFullVersionModal
        version={selectedVersion}
        isOpen={fullVersionModalOpen}
        onClose={() => setFullVersionModalOpen(false)}
      />

      <RestoreConfirmModal
        version={selectedVersion}
        isOpen={restoreModalOpen}
        onClose={() => setRestoreModalOpen(false)}
        onConfirm={handleConfirmRestore}
        isRestoring={isRestoring}
      />
    </div>
  );
};
