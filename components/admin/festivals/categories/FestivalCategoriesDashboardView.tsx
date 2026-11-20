"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { FestivalCategoriesHeader } from "./FestivalCategoriesHeader";
import { CategorySummaryCards } from "./CategorySummaryCards";
import { CategoryGridSection } from "./CategoryGridSection";
import { RecentlyAssociatedEventsTable } from "./RecentlyAssociatedEventsTable";
import { CategoryDetailsCard } from "./CategoryDetailsCard";
import { CategoryDisplaySettingsCard } from "./CategoryDisplaySettingsCard";
import { AddEditCategoryDrawer } from "./AddEditCategoryDrawer";
import { CategorySettingsModal } from "./CategorySettingsModal";
import { ReorderCategoriesModal } from "./ReorderCategoriesModal";
import { CategoryEventsModal } from "./CategoryEventsModal";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { ChangePriorityModal } from "./ChangePriorityModal";

import {
  type FestivalCategory,
  type CategorySummaryMetrics,
  type CategoryDisplaySettings,
  CANONICAL_FESTIVAL_CATEGORIES_DATASET,
} from "@/lib/festival-categories";
import { type FestivalEvent } from "@/lib/festivals";

export const FestivalCategoriesDashboardView: React.FC = () => {
  // Main Data States
  const [categories, setCategories] = useState<FestivalCategory[]>(
    CANONICAL_FESTIVAL_CATEGORIES_DATASET.categories
  );
  const [metrics, setMetrics] = useState<CategorySummaryMetrics>(
    CANONICAL_FESTIVAL_CATEGORIES_DATASET.summary
  );
  const [displaySettings, setDisplaySettings] = useState<CategoryDisplaySettings>(
    CANONICAL_FESTIVAL_CATEGORIES_DATASET.displaySettings
  );
  const [associatedEvents, setAssociatedEvents] = useState<FestivalEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FestivalCategory | null>(
    CANONICAL_FESTIVAL_CATEGORIES_DATASET.categories[0] || null
  );

  // Filters & Sorting States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [sortBy, setSortBy] = useState("priority");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeMetricFilter, setActiveMetricFilter] = useState<string | null>(null);

  // Modal & Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerEditingCategory, setDrawerEditingCategory] = useState<FestivalCategory | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);
  const [eventsModalCategory, setEventsModalCategory] = useState<FestivalCategory | null>(null);
  const [eventsModalList, setEventsModalList] = useState<FestivalEvent[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTargetCategory, setDeleteTargetCategory] = useState<FestivalCategory | null>(null);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [priorityTargetCategory, setPriorityTargetCategory] = useState<FestivalCategory | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch Dataset from Backend API
  const fetchDataset = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (selectedType !== "All Types") params.set("type", selectedType);
      if (selectedStatus !== "All Status") params.set("status", selectedStatus);
      if (sortBy) params.set("sort", sortBy);
      if (sortDirection) params.set("direction", sortDirection);
      if (selectedCategory) params.set("categoryId", selectedCategory.id);

      const res = await fetch(`/api/admin/festivals/categories?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load category dataset");
      const data = await res.json();

      if (data.success) {
        let fetchedCats: FestivalCategory[] = data.categories || [];

        // Apply Metric Filter locally if active
        if (activeMetricFilter === "active") {
          fetchedCats = fetchedCats.filter((c) => c.status === "Active");
        } else if (activeMetricFilter === "without-events") {
          fetchedCats = fetchedCats.filter((c) => !c.eventCount || c.eventCount === 0);
        }

        setCategories(fetchedCats);
        setMetrics(data.summary);
        setDisplaySettings(data.displaySettings);

        if (data.associatedEvents) {
          setAssociatedEvents(data.associatedEvents);
        }

        // Keep selected category current
        if (selectedCategory) {
          const matched = (data.allCategories || fetchedCats).find(
            (c: FestivalCategory) => c.id === selectedCategory.id
          );
          if (matched) setSelectedCategory(matched);
        } else if (fetchedCats.length > 0) {
          setSelectedCategory(fetchedCats[0]);
        }
      }
    } catch (err: unknown) {
      console.error("Error fetching categories:", err);
    }
  }, [searchQuery, selectedType, selectedStatus, sortBy, sortDirection, activeMetricFilter, selectedCategory]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDataset();
  }, [fetchDataset]);

  // Handle Card Click
  const handleSelectCategory = async (cat: FestivalCategory) => {
    setSelectedCategory(cat);
    try {
      const res = await fetch(`/api/admin/festivals/categories?categoryId=${cat.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.associatedEvents) {
          setAssociatedEvents(data.associatedEvents);
        }
      }
    } catch {
      // fallback
    }
  };

  // Drawer Create / Edit
  const handleOpenAddCategory = () => {
    setDrawerEditingCategory(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditCategory = (cat: FestivalCategory) => {
    setDrawerEditingCategory(cat);
    setIsDrawerOpen(true);
  };

  const handleSaveDrawer = async (data: Partial<FestivalCategory>) => {
    const isEdit = Boolean(drawerEditingCategory);
    const res = await fetch("/api/admin/festivals/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: isEdit ? "update" : "create",
        id: drawerEditingCategory?.id,
        category: data,
      }),
    });

    const result = await res.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to save category");
    }

    showToast(result.message || "Category saved successfully.");
    await fetchDataset();
  };

  // Card Menu Actions
  const handleDuplicate = async (cat: FestivalCategory) => {
    try {
      const res = await fetch("/api/admin/festivals/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate", id: cat.id }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showToast(data.message);
      await fetchDataset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to duplicate category";
      showToast(msg);
    }
  };

  const handleToggleStatus = async (cat: FestivalCategory) => {
    try {
      const res = await fetch("/api/admin/festivals/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggleStatus", id: cat.id }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showToast(data.message);
      await fetchDataset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update category status";
      showToast(msg);
    }
  };

  const handleToggleFeatured = async (cat: FestivalCategory) => {
    try {
      const res = await fetch("/api/admin/festivals/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          id: cat.id,
          category: { isFeatured: !cat.isFeatured },
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showToast(`Category ${cat.isFeatured ? "unfeatured" : "featured"} successfully.`);
      await fetchDataset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update featured status";
      showToast(msg);
    }
  };

  const handleChangePriority = (cat: FestivalCategory) => {
    setPriorityTargetCategory(cat);
    setIsPriorityModalOpen(true);
  };

  const handleSavePriority = async (categoryId: string, priority: number) => {
    const res = await fetch("/api/admin/festivals/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update",
        id: categoryId,
        category: { displayPriority: priority },
      }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    showToast("Display priority updated.");
    await fetchDataset();
  };

  const handleDeletePrompt = (cat: FestivalCategory) => {
    setDeleteTargetCategory(cat);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (categoryId: string, reassignToId?: string) => {
    const res = await fetch("/api/admin/festivals/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete",
        id: categoryId,
        reassignToId,
      }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    showToast(data.message);
    if (selectedCategory?.id === categoryId) {
      setSelectedCategory(null);
    }
    await fetchDataset();
  };

  const handleViewEvents = async (cat: FestivalCategory) => {
    setEventsModalCategory(cat);
    try {
      const res = await fetch("/api/admin/festivals/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getEvents", categoryId: cat.id }),
      });
      const data = await res.json();
      if (data.success && data.events) {
        setEventsModalList(data.events);
      } else {
        setEventsModalList([]);
      }
    } catch {
      setEventsModalList([]);
    }
    setIsEventsModalOpen(true);
  };

  // Reorder Categories
  const handleSaveReorder = async (orderedIds: string[]) => {
    const res = await fetch("/api/admin/festivals/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reorder", orderedIds }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    showToast("Categories reordered successfully.");
    await fetchDataset();
  };

  // Display Settings update
  const handleUpdateDisplaySettings = async (partialSettings: Partial<CategoryDisplaySettings>) => {
    try {
      const res = await fetch("/api/admin/festivals/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateDisplaySettings", settings: partialSettings }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDisplaySettings(data.displaySettings);
      showToast("Display settings updated.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update display settings";
      showToast(msg);
    }
  };

  // Metric card quick filters
  const handleSelectMetricFilter = (filterKey: string | null) => {
    setActiveMetricFilter(filterKey);
    if (filterKey === "active") {
      setSelectedStatus("Active");
    } else {
      setSelectedStatus("All Status");
    }
  };

  return (
    <div
      style={{
        padding: "24px 32px 60px",
        maxWidth: "1600px",
        margin: "0 auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        backgroundColor: "#FAF7F2",
      }}>
      {/* Toast Banner */}
            {toastMessage && (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "10px 16px",
                  backgroundColor: "#DEF7EC",
                  color: "#03543F",
                  borderRadius: "8px",
                  border: "1px solid #BCF0DA",
                  fontSize: "13px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>{toastMessage}</span>
                <button
                  type="button"
                  onClick={() => setToastMessage(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#03543F",
                    fontWeight: 700,
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Page Header */}
            <FestivalCategoriesHeader
              onOpenSettings={() => setIsSettingsModalOpen(true)}
              onOpenReorder={() => setIsReorderModalOpen(true)}
              onOpenAddCategory={handleOpenAddCategory}
            />

            {/* 4 Summary Cards */}
            <CategorySummaryCards
              metrics={metrics}
              activeFilter={activeMetricFilter}
              onSelectFilter={handleSelectMetricFilter}
            />

            {/* All Festival & Event Categories 3x3 Grid */}
            <CategoryGridSection
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortDirection={sortDirection}
              onToggleDirection={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onEdit={handleOpenEditCategory}
              onDuplicate={handleDuplicate}
              onToggleStatus={handleToggleStatus}
              onToggleFeatured={handleToggleFeatured}
              onChangePriority={handleChangePriority}
              onDelete={handleDeletePrompt}
              onViewEvents={handleViewEvents}
            />

            {/* Bottom 2-Column Section matching reference image:
                Left: Recently Associated Events table & Category Display Settings card
                Right: Category Details card */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 0.8fr",
                gap: "20px",
                alignItems: "start",
              }}
            >
              {/* Left Column: Recently Associated Events + Display Settings */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <RecentlyAssociatedEventsTable
                  events={associatedEvents}
                  onViewEvent={() => {
                    if (selectedCategory) handleViewEvents(selectedCategory);
                  }}
                />

                <CategoryDisplaySettingsCard
                  settings={displaySettings}
                  onUpdateSettings={handleUpdateDisplaySettings}
                />
              </div>

              {/* Right Column: Category Details Card */}
              <div>
                <CategoryDetailsCard
                  category={selectedCategory}
                  onEdit={handleOpenEditCategory}
                  onViewEvents={handleViewEvents}
                />
              </div>
            </div>
          

        {/* Right-Side Add / Edit Drawer */}
        <AddEditCategoryDrawer
          isOpen={isDrawerOpen}
          category={drawerEditingCategory}
          onClose={() => setIsDrawerOpen(false)}
          onSave={handleSaveDrawer}
        />

        {/* Category & Taxonomy Settings Modal */}
        <CategorySettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onSaveSettings={() => showToast("Category taxonomy rules saved.")}
        />

        {/* Reorder Priorities Modal */}
        <ReorderCategoriesModal
          isOpen={isReorderModalOpen}
          categories={categories}
          onClose={() => setIsReorderModalOpen(false)}
          onSaveReorder={handleSaveReorder}
        />

        {/* Associated Events Modal */}
        <CategoryEventsModal
          isOpen={isEventsModalOpen}
          category={eventsModalCategory}
          events={eventsModalList}
          onClose={() => setIsEventsModalOpen(false)}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteCategoryDialog
          isOpen={isDeleteDialogOpen}
          category={deleteTargetCategory}
          categories={categories}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirmDelete={handleConfirmDelete}
        />

        {/* Change Priority Quick Modal */}
        <ChangePriorityModal
          isOpen={isPriorityModalOpen}
          category={priorityTargetCategory}
          onClose={() => setIsPriorityModalOpen(false)}
          onSavePriority={handleSavePriority}
        />
      </div>
      );
};
