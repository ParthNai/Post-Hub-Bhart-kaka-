import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { CollageArt } from "@/components/CollageArt";
import { LoginForm } from "@/components/LoginForm";
import { SetupDrawer } from "@/components/SetupDrawer";

export default function AdminLoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "28px 64px 32px 64px",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <SetupDrawer />

      {/* Top Switcher Banner: Link to Separate Mobile App */}
      <div
        style={{
          width: "100%",
          maxWidth: "1360px",
          margin: "0 auto 16px auto",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Link
          href="/app"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "999px",
            backgroundColor: "#F4F0FB",
            border: "1px solid #D8C7F5",
            color: "#543399",
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
            transition: "all 0.18s ease",
            boxShadow: "0 2px 6px rgba(121, 86, 201, 0.08)",
          }}
        >
          <Sparkles size={14} color="#7956C9" />
          <span>Launch Separate Mobile App (Login First Page)</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Main Two-Column Viewport Wrapper */}
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1360px",
          width: "100%",
          margin: "0 auto",
          gap: "48px",
        }}
      >
        {/* Left Column: Brand, Greetings, Artwork Collage */}
        <section
          aria-label="Post Hub Creative Platform Intro"
          style={{
            flex: "1 1 540px",
            maxWidth: "580px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Brand Wordmark */}
          <div style={{ marginBottom: "52px" }}>
            <BrandLogo size="md" />
          </div>

          {/* Heading & Subtitle */}
          <div style={{ marginBottom: "24px" }}>
            <h1
              style={{
                fontSize: "44px",
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                marginBottom: "12px",
              }}
            >
              Welcome back.
            </h1>
            <p
              style={{
                fontSize: "17px",
                color: "var(--text-muted)",
                letterSpacing: "-0.01em",
              }}
            >
              Sign in to manage your creative platform.
            </p>
          </div>

          {/* Collage Composition */}
          <CollageArt />
        </section>

        {/* Right Column: Admin Sign In Card */}
        <section
          aria-label="Admin Sign In Section"
          style={{
            flex: "1 1 480px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoginForm />
        </section>
      </div>

      {/* Bottom Footer: POST HUB ADMINISTRATION */}
      <footer
        style={{
          width: "100%",
          maxWidth: "1360px",
          margin: "24px auto 0 auto",
          userSelect: "none",
        }}
      >
        <span
          style={{
            fontSize: "10.5px",
            fontWeight: 600,
            letterSpacing: "0.22em",
            color: "var(--text-light)",
            textTransform: "uppercase",
          }}
        >
          POST HUB ADMINISTRATION
        </span>
      </footer>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1024px) {
          main {
            padding: 24px 28px !important;
          }
          div[style*="max-width: 1360px"] {
            flex-direction: column !important;
            gap: 36px !important;
            align-items: center !important;
          }
          section[aria-label="Post Hub Creative Platform Intro"] {
            max-width: 100% !important;
            align-items: center !important;
            text-align: center !important;
          }
          footer {
            text-align: center !important;
            margin-top: 36px !important;
          }
        }
        @media (max-width: 640px) {
          main {
            padding: 20px 16px !important;
          }
          div[style*="max-width: 460px"] {
            padding: 32px 20px !important;
          }
          div[style*="max-width: 510px"] {
            transform: scale(0.85);
            transform-origin: top center;
            height: 380px !important;
          }
        }
      `}</style>
    </main>
  );
}
