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

      {/* Main Slidable Floating Sidebar */}
      <aside
        style={{
          width: "250px",
          minWidth: "250px",
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
          transform: isCollapsed ? "translateX(-100%)" : "translateX(0)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: isCollapsed ? "none" : "2px 0 16px rgba(36, 33, 58, 0.04)",
        }}
        className={`admin-sidebar ${isCollapsed ? "collapsed" : "expanded"} ${isActuallyMobileOpen ? "open" : ""}`}
      >
        {/* Brand Header */}
        <div
          style={{
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link href="/admin/dashboard" style={{ display: "inline-flex", alignItems: "center" }}>
              <BrandLogo size="sm" />
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {/* Slide Collapse Button (Desktop & Tablet) */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="sidebar-collapse-btn"
              title="Slide navigation closed"
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
            padding: "8px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {ADMIN_NAV_ITEMS.map((item: NavItem) => {
            const Icon = ICON_MAP[item.iconName] || LayoutGrid;
            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard" || pathname === "/admin"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "9px 14px",
                  borderRadius: "8px",
                  fontSize: "13.5px",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "var(--primary)" : "var(--text-muted)",
                  backgroundColor: isActive ? "var(--secondary)" : "transparent",
                  transition: "all 0.15s ease",
                  textDecoration: "none",
                }}
                className={`nav-link-item ${isActive ? "active" : ""}`}
                title={item.label}
              >
                <Icon
                  size={18}
                  style={{
                    color: isActive ? "var(--primary)" : "var(--text-muted)",
                    flexShrink: 0,
                  }}
                  strokeWidth={isActive ? 2.2 : 1.9}
                />
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer with Workspace info */}
        <div
          style={{
            padding: "14px 18px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "var(--bg)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#DCD6E8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text)",
                fontWeight: 600,
                fontSize: "13px",
                flexShrink: 0,
              }}
            >
              A
            </div>
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
          </div>

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
        </div>
      </aside>

      <style jsx global>{`
        .nav-link-item:hover:not(.active) {
          background-color: var(--primary-light) !important;
          color: var(--text) !important;
        }
        .sidebar-collapse-btn:hover {
          background-color: var(--primary-light) !important;
          color: var(--primary) !important;
        }
        @media (min-width: 1025px) {
          .mobile-sidebar-backdrop {
            display: none !important;
          }
        }
        @media (max-width: 1024px) {
          .sidebar-collapse-btn {
            display: none !important;
          }
          .admin-sidebar {
            position: fixed !important;
            left: 0;
            top: 0;
            bottom: 0;
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
