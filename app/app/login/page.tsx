import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AppShowcase } from "@/components/app/AppShowcase";
import { AppLoginForm } from "@/components/app/AppLoginForm";
import { Shield, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Post Hub Studio — Create Posters, Banners & AI Graphics",
  description: "Sign in to Post Hub Studio, the modern Canva alternative for festival posters, social media banners, and AI graphic creation.",
};

export default function AppLoginPage() {
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
          padding: "24px 44px 18px 44px",
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
            marginBottom: "12px",
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
              <ArrowRight size={12} />
            </Link>
          </div>
        </header>

        {/* Center Main Login Form */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "8px 0",
          }}
        >
          <AppLoginForm />
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
            Zero-API Working Client Auth
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
