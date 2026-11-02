"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ImagesHeader } from "./ImagesHeader";
import { ImageKpiCards } from "./ImageKpiCards";
import { ImageToolbar } from "./ImageToolbar";
import { BulkActionBar } from "./BulkActionBar";
import { ImageGalleryGrid } from "./ImageGalleryGrid";
import { ImageDetailsPanel } from "./ImageDetailsPanel";
import { QuickViewModal } from "./QuickViewModal";
import { RejectReasonModal } from "./RejectReasonModal";
import { FlagReasonModal } from "./FlagReasonModal";
import { ModerationHistoryModal } from "./ModerationHistoryModal";
import { ModerationSettingsModal } from "./ModerationSettingsModal";
import type {
  AiGeneratedImage,
  AiImageMetrics,
  AiImageModerationSettings,
} from "@/lib/ai-images";

interface ImagesViewProps {
  initialImages?: AiGeneratedImage[];
  initialMetrics?: AiImageMetrics;
  initialSettings?: AiImageModerationSettings;
  adminName?: string;
  adminRole?: string;
}

const DEFAULT_METRICS: AiImageMetrics = {
  totalImages: 1248,
  totalChange: "↑ 12%",
  approvedCount: 1102,
  approvedChange: "↑ 14%",
  approvalRate: "88.3%",
  pendingCount: 67,
  pendingRate: "5.4%",
  rejectedCount: 79,
  rejectionRate: "6.3%",
};

const DEFAULT_SETTINGS: AiImageModerationSettings = {
  autoApproveSafe: false,
  strictnessLevel: "standard",
  flagNudity: true,
  flagHateSpeech: true,
  flagViolence: true,
  retentionDays: 90,
};

