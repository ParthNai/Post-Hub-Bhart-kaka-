"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Smartphone,
  Palette,
  LayoutTemplate,
  Sparkles,
  PartyPopper,
  Users,
  CreditCard,
  Home,
  ShieldCheck,
  Activity,
  Settings as SettingsIcon,
  Check,
  AlertCircle,
} from "lucide-react";
import { CredentialsHeader } from "./CredentialsHeader";
import { CredentialsSummaryCards } from "./CredentialsSummaryCards";
import { ProviderCredentialsTable } from "./ProviderCredentialsTable";
import { CredentialDetailsCard } from "./CredentialDetailsCard";
import { KeyRotationCard } from "./KeyRotationCard";
import { AccessControlCard } from "./AccessControlCard";
import { CredentialAuditHistoryTable } from "./CredentialAuditHistoryTable";
import { AddCredentialDrawer } from "./AddCredentialDrawer";
import { RevokeConfirmModal } from "./RevokeConfirmModal";
import { CredentialAuditModal } from "./CredentialAuditModal";
import { SecuritySettingsModal } from "./SecuritySettingsModal";
import {
  type CredentialsDataset,
  type AddCredentialInput,
  CANONICAL_CREDENTIALS_SEED,
} from "@/lib/ai-credentials";

export const CredentialsView: React.FC = () => {
  const [dataset, setDataset] = useState<CredentialsDataset>(CANONICAL_CREDENTIALS_SEED);
  const [selectedId, setSelectedId] = useState<string>("cred_openai_prod_01");

  // Drawer & Modals state
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [revokingCredId, setRevokingCredId] = useState<string | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial load
  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/ai-generation/credentials")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          const loaded: CredentialsDataset = data.dataset || data;
          if (loaded?.credentials) {
            setDataset(loaded);
          }
        }
      })
      .catch((err) => {
        console.error("Initial load error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedCredential =
    dataset.credentials.find((c) => c.id === selectedId) || dataset.credentials[0] || null;

  // Handler: Add Credential
  const handleAddCredential = async (input: AddCredentialInput) => {
    const res = await fetch("/api/admin/ai-generation/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", input }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to add credential");
    }

    setDataset(data.dataset);
    if (data.credential?.id) {
      setSelectedId(data.credential.id);
    }
    showToast(`Added ${input.credentialName} with encrypted AES-256-GCM vault storage`);
  };

  // Handler: Rotate Key
  const handleRotateKey = async (credentialId: string, replacementSecret: string) => {
    const res = await fetch("/api/admin/ai-generation/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rotate", credentialId, replacementSecret }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to rotate credential");
    }

    setDataset(data.dataset);
    showToast("Key rotated successfully with zero downtime!");
  };

  // Handler: Verify Key
  const handleVerifyKey = async (credentialId: string) => {
    showToast("Verifying provider credentials...", "success");
    try {
      const res = await fetch("/api/admin/ai-generation/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", credentialId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Verification failed");
      }

      setDataset(data.dataset);
      showToast("Live provider verification passed successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      showToast(msg, "error");
    }
  };

  // Handler: Revoke Confirm
  const handleOpenRevokeModal = (credentialId: string) => {
    setRevokingCredId(credentialId);
    setRevokeModalOpen(true);
  };

  const handleConfirmRevoke = async (credentialId: string, reason: string) => {
    const res = await fetch("/api/admin/ai-generation/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "revoke", credentialId, reason }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to revoke credential");
    }

    setDataset(data.dataset);
    showToast("Credential marked as revoked", "success");
  };

  // Handler: Delete Key
  const handleDeleteKey = async (credentialId: string) => {
    if (!confirm("Are you sure you want to permanently delete this credential record and purge its secret from the vault?")) {
      return;
    }

    try {
      const res = await fetch("/api/admin/ai-generation/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", credentialId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete credential");
      }

      setDataset(data.dataset);
      showToast("Credential record deleted and purged from vault");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete error";
      showToast(msg, "error");
    }
  };

  // Navigation Items
  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "App Screens", href: "/admin/screens", icon: Smartphone },
    { label: "Design System", href: "/admin/design-system", icon: Palette },
    { label: "Templates", href: "/admin/templates", icon: LayoutTemplate },
    { label: "AI Image Generation", href: "/admin/ai-generation", icon: Sparkles, active: true },
    { label: "Festivals & Events", href: "/admin/festivals", icon: PartyPopper },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Subscriptions & Payments", href: "/admin/subscriptions", icon: CreditCard },
    { label: "Home Content", href: "/admin/home-content", icon: Home },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Roles & Permissions", href: "/admin/roles", icon: ShieldCheck },
    { label: "System Health", href: "/admin/system-health", icon: Activity },
    { label: "Support & Settings", href: "/admin/settings", icon: SettingsIcon },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#FAF7F2",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 110,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 20px",
            borderRadius: "10px",
            backgroundColor: toastMessage.type === "success" ? "#10B981" : "#EF4444",
            color: "#FFFFFF",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {toastMessage.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <aside
        style={{
          width: "250px",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #EAE4EE",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: "70px",
            padding: "0 22px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderBottom: "1px solid #EAE4EE",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #7956C9 0%, #906FE2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "18px",
              boxShadow: "0 2px 6px rgba(121, 86, 201, 0.3)",
            }}
          >
            P
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#24213A", letterSpacing: "-0.01em" }}>
              Post Hub
            </div>
            <div style={{ fontSize: "11px", color: "#777184" }}>Admin Panel</div>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: "3px", flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            return (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#7956C9" : "#777184",
                  backgroundColor: isActive ? "#F4EFFC" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={17} color={isActive ? "#7956C9" : "#777184"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid #EAE4EE",
            fontSize: "11px",
            color: "#777184",
          }}
        >
          <div>Post Hub v1.0.0</div>
          <div style={{ marginTop: "2px" }}>© 2025 KnowledgePark</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowX: "hidden" }}>
        {/* Top Navbar */}
        <header
          style={{
            height: "70px",
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #EAE4EE",
            padding: "0 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, maxWidth: "480px" }}>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#777184",
                padding: "4px",
                display: "flex",
              }}
            >
              <Menu size={20} />
            </button>
            <div style={{ position: "relative", width: "100%" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#777184",
                }}
              />
              <input
                type="text"
                placeholder="Search anything..."
                style={{
                  width: "100%",
                  height: "40px",
                  paddingLeft: "40px",
                  paddingRight: "14px",
                  borderRadius: "20px",
                  border: "1px solid #EAE4EE",
                  backgroundColor: "#FAF7F2",
                  fontSize: "13px",
                  color: "#24213A",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Right Header items */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Bell */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  backgroundColor: "#FAF7F2",
                  border: "1px solid #EAE4EE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#777184",
                }}
              >
                <Bell size={18} />
              </button>
              <span
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  backgroundColor: "#EF4444",
                  color: "#FFFFFF",
                  fontSize: "10px",
                  fontWeight: 700,
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #FFFFFF",
                }}
              >
                3
              </span>
            </div>

            {/* Admin Avatar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "4px 8px 4px 4px",
                borderRadius: "20px",
                backgroundColor: "#FAF7F2",
                border: "1px solid #EAE4EE",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#7956C9",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                P
              </div>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>Parth Admin</span>
              <ChevronDown size={14} color="#777184" />
            </div>
          </div>
        </header>

        {/* Page Container */}
        <main style={{ padding: "28px", flex: 1 }}>
          {/* Header */}
          <CredentialsHeader
            onAddCredential={() => setIsDrawerOpen(!isDrawerOpen)}
            onOpenAuditHistory={() => setAuditModalOpen(true)}
            onOpenSecuritySettings={() => setSecurityModalOpen(true)}
            isDrawerOpen={isDrawerOpen}
          />

          {/* 4 Summary Cards */}
          <CredentialsSummaryCards metrics={dataset.summary} />

          {/* Main 2-Column Responsive Workspace */}
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
            {/* Left Column (Table, Details, Rotation, Access Control, Audit) */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
              {/* Provider Credentials Table */}
              <ProviderCredentialsTable
                credentials={dataset.credentials}
                selectedId={selectedId}
                onSelectCredential={(id) => setSelectedId(id)}
                onRotateKey={(id) => {
                  setSelectedId(id);
                }}
                onVerifyKey={(id) => handleVerifyKey(id)}
                onRevokeKey={(id) => handleOpenRevokeModal(id)}
                onDeleteKey={(id) => handleDeleteKey(id)}
              />

              {/* Middle Row: 3 Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "18px",
                  marginBottom: "24px",
                }}
              >
                <CredentialDetailsCard credential={selectedCredential} />
                <KeyRotationCard
                  credential={selectedCredential}
                  onRotateKey={handleRotateKey}
                />
                <AccessControlCard credential={selectedCredential} />
              </div>

              {/* Credential Audit History Table */}
              <CredentialAuditHistoryTable
                auditEvents={dataset.auditHistory}
                onViewAllLogs={() => setAuditModalOpen(true)}
              />
            </div>

            {/* Right Column: Add Credential Drawer & Best Practices */}
            {isDrawerOpen && (
              <AddCredentialDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onSave={handleAddCredential}
              />
            )}
          </div>
        </main>
      </div>

      {/* Revoke Confirmation Modal */}
      <RevokeConfirmModal
        isOpen={revokeModalOpen}
        credential={dataset.credentials.find((c) => c.id === revokingCredId) || null}
        onClose={() => {
          setRevokeModalOpen(false);
          setRevokingCredId(null);
        }}
        onConfirmRevoke={handleConfirmRevoke}
      />

      {/* Full Audit History Modal */}
      <CredentialAuditModal
        isOpen={auditModalOpen}
        auditEvents={dataset.auditHistory}
        onClose={() => setAuditModalOpen(false)}
      />

      {/* Security Settings Modal */}
      <SecuritySettingsModal
        isOpen={securityModalOpen}
        settings={dataset.securitySettings}
        onClose={() => setSecurityModalOpen(false)}
      />
    </div>
  );
};
