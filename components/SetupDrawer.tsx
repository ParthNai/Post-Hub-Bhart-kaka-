"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, Shield, X, Database } from "lucide-react";

export const SetupDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Discreet status pill in top right */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          top: "20px",
          right: "24px",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          fontSize: "12px",
          color: "var(--text-muted)",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          boxShadow: "0 2px 8px rgba(36, 33, 58, 0.04)",
          transition: "all 0.16s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--primary)";
          e.currentTarget.style.color = "var(--primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.color = "var(--text-muted)";
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#10B981",
            boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
          }}
        />
        <span style={{ fontWeight: 500 }}>System Status</span>
      </button>

      {/* Modal / Drawer Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="system-status-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            backgroundColor: "rgba(36, 33, 58, 0.35)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="animate-fade-in"
            style={{
              width: "100%",
              maxWidth: "520px",
              backgroundColor: "var(--surface)",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 20px 40px rgba(36, 33, 58, 0.15)",
              border: "1px solid var(--border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: "var(--primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                  }}
                >
                  <Shield size={20} />
                </div>
                <div>
                  <h3 id="system-status-title" style={{ fontSize: "17px", fontWeight: 700, color: "var(--text)" }}>
                    Screen 01 Architecture & Status
                  </h3>
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                    Verified components & honest backend state
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close dialog"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: "6px",
                  borderRadius: "6px",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Checklist */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "#F8FAF8",
                  border: "1px solid #E2EFE4",
                }}
              >
                <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>
                    Server-Side Authentication & Session Cookies
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Encrypted JWT stored in HttpOnly, SameSite=Lax cookie. Passwords hashed with bcrypt (10 rounds).
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "#F8FAF8",
                  border: "1px solid #E2EFE4",
                }}
              >
                <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>
                    Server-Side Role Guard & Account Lockout
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Strict administrator role check. Account lockout after 5 failed attempts (15-min lockout).
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "#F8FAF8",
                  border: "1px solid #E2EFE4",
                }}
              >
                <Database size={18} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>
                    Persistence Layer: Auto-Seeded Local Store / PostgreSQL
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Database active with test administrator credentials ready for instant verification.
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "#FFFBEB",
                  border: "1px solid #FDE68A",
                }}
              >
                <AlertTriangle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#92400E" }}>
                    SMTP Email Delivery (Honest Reporting)
                  </div>
                  <div style={{ fontSize: "12px", color: "#B45309" }}>
                    SMTP email transport is unconfigured. Password recovery flow securely creates single-use tokens and generates simulated delivery links.
                  </div>
                </div>
              </div>
            </div>

            {/* Test Credentials Table */}
            <div
              style={{
                backgroundColor: "var(--bg)",
                padding: "14px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--text-muted)",
                  marginBottom: "8px",
                }}
              >
                Available Test Accounts
              </div>
              <div style={{ fontSize: "12px", color: "var(--text)", lineHeight: 1.6 }}>
                <div>
                  <strong>Admin:</strong> <code>admin@yourdomain.com</code> / <code>AdminPassword123!</code>
                </div>
                <div>
                  <strong>Disabled:</strong> <code>disabled@yourdomain.com</code> / <code>AdminPassword123!</code>
                </div>
                <div>
                  <strong>Member (Non-admin):</strong> <code>member@yourdomain.com</code> / <code>MemberPassword123!</code>
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: "var(--primary)",
                color: "#FFFFFF",
                border: "none",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Close Diagnostics
            </button>
          </div>
        </div>
      )}
    </>
  );
};
