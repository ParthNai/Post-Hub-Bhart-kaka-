"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export const AdminLayoutClient: React.FC<AdminLayoutClientProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--bg)",
        }}
        id="admin-main-container"
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // Pass down onMenuToggle if child accepts it
            return React.cloneElement(child as React.ReactElement<{ onMenuToggle?: () => void }>, {
              onMenuToggle: () => setSidebarOpen(true),
            });
          }
          return child;
        })}
      </div>
    </div>
  );
};
