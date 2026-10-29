"use client";

import React, { useState, useMemo } from "react";
import { PosterTemplate, TemplateFilterParams, filterAndSortTemplates, calculateTemplateMetrics } from "@/lib/templates";
import { TemplatesHeader } from "./TemplatesHeader";
import { TemplatesMetricsRow } from "./TemplatesMetricsRow";
import { TemplatesToolbar } from "./TemplatesToolbar";
import { TemplateCard } from "./TemplateCard";
import { TemplatePreviewDrawer } from "./TemplatePreviewDrawer";
import { EmptyStateCard } from "./EmptyStateCard";
import { CreateTemplateModal } from "./CreateTemplateModal";
import { EditTemplateModal } from "./EditTemplateModal";
import { CategoriesModal } from "./CategoriesModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { FullPreviewModal } from "./FullPreviewModal";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface TemplatesViewProps {
  initialTemplates: PosterTemplate[];
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ initialTemplates }) => {
  const [templates, setTemplates] = useState<PosterTemplate[]>(initialTemplates);
  // Default selected template is TPL-001 matching the approved reference screenshot
  const [selectedTemplate, setSelectedTemplate] = useState<PosterTemplate | null>(
    initialTemplates.find((t) => t.id === "TPL-001") || initialTemplates[0] || null
  );
  // Drawer open by default as shown in reference image
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Filters state
  const [filters, setFilters] = useState<TemplateFilterParams>({
    query: "",
    category: "All Categories",
    status: "All Statuses",
    format: "All Formats",
    sort: "Recently Updated",
  });

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);

  const [activeTemplate, setActiveTemplate] = useState<PosterTemplate | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Filter & sort templates
  const filteredTemplates = useMemo(() => {
    return filterAndSortTemplates(templates, filters);
  }, [templates, filters]);

  // Real computed metrics
  const metrics = useMemo(() => {
    return calculateTemplateMetrics(templates);
  }, [templates]);

  // Filter change handler
  const handleFilterChange = (key: keyof TemplateFilterParams, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      query: "",
      category: "All Categories",
      status: "All Statuses",
      format: "All Formats",
      sort: "Recently Updated",
    });
  };

  const isFiltered = Boolean(
    (filters.query && filters.query.trim()) ||
      (filters.category && filters.category !== "All Categories") ||
      (filters.status && filters.status !== "All Statuses") ||
      (filters.format && filters.format !== "All Formats") ||
      (filters.sort && filters.sort !== "Recently Updated")
  );

  // Card click / selection
  const handleSelectTemplate = (template: PosterTemplate) => {
    setSelectedTemplate(template);
    setIsDrawerOpen(true);
  };

  // Quick preview button click
  const handlePreview = (template: PosterTemplate) => {
    setSelectedTemplate(template);
    setIsDrawerOpen(true);
  };

  // Open full high-res modal
  const handleOpenFullPreview = (template: PosterTemplate) => {
    setActiveTemplate(template);
    setIsFullPreviewOpen(true);
  };

  // Modal Triggers
  const handleOpenEdit = (template: PosterTemplate) => {
    setActiveTemplate(template);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (template: PosterTemplate) => {
    setActiveTemplate(template);
    setIsDeleteOpen(true);
  };

  // API Actions
  const handleCreateTemplate = async (templateData: Partial<PosterTemplate>) => {
    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", template: templateData }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Failed to create template." };
      }

      const created = data.template as PosterTemplate;
      setTemplates((prev) => [created, ...prev]);
      setSelectedTemplate(created);
      setIsDrawerOpen(true);
      showToast(`Template "${created.name}" (${created.id}) created successfully.`);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to connect to template service.",
      };
    }
  };

  const handleUpdateTemplate = async (id: string, updates: Partial<PosterTemplate>) => {
    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", id, updates }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Failed to update template." };
      }

      const updated = data.template as PosterTemplate;
      setTemplates((prev) => prev.map((t) => (t.id === id ? updated : t)));
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(updated);
      }
      showToast(`Template "${updated.name}" updated successfully.`);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to connect to template service.",
      };
    }
  };

  const handleDuplicateTemplate = async (template: PosterTemplate) => {
    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate", id: template.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to duplicate template.", "error");
        return;
      }

      const duplicate = data.template as PosterTemplate;
      setTemplates((prev) => {
        const idx = prev.findIndex((t) => t.id === template.id);
        const next = [...prev];
        next.splice(idx + 1, 0, duplicate);
        return next;
      });
      setSelectedTemplate(duplicate);
      setIsDrawerOpen(true);
      showToast(`Duplicated "${template.name}" as "${duplicate.id}".`);
    } catch {
      showToast("Failed to duplicate template.", "error");
    }
  };

  const handleToggleArchiveTemplate = async (template: PosterTemplate) => {
    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "archive", id: template.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to toggle archive status.", "error");
        return;
      }

      const updated = data.template as PosterTemplate;
      setTemplates((prev) => prev.map((t) => (t.id === template.id ? updated : t)));
      if (selectedTemplate?.id === template.id) {
        setSelectedTemplate(updated);
      }
      showToast(
        updated.status === "Archived"
          ? `Template "${updated.name}" archived.`
          : `Template "${updated.name}" restored from archive.`
      );
    } catch {
      showToast("Failed to toggle archive status.", "error");
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Failed to delete template." };
      }

      setTemplates((prev) => prev.filter((t) => t.id !== id));
      if (selectedTemplate?.id === id) {
        const remaining = templates.filter((t) => t.id !== id);
        setSelectedTemplate(remaining[0] || null);
      }
      showToast(`Template ${id} removed successfully.`);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to delete template.",
      };
    }
  };

  return (
    <div
      style={{
        padding: "24px 32px",
        minHeight: "100%",
        boxSizing: "border-box",
        maxWidth: "1600px",
        margin: "0 auto",
      }}
    >
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: toast.type === "error" ? "#DC2626" : "#24213A",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
            zIndex: 999,
            animation: "fadeIn 0.2s ease-in-out",
          }}
        >
          {toast.type === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <CheckCircle2 size={16} style={{ color: "#34D399" }} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <TemplatesHeader
        onCreateTemplate={() => setIsCreateOpen(true)}
        onOpenCategories={() => setIsCategoriesOpen(true)}
      />

      {/* Summary Metrics Row */}
      <TemplatesMetricsRow metrics={metrics} />

      {/* Toolbar Search & Filters */}
      <TemplatesToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        isFiltered={isFiltered}
      />

      {/* Main Grid & Preview Drawer Container */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "flex-start",
        }}
      >
        {/* Left / Center Grid Area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {filteredTemplates.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isDrawerOpen
                  ? "repeat(auto-fill, minmax(220px, 1fr))"
                  : "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "16px",
              }}
            >
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate?.id === template.id}
                  onSelect={handleSelectTemplate}
                  onEdit={handleOpenEdit}
                  onDuplicate={handleDuplicateTemplate}
                  onToggleArchive={handleToggleArchiveTemplate}
                  onDelete={handleOpenDelete}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          ) : (
            <EmptyStateCard
              onCreateTemplate={() => setIsCreateOpen(true)}
              title="No templates found"
              subtitle="Try adjusting your search or filter criteria, or create a new template."
            />
          )}

          {/* Bottom container shown in the reference image */}
          {filteredTemplates.length > 0 && (
            <EmptyStateCard
              onCreateTemplate={() => setIsCreateOpen(true)}
              title="No templates found"
              subtitle="Try adjusting your search or filter criteria, or create a new template."
            />
          )}
        </div>

        {/* Right Preview Drawer matching reference */}
        {isDrawerOpen && (
          <div
            style={{
              width: "280px",
              flexShrink: 0,
            }}
          >
            <TemplatePreviewDrawer
              template={selectedTemplate}
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              onOpenFullPreview={handleOpenFullPreview}
            />
          </div>
        )}
      </div>

      {/* Interactive Modals */}
      <CreateTemplateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateTemplate}
      />

      <EditTemplateModal
        key={activeTemplate?.id || "empty-modal"}
        template={activeTemplate}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onUpdate={handleUpdateTemplate}
      />

      <CategoriesModal
        isOpen={isCategoriesOpen}
        onClose={() => setIsCategoriesOpen(false)}
        templates={templates}
        onSelectCategoryFilter={(cat) => handleFilterChange("category", cat)}
      />

      <DeleteConfirmModal
        template={activeTemplate}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteTemplate}
      />

      <FullPreviewModal
        template={activeTemplate}
        isOpen={isFullPreviewOpen}
        onClose={() => setIsFullPreviewOpen(false)}
      />
    </div>
  );
};