export const ImagesView: React.FC<ImagesViewProps> = ({
  initialImages = [],
  initialMetrics = DEFAULT_METRICS,
  initialSettings = DEFAULT_SETTINGS,
  adminName = "Parth Patel",
  adminRole = "Administrator",
}) => {
  // Core state
  const [images, setImages] = useState<AiGeneratedImage[]>(initialImages);
  const [metrics, setMetrics] = useState<AiImageMetrics>(initialMetrics);
  const [settings, setSettings] = useState<AiImageModerationSettings>(initialSettings);
  const [selectedImage, setSelectedImage] = useState<AiGeneratedImage | null>(
    initialImages.length > 0 ? initialImages[0] : null
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [selectedProvider, setSelectedProvider] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(157);
  const [totalCount, setTotalCount] = useState(1248);

  // Loading & feedback
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Track initial mount
  const isFirstMount = React.useRef(true);

  // Modals state
  const [quickViewImage, setQuickViewImage] = useState<AiGeneratedImage | null>(null);
  const [rejectModalImageId, setRejectModalImageId] = useState<string | null>(null);
  const [flagModalImageId, setFlagModalImageId] = useState<string | null>(null);
  const [historyModalImageId, setHistoryModalImageId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Fetch images based on current filters and pagination
  const fetchImages = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("query", searchQuery.trim());
      if (selectedUser !== "all") params.set("user", selectedUser);
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (selectedStatus !== "all") params.set("status", selectedStatus);
      if (selectedTimeRange !== "all") params.set("timeRange", selectedTimeRange);
      if (selectedProvider !== "all") params.set("provider", selectedProvider);
      params.set("page", String(currentPage));
      params.set("pageSize", String(pageSize));

      const res = await fetch(`/api/admin/ai-generation/images?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setImages(data.images || []);
        setMetrics(data.metrics || DEFAULT_METRICS);
        if (data.settings) setSettings(data.settings);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);

        // Keep or sync selectedImage
        if (data.images && data.images.length > 0) {
          setSelectedImage((prev) => {
            if (!prev) return data.images[0];
            const updated = data.images.find((i: AiGeneratedImage) => i.id === prev.id);
            return updated || data.images[0];
          });
        }
      }
    } catch (err) {
      console.error("Failed to load generated images:", err);
    }
  }, [
    searchQuery,
    selectedUser,
    selectedCategory,
    selectedStatus,
    selectedTimeRange,
    selectedProvider,
    currentPage,
    pageSize,
  ]);

  // Load on query param changes (skipping initial mount since initial data is server-rendered)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    fetchImages();
  }, [fetchImages]);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchImages();
    setIsRefreshing(false);
    setToast({ type: "info", message: "Image library refreshed." });
  };

  // Reset filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedUser("all");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSelectedTimeRange("all");
    setSelectedProvider("all");
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  const isAllSelected = useMemo(() => {
    return images.length > 0 && images.every((img) => selectedIds.has(img.id));
  }, [images, selectedIds]);

  // Bulk selection toggles
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(images.map((img) => img.id)));
    }
  };

  const handleToggleSelectId = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Single Approve
  const handleApprove = async (id: string, notes: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/ai-generation/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          id,
          reviewer: adminName,
          notes,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToast({ type: "success", message: `Image ${id} approved successfully.` });
        await fetchImages();
        return true;
      } else {
        setToast({ type: "error", message: data.error || "Failed to approve image." });
        return false;
      }
    } catch {
      setToast({ type: "error", message: "Failed to approve image." });
      return false;
    }
  };

  // Single Reject confirm
  const handleConfirmReject = async (
    id: string,
    reason: string,
    notes: string
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/ai-generation/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          id,
          reason,
          reviewer: adminName,
          notes,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToast({ type: "success", message: `Image ${id} rejected.` });
        await fetchImages();
        return true;
      } else {
        setToast({ type: "error", message: data.error || "Failed to reject image." });
        return false;
      }
    } catch {
      setToast({ type: "error", message: "Failed to reject image." });
      return false;
    }
  };

  // Single Flag confirm
  const handleConfirmFlag = async (id: string, reason: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/ai-generation/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "flag",
          id,
          reason,
          reviewer: adminName,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToast({ type: "info", message: `Image ${id} flagged for policy review.` });
        await fetchImages();
        return true;
      } else {
        setToast({ type: "error", message: data.error || "Failed to flag image." });
        return false;
      }
    } catch {
      setToast({ type: "error", message: "Failed to flag image." });
      return false;
    }
  };

  // Bulk actions
  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return;
    try {
      const res = await fetch("/api/admin/ai-generation/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bulk-approve",
          ids: Array.from(selectedIds),
          reviewer: adminName,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToast({
          type: "success",
          message: `Approved ${selectedIds.size} selected image(s).`,
        });
        setSelectedIds(new Set());
        await fetchImages();
      }
    } catch {
      setToast({ type: "error", message: "Failed to execute bulk approval." });
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.size === 0) return;
    try {
      const res = await fetch("/api/admin/ai-generation/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bulk-reject",
          ids: Array.from(selectedIds),
          reason: "Bulk admin rejection",
          reviewer: adminName,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToast({
          type: "success",
          message: `Rejected ${selectedIds.size} selected image(s).`,
        });
        setSelectedIds(new Set());
        await fetchImages();
      }
    } catch {
      setToast({ type: "error", message: "Failed to execute bulk rejection." });
    }
  };

  const handleBulkArchive = async () => {
    if (selectedIds.size === 0) return;
    try {
      const res = await fetch("/api/admin/ai-generation/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bulk-archive",
          ids: Array.from(selectedIds),
          reviewer: adminName,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToast({
          type: "success",
          message: `Archived ${selectedIds.size} selected image(s).`,
        });
        setSelectedIds(new Set());
        await fetchImages();
      }
    } catch {
      setToast({ type: "error", message: "Failed to execute bulk archive." });
    }
  };

  // Export CSV
  const handleExportCsv = async () => {
    try {
      const res = await fetch("/api/admin/ai-generation/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "export" }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ai-generated-images-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        setToast({ type: "success", message: "CSV exported successfully." });
      }
    } catch {
      setToast({ type: "error", message: "Failed to export CSV." });
    }
  };

  // Moderation Settings save
  const handleSaveSettings = async (
    newSettings: Partial<AiImageModerationSettings>
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/ai-generation/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-settings",
          settings: newSettings,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.settings);
        setToast({
          type: "success",
          message: "Moderation settings updated successfully.",
        });
        return true;
      }
      return false;
    } catch {
      setToast({ type: "error", message: "Failed to save moderation settings." });
      return false;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF7F2",
        padding: "24px 32px 48px 32px",
        fontFamily: "inherit",
      }}
    >
      {/* Toast Feedback */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 99999,
            padding: "12px 20px",
            borderRadius: "10px",
            backgroundColor:
              toast.type === "success"
                ? "#10B981"
                : toast.type === "error"
                ? "#EF4444"
                : "#7956C9",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 600,
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.15)",
            animation: "fadeIn 0.2s ease",
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Top Header */}
      <ImagesHeader
        userName={adminName}
        userRole={adminRole}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExport={handleExportCsv}
      />

      {/* Top KPI Cards (1,248 | 1,102 | 67 | 79) */}
      <div style={{ marginTop: "24px", marginBottom: "24px" }}>
        <ImageKpiCards metrics={metrics} />
      </div>

      {/* Main Container */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #EAE4EE",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          overflow: "hidden",
        }}
      >
        {/* Filter Toolbar */}
        <div style={{ padding: "16px 20px" }}>
          <ImageToolbar
            searchQuery={searchQuery}
            setSearchQuery={(q: string) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            selectedUser={selectedUser}
            setSelectedUser={(u: string) => {
              setSelectedUser(u);
              setCurrentPage(1);
            }}
            selectedCategory={selectedCategory}
            setSelectedCategory={(c: string) => {
              setSelectedCategory(c);
              setCurrentPage(1);
            }}
            selectedStatus={selectedStatus}
            setSelectedStatus={(s: string) => {
              setSelectedStatus(s);
              setCurrentPage(1);
            }}
            selectedTimeRange={selectedTimeRange}
            setSelectedTimeRange={(t: string) => {
              setSelectedTimeRange(t);
              setCurrentPage(1);
            }}
            selectedProvider={selectedProvider}
            setSelectedProvider={(p: string) => {
              setSelectedProvider(p);
              setCurrentPage(1);
            }}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Bulk Action Bar */}
        <div style={{ padding: "0 20px 16px 20px" }}>
          <BulkActionBar
            allSelected={isAllSelected}
            selectedCount={selectedIds.size}
            onToggleSelectAll={handleToggleSelectAll}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
            onBulkArchive={handleBulkArchive}
          />
        </div>

        {/* Content Body: Left Gallery Grid + Right Sticky Details Panel */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "0px",
            borderTop: "1px solid #EAE4EE",
            minHeight: "700px",
          }}
        >
          {/* Left Column: Gallery Grid */}
          <div
            style={{
              padding: "20px 24px 28px 24px",
              borderRight: "1px solid #EAE4EE",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ImageGalleryGrid
              images={images}
              selectedImageId={selectedImage?.id || null}
              selectedIds={Array.from(selectedIds)}
              onSelectImage={(img) => setSelectedImage(img)}
              onToggleSelectId={handleToggleSelectId}
              onQuickView={(img) => setQuickViewImage(img)}
              page={currentPage}
              totalPages={totalPages}
              total={totalCount}
              pageSize={pageSize}
              onPageChange={(p) => {
                setCurrentPage(p);
                window.scrollTo({ top: 320, behavior: "smooth" });
              }}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Right Column: Image Details Panel & Moderation Workspace */}
          <div
            style={{
              padding: "20px 20px 28px 20px",
              backgroundColor: "#FAF7F2",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ImageDetailsPanel
              image={selectedImage}
              onClose={() => setSelectedImage(null)}
              onApprove={handleApprove}
              onReject={(id) => setRejectModalImageId(id)}
              onFlag={(id) => setFlagModalImageId(id)}
              onViewHistory={(id) => setHistoryModalImageId(id)}
            />
          </div>
        </div>
      </div>

      {/* Modal 1: Quick View */}
      <QuickViewModal
        isOpen={Boolean(quickViewImage)}
        onClose={() => setQuickViewImage(null)}
        image={quickViewImage}
        onApprove={async (id) => {
          await handleApprove(id, "Approved via Quick View");
        }}
        onReject={(id) => {
          setRejectModalImageId(id);
          setQuickViewImage(null);
        }}
        onFlag={(id) => {
          setFlagModalImageId(id);
          setQuickViewImage(null);
        }}
      />

      {/* Modal 2: Rejection Reason */}
      <RejectReasonModal
        isOpen={Boolean(rejectModalImageId)}
        onClose={() => setRejectModalImageId(null)}
        imageId={rejectModalImageId}
        onConfirm={handleConfirmReject}
      />

      {/* Modal 3: Flag Policy Reason */}
      <FlagReasonModal
        isOpen={Boolean(flagModalImageId)}
        onClose={() => setFlagModalImageId(null)}
        imageId={flagModalImageId}
        onConfirm={handleConfirmFlag}
      />

      {/* Modal 4: Moderation Audit Trail History */}
      <ModerationHistoryModal
        isOpen={Boolean(historyModalImageId)}
        onClose={() => setHistoryModalImageId(null)}
        imageId={historyModalImageId}
      />

      {/* Modal 5: Moderation Settings */}
      <ModerationSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  );
};
