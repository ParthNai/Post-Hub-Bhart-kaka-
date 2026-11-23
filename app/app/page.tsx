"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Shield } from "lucide-react";
import { AppShowcase } from "@/components/app/AppShowcase";
import { AppLoginForm } from "@/components/app/AppLoginForm";
import { MobileAppHomeScreen } from "@/components/mobile/MobileAppHomeScreen";
import { MobileAppPreloader } from "@/components/mobile/MobileAppPreloader";
import { AppUser, clearAppUser, getAppUser, PRESET_DEMO_USERS, saveAppUser } from "@/lib/app-auth";
import { PosterTemplate } from "@/lib/templates";

export default function MobileAppRootPage() {
  // First page shows the animated Preloader / Splash Screen, then transitions to Login
  const [currentScreen, setCurrentScreen] = useState<"preloader" | "login" | "home">("preloader");
  const [activeUser, setActiveUser] = useState<AppUser | null>(null);
  const [templates, setTemplates] = useState<PosterTemplate[]>([]);
  const [homeConfig, setHomeConfig] = useState<Record<string, any>>({});
  const [appRemoteConfig, setAppRemoteConfig] = useState<Record<string, any> | null>(null);

  // Fetch templates and published screen configuration for the studio workspace
  useEffect(() => {
    let isMounted = true;
    
    // First try public app templates endpoint (works for all users without requiring admin cookie)
    fetch("/api/app/templates")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && Array.isArray(data.templates) && data.templates.length > 0) {
          setTemplates(data.templates);
        } else {
          // Fallback to admin templates if logged in as admin
          fetch("/api/admin/templates")
            .then((res) => (res.ok ? res.json() : null))
            .then((adminData) => {
              if (isMounted && adminData && adminData.templates) {
                setTemplates(adminData.templates);
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        // Fallback to admin templates
        fetch("/api/admin/templates")
          .then((res) => (res.ok ? res.json() : null))
          .then((adminData) => {
            if (isMounted && adminData && adminData.templates) {
              setTemplates(adminData.templates);
            }
          })
          .catch(() => {});
      });

    fetch("/api/app/config")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          setAppRemoteConfig(data);
          if (data.templates && (!templates || templates.length === 0)) {
            setTemplates((prev) => (prev.length > 0 ? prev : data.templates));
          }
          if (data.screens && data.screens.home) {
            setHomeConfig(data.screens.home.layoutConfig || {});
          }
        }
      })
      .catch(() => {
        // Fallback handled gracefully
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoginSuccess = (user: AppUser) => {
    setActiveUser(user);
    saveAppUser(user);
    setCurrentScreen("home");
  };

  const handleExploreGuest = () => {
    const guestUser = PRESET_DEMO_USERS.guest;
    setActiveUser(guestUser);
    saveAppUser(guestUser);
    setCurrentScreen("home");
  };

  const handleSignOut = () => {
    clearAppUser();
    setActiveUser(null);
    setCurrentScreen("login"); // Returns directly to the login page (the first page)
  };

  if (currentScreen === "preloader") {
    return (
      <MobileAppPreloader
        primaryColor={appRemoteConfig?.preloader?.primaryColor || appRemoteConfig?.preloaderScreen?.spinnerColor || "#FE8706"}
        secondaryColor={appRemoteConfig?.preloader?.secondaryColor || appRemoteConfig?.preloaderScreen?.spinnerSecondaryColor || "#0055B8"}
        durationMs={appRemoteConfig?.preloader?.durationMs || (appRemoteConfig?.preloaderScreen?.durationSeconds ? appRemoteConfig.preloaderScreen.durationSeconds * 1000 : 2200)}
        logoUrl={appRemoteConfig?.appBranding?.logoUrl || appRemoteConfig?.appBranding?.appIconUrl || appRemoteConfig?.preloaderScreen?.appIcon?.url}
        title={appRemoteConfig?.preloader?.title || appRemoteConfig?.preloaderScreen?.title || "Panchayat Post"}
        tagline={appRemoteConfig?.preloader?.tagline || appRemoteConfig?.preloaderScreen?.tagline || "તમારા ગામનું પોતાનું ડિજિટલ પોસ્ટર"}
        videoUrl={appRemoteConfig?.preloader?.videoUrl || appRemoteConfig?.preloaderScreen?.videoUrl}
        mediaType={appRemoteConfig?.preloader?.mediaType || appRemoteConfig?.preloaderScreen?.mediaType || "animation"}
        skipButtonEnabled={appRemoteConfig?.preloader?.skipButtonEnabled ?? appRemoteConfig?.preloaderScreen?.skipButtonEnabled ?? true}
        backgroundColor={appRemoteConfig?.preloader?.backgroundColor || appRemoteConfig?.preloaderScreen?.backgroundColor || "#FFFFFF"}
        onComplete={() => {
          const user = getAppUser();
          if (user) {
            setActiveUser(user);
            setCurrentScreen("home");
          } else {
            setCurrentScreen("login");
          }
        }}
      />
    );
  }

  if (currentScreen === "home") {
    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#FAF7F2",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "var(--font-family-sans)",
        }}
      >
        <MobileAppHomeScreen
          user={activeUser || PRESET_DEMO_USERS.creator}
          templates={templates}
          config={homeConfig}
          onSignOut={handleSignOut}
        />
      </main>
    );
  }

  /* The First Page: Unified Desktop Website & Mobile App Login Page */
  return (
    <div
      className="split-screen-wrapper"
      style={{
        display: "flex",
        width: "100vw",
        minHeight: "100vh",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        fontFamily: "var(--font-family-sans)",
      }}
    >
      {/* Left Column: Full-Bleed Creative Suite Showcase (Desktop) */}
      <section
        className="split-showcase-panel"
        aria-label="Creative Suite Showcase"
        style={{
          flex: "1 1 54%",
          height: "100%",
          position: "relative",
          backgroundColor: "#151125",
          overflow: "hidden",
        }}
      >
        <AppShowcase />
      </section>

      {/* Right Column: Clean White Authentication Studio */}
      <section
        className="split-auth-panel"
        aria-label="App User Authentication"
        style={{
          flex: "1 1 46%",
          height: "100%",
          backgroundColor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "20px 36px 16px 36px",
          boxSizing: "border-box",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Top Header Navigation */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "10px",
          }}
        >
          <div className="mobile-brand-header" style={{ display: "none", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "7px",
                background: "linear-gradient(135deg, #7956C9 0%, #9065ED 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "15px",
                color: "#FFFFFF",
              }}
            >
              P
            </div>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#24213A" }}>Post Hub</span>
          </div>

          <div style={{ marginLeft: "auto" }}>
            <Link
              href="/admin/dashboard"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#543399",
                backgroundColor: "#F7F4FD",
                border: "1px solid #E4D8FA",
                padding: "6px 14px",
                borderRadius: "8px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              <span>Admin Console</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </header>

        {/* Center Main Login Form */}
        <div
          style={{
            margin: "auto 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "8px 0",
          }}
        >
          <AppLoginForm
            onSuccess={handleLoginSuccess}
            onExploreGuest={handleExploreGuest}
          />
        </div>

        {/* Bottom Footer Information */}
        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "11.5px",
            color: "#8E8899",
            borderTop: "1px solid #F0ECF4",
            paddingTop: "12px",
            marginTop: "12px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <span style={{ fontWeight: 600, color: "#24213A" }}>POST HUB CREATIVE SUITE</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#12805C" }}>
            <Shield size={12} />
            Zero-API Working Authentication
          </span>
        </footer>
      </section>

      {/* Responsive Breakpoints: Desktop Mode vs F12 Mobile Mode */}
      <style>{`
        /* Tablet & Mobile (max-width: 1024px or F12 mobile screen) */
        @media (max-width: 1024px) {
          .split-screen-wrapper {
            flex-direction: column !important;
            height: auto !important;
            min-height: 100vh !important;
            overflow-y: auto !important;
          }
          .split-showcase-panel {
            display: none !important;
          }
          .split-auth-panel {
            flex: 1 1 100% !important;
            width: 100% !important;
            min-height: 100vh !important;
            padding: 20px 20px 24px 20px !important;
          }
          .mobile-brand-header {
            display: flex !important;
          }
        }

        /* Mobile Phones / F12 iPhone/Galaxy inspection */
        @media (max-width: 480px) {
          .split-auth-panel {
            padding: 16px 16px 20px 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
