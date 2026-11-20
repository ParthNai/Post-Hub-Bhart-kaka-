"use client";

import React from "react";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { Sidebar } from "./Sidebar";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

const AdminLayoutContent: React.FC<AdminLayoutClientProps> = ({ children }) => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        position: "relative",
      }}
    >
      {/* Slidable Floating Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area with smooth transition matching rail/full sidebar */}
      <div
        suppressHydrationWarning
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--bg)",
          marginLeft: isCollapsed ? "68px" : "250px",
          transition: isMounted
            ? "margin-left 0.3s cubic-bezier(0.2, 0, 0, 1), width 0.3s cubic-bezier(0.2, 0, 0, 1)"
            : "none",
          width: isCollapsed ? "calc(100% - 68px)" : "calc(100% - 250px)",
        }}
        id="admin-main-container"
        className={`admin-main-wrapper ${isCollapsed ? "sidebar-collapsed rail-active" : ""}`}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // Pass down onMenuToggle if child accepts it
            return React.cloneElement(child as React.ReactElement<{ onMenuToggle?: () => void }>, {
              onMenuToggle: toggleSidebar,
            });
          }
          return child;
        })}
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          #admin-main-container {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export const AdminLayoutClient: React.FC<AdminLayoutClientProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
};
