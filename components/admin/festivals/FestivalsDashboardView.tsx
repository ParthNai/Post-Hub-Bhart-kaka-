"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Smartphone,
  Palette,
  LayoutTemplate,
  Sparkles,
  PartyPopper,
  Users,
  CreditCard,
  Home,
  ShieldCheck,
  Activity,
  Settings as SettingsIcon,
  Check,
  AlertCircle,
} from "lucide-react";
import { FestivalsHeader } from "./FestivalsHeader";
import { FestivalsSummaryCards } from "./FestivalsSummaryCards";
import { FestivalCalendarView } from "./FestivalCalendarView";
import { UpcomingEventPreviewCard } from "./UpcomingEventPreviewCard";
import { UpcomingEventsTable } from "./UpcomingEventsTable";
import { ContentPreparationStatusCard } from "./ContentPreparationStatusCard";
import { EventCategoriesSection } from "./EventCategoriesSection";
import { QuickActionsSection } from "./QuickActionsSection";
import { AddEditEventDrawer } from "./AddEditEventDrawer";
import { EventDetailModal } from "./EventDetailModal";
import { ImportEventsModal } from "./ImportEventsModal";
import { EventCategoriesModal } from "./EventCategoriesModal";
import { RegionalCalendarModal } from "./RegionalCalendarModal";
import {
  type FestivalsDataset,
  type FestivalEvent,
  CANONICAL_FESTIVALS_SEED,
} from "@/lib/festivals";

