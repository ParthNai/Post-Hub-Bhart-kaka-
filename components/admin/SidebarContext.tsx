"use client";

import React, { createContext, useContext, useState, useSyncExternalStore } from "react";

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

function getSidebarSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem("posthub_sidebar_collapsed") === "true";
  } catch {
    return false;
  }
}

function getSidebarServerSnapshot(): boolean {
  return false;
}

function subscribeToSidebar(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isCollapsed = useSyncExternalStore(
    subscribeToSidebar,
    getSidebarSnapshot,
    getSidebarServerSnapshot
  );
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 1024) {
      setIsMobileOpen((prev) => !prev);
    } else {
      try {
        const next = !getSidebarSnapshot();
        localStorage.setItem("posthub_sidebar_collapsed", String(next));
        window.dispatchEvent(new Event("storage"));
      } catch {
        // Ignore
      }
    }
  };

  const handleSetCollapsed = (collapsed: boolean) => {
    try {
      localStorage.setItem("posthub_sidebar_collapsed", String(collapsed));
      window.dispatchEvent(new Event("storage"));
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
