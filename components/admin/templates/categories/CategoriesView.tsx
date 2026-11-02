"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  TemplateCategoryRecord,
  CategoryMetrics,
  CategoryFilterOptions,
  filterAndSortCategories,
  calculateCategoryMetrics,
} from "@/lib/template-categories";
import { CategoriesHeader } from "./CategoriesHeader";
import { CategoriesMetricsRow } from "./CategoriesMetricsRow";
import { CategoriesToolbar } from "./CategoriesToolbar";
import { CategoriesTable } from "./CategoriesTable";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { EditCategoryModal } from "./EditCategoryModal";
import { CannotDeleteModal } from "./CannotDeleteModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { AuxiliaryStatesShowcase } from "./AuxiliaryStatesShowcase";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface CategoriesViewProps {
  initialCategories: TemplateCategoryRecord[];
  initialMetrics: CategoryMetrics;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  initialCategories,
  initialMetrics,
}) => {
  const router = useRouter();
  const [categories, setCategories] = useState<TemplateCategoryRecord[]>(initialCategories);
  const [filters, setFilters] = useState<CategoryFilterOptions>({
    search: "",
    status: "All Statuses",
    sort: "Name A–Z",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TemplateCategoryRecord | null>(null);
  const [cannotDeleteCategory, setCannotDeleteCategory] = useState<TemplateCategoryRecord | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<TemplateCategoryRecord | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Dynamic metrics calculation based on current categories
  const currentMetrics = useMemo(() => {
    return calculateCategoryMetrics(categories, initialMetrics.unassigned);
  }, [categories, initialMetrics.unassigned]);

  // Filtered and sorted category list
  const filteredCategories = useMemo(() => {
    return filterAndSortCategories(categories, filters);
  }, [categories, filters]);

  const hasActiveFilters = Boolean(
    (filters.search && filters.search.trim() !== "") ||
      (filters.status && filters.status !== "All Statuses") ||
      (filters.sort && filters.sort !== "Name A–Z")
  );

  const handleFilterChange = <K extends keyof CategoryFilterOptions>(
    key: K,
    value: CategoryFilterOptions[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "All Statuses",
      sort: "Name A–Z",
    });
    setCurrentPage(1);
  };

  // Create Category
  const handleCreateCategory = async (data: Partial<TemplateCategoryRecord>) => {
    try {
      const res = await fetch("/api/admin/templates/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", data }),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || "Failed to create category." };
      }

      const created = json.category as TemplateCategoryRecord;
      setCategories((prev) => [...prev, created]);
      showToast(`Category "${created.name}" created successfully.`);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to connect to category service.",
      };
    }
  };

  // Update Category
  const handleUpdateCategory = async (id: string, updates: Partial<TemplateCategoryRecord>) => {
    try {
      const res = await fetch("/api/admin/templates/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", id, updates }),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || "Failed to update category." };
      }

      const updated = json.category as TemplateCategoryRecord;
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      showToast(`Category "${updated.name}" updated successfully.`);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to connect to category service.",
      };
    }
  };

  // Toggle Archive
  const handleToggleArchive = async (cat: TemplateCategoryRecord) => {
    try {
      const res = await fetch("/api/admin/templates/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "archive", id: cat.id }),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast(json.error || "Failed to change archive status.", "error");
        return;
      }

      const updated = json.category as TemplateCategoryRecord;
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? updated : c)));
      const actionLabel = updated.status === "Archived" ? "archived" : "restored to active";
      showToast(`Category "${updated.name}" ${actionLabel}.`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Network error occurred.", "error");
    }
  };

  // Delete Category Check
  const handleDeleteCategoryRequest = (cat: TemplateCategoryRecord) => {
    if (cat.templateCount > 0) {
      setCannotDeleteCategory(cat);
    } else {
      setDeletingCategory(cat);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async (id: string) => {
    try {
      const res = await fetch("/api/admin/templates/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || "Failed to delete category." };
      }

      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast("Category deleted successfully.");
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Network error occurred.",
      };
    }
  };

  // View Templates Navigation
  const handleViewTemplates = (cat?: TemplateCategoryRecord) => {
    if (cat) {
      router.push(`/admin/templates?category=${encodeURIComponent(cat.name)}`);
    } else {
      router.push("/admin/templates");
    }
  };

  // Restore First Archived Category from bottom auxiliary card
  const handleRestoreFirstArchived = async () => {
    const archived = categories.find((c) => c.status === "Archived");
    if (!archived) {
      showToast("No archived categories currently exist.", "error");
      return;
    }
    await handleToggleArchive(archived);
  };

  return (
    <div
      style={{
        padding: "24px 32px",
        minHeight: "100vh",
        backgroundColor: "var(--bg, #FAF7F2)",
      }}
      className="template-categories-view-container"
    >
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: toast.type === "error" ? "#FEF2F2" : "#F0FDF4",
            color: toast.type === "error" ? "#991B1B" : "#166534",
            border: `1px solid ${toast.type === "error" ? "#FCA5A5" : "#BBF7D0"}`,
            padding: "12px 20px",
            borderRadius: "10px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            zIndex: 150,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "13.5px",
            fontWeight: 500,
            animation: "fadeIn 0.2s ease-in-out",
          }}
        >
          {toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <CategoriesHeader
        onCreateCategory={() => setIsCreateOpen(true)}
        adminName="Parth Patel"
        adminRole="Administrator"
      />

      {/* Summary Metrics */}
      <CategoriesMetricsRow
        metrics={currentMetrics}
        onFilterAll={() => handleFilterChange("status", "All Statuses")}
        onFilterActive={() => handleFilterChange("status", "Active")}
      />

      {/* Search and Toolbar */}
      <CategoriesToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Categories Table */}
      <CategoriesTable
        categories={filteredCategories}
        allTotal={categories.length}
        onViewTemplates={handleViewTemplates}
        onEditCategory={(cat) => setEditingCategory(cat)}
        onToggleArchive={handleToggleArchive}
        onDeleteCategory={handleDeleteCategoryRequest}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Auxiliary States Showcase matching 4K reference image */}
      <AuxiliaryStatesShowcase
        onClearFilters={handleClearFilters}
        onCreateCategory={() => setIsCreateOpen(true)}
        onViewTemplates={() => handleViewTemplates()}
        onRestoreCategory={handleRestoreFirstArchived}
      />

      {/* Interactive Modals */}
      <CreateCategoryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateCategory}
      />

      <EditCategoryModal
        category={editingCategory}
        isOpen={Boolean(editingCategory)}
        onClose={() => setEditingCategory(null)}
        onUpdate={handleUpdateCategory}
      />

      <CannotDeleteModal
        category={cannotDeleteCategory}
        isOpen={Boolean(cannotDeleteCategory)}
        onClose={() => setCannotDeleteCategory(null)}
        onViewTemplates={handleViewTemplates}
      />

      <DeleteConfirmModal
        category={deletingCategory}
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleConfirmDelete}
      />

      <style jsx global>{`
        @media (max-width: 900px) {
          .categories-metrics-grid {
            grid-template-columns: 1fr !important;
          }
          .categories-auxiliary-states-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .categories-auxiliary-states-grid {
            grid-template-columns: 1fr !important;
          }
          .template-categories-view-container {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};
