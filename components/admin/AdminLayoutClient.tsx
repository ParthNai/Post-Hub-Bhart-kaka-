"use client";

import React from "react";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { Sidebar } from "./Sidebar";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

const AdminLayoutContent: React.FC<AdminLayoutClientProps> = ({ children }) => {
  const { isCollapsed, toggleSidebar } = useSidebar();

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

      {/* Main Content Area with smooth transition matching sliding sidebar */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--bg)",
          marginLeft: isCollapsed ? 0 : "250px",
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          width: isCollapsed ? "100%" : "calc(100% - 250px)",
        }}
        id="admin-main-container"
        className={`admin-main-wrapper ${isCollapsed ? "sidebar-collapsed" : ""}`}
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
