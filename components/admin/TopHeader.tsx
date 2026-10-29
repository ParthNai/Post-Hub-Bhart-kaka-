"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Home,
  User,
  ChevronDown,
  Menu,
  CheckCircle2,
  ExternalLink,
  LogOut,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";

interface TopHeaderProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  onMenuToggle?: () => void;
  adminName?: string;
  adminEmail?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title = "Dashboard",
  subtitle = "Your Post Hub workspace at a glance.",
  breadcrumbs = [
    { label: "Admin", href: "/admin/dashboard" },
    { label: "Dashboard", href: "/admin/dashboard" },
  ],
  searchQuery = "",
  onSearchChange,
  onMenuToggle,
  adminName = "Admin Workspace",
  adminEmail = "admin@posthub.io",
}) => {
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const handleToggle = onMenuToggle || toggleSidebar;

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "n-1",
      title: "New template submitted for review",
      time: "1 day ago",
      read: false,
    },
    {
      id: "n-2",
      title: "Diwali festival campaign scheduled for Oct 28, 2025",
      time: "5 hours ago",
      read: false,
    },
    {
      id: "n-3",
      title: "Database connection verified operational",
      time: "Just now",
      read: false,
    },
  ]);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network failure and redirect anyway
    }
    router.push("/");
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 35,
        backgroundColor: "rgba(250, 247, 242, 0.94)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(234, 228, 238, 0.9)",
        boxShadow: "0 2px 14px rgba(36, 33, 58, 0.04)",
        padding: "16px 36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
        flexWrap: "wrap",
        transition: "box-shadow 0.2s ease, background-color 0.2s ease",
      }}
      className="admin-top-header"
    >
      {/* Left Column: Titles & Breadcrumb */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
          <button
            type="button"
            onClick={handleToggle}
            aria-label={isCollapsed ? "Expand sidebar navigation" : "Collapse sidebar navigation"}
            title={isCollapsed ? "Expand navigation (Slide in)" : "Collapse navigation (Slide out)"}
            className="admin-sidebar-toggle-btn"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              padding: "7px 9px",
              borderRadius: "8px",
              cursor: "pointer",
              color: "var(--text)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
              boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
            }}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>

        <p
          style={{
            fontSize: "13.5px",
            color: "var(--text-muted)",
            margin: "0 0 8px 0",
          }}
        >
          {subtitle}
        </p>

        {/* Breadcrumb line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          <Home size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ opacity: 0.5 }}>/</span>}
              {b.href ? (
                <Link
                  href={b.href}
                  style={{
                    color: i === breadcrumbs.length - 1 ? "var(--text)" : "var(--text-muted)",
                    fontWeight: i === breadcrumbs.length - 1 ? 500 : 400,
                    textDecoration: "none",
                  }}
                >
                  {b.label}
                </Link>
              ) : (
                <span
                  style={{
                    color: i === breadcrumbs.length - 1 ? "var(--text)" : "var(--text-muted)",
                    fontWeight: i === breadcrumbs.length - 1 ? 500 : 400,
                  }}
                >
                  {b.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right Column: Search bar, Notifications, User profile */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        {/* Search input with live filter */}
        <div
          style={{
            position: "relative",
            width: "280px",
          }}
          className="header-search-wrapper"
        >
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-light)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            style={{
              width: "100%",
              height: "40px",
              paddingLeft: "38px",
              paddingRight: searchQuery ? "32px" : "14px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              fontSize: "13px",
              color: "var(--text)",
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            className="header-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange?.("")}
              aria-label="Clear search"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                color: "var(--text-muted)",
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Notifications button */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
              color: "var(--text-muted)",
            }}
            className="icon-hover-btn"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "9px",
                  right: "10px",
                  width: "7px",
                  height: "7px",
                  backgroundColor: "var(--primary)",
                  borderRadius: "50%",
                }}
              />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "48px",
                width: "320px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(36, 33, 58, 0.08)",
                zIndex: 50,
                overflow: "hidden",
                animation: "fadeIn 0.2s ease-out",
              }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        padding: "2px 6px",
                        fontSize: "11px",
                        borderRadius: "10px",
                        backgroundColor: "var(--secondary)",
                        color: "var(--primary)",
                        fontWeight: 600,
                      }}
                    >
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--primary)",
                      fontSize: "12px",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <div
                    style={{
                      padding: "24px 16px",
                      textAlign: "center",
                      color: "var(--text-muted)",
                      fontSize: "13px",
                    }}
                  >
                    No notifications
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid var(--border)",
                        backgroundColor: item.read ? "transparent" : "var(--primary-light)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12.5px",
                          fontWeight: item.read ? 400 : 600,
                          color: "var(--text)",
                          marginBottom: "4px",
                          lineHeight: 1.4,
                        }}
                      >
                        {item.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-light)" }}>
                        {item.time}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div
                style={{
                  padding: "10px 16px",
                  borderTop: "1px solid var(--border)",
                  textAlign: "center",
                }}
              >
                <Link
                  href="/admin/notifications"
                  onClick={() => setShowNotifications(false)}
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--primary)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    textDecoration: "none",
                  }}
                >
                  View all notifications <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Administrator profile avatar & dropdown */}
        <div style={{ position: "relative" }} ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="Admin Profile menu"
            style={{
              height: "40px",
              padding: "0 6px 0 6px",
              borderRadius: "20px",
              backgroundColor: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                backgroundColor: "var(--secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
                border: "1px solid rgba(121, 86, 201, 0.2)",
              }}
            >
              <User size={18} />
            </div>
            <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "48px",
                width: "240px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(36, 33, 58, 0.08)",
                zIndex: 50,
                overflow: "hidden",
                animation: "fadeIn 0.2s ease-out",
              }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--border)",
                  backgroundColor: "var(--bg)",
                }}
              >
                <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text)" }}>
                  {adminName}
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {adminEmail}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    marginTop: "6px",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    backgroundColor: "var(--primary-light)",
                    color: "var(--primary)",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={11} /> Administrator
                </div>
              </div>

              <div style={{ padding: "6px" }}>
                <Link
                  href="/admin/settings"
                  onClick={() => setShowProfileMenu(false)}
                  style={{
                    display: "block",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: "var(--text)",
                    textDecoration: "none",
                  }}
                  className="dropdown-item"
                >
                  Workspace Settings
                </Link>
                <Link
                  href="/admin/system-health"
                  onClick={() => setShowProfileMenu(false)}
                  style={{
                    display: "block",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: "var(--text)",
                    textDecoration: "none",
                  }}
                  className="dropdown-item"
                >
                  System Status
                </Link>
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "var(--border)",
                    margin: "4px 0",
                  }}
                />
                <button
                  type="button"
                  onClick={handleSignOut}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: "var(--error)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  className="dropdown-item sign-out"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .header-search-input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 3px rgba(121, 86, 201, 0.12) !important;
        }
        .icon-hover-btn:hover {
          border-color: var(--primary) !important;
          color: var(--primary) !important;
        }
        .dropdown-item:hover {
          background-color: var(--primary-light);
        }
        .dropdown-item.sign-out:hover {
          background-color: var(--error-bg);
        }
        @media (max-width: 1024px) {
          .mobile-menu-toggle {
            display: flex !important;
          }
          .admin-top-header {
            padding: 16px 20px 8px 20px !important;
          }
          .header-search-wrapper {
            width: 200px !important;
          }
        }
        @media (max-width: 640px) {
          .header-search-wrapper {
            width: 100% !important;
            order: 3;
            margin-top: 8px;
          }
        }
      `}</style>
    </header>
  );
};
