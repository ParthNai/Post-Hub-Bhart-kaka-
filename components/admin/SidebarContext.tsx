"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  isMobileOpen: false,
  toggleSidebar: () => {},
  setCollapsed: () => {},
  setMobileOpen: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("posthub_sidebar_collapsed");
      if (stored === "true") {
        setIsCollapsed(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 1024) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem("posthub_sidebar_collapsed", String(next));
        } catch {
          // Ignore
        }
        return next;
      });
    }
  };

  const handleSetCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    try {
      localStorage.setItem("posthub_sidebar_collapsed", String(collapsed));
    } catch {
      // Ignore
    }
  };

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        toggleSidebar,
        setCollapsed: handleSetCollapsed,
        setMobileOpen: setIsMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
