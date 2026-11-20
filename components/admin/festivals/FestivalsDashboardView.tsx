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
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#FAF7F2",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
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
      <aside
        style={{
          width: "250px",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #EAE4EE",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: "70px",
            padding: "0 22px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderBottom: "1px solid #EAE4EE",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #7956C9 0%, #906FE2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "18px",
              boxShadow: "0 2px 6px rgba(121, 86, 201, 0.3)",
            }}
          >
            P
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#24213A", letterSpacing: "-0.01em" }}>
              Post Hub
            </div>
            <div style={{ fontSize: "11px", color: "#777184" }}>Admin Panel</div>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: "3px", flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            return (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#7956C9" : "#777184",
                  backgroundColor: isActive ? "#F4EFFC" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={17} color={isActive ? "#7956C9" : "#777184"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid #EAE4EE",
            fontSize: "11px",
            color: "#777184",
          }}
        >
          <div>Post Hub v1.0.0</div>
          <div style={{ marginTop: "2px" }}>© 2025 KnowledgePark</div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowX: "hidden" }}>
        {/* Top Navbar */}
        <header
          style={{
            height: "70px",
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #EAE4EE",
            padding: "0 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, maxWidth: "480px" }}>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#777184",
                padding: "4px",
                display: "flex",
              }}
            >
              <Menu size={20} />
            </button>
            <div style={{ position: "relative", width: "100%" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#777184",
                }}
              />
              <input
                type="text"
                placeholder="Search anything..."
                style={{
                  width: "100%",
                  height: "40px",
                  paddingLeft: "40px",
                  paddingRight: "14px",
                  borderRadius: "20px",
                  border: "1px solid #EAE4EE",
                  backgroundColor: "#FAF7F2",
                  fontSize: "13px",
                  color: "#24213A",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Right Header items */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Bell */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  backgroundColor: "#FAF7F2",
                  border: "1px solid #EAE4EE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#777184",
                }}
              >
                <Bell size={18} />
              </button>
              <span
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  backgroundColor: "#EF4444",
                  color: "#FFFFFF",
                  fontSize: "10px",
                  fontWeight: 700,
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #FFFFFF",
                }}
              >
                3
              </span>
            </div>

            {/* Admin Avatar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "4px 8px 4px 4px",
                borderRadius: "20px",
                backgroundColor: "#FAF7F2",
                border: "1px solid #EAE4EE",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#7956C9",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                P
              </div>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>Parth Admin</span>
              <ChevronDown size={14} color="#777184" />
            </div>
          </div>
        </header>

        {/* Page Main Content */}
        <main style={{ padding: "28px", flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
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
        </main>
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
