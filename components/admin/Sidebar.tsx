"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { ADMIN_NAV_ITEMS, NavItem } from "@/lib/navigation";
import {
  LayoutGrid,
  Smartphone,
  Palette,
  FileText,
  Sparkles,
  Calendar,
  Users,
  CreditCard,
  Home,
  Bell,
  ShieldCheck,
  Activity,
  Settings,
  X,
  ChevronDown,
  PanelLeftClose,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const ICON_MAP = {
  LayoutGrid,
  Smartphone,
  Palette,
  FileText,
  Sparkles,
  Calendar,
  Users,
  CreditCard,
  Home,
  Bell,
  ShieldCheck,
  Activity,
  Settings,
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, toggleSidebar, setMobileOpen } = useSidebar();

  const isActuallyMobileOpen = isOpen !== undefined ? isOpen : isMobileOpen;
  const handleClose = onClose || (() => setMobileOpen(false));

  const [expandedNav, setExpandedNav] = React.useState<Record<string, boolean>>({ templates: true });
  const toggleSubmenu = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedNav(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isActuallyMobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar backdrop"
          onClick={handleClose}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") handleClose();
          }}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(36, 33, 58, 0.4)",
            zIndex: 40,
            backdropFilter: "blur(2px)",
          }}
          className="mobile-sidebar-backdrop"
        />
      )}

      {/* Main Slidable / Rail Sidebar Navigation */}
      <aside
        style={{
          width: isCollapsed ? "68px" : "250px",
          minWidth: isCollapsed ? "68px" : "250px",
          height: "100vh",
          backgroundColor: "var(--bg)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 45,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease",
          boxShadow: "2px 0 16px rgba(36, 33, 58, 0.04)",
          overflowX: "hidden",
        }}
        className={`admin-sidebar ${isCollapsed ? "collapsed rail-mode" : "expanded"} ${isActuallyMobileOpen ? "open" : ""}`}
      >
        {/* Brand Header */}
        <div
          style={{
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "space-between",
            padding: isCollapsed ? "0 8px" : "0 18px",
            borderBottom: "1px solid var(--border)",
            transition: "padding 0.3s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: isCollapsed ? "center" : "flex-start", width: isCollapsed ? "auto" : "auto" }}>
            <Link
              href="/admin/dashboard"
              title={isCollapsed ? "Post Hub - Expand Navigation" : "Post Hub Dashboard"}
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <BrandLogo size="sm" iconOnly={isCollapsed} />
            </Link>
          </div>

          <div style={{ display: isCollapsed ? "none" : "flex", alignItems: "center", gap: "4px" }}>
            {/* Slide Collapse Button (Desktop & Tablet) */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="sidebar-collapse-btn"
              title="Collapse sidebar to icons only"
              aria-label="Collapse sidebar navigation"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "6px",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease",
              }}
            >
              <PanelLeftClose size={18} />
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="mobile-close-btn"
              aria-label="Close sidebar"
              style={{
                display: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                color: "var(--text-muted)",
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation list */}
        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: isCollapsed ? "12px 6px" : "8px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            transition: "padding 0.2s ease",
          }}
        >
          {ADMIN_NAV_ITEMS.map((item: NavItem) => {
            const Icon = ICON_MAP[item.iconName] || LayoutGrid;
            const hasSub = item.subItems && item.subItems.length > 0;
            const isSubActive = hasSub && item.subItems!.some((s) => pathname === s.href);
            const isTemplatesActive = item.id === "templates" && pathname.startsWith("/admin/templates");
            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard" || pathname === "/admin"
                : pathname === item.href || (pathname.startsWith(item.href + "/") && !hasSub);

            const isExpanded = expandedNav[item.id] ?? isTemplatesActive;

            return (
              <div key={item.id} style={{ display: "flex", flexDirection: "column" }}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isCollapsed ? "center" : "space-between",
                    gap: isCollapsed ? "0" : "12px",
                    padding: isCollapsed ? "10px 0" : "9px 14px",
                    width: isCollapsed ? "48px" : "100%",
                    height: isCollapsed ? "44px" : "auto",
                    margin: isCollapsed ? "0 auto" : "0",
                    borderRadius: isCollapsed ? "10px" : "8px",
                    fontSize: "13.5px",
                    fontWeight: (isActive || isSubActive || isTemplatesActive) ? 600 : 500,
                    color: (isActive || isSubActive || isTemplatesActive) ? "var(--primary)" : "var(--text-muted)",
                    backgroundColor: (isActive && !hasSub) ? "var(--secondary)" : (hasSub && isSubActive && pathname === "/admin/templates") ? "var(--secondary)" : (isCollapsed && (isActive || isSubActive || isTemplatesActive)) ? "var(--secondary)" : "transparent",
                    transition: "all 0.15s ease",
                    textDecoration: "none",
                  }}
                  className={`nav-link-item ${isActive || isSubActive || isTemplatesActive ? "active" : ""} ${isCollapsed ? "icon-only-item" : ""}`}
                  title={item.label}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: isCollapsed ? "center" : "flex-start", gap: isCollapsed ? "0" : "12px", minWidth: 0, width: isCollapsed ? "100%" : "auto" }}>
                    <Icon
                      size={isCollapsed ? 20 : 18}
                      style={{
                        color: (isActive || isSubActive || isTemplatesActive) ? "var(--primary)" : "var(--text-muted)",
                        flexShrink: 0,
                      }}
                      strokeWidth={(isActive || isSubActive || isTemplatesActive) ? 2.3 : 1.9}
                    />
                    {!isCollapsed && (
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                  </div>
                  {hasSub && !isCollapsed && (
                    <button
                      type="button"
                      onClick={(e) => toggleSubmenu(item.id, e)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: "2px",
                        cursor: "pointer",
                        color: (isActive || isSubActive || isTemplatesActive) ? "var(--primary)" : "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ChevronDown
                        size={15}
                        style={{
                          transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                          transition: "transform 0.2s ease",
                        }}
                      />
                    </button>
                  )}
                </Link>

                {hasSub && isExpanded && !isCollapsed && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      marginTop: "2px",
                      marginBottom: "4px",
                      paddingLeft: "24px",
                    }}
                  >
                    {item.subItems!.map((sub) => {
                      const isChildActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.id}
                          href={sub.href}
                          onClick={onClose}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            fontWeight: isChildActive ? 600 : 400,
                            color: isChildActive ? "var(--primary)" : "var(--text-muted)",
                            backgroundColor: isChildActive ? "var(--secondary)" : "transparent",
                            textDecoration: "none",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "14px",
                              lineHeight: 1,
                              color: isChildActive ? "var(--primary)" : "var(--text-muted)",
                            }}
                          >
                            •
                          </span>
                          <span>{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer with Workspace info */}
        <div
          style={{
            padding: isCollapsed ? "12px 6px" : "14px 18px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexDirection: isCollapsed ? "column" : "row",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "space-between",
            backgroundColor: "var(--bg)",
            gap: isCollapsed ? "8px" : "0",
            transition: "padding 0.2s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: isCollapsed ? "center" : "flex-start", gap: "10px", minWidth: 0, width: isCollapsed ? "100%" : "auto" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                backgroundColor: "#DCD6E8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text)",
                fontWeight: 700,
                fontSize: "13px",
                flexShrink: 0,
              }}
              title="Admin (System Administrator)"
            >
              A
            </div>
            {!isCollapsed && (
              <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--text)",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Admin
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  System Administrator
                </span>
              </div>
            )}
          </div>

          {isCollapsed ? (
            <button
              type="button"
              onClick={toggleSidebar}
              className="sidebar-rail-expand-btn"
              title="Expand sidebar navigation"
              aria-label="Expand sidebar navigation"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "6px",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease",
              }}
            >
              <PanelLeftClose size={16} style={{ transform: "rotate(180deg)" }} />
            </button>
          ) : (
            <Link
              href="/admin/settings"
              aria-label="Admin Profile Settings"
              style={{
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px",
                borderRadius: "6px",
              }}
            >
              <ChevronDown size={15} />
            </Link>
          )}
        </div>
      </aside>

      <style jsx global>{`
        .nav-link-item:hover:not(.active) {
          background-color: var(--primary-light) !important;
          color: var(--text) !important;
        }
        .sidebar-collapse-btn:hover,
        .sidebar-rail-expand-btn:hover {
          background-color: var(--primary-light) !important;
          color: var(--primary) !important;
        }
        @media (min-width: 1025px) {
          .mobile-sidebar-backdrop {
            display: none !important;
          }
          .admin-sidebar {
            transform: translateX(0) !important;
          }
        }
        @media (max-width: 1024px) {
          .sidebar-collapse-btn,
          .sidebar-rail-expand-btn {
            display: none !important;
          }
          .admin-sidebar {
            position: fixed !important;
            left: 0;
            top: 0;
            bottom: 0;
            width: 250px !important;
            min-width: 250px !important;
            transform: translateX(-100%) !important;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
          }
          .admin-sidebar.open {
            transform: translateX(0) !important;
          }
          .mobile-close-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};