export const FestivalsDashboardView: React.FC = () => {
  const [dataset, setDataset] = useState<FestivalsDataset>(CANONICAL_FESTIVALS_SEED);
  const [selectedEventId, setSelectedEventId] = useState<string>("EVT-FEST-001");
  const [selectedDate, setSelectedDate] = useState<string>("2026-11-08");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modals & Drawers
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<FestivalEvent | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [eventToView, setEventToView] = useState<FestivalEvent | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const [regionalModalOpen, setRegionalModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial load
  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/festivals")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          const loaded: FestivalsDataset = data.dataset || data;
          if (loaded?.events) {
            setDataset(loaded);
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching festivals:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedEvent =
    dataset.events.find((e) => e.id === selectedEventId) || dataset.events[0] || null;

  // Filtered events
  const displayedEvents = dataset.events.filter((evt) => {
    if (selectedCategory !== "all" && evt.category !== selectedCategory) {
      return false;
    }
    if (selectedFilter === "active") return evt.contentStatus === "Published";
    if (selectedFilter === "draft") return evt.contentStatus === "Draft";
    if (selectedFilter === "upcoming") {
      return new Date(evt.startDate) >= new Date("2026-11-01");
    }
    return true;
  });

  // Handlers
  const handleSaveEvent = async (eventData: Partial<FestivalEvent>) => {
    const isEdit = Boolean(eventToEdit);
    const endpoint = "/api/admin/festivals";
    const body = isEdit
      ? { action: "update", id: eventToEdit?.id, updates: eventData }
      : { action: "create", event: eventData };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to save event");
    }

    setDataset(data.dataset);
    if (data.event?.id) {
      setSelectedEventId(data.event.id);
    }
    showToast(isEdit ? "Event updated successfully!" : "New event created successfully!");
  };

  const handleDuplicateEvent = async (id: string) => {
    try {
      const res = await fetch("/api/admin/festivals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate", id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      setDataset(data.dataset);
      showToast("Event duplicated successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Duplicate error";
      showToast(msg, "error");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this festival event?")) return;
    try {
      const res = await fetch("/api/admin/festivals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      setDataset(data.dataset);
      showToast("Event deleted successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete error";
      showToast(msg, "error");
    }
  };

  const handleImportEvents = async (items: Partial<FestivalEvent>[]) => {
    const res = await fetch("/api/admin/festivals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "import", items }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Import error");
    setDataset(data.dataset);
    return { importedCount: data.importedCount, duplicatesSkipped: data.duplicatesSkipped };
  };

  const handleExportEvents = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataset.events, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "post-hub-festivals-calendar-2026-2027.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Festivals dataset exported successfully!");
  };

  // Nav Items
  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "App Screens", href: "/admin/screens", icon: Smartphone },
    { label: "Design System", href: "/admin/design-system", icon: Palette },
    { label: "Templates", href: "/admin/templates", icon: LayoutTemplate },
    { label: "AI Image Generation", href: "/admin/ai-generation", icon: Sparkles },
    { label: "Festivals & Events", href: "/admin/festivals", icon: PartyPopper, active: true },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Subscriptions & Payments", href: "/admin/subscriptions", icon: CreditCard },
    { label: "Home Content", href: "/admin/home-content", icon: Home },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Roles & Permissions", href: "/admin/roles", icon: ShieldCheck },
    { label: "System Health", href: "/admin/system-health", icon: Activity },
    { label: "Support & Settings", href: "/admin/settings", icon: SettingsIcon },
  ];

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
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 110,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 20px",
            borderRadius: "10px",
            backgroundColor: toastMessage.type === "success" ? "#10B981" : "#EF4444",
            color: "#FFFFFF",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {toastMessage.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Left Sidebar */}
      
          {/* Header */}
          <FestivalsHeader
            onAddNewEvent={() => {
              setEventToEdit(null);
              setIsAddDrawerOpen(true);
            }}
            onImportEvents={() => setImportModalOpen(true)}
            onExportEvents={handleExportEvents}
            onCalendarViewClick={() => {
              setSelectedDate("2026-11-08");
              setSelectedEventId("EVT-FEST-001");
            }}
          />

          {/* 4 Summary Cards */}
          <FestivalsSummaryCards
            metrics={dataset.summary}
            selectedFilter={selectedFilter}
            onSelectFilter={(filter) => setSelectedFilter(filter)}
          />

          {/* Middle Row: Calendar (Left) & Upcoming Event Preview (Right) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "stretch" }}>
            <FestivalCalendarView
              events={dataset.events}
              selectedDate={selectedDate}
              selectedEventId={selectedEventId}
              onSelectDate={(date) => setSelectedDate(date)}
              onSelectEvent={(id) => setSelectedEventId(id)}
            />
            <UpcomingEventPreviewCard
              event={selectedEvent}
              onEditEvent={(evt) => {
                setEventToEdit(evt);
                setIsAddDrawerOpen(true);
              }}
            />
          </div>

          {/* Lower Row: Upcoming Festivals & Events Table (Left) & Content Prep (Right) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "stretch" }}>
            <UpcomingEventsTable
              events={displayedEvents}
              selectedEventId={selectedEventId}
              onSelectEvent={(id) => setSelectedEventId(id)}
              onEditEvent={(evt) => {
                setEventToEdit(evt);
                setIsAddDrawerOpen(true);
              }}
              onViewEvent={(evt) => {
                setEventToView(evt);
                setDetailModalOpen(true);
              }}
              onDuplicateEvent={handleDuplicateEvent}
              onDeleteEvent={handleDeleteEvent}
            />
            <ContentPreparationStatusCard metrics={dataset.contentPreparation} />
          </div>

          {/* Bottom Row: Event Categories (Left) & Quick Actions (Right) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "stretch" }}>
            <EventCategoriesSection
              categories={dataset.categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              onViewAll={() => setCategoriesModalOpen(true)}
            />
            <QuickActionsSection
              onAddNewFestival={() => {
                setEventToEdit(null);
                setIsAddDrawerOpen(true);
              }}
              onCreateCustomEvent={() => {
                setEventToEdit(null);
                setIsAddDrawerOpen(true);
              }}
              onImportCalendar={() => setImportModalOpen(true)}
              onManageCategories={() => setCategoriesModalOpen(true)}
              onConfigureRegional={() => setRegionalModalOpen(true)}
            />
          </div>
        

      {/* Add / Edit Drawer */}
      <AddEditEventDrawer
        isOpen={isAddDrawerOpen}
        eventToEdit={eventToEdit}
        onClose={() => {
          setIsAddDrawerOpen(false);
          setEventToEdit(null);
        }}
        onSave={handleSaveEvent}
      />

      {/* Detail Inspection Modal */}
      <EventDetailModal
        isOpen={detailModalOpen}
        event={eventToView}
        onClose={() => {
          setDetailModalOpen(false);
          setEventToView(null);
        }}
        onEdit={(evt) => {
          setEventToEdit(evt);
          setIsAddDrawerOpen(true);
        }}
      />

      {/* Import Modal */}
      <ImportEventsModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportEvents}
      />

      {/* Categories Modal */}
      <EventCategoriesModal
        isOpen={categoriesModalOpen}
        categories={dataset.categories}
        onClose={() => setCategoriesModalOpen(false)}
      />

      {/* Regional Configuration Modal */}
      <RegionalCalendarModal
        isOpen={regionalModalOpen}
        onClose={() => setRegionalModalOpen(false)}
      />
    </div>
  );
};
