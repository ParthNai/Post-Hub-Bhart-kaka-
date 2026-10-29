"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [demoToken, setDemoToken] = useState<string | null>(null);
  const [emailConfigured, setEmailConfigured] = useState<boolean>(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setStatusMessage(null);
    setDemoToken(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Please enter your administrator email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json();
      setStatusMessage(data.message);
      setEmailConfigured(data.emailConfigured);
      if (data.demoResetToken) {
        setDemoToken(data.demoResetToken);
      }
    } catch {
      setStatusMessage("Unable to request password recovery. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
      }}
    >
      <div style={{ marginBottom: "36px" }}>
        <BrandLogo size="md" />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "var(--surface)",
          borderRadius: "var(--radius-card)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-card)",
          padding: "44px 40px",
        }}
      >
        <div style={{ marginBottom: "26px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "6px",
            }}
          >
            Password Recovery
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Enter your administrator email to receive secure recovery instructions.
          </p>
        </div>

        {statusMessage && (
          <div
            style={{
              padding: "16px",
              borderRadius: "8px",
              backgroundColor: "var(--success-bg)",
              border: "1px solid var(--success-border)",
              color: "var(--success)",
              fontSize: "13px",
              lineHeight: 1.5,
              marginBottom: "20px",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong>Recovery Request Dispatched</strong>
              <div style={{ marginTop: "4px" }}>{statusMessage}</div>
            </div>
          </div>
        )}

        {/* Honest Email Gateway Report if SMTP is unconfigured */}
        {statusMessage && !emailConfigured && (
          <div
            style={{
              padding: "14px",
              borderRadius: "8px",
              backgroundColor: "#FFFBEB",
              border: "1px solid #FDE68A",
              color: "#92400E",
              fontSize: "12.5px",
              lineHeight: 1.5,
              marginBottom: "20px",
              display: "flex",
              gap: "8px",
            }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong>Integration Notice:</strong> SMTP server is not yet configured in production environment.
              {demoToken && (
                <div style={{ marginTop: "6px" }}>
                  <span>Generated single-use token: </span>
                  <code
                    style={{
                      backgroundColor: "#FEF3C7",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      wordBreak: "break-all",
                    }}
                  >
                    {demoToken}
                  </code>
                </div>
              )}
            </div>
          </div>
        )}

        {!statusMessage && (
          <form onSubmit={handleSubmit} noValidate>
            <Input
              id="recovery-email"
              label="Administrator Email address"
              type="email"
              placeholder="admin@yourdomain.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
              }}
              icon={<Mail size={18} />}
              error={emailError || undefined}
              disabled={isLoading}
              required
            />

            <Button type="submit" loading={isLoading}>
              Send Recovery Instructions
            </Button>
          </form>
        )}

        <div
          style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid var(--border)",
            textAlign: "center",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--primary)",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
