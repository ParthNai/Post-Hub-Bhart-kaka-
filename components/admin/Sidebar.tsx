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
  PanelLeftOpen,
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
  const [isHovered, setIsHovered] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const isVisuallyExpanded = !isCollapsed || isHovered;

  const handleMouseEnter = () => {
    if (!isCollapsed) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Subtle 50ms entrance delay prevents accidental opening during rapid cursor sweeps
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 50);
  };

  const handleMouseLeave = () => {
    if (!isCollapsed) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Graceful 180ms exit delay prevents premature collapsing
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 180);
  };

  React.useEffect(() => {
    setIsMounted(true);
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

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

      {/* Main Slidable / Rail Sidebar Navigation (Opens on cursor hover when collapsed) */}
      <aside
        suppressHydrationWarning
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: isVisuallyExpanded ? "250px" : "68px",
          minWidth: isVisuallyExpanded ? "250px" : "68px",
          height: "100vh",
          backgroundColor: "var(--bg)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: isCollapsed && isHovered ? 55 : 45,
          transition: isMounted
            ? "width 0.28s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.28s cubic-bezier(0.2, 0, 0, 1)"
            : "none",
          boxShadow: isCollapsed && isHovered ? "6px 0 28px rgba(36, 33, 58, 0.16)" : "2px 0 16px rgba(36, 33, 58, 0.04)",
          overflowX: "hidden",
          willChange: "width, box-shadow",
        }}
        className={`admin-sidebar ${isCollapsed ? "collapsed rail-mode" : "expanded"} ${isActuallyMobileOpen ? "open" : ""} ${isHovered ? "hover-expanded" : ""}`}
      >
        {/* Brand Header */}
        <div
          style={{
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 14px",
            borderBottom: "1px solid var(--border)",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
            <Link
              href="/admin/dashboard"
              title="Post Hub Dashboard"
              style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  minWidth: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <BrandLogo size="sm" iconOnly={true} />
              </div>
              <div
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  maxWidth: isVisuallyExpanded ? "120px" : "0px",
                  opacity: isVisuallyExpanded ? 1 : 0,
                  transform: isVisuallyExpanded ? "translateX(0)" : "translateX(-8px)",
                  transition: "max-width 0.28s cubic-bezier(0.2, 0, 0, 1), opacity 0.22s cubic-bezier(0.2, 0, 0, 1), transform 0.25s cubic-bezier(0.2, 0, 0, 1)",
                  display: "inline-flex",
                  alignItems: "baseline",
                  marginLeft: "8px",
                }}
              >
                <span
                  style={{
                    color: "var(--text, #24213A)",
                    fontSize: "19px",
                    letterSpacing: "-0.03em",
                    marginRight: "3px",
                    fontWeight: 700,
                  }}
                >
                  Post
                </span>
                <span
                  style={{
                    color: "var(--primary, #7956C9)",
                    fontSize: "19px",
                    letterSpacing: "-0.03em",
                    fontWeight: 700,
                  }}
                >
                  Hub
                </span>
              </div>
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              opacity: isVisuallyExpanded ? 1 : 0,
              pointerEvents: isVisuallyExpanded ? "auto" : "none",
              transform: isVisuallyExpanded ? "scale(1)" : "scale(0.85)",
              transition: "opacity 0.2s cubic-bezier(0.2, 0, 0, 1), transform 0.2s cubic-bezier(0.2, 0, 0, 1)",
            }}
          >
            {/* Desktop Pin / Collapse Button */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="sidebar-collapse-btn"
              title={isCollapsed ? "Pin sidebar open" : "Collapse sidebar to icons only"}
              aria-label={isCollapsed ? "Pin sidebar open" : "Collapse sidebar to icons only"}
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
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
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
            padding: "10px 8px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
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
                  onClick={() => {
                    setIsHovered(false);
                    onClose?.();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "100%",
                    height: "42px",
                    boxSizing: "border-box",
                    padding: "0 6px",
                    borderRadius: "8px",
                    fontSize: "13.5px",
                    fontWeight: (isActive || isSubActive || isTemplatesActive) ? 600 : 500,
                    color: (isActive || isSubActive || isTemplatesActive) ? "var(--primary)" : "var(--text-muted)",
                    backgroundColor: (isActive && !hasSub) ? "var(--secondary)" : (hasSub && isSubActive && pathname === "/admin/templates") ? "var(--secondary)" : (!isVisuallyExpanded && (isActive || isSubActive || isTemplatesActive)) ? "var(--secondary)" : "transparent",
                    transition: "background-color 0.15s ease, color 0.15s ease",
                    textDecoration: "none",
                    overflow: "hidden",
                  }}
                  className={`nav-link-item ${isActive || isSubActive || isTemplatesActive ? "active" : ""} ${!isVisuallyExpanded ? "icon-only-item" : ""}`}
                  title={!isVisuallyExpanded ? item.label : undefined}
                >
                  {/* Stable Icon Container - Never shifts */}
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      minWidth: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      size={19}
                      style={{
                        color: (isActive || isSubActive || isTemplatesActive) ? "var(--primary)" : "var(--text-muted)",
                        flexShrink: 0,
                        transition: "color 0.15s ease",
                      }}
                      strokeWidth={(isActive || isSubActive || isTemplatesActive) ? 2.3 : 1.9}
                    />
                  </div>

                  {/* Smooth Label and Submenu Toggle Container */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      marginLeft: "6px",
                      opacity: isVisuallyExpanded ? 1 : 0,
                      maxWidth: isVisuallyExpanded ? "180px" : "0px",
                      transform: isVisuallyExpanded ? "translateX(0)" : "translateX(-8px)",
                      transition: "max-width 0.28s cubic-bezier(0.2, 0, 0, 1), opacity 0.22s cubic-bezier(0.2, 0, 0, 1), transform 0.25s cubic-bezier(0.2, 0, 0, 1)",
                    }}
                  >
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "13.5px",
                        lineHeight: 1,
                      }}
                    >
                      {item.label}
                    </span>
                    {hasSub && (
                      <button
                        type="button"
                        onClick={(e) => toggleSubmenu(item.id, e)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: "2px 4px",
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
                  </div>
                </Link>

                {/* Submenu with height and opacity transition */}
                {hasSub && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      marginTop: "2px",
                      marginBottom: "4px",
                      paddingLeft: "44px",
                      maxHeight: hasSub && isExpanded && isVisuallyExpanded ? "160px" : "0px",
                      opacity: hasSub && isExpanded && isVisuallyExpanded ? 1 : 0,
                      overflow: "hidden",
                      transform: hasSub && isExpanded && isVisuallyExpanded ? "translateY(0)" : "translateY(-4px)",
                      transition: "max-height 0.26s cubic-bezier(0.2, 0, 0, 1), opacity 0.2s ease, transform 0.22s ease",
                    }}
                  >
                    {item.subItems!.map((sub) => {
                      const isChildActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.id}
                          href={sub.href}
                          onClick={() => {
                            setIsHovered(false);
                            onClose?.();
                          }}
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
                            whiteSpace: "nowrap",
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
            padding: "14px 12px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "var(--bg)",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", minWidth: 0, flex: 1 }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                minWidth: "36px",
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                marginLeft: "10px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                opacity: isVisuallyExpanded ? 1 : 0,
                maxWidth: isVisuallyExpanded ? "130px" : "0px",
                transform: isVisuallyExpanded ? "translateX(0)" : "translateX(-8px)",
                transition: "max-width 0.28s cubic-bezier(0.2, 0, 0, 1), opacity 0.22s cubic-bezier(0.2, 0, 0, 1), transform 0.25s cubic-bezier(0.2, 0, 0, 1)",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--text)",
                  lineHeight: 1.2,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                Admin
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  lineHeight: 1.2,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                System Administrator
              </span>
            </div>
          </div>

          <div
            style={{
              opacity: isVisuallyExpanded ? 1 : 0,
              pointerEvents: isVisuallyExpanded ? "auto" : "none",
              transform: isVisuallyExpanded ? "scale(1)" : "scale(0.85)",
              transition: "opacity 0.2s cubic-bezier(0.2, 0, 0, 1), transform 0.2s cubic-bezier(0.2, 0, 0, 1)",
            }}
          >
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
