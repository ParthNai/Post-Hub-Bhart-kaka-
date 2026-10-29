"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  Info,
  X,
  SearchX,
} from "lucide-react";
import { TopHeader } from "@/components/admin/TopHeader";
import { AppScreen } from "@/lib/screens";
import { ScreenCard } from "@/components/admin/screens/ScreenCard";
import { ScreenListView } from "@/components/admin/screens/ScreenListView";
import { ManageScreenDrawer } from "@/components/admin/screens/ManageScreenDrawer";
import { AddScreenModal } from "@/components/admin/screens/AddScreenModal";
import { EditScreenModal } from "@/components/admin/screens/EditScreenModal";
import { JsonConfigModal } from "@/components/admin/screens/JsonConfigModal";
import { ConfirmModal } from "@/components/admin/screens/ConfirmModal";

interface AppScreensViewProps {
  initialScreens: AppScreen[];
  adminName?: string;
  adminEmail?: string;
  onMenuToggle?: () => void;
}

export const AppScreensView: React.FC<AppScreensViewProps> = ({
  initialScreens,
  adminName = "Admin Workspace",
  adminEmail = "admin@posthub.io",
  onMenuToggle,
}) => {
  const [screens, setScreens] = useState<AppScreen[]>(initialScreens);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Screens");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modals & Drawer State
  const [activeManageScreen, setActiveManageScreen] = useState<AppScreen | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editScreen, setEditScreen] = useState<AppScreen | null>(null);
  const [jsonScreen, setJsonScreen] = useState<AppScreen | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<AppScreen | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppScreen | null>(null);

  // Filter categories
  const categories = ["All Screens", "Navigation", "Content", "Creation", "Account"];
  const statuses = ["All", "Configured", "Needs Setup"];

  // Filter logic
  const filteredScreens = useMemo(() => {
    return screens.filter((screen) => {
      // Exclude archived by default unless filtering by status or search
      if (screen.status === "archived" && selectedStatus !== "Archived") {
        return false;
      }

      // Search matching name, key, or description
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = screen.name.toLowerCase().includes(q);
        const matchesKey = screen.key.toLowerCase().includes(q);
        const matchesDesc = screen.description.toLowerCase().includes(q);
        if (!matchesName && !matchesKey && !matchesDesc) {
          return false;
        }
      }

      // Category matching
      if (selectedCategory !== "All Screens") {
        if (screen.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Status matching
      if (selectedStatus !== "All") {
        const normSelected = selectedStatus.toLowerCase().replace(/\s+/g, "_");
        if (screen.status.toLowerCase() !== normSelected) {
          return false;
        }
      }

      return true;
    });
  }, [screens, searchQuery, selectedCategory, selectedStatus]);

  // Handlers
  const handleScreenCreated = (newScreen: AppScreen) => {
    setScreens((prev) => [newScreen, ...prev]);
  };

  const handleScreenUpdated = (updated: AppScreen) => {
    setScreens((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    if (activeManageScreen?.id === updated.id) {
      setActiveManageScreen(updated);
    }
  };

  const handleArchiveConfirm = async () => {
    if (!archiveTarget) return;
    try {
      const res = await fetch(`/api/admin/screens/${archiveTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setScreens((prev) =>
          prev.map((s) => (s.id === archiveTarget.id ? { ...s, status: "archived" } : s))
        );
      }
    } catch (err) {
      console.error("Archive error:", err);
    } finally {
      setArchiveTarget(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/screens/${deleteTarget.id}?hard=true`, {
        method: "DELETE",
      });
      if (res.ok) {
        setScreens((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Screens");
    setSelectedStatus("All");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
      }}
    >
      {/* 1. Top Header */}
      <TopHeader
        title="App Screens"
        subtitle="Manage the structure and configurable content of your Post Hub app."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "App Screens", href: "/admin/app-screens" },
        ]}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMenuToggle={onMenuToggle}
        adminName={adminName}
        adminEmail={adminEmail}
      />

      {/* 2. Main Content Container */}
      <main
        style={{
          flex: 1,
          padding: "8px 36px 40px 36px",
          display: "flex",
          flexDirection: "column",
          gap: "22px",
          maxWidth: "1600px",
          width: "100%",
          margin: "0 auto",
        }}
        className="app-screens-content"
      >
        {/* 3. Filter Toolbar Row */}
        <section
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            padding: "4px 0",
          }}
          className="screens-toolbar-row"
          aria-label="App Screens filters and search"
        >
          {/* Left: Search input */}
          <div
            style={{
              position: "relative",
              width: "240px",
            }}
            className="toolbar-search-box"
          >
            <Search
              size={15}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-light)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search by screen name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                height: "36px",
                paddingLeft: "34px",
                paddingRight: searchQuery ? "28px" : "12px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12.5px",
                color: "var(--text)",
                outline: "none",
              }}
              className="toolbar-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear toolbar search"
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: "2px",
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Middle: Category filter group */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>
              Category
            </span>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                flexWrap: "wrap",
              }}
            >
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "6px",
                      border: isActive ? "none" : "1px solid var(--border)",
                      backgroundColor: isActive ? "var(--primary)" : "var(--surface)",
                      color: isActive ? "#FFFFFF" : "var(--text)",
                      fontSize: "12px",
                      fontWeight: isActive ? 600 : 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    className={`filter-pill ${isActive ? "active" : ""}`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Middle-Right: Status filter group */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>
              Status
            </span>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {statuses.map((st) => {
                const isActive = selectedStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStatus(st)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "6px",
                      border: isActive ? "none" : "1px solid var(--border)",
                      backgroundColor: isActive ? "var(--primary)" : "var(--surface)",
                      color: isActive ? "#FFFFFF" : "var(--text)",
                      fontSize: "12px",
                      fontWeight: isActive ? 600 : 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    className={`filter-pill ${isActive ? "active" : ""}`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: View Toggle (Grid / List) + Add Screen Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "auto" }}>
            {/* View Mode Switcher */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "2px",
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Switch to grid view"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: viewMode === "grid" ? "var(--secondary)" : "transparent",
                  color: viewMode === "grid" ? "var(--primary)" : "var(--text-muted)",
                  fontSize: "12px",
                  fontWeight: viewMode === "grid" ? 600 : 500,
                  cursor: "pointer",
                }}
              >
                <LayoutGrid size={14} />
                <span>Grid</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="Switch to list view"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: viewMode === "list" ? "var(--secondary)" : "transparent",
                  color: viewMode === "list" ? "var(--primary)" : "var(--text-muted)",
                  fontSize: "12px",
                  fontWeight: viewMode === "list" ? 600 : 500,
                  cursor: "pointer",
                }}
              >
                <List size={14} />
                <span>List</span>
              </button>
            </div>

            {/* + Add Screen Action Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "var(--primary)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(121, 86, 201, 0.2)",
                transition: "background-color 0.15s ease",
              }}
              className="add-screen-btn"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Add Screen</span>
            </button>
          </div>
        </section>

        {/* 4. Screen Inventory (Grid or List View) */}
        <section aria-label="App Screens Inventory">
          {filteredScreens.length === 0 ? (
            /* Empty State */
            <div
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "14px",
                border: "1px solid var(--border)",
                padding: "60px 24px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SearchX size={24} />
              </div>

              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", margin: 0 }}>
                No screens match your filters
              </h3>

              <p style={{ fontSize: "13px", color: "var(--text-muted)", maxWidth: "340px", margin: 0 }}>
                {searchQuery
                  ? `No screen matches "${searchQuery}" in category "${selectedCategory}".`
                  : "No screens found with the selected filter criteria."}
              </p>

              <button
                type="button"
                onClick={resetFilters}
                style={{
                  marginTop: "8px",
                  padding: "7px 16px",
                  borderRadius: "6px",
                  backgroundColor: "var(--primary-light)",
                  color: "var(--primary)",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Reset all filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* 2x3 Responsive Grid */
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "20px",
              }}
              className="screens-grid"
            >
              {filteredScreens.map((screen) => (
                <ScreenCard
                  key={screen.id}
                  screen={screen}
                  onManage={setActiveManageScreen}
                  onEdit={setEditScreen}
                  onViewConfig={setJsonScreen}
                  onArchive={setArchiveTarget}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          ) : (
            /* List View */
            <ScreenListView
              screens={filteredScreens}
              onManage={setActiveManageScreen}
              onEdit={setEditScreen}
              onArchive={setArchiveTarget}
            />
          )}
        </section>

        {/* 5. Bottom Information Strip */}
        <section aria-label="Configuration safety notice">
          <div
            style={{
              backgroundColor: "#FAF7FD",
              border: "1px solid #E8DFF5",
              borderRadius: "10px",
              padding: "12px 18px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Info size={18} />
            </div>

            <div style={{ fontSize: "12px", color: "var(--text)", lineHeight: 1.5 }}>
              <div>
                Screen configuration changes affect only supported app components and settings.
              </div>
              <div style={{ color: "var(--text-muted)" }}>
                Changes should be reviewed before publishing.
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Configuration Drawer */}
      <ManageScreenDrawer
        screen={activeManageScreen}
        isOpen={Boolean(activeManageScreen)}
        onClose={() => setActiveManageScreen(null)}
        onSave={handleScreenUpdated}
      />

      {/* Add Screen Modal */}
      <AddScreenModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={handleScreenCreated}
      />

      {/* Edit Screen Details Modal */}
      <EditScreenModal
        screen={editScreen}
        isOpen={Boolean(editScreen)}
        onClose={() => setEditScreen(null)}
        onUpdated={handleScreenUpdated}
      />

      {/* View JSON Config Modal */}
      <JsonConfigModal
        screen={jsonScreen}
        isOpen={Boolean(jsonScreen)}
        onClose={() => setJsonScreen(null)}
      />

      {/* Archive Screen Confirmation */}
      <ConfirmModal
        isOpen={Boolean(archiveTarget)}
        title="Archive Screen"
        message={`Are you sure you want to archive "${archiveTarget?.name}"? Archived screens are preserved in the database but hidden from active app navigation.`}
        confirmLabel="Archive Screen"
        onConfirm={handleArchiveConfirm}
        onCancel={() => setArchiveTarget(null)}
      />

      {/* Delete Screen Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Screen Record"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Permanently Delete"
        isDestructive
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <style jsx global>{`
        .toolbar-input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 3px rgba(121, 86, 201, 0.12) !important;
        }
        .filter-pill:hover:not(.active) {
          background-color: var(--primary-light) !important;
          border-color: rgba(121, 86, 201, 0.3) !important;
        }
        .add-screen-btn:hover {
          background-color: var(--primary-hover) !important;
        }
        @media (max-width: 1200px) {
          .screens-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 768px) {
          .screens-grid {
            grid-template-columns: 1fr !important;
          }
          .app-screens-content {
            padding: 8px 18px 32px 18px !important;
          }
          .toolbar-search-box {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};
