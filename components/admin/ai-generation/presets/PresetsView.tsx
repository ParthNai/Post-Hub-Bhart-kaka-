"use client";

import React, { useState, useCallback } from "react";
import type {
  AiPromptPreset,
  AiGlobalPromptRules,
  AiPresetMetrics,
} from "@/lib/ai-presets";
import { PresetsHeader } from "./PresetsHeader";
import { PresetKpiCards } from "./PresetKpiCards";
import { PresetLibraryCard } from "./PresetLibraryCard";
import { PromptRulesEditorCard } from "./PromptRulesEditorCard";
import { PresetDetailsCard } from "./PresetDetailsCard";
import { PromptPreviewPanel } from "./PromptPreviewPanel";
import { PresetActionsCard } from "./PresetActionsCard";
import { CreateEditPresetModal } from "./CreateEditPresetModal";
import { GlobalRulesModal } from "./GlobalRulesModal";
import { PreviewGenerationModal } from "./PreviewGenerationModal";
import { DeletePresetModal } from "./DeletePresetModal";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

interface PresetsViewProps {
  initialPresets: AiPromptPreset[];
  initialRules: AiGlobalPromptRules;
  initialMetrics: AiPresetMetrics;
  adminName?: string;
  adminRole?: string;
}

export function PresetsView({
  initialPresets,
  initialRules,
  initialMetrics,
  adminName = "Parth Patel",
  adminRole = "Administrator",
}: PresetsViewProps) {
  const [presets, setPresets] = useState<AiPromptPreset[]>(initialPresets);
  const [globalRules, setGlobalRules] = useState<AiGlobalPromptRules>(initialRules);
  const [metrics, setMetrics] = useState<AiPresetMetrics>(initialMetrics);

  // Selected Preset for inspection & details (defaults to Diwali Festival if present)
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(
    initialPresets.find((p) => p.name.includes("Diwali"))?.id || initialPresets[0]?.id || null
  );

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedSort, setSelectedSort] = useState("Last Updated");

  // Modals
  const [createEditModalOpen, setCreateEditModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<AiPromptPreset | null>(null);
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewInitialPrompt, setPreviewInitialPrompt] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      setToast({ message, type });
      setTimeout(() => {
        setToast((current) => (current?.message === message ? null : current));
      }, 4000);
    },
    []
  );


  // Filtered preset list for display
  const filteredPresets = React.useMemo(() => {
    let list = [...presets];

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All Categories" && selectedCategory !== "All") {
      list = list.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedStatus !== "All Statuses" && selectedStatus !== "All") {
      list = list.filter(
        (p) => p.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    if (selectedSort === "Name A-Z") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === "Category") {
      list.sort((a, b) => a.category.localeCompare(b.category));
    }

    return list;
  }, [presets, searchQuery, selectedCategory, selectedStatus, selectedSort]);

  // Currently selected preset
  const selectedPreset =
    presets.find((p) => p.id === selectedPresetId) ||
    presets[0] ||
    null;

  // Handle preset selection
  const handleSelectPreset = (preset: AiPromptPreset) => {
    setSelectedPresetId(preset.id);
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingPreset(null);
    setCreateEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (presetToEdit?: AiPromptPreset) => {
    const target = presetToEdit || selectedPreset;
    if (!target) return;
    setEditingPreset(target);
    setCreateEditModalOpen(true);
  };

  // Save (Create or Update) Preset
  const handleSavePreset = async (presetData: Partial<AiPromptPreset>): Promise<boolean> => {
    try {
      if (editingPreset) {
        // Update
        const res = await fetch("/api/admin/ai-generation/presets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update",
            id: editingPreset.id,
            updates: presetData,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Update failed");

        setPresets((prev) =>
          prev.map((p) => (p.id === editingPreset.id ? data.preset : p))
        );
        setMetrics(data.metrics);
        showToast(data.message || "Preset updated successfully", "success");
        return true;
      } else {
        // Create
        const res = await fetch("/api/admin/ai-generation/presets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create",
            preset: presetData,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Creation failed");

        setPresets((prev) => [data.preset, ...prev]);
        setSelectedPresetId(data.preset.id);
        setMetrics(data.metrics);
        showToast(data.message || "Preset created successfully", "success");
        return true;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving preset";
      showToast(msg, "error");
      return false;
    }
  };

  // Duplicate Preset
  const handleDuplicatePreset = async () => {
    if (!selectedPreset) return;
    try {
      const res = await fetch("/api/admin/ai-generation/presets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "duplicate",
          id: selectedPreset.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Duplication failed");

      setPresets((prev) => [data.preset, ...prev]);
      setSelectedPresetId(data.preset.id);
      setMetrics(data.metrics);
      showToast(data.message || `Preset duplicated as ${data.preset.name}`, "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error duplicating preset", "error");
    }
  };

  // Toggle Preset Status (Active <-> Draft)
  const handleToggleStatus = async () => {
    if (!selectedPreset) return;
    try {
      const res = await fetch("/api/admin/ai-generation/presets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle-status",
          id: selectedPreset.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Status update failed");

      setPresets((prev) =>
        prev.map((p) => (p.id === selectedPreset.id ? data.preset : p))
      );
      setMetrics(data.metrics);
      showToast(data.message, "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error updating status", "error");
    }
  };

  // Archive Preset
  const handleArchive = async () => {
    if (!selectedPreset) return;
    try {
      const res = await fetch("/api/admin/ai-generation/presets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "archive",
          id: selectedPreset.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Archive failed");

      setPresets((prev) =>
        prev.map((p) => (p.id === selectedPreset.id ? data.preset : p))
      );
      setMetrics(data.metrics);
      showToast(data.message, "info");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error archiving preset", "error");
    }
  };

  // Confirm Delete Preset
  const handleConfirmDelete = async (presetId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/ai-generation/presets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          id: presetId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      const remaining = presets.filter((p) => p.id !== presetId);
      setPresets(remaining);
      setSelectedPresetId(remaining[0]?.id || null);
      setMetrics(data.metrics);
      showToast("Preset deleted successfully", "success");
      return true;
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error deleting preset", "error");
      return false;
    }
  };

  // Save Global Rules
  const handleSaveGlobalRules = async (
    rulesPayload: Partial<AiGlobalPromptRules>
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/ai-generation/presets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save-rules",
          rules: rulesPayload,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Saving rules failed");

      setGlobalRules(data.globalRules);
      showToast("Global prompt rules saved successfully", "success");
      return true;
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error saving rules", "error");
      return false;
    }
  };

  // Reset to Defaults
  const handleResetToDefaults = async () => {
    if (!window.confirm("Reset all presets and global rules to canonical default state?")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/ai-generation/presets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const data = await res.json();
      if (res.ok) {
        setPresets(data.presets);
        setGlobalRules(data.globalRules);
        setMetrics(data.metrics);
        setSelectedPresetId(data.presets[0]?.id || null);
        showToast("Presets and rules reset to defaults", "info");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Clear Filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedStatus("All Statuses");
    setSelectedSort("Last Updated");
  };

  // Filter KPI card click
  const handleKpiFilter = (status: string) => {
    if (status === "All") {
      handleClearFilters();
    } else {
      setSelectedStatus(status === "active" ? "Active" : status === "draft" ? "Draft" : "All Statuses");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#24213A] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-medium transition-all transform animate-in fade-in slide-in-from-top-2 ${
            toast.type === "success"
              ? "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]"
              : toast.type === "error"
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : "bg-[#E8DFF5] text-[#7956C9] border-[#D8C7F0]"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : toast.type === "error" ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <Info className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 text-current opacity-70 hover:opacity-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <PresetsHeader
        onCreateClick={handleOpenCreateModal}
        onRulesClick={() => setRulesModalOpen(true)}
        onPreviewClick={() => {
          setPreviewInitialPrompt("");
          setPreviewModalOpen(true);
        }}
        userName={adminName}
        userRole={adminRole}
      />

      {/* KPI Cards */}
      <PresetKpiCards metrics={metrics} onFilterClick={handleKpiFilter} />

      {/* Main Grid: Left Preset Library (70%) + Right Prompt Rules Editor (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <PresetLibraryCard
            presets={filteredPresets}
            selectedPresetId={selectedPreset?.id || null}
            onSelectPreset={handleSelectPreset}
            onEditPreset={(p) => handleOpenEditModal(p)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <PromptRulesEditorCard
            initialRules={globalRules}
            onSaveRules={handleSaveGlobalRules}
            onResetToDefaults={handleResetToDefaults}
          />
        </div>
      </div>

      {/* Bottom Row: 3 Equal-height Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Bottom Left: Preset Details */}
        <PresetDetailsCard preset={selectedPreset} />

        {/* Bottom Middle: Preview Panel */}
        <PromptPreviewPanel
          preset={selectedPreset}
          globalRules={globalRules}
          onOpenSimulator={(prompt) => {
            setPreviewInitialPrompt(prompt);
            setPreviewModalOpen(true);
          }}
        />

        {/* Bottom Right: Preset Management Actions */}
        <PresetActionsCard
          selectedPreset={selectedPreset}
          onCreateClick={handleOpenCreateModal}
          onEditClick={() => handleOpenEditModal()}
          onDuplicateClick={handleDuplicatePreset}
          onToggleStatusClick={handleToggleStatus}
          onArchiveClick={handleArchive}
          onDeleteClick={() => setDeleteModalOpen(true)}
        />
      </div>

      {/* Modals */}
      <CreateEditPresetModal
        isOpen={createEditModalOpen}
        onClose={() => setCreateEditModalOpen(false)}
        onSave={handleSavePreset}
        initialPreset={editingPreset}
      />

      <GlobalRulesModal
        isOpen={rulesModalOpen}
        onClose={() => setRulesModalOpen(false)}
        rules={globalRules}
        onSave={handleSaveGlobalRules}
      />

      <PreviewGenerationModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        presets={presets}
        initialPreset={selectedPreset}
        globalRules={globalRules}
        initialPrompt={previewInitialPrompt}
      />

      <DeletePresetModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        preset={selectedPreset}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
